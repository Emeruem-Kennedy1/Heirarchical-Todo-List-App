from flask import Flask, request, jsonify  # noqa
from flask_cors import CORS
from List.list import list_blueprint  # noqa
from Task.task import task_blueprint  # noqa
from extensions import db  # noqa
from flask_login import LoginManager  # noqa
from Auth.auth import auth_bp  # noqa
from db.models import User  # noqa

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(list_blueprint, url_prefix="/api")
app.register_blueprint(task_blueprint, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hierarchy.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True
app.secret_key = 'kendo'
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


if __name__ == "__main__":
    app.run(debug=True, port=7000)
