from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from db.models import User
from extensions import db
from flask_login import login_user

auth_bp = Blueprint("login", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")

        user = User.query.filter_by(email=email).first()
        print(user)

        if not user:
            return jsonify({"message": "User does not exist"}), 401

        if not check_password_hash(user.password_hash, password):
            return jsonify({"message": "Invalid username or password"}), 401
        login_user(user)
        return (
            jsonify({"message": "Successfully logged in", "user": user.to_dict()}),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Failed to log in. error is {e}"}), 400


@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        username = request.json.get("username")
        email = request.json.get("email")
        password = request.json.get("password")

        password_hash = generate_password_hash(password)

        user = User.query.filter_by(email=email).first()

        if user:
            return jsonify({"message": "User already exists"}), 401

        new_user = User(email=email, password_hash=password_hash, username=username)
        db.session.add(new_user)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Successfully created a new user",
                    "user": new_user.to_dict(),
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"message": f"Failed to create a new user. error is {e}"}), 400
