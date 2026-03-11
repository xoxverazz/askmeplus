from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
import re
from models import db, User

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def is_valid_username(username):
    return bool(re.match(r'^[a-zA-Z0-9_]{3,20}$', username))

def is_valid_email(email):
    return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', email))

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip().lower()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if not is_valid_username(username):
        return jsonify({'error': 'Username must be 3-20 characters, letters/numbers/underscore only'}), 400

    if not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already taken'}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Account created successfully',
        'access_token': access_token,
        'user': user.to_dict(include_email=True)
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier', '').strip().lower()
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'error': 'Email/username and password are required'}), 400

    user = User.query.filter(
        (User.email == identifier) | (User.username == identifier)
    ).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict(include_email=True)
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict(include_email=True)}), 200

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    data = request.get_json()
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if not bcrypt.check_password_hash(user.password_hash, current_password):
        return jsonify({'error': 'Current password is incorrect'}), 401

    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters'}), 400

    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'}), 200
