from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from better_profanity import profanity
from models import db, User, Message, Analytics, Report, RateLimit
import user_agents

messages_bp = Blueprint('messages', __name__)
profanity.load_censor_words()

RATE_LIMIT_COUNT = 5
RATE_LIMIT_WINDOW = 60  # minutes

def get_client_info(req):
    ip = req.headers.get('X-Forwarded-For', req.remote_addr)
    if ip and ',' in ip:
        ip = ip.split(',')[0].strip()
    ua_string = req.headers.get('User-Agent', '')
    ua = user_agents.parse(ua_string)
    device_type = 'mobile' if ua.is_mobile else ('tablet' if ua.is_tablet else 'desktop')
    browser = ua.browser.family if ua.browser.family else 'Unknown'
    return ip, device_type, browser

def check_rate_limit(ip, user_id):
    window_start = datetime.utcnow() - timedelta(minutes=RATE_LIMIT_WINDOW)
    rl = RateLimit.query.filter_by(ip_address=ip, target_user_id=user_id).first()
    if rl:
        if rl.window_start < window_start:
            rl.message_count = 1
            rl.window_start = datetime.utcnow()
            db.session.commit()
            return True
        if rl.message_count >= RATE_LIMIT_COUNT:
            return False
        rl.message_count += 1
        db.session.commit()
        return True
    else:
        new_rl = RateLimit(ip_address=ip, target_user_id=user_id)
        db.session.add(new_rl)
        db.session.commit()
        return True

def update_analytics(user_id, field):
    today = datetime.utcnow().date()
    analytics = Analytics.query.filter_by(user_id=user_id, date=today).first()
    if not analytics:
        analytics = Analytics(user_id=user_id, date=today)
        db.session.add(analytics)
    setattr(analytics, field, getattr(analytics, field) + 1)
    db.session.commit()

@messages_bp.route('/send/<username>', methods=['POST'])
def send_message(username):
    user = User.query.filter_by(username=username.lower()).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if not user.allow_messages:
        return jsonify({'error': 'This user is not accepting messages'}), 403

    data = request.get_json()
    message_text = data.get('message', '').strip()
    if not message_text:
        return jsonify({'error': 'Message cannot be empty'}), 400
    if len(message_text) > 500:
        return jsonify({'error': 'Message too long (max 500 characters)'}), 400

    ip, device_type, browser = get_client_info(request)

    if not check_rate_limit(ip, user.id):
        return jsonify({'error': 'Too many messages. Please try again later.'}), 429

    if profanity.contains_profanity(message_text):
        return jsonify({'error': 'Message contains inappropriate content'}), 400

    message = Message(
        receiver_id=user.id,
        message_text=message_text,
        ip_address=ip,
        device_type=device_type,
        browser=browser,
    )
    db.session.add(message)
    db.session.commit()
    update_analytics(user.id, 'messages_received')

    return jsonify({'message': 'Message sent successfully!', 'id': message.id}), 201

@messages_bp.route('/inbox', methods=['GET'])
@jwt_required()
def get_inbox():
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    messages = Message.query.filter_by(
        receiver_id=user_id, is_deleted=False
    ).order_by(Message.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'messages': [m.to_dict() for m in messages.items],
        'total': messages.total,
        'pages': messages.pages,
        'current_page': page,
        'unread_count': Message.query.filter_by(receiver_id=user_id, is_read=False, is_deleted=False).count()
    }), 200

@messages_bp.route('/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(message_id):
    user_id = int(get_jwt_identity())
    message = Message.query.filter_by(id=message_id, receiver_id=user_id).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    message.is_read = True
    db.session.commit()
    return jsonify({'message': 'Marked as read'}), 200

@messages_bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    user_id = int(get_jwt_identity())
    message = Message.query.filter_by(id=message_id, receiver_id=user_id).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    message.is_deleted = True
    db.session.commit()
    return jsonify({'message': 'Message deleted'}), 200

@messages_bp.route('/<int:message_id>/report', methods=['POST'])
@jwt_required()
def report_message(message_id):
    user_id = int(get_jwt_identity())
    message = Message.query.filter_by(id=message_id, receiver_id=user_id).first()
    if not message:
        return jsonify({'error': 'Message not found'}), 404

    data = request.get_json()
    reason = data.get('reason', 'inappropriate')
    description = data.get('description', '')

    report = Report(message_id=message_id, reporter_id=user_id, reason=reason, description=description)
    message.is_reported = True
    db.session.add(report)
    db.session.commit()
    return jsonify({'message': 'Message reported'}), 200

@messages_bp.route('/mark-all-read', methods=['PUT'])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    Message.query.filter_by(receiver_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All messages marked as read'}), 200

@messages_bp.route('/unread-count', methods=['GET'])
@jwt_required()
def unread_count():
    user_id = int(get_jwt_identity())
    count = Message.query.filter_by(receiver_id=user_id, is_read=False, is_deleted=False).count()
    return jsonify({'unread_count': count}), 200
