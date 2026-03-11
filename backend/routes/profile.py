from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
import base64, os, uuid

profile_bp = Blueprint('profile', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if 'bio' in data:
        bio = data['bio'].strip()
        if len(bio) > 160:
            return jsonify({'error': 'Bio must be 160 characters or less'}), 400
        user.bio = bio

    if 'allow_messages' in data:
        user.allow_messages = bool(data['allow_messages'])

    if 'notifications_enabled' in data:
        user.notifications_enabled = bool(data['notifications_enabled'])

    if 'profile_picture' in data and data['profile_picture']:
        try:
            img_data = data['profile_picture']
            if img_data.startswith('data:image'):
                header, img_data = img_data.split(',', 1)
            img_bytes = base64.b64decode(img_data)
            filename = f"{uuid.uuid4().hex}.jpg"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            if user.profile_picture and os.path.exists(os.path.join(UPLOAD_FOLDER, os.path.basename(user.profile_picture))):
                try:
                    os.remove(os.path.join(UPLOAD_FOLDER, os.path.basename(user.profile_picture)))
                except:
                    pass
            user.profile_picture = f'/uploads/{filename}'
        except Exception as e:
            return jsonify({'error': 'Failed to upload image'}), 400

    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict(include_email=True)}), 200

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict(include_email=True)}), 200

@profile_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user.is_active = False
    db.session.commit()
    return jsonify({'message': 'Account deactivated'}), 200
