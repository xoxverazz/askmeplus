from flask import Blueprint, jsonify
from models import User

public_bp = Blueprint('public', __name__)

@public_bp.route('/user/<username>', methods=['GET'])
def get_public_profile(username):
    user = User.query.filter_by(username=username.lower(), is_active=True).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200
