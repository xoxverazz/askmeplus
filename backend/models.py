from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(500), default=None)
    bio = db.Column(db.Text, default=None)
    is_active = db.Column(db.Boolean, default=True)
    allow_messages = db.Column(db.Boolean, default=True)
    notifications_enabled = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages_received = db.relationship('Message', backref='receiver', lazy=True, foreign_keys='Message.receiver_id')
    analytics = db.relationship('Analytics', backref='user', lazy=True)

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'allow_messages': self.allow_messages,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_email:
            data['email'] = self.email
            data['notifications_enabled'] = self.notifications_enabled
        return data


class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_text = db.Column(db.Text, nullable=False)
    ip_address = db.Column(db.String(45), default=None)
    device_type = db.Column(db.String(50), default=None)
    browser = db.Column(db.String(100), default=None)
    location = db.Column(db.String(255), default=None)
    is_read = db.Column(db.Boolean, default=False)
    is_reported = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship('Report', backref='message', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'receiver_id': self.receiver_id,
            'message_text': self.message_text,
            'device_type': self.device_type,
            'is_read': self.is_read,
            'is_reported': self.is_reported,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class Analytics(db.Model):
    __tablename__ = 'analytics'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    link_clicks = db.Column(db.Integer, default=0)
    messages_received = db.Column(db.Integer, default=0)
    story_shares = db.Column(db.Integer, default=0)

    __table_args__ = (db.UniqueConstraint('user_id', 'date', name='unique_user_date'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'link_clicks': self.link_clicks,
            'messages_received': self.messages_received,
            'story_shares': self.story_shares,
        }


class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=False)
    reporter_id = db.Column(db.Integer, default=None)
    reason = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default=None)
    status = db.Column(db.Enum('pending', 'reviewed', 'dismissed'), default='pending')
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'message_id': self.message_id,
            'reason': self.reason,
            'status': self.status,
            'reported_at': self.reported_at.isoformat() if self.reported_at else None,
        }


class RateLimit(db.Model):
    __tablename__ = 'rate_limits'
    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(45), nullable=False)
    target_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message_count = db.Column(db.Integer, default=1)
    window_start = db.Column(db.DateTime, default=datetime.utcnow)
