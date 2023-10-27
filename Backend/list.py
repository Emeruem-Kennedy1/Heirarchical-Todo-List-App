from flask import Blueprint, request, jsonify  # noqa
from db.models import List, Task
from extensions import db
from flask_login import login_required, current_user


list_blueprint = Blueprint("list", __name__)


# get all the user lists from the database
@list_blueprint.route("/lists", methods=["GET"])
@login_required
def get_all_lists():
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401

    try:
        print(current_user.id)
        lists = List.query.filter_by(user_id=current_user.id).all()

        return (
            jsonify(
                {
                    "message": "Successfully retrieved all lists from the database",
                    "lists": [
                        {
                            "id": list.id,
                            "name": list.name,
                        }
                        for list in lists
                    ],
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to retrieve all lists from the database.. error is {e}"
                }
            ),
            400,
        )


# get a specific list from the database
@list_blueprint.route("/lists/<list_id>", methods=["GET"])
@login_required
def get_list(list_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401

    try:
        list = List.query.get(list_id)
        if current_user.id != list.user_id:
            return jsonify({"message": "User is not authorized to view this list"}), 401
        return (
            jsonify(
                {
                    "message": "Successfully retrieved list with id {list_id}.",
                    "list": list.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {"message": f"Failed to retrieve list with id {list_id}. error is {e}"}
            ),
            400,
        )


# create a new list in the database
@list_blueprint.route("/lists", methods=["POST"])
@login_required
def create_list():
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        name = request.json.get("name")
        user_id = current_user.id

        list = List(name=name, user_id=user_id)
        db.session.add(list)
        db.session.commit()

        return (
            jsonify({"message": f"Successfully created a new list with name {name}."}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": f"Failed to create a new list with name {name}. error is {e}"
                }
            ),
            400,
        )


# delete a specific list from the database
@list_blueprint.route("/lists/<list_id>", methods=["DELETE"])
@login_required
def delete_list(list_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        list = List.query.get(list_id)
        # check if the list has any tasks and delete them
        tasks = Task.query.filter_by(list_id=list_id).all()
        for task in tasks:
            db.session.delete(task)

        db.session.delete(list)
        db.session.commit()

        return (
            jsonify({"message": f"Successfully deleted the list with id {list_id}."}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": f"Failed to delete the list with id {list_id}. error is {e}"
                }
            ),
            400,
        )


# update a specific list in the database
@list_blueprint.route("/lists/<list_id>", methods=["PUT"])
@login_required
def update_list(list_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        name = request.json.get("name")
        list = List.query.get(list_id)
        list.name = name
        db.session.commit()

        return (
            jsonify({"message": f"Successfully updated the list with id {list_id}."}),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": f"Failed to update the list with id {list_id}. error is {e}"
                }
            ),
            400,
        )


# get all tasks from a specific list
@list_blueprint.route("/lists/<list_id>/tasks", methods=["GET"])
@login_required
def get_tasks(list_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        tasks = Task.query.filter_by(list_id=list_id).all()

        return (
            jsonify(
                {
                    "message": f"Successfully retrieved all tasks from list with id {list_id}.",
                    "tasks": [task.to_dict() for task in tasks],
                }
            ),
            200,
        )
    except Exception as e:
        return (
            jsonify(
                {
                    "message": f"Failed to retrieve all tasks from list with id {list_id}. error is {e}"  # noqa
                }
            ),
            400,
        )


# create a new base task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks", methods=["POST"])
@login_required
def create_task(list_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        name = request.json.get("name")
        parent_id = None
        task_depth = 0

        task = Task(
            name=name,
            list_id=list_id,
            parent_id=parent_id,
            task_depth=task_depth,
        )
        db.session.add(task)
        db.session.commit()

        return jsonify(
            {"message": f"Succesfully created a new task in list with id {list_id}"}
        )
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": f"Failed to create a new task. error is {e}"}), 400


# modify a specific task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks/<task_id>", methods=["PUT"])
@login_required
def modify_task(task_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        name = request.json.get("name")
        task = Task.query.get(task_id)
        task.name = name
        db.session.commit()

        return jsonify({"message": f"I modified the task with id {task_id}"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to modify the task. error is {e}"}), 400


# delete a specific base task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks/<task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id):
    if not current_user.is_authenticated:
        return jsonify({"message": "User is not authenticated"}), 401
    try:
        task = Task.query.get(task_id)
        for subtask in task.subtasks:
            db.session.delete(subtask)
        db.session.delete(task)
        db.session.commit()

        return jsonify({"message": f"I deleted the task with id {task_id}"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to delete the task. error is {e}"}), 400
