from flask import Flask
from flask_cors import CORS
from list import list_blueprint
from task import task_blueprint
from Auth.auth import auth_bp
from extensions import db
from flask_login import LoginManager
from db.models import User


def create_app(test_config=None):
    app = Flask(__name__)

    # Set up CORS
    CORS(app, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(list_blueprint, url_prefix="/api", name="list")
    app.register_blueprint(task_blueprint, url_prefix="/api", name="task")
    app.register_blueprint(auth_bp, url_prefix="/api", name="auth")
    # Configuration
    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI="sqlite:///hierarchy.db",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=True,
        SECRET_KEY="kendo",
    )

    # Override config with test config if passed
    if test_config:
        app.config.update(test_config)

    # Initialize extensions
    db.init_app(app)
    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, user_id)

    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return "Welcome to the backend!"

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=7000)
