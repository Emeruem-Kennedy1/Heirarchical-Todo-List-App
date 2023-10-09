from flask import Flask, request, jsonify  # noqa
from flask_cors import CORS
from List.list import list_blueprint  # noqa
from Task.task import task_blueprint  # noqa
from db.models import db  # noqa

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(list_blueprint, url_prefix="/api")
app.register_blueprint(task_blueprint, url_prefix="/api")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hierarchy.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return "Welcome to the backend!"


if __name__ == "__main__":
    app.run(debug=True, port=7000)
