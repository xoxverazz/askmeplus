import eventlet
eventlet.monkey_patch()

import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from dotenv import load_dotenv

from models import db
from routes.auth import auth_bp
from routes.messages import messages_bp
from routes.analytics import analytics_bp
from routes.profile import profile_bp
from routes.public import public_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)

# =========================
# Configuration
# =========================

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

# =========================
# Database Configuration
# =========================

DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'askmeplus')

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_RECYCLE'] = 280

# =========================
# Initialize Extensions
# =========================

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# SocketIO
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet"
)

# =========================
# CORS Configuration
# =========================

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

CORS(
    app,
    supports_credentials=True,
    origins=[
        FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
)

# =========================
# Register Blueprints
# =========================

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(messages_bp, url_prefix="/api/messages")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
app.register_blueprint(profile_bp, url_prefix="/api/profile")
app.register_blueprint(public_bp, url_prefix="/api/public")

# =========================
# Routes
# =========================

@app.route("/")
def home():
    return {
        "status": "running",
        "message": "ASKME+ Backend is running",
        "health_check": "/api/health"
    }


@app.route("/api/health")
def health():
    return {
        "status": "ok",
        "message": "ASKME+ API is running"
    }


# =========================
# SocketIO Events
# =========================

@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


# =========================
# Run Server
# =========================

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=True
    )
