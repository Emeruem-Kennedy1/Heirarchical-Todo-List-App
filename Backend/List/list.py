from flask import Blueprint, request, jsonify  # noqa
from db.models import List, Task, db  # noqa


list_blueprint = Blueprint("list", __name__)


# get all the user lists from the database
@list_blueprint.route("/lists", methods=["GET"])
def get_all_lists():
    success_message = "Successfully retrieved all lists from the database."
    failure_message = "Failed to retrieve all lists from the database."
    success_status = 200
    try:
        lists = List.query.all()

        return (
            jsonify(
                {
                    "message": success_message,
                    "lists": [list.to_dict() for list in lists],
                }
            ),
            success_status,
        )
    except Exception as e:
        return jsonify({"message": f"{failure_message}. error is {e}"}), 400


# get a specific list from the database
@list_blueprint.route("/lists/<list_id>", methods=["GET"])
def get_list(list_id):
    success_message = f"Successfully retrieved list with id {list_id}."
    failure_message = f"Failed to retrieve list with id {list_id}."
    status = 200

    try:
        list = List.query.get(list_id)
        return jsonify({"message": success_message, "list": list.to_dict()}), status
    except Exception as e:
        return jsonify({"message": f"{failure_message}. error is {e}"}), 400


# create a new list in the database
@list_blueprint.route("/lists", methods=["POST"])
def create_list():
    try:
        name = request.json.get("name")

        sucess_message = f"Successfully created a new list with name {name}."
        success_status = 201

        list = List(name=name)
        db.session.add(list)
        db.session.commit()

        return jsonify({"message": f"{sucess_message} {name}"}), success_status
    except Exception as e:
        failure_message = f"Failed to create a new list with name {name}."
        failure_status = 400
        return (
            jsonify({"message": f"{failure_message} {name}. error is {e}"}),
            failure_status,
        )


# delete a specific list from the database
@list_blueprint.route("/lists/<list_id>", methods=["DELETE"])
def delete_list(list_id):
    try:
        list = List.query.get(list_id)
        # check if the list has any tasks and delete them
        tasks = Task.query.filter_by(list_id=list_id).all()
        for task in tasks:
            db.session.delete(task)

        db.session.delete(list)
        db.session.commit()

        message = f"Successfully deleted the list with id {list_id}."
        status = 200

        return jsonify({"message": message}), status
    except Exception as e:
        message = f"Failed to delete the list with id {list_id}."
        status = 500

        return jsonify({"message": f"{message}. error is {e}"}), status


# update a specific list in the database
@list_blueprint.route("/lists/<list_id>", methods=["PUT"])
def update_list(list_id):
    try:
        name = request.json.get("name")
        list = List.query.get(list_id)
        list.name = name
        db.session.commit()

        message = f"Successfully updated the list with id {list_id}."
        status = 200

        return jsonify({"message": message}), status
    except Exception as e:
        message = f"Failed to update the list with id {list_id}."
        status = 400

        return jsonify({"message": f"{message}. error is {e}"}), status


# get all tasks from a specific list
@list_blueprint.route("/lists/<list_id>/tasks", methods=["GET"])
def get_tasks(list_id):
    try:
        tasks = Task.query.filter_by(list_id=list_id).all()
        message = f"Successfully retrieved all tasks from list with id {list_id}."
        status = 200

        return (
            jsonify({"message": message, "tasks": [task.to_dict() for task in tasks]}),
            status,
        )
    except Exception as e:
        message = f"Failed to retrieve all tasks from list with id {list_id}."
        status = 400

        return jsonify({"message": f"{message}. error is {e}"}), status


# create a new base task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks", methods=["POST"])
def create_task(list_id):
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

        return jsonify({"message": f"I created a new task in list with id {list_id}"})
    except Exception as e:
        print(e)
        return jsonify({"message": f"Failed to create a new task. error is {e}"}), 400


# modify a specific task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks/<task_id>", methods=["PUT"])
def modify_task(list_id, task_id):
    try:
        name = request.json.get("name")
        task = Task.query.get(task_id)
        task.name = name
        db.session.commit()

        return jsonify({"message": f"I modified the task with id {task_id}"})
    except Exception as e:
        return jsonify({"message": f"Failed to modify the task. error is {e}"}), 400


# delete a specific base task in a specific list
@list_blueprint.route("/lists/<list_id>/tasks/<task_id>", methods=["DELETE"])
def delete_task(list_id, task_id):
    try:
        task = Task.query.get(task_id)
        for subtask in task.subtasks:
            db.session.delete(subtask)
        db.session.delete(task)
        db.session.commit()

        return jsonify({"message": f"I deleted the task with id {task_id}"})
    except Exception as e:
        return jsonify({"message": f"Failed to delete the task. error is {e}"}), 400


# move a specific task to a different list
@list_blueprint.route("/lists/<list_id>/tasks/<task_id>/move", methods=["PUT"])
def move_task(list_id, task_id):
    try:
        new_list_id = request.json.get("new_list_id")
        task = Task.query.get(task_id)
        task.list_id = new_list_id
        db.session.commit()

        return jsonify(
            {
                "message": f"I moved the task with id {task_id} to list with id {new_list_id}"
            }
        )
    except Exception as e:
        return jsonify({"message": f"Failed to move the task. error is {e}"}), 400
