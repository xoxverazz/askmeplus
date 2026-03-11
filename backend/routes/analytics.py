from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from models import db, Analytics, Message, User
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = int(get_jwt_identity())
    
    total_messages = Message.query.filter_by(receiver_id=user_id, is_deleted=False).count()
    
    thirty_days_ago = datetime.utcnow().date() - timedelta(days=30)
    analytics_data = Analytics.query.filter(
        Analytics.user_id == user_id,
        Analytics.date >= thirty_days_ago
    ).all()
    
    total_clicks = sum(a.link_clicks for a in analytics_data)
    total_shares = sum(a.story_shares for a in analytics_data)
    messages_30d = sum(a.messages_received for a in analytics_data)
    
    today = datetime.utcnow().date()
    today_analytics = Analytics.query.filter_by(user_id=user_id, date=today).first()
    today_messages = today_analytics.messages_received if today_analytics else 0
    today_clicks = today_analytics.link_clicks if today_analytics else 0

    return jsonify({
        'total_messages': total_messages,
        'total_link_clicks': total_clicks,
        'total_story_shares': total_shares,
        'messages_last_30_days': messages_30d,
        'today_messages': today_messages,
        'today_clicks': today_clicks,
    }), 200

@analytics_bp.route('/chart', methods=['GET'])
@jwt_required()
def get_chart_data():
    user_id = int(get_jwt_identity())
    days = request.args.get('days', 7, type=int)
    
    start_date = datetime.utcnow().date() - timedelta(days=days - 1)
    analytics_data = Analytics.query.filter(
        Analytics.user_id == user_id,
        Analytics.date >= start_date
    ).order_by(Analytics.date.asc()).all()

    data_map = {a.date.isoformat(): a for a in analytics_data}
    result = []
    for i in range(days):
        date = (start_date + timedelta(days=i)).isoformat()
        if date in data_map:
            result.append(data_map[date].to_dict())
        else:
            result.append({
                'date': date,
                'link_clicks': 0,
                'messages_received': 0,
                'story_shares': 0
            })

    return jsonify({'chart_data': result}), 200

@analytics_bp.route('/track-click/<username>', methods=['POST'])
def track_link_click(username):
    user = User.query.filter_by(username=username.lower()).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    today = datetime.utcnow().date()
    analytics = Analytics.query.filter_by(user_id=user.id, date=today).first()
    if not analytics:
        analytics = Analytics(user_id=user.id, date=today)
        db.session.add(analytics)
    analytics.link_clicks += 1
    db.session.commit()
    return jsonify({'message': 'Click tracked'}), 200

@analytics_bp.route('/track-share', methods=['POST'])
@jwt_required()
def track_share():
    user_id = int(get_jwt_identity())
    today = datetime.utcnow().date()
    analytics = Analytics.query.filter_by(user_id=user_id, date=today).first()
    if not analytics:
        analytics = Analytics(user_id=user_id, date=today)
        db.session.add(analytics)
    analytics.story_shares += 1
    db.session.commit()
    return jsonify({'message': 'Share tracked'}), 200
