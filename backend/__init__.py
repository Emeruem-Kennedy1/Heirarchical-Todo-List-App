from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
import os
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()

login_manager = LoginManager()


def create_app(test_config=None):
    app = Flask(__name__)

    # Set up CORS
    CORS(app, supports_credentials=True)

    from .list import list_blueprint
    from .task import task_blueprint
    from .auth import auth_bp

    # Register blueprints
    app.register_blueprint(list_blueprint, url_prefix="/api", name="list")
    app.register_blueprint(task_blueprint, url_prefix="/api", name="task")
    app.register_blueprint(auth_bp, url_prefix="/api", name="auth")
    print(os.environ.get("DATABASE_URL"))
    # Configuration
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=os.environ.get("DATABASE_URL"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True,
        SECRET_KEY=os.environ.get("SECRET_KEY"),
    )

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "Welcome to the backend!"

    return app
