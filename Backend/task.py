from flask import Blueprint, request, jsonify  # noqa
from db.models import Task
from extensions import db
from flask_login import login_required

task_blueprint = Blueprint("task", __name__)


# get subtasks from a specific task
@task_blueprint.route("/task/<task_id>/subtasks", methods=["GET"])
@login_required
def get_subtasks(task_id):
    try:
        task = Task.query.get(task_id)
        return jsonify(
            {
                "message": f"Successfully retrieved subtasks from task with id {task_id}.",
                "subtasks": [subtask.to_dict() for subtask in task.subtasks],
            }
        )
    except Exception as e:
        return jsonify(
            {
                "message": f"Failed to retrieve subtasks from task with id {task_id}. error is {e}"  # noqa
            }
        )


# create a new subtask in a specific task
@task_blueprint.route("/task/<task_id>/subtasks", methods=["POST"])
@login_required
def create_subtask(task_id):
    try:
        parent_task = Task.query.get(task_id)
        parent_task.task_depth = parent_task.calculate_depth()
        print(parent_task.task_depth)
        name = request.json.get("name")
        can_have_subtasks = True if parent_task.task_depth < 2 else False

        if not can_have_subtasks:
            return jsonify(
                {
                    "message": f"Failed to create a new subtask with name {name} in task with id {task_id}. Task with id {task_id} already has 2 levels of subtasks."  # noqa
                }
            )

        subtask = Task(
            name=name,
            list_id=parent_task.list_id,
            parent_id=parent_task.id,
            task_depth=parent_task.task_depth + 1,
        )
        db.session.add(subtask)
        db.session.commit()

        return jsonify(
            {
                "message": f"Successfully created a new subtask with name {name} in task with id {task_id}.",  # noqa
                "subtask": subtask.to_dict(),
            }
        )
    except Exception as e:
        return jsonify(
            {
                "message": f"Failed to create a new subtask with name {name} in task with id {task_id}. error is {e}"  # noqa
            }
        )


# update a specific task
@task_blueprint.route("/task/<task_id>", methods=["PUT"])
@login_required
def update_task(task_id):
    try:
        name = request.json.get("name")
        task = Task.query.get(task_id)
        task.name = name
        db.session.commit()

        return jsonify(
            {
                "message": f"Successfully updated task with id {task_id}.",
                "task": task.to_dict(),
            }
        )
    except Exception as e:
        return jsonify(
            {"message": f"Failed to update task with id {task_id}. error is {e}"}
        )


# delete a specific task
@task_blueprint.route("/task/<task_id>", methods=["DELETE"])
@login_required
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        for subtask in task.subtasks:
            db.session.delete(subtask)
        db.session.delete(task)
        db.session.commit()

        return jsonify(
            {
                "message": f"Successfully deleted task with id {task_id}.",
                "task": task.to_dict(),
            }
        )
    except Exception as e:
        return jsonify(
            {"message": f"Failed to delete task with id {task_id}. error is {e}"}
        )


def update_subtasks_status(task, status):
    """Recursively update the status of subtasks."""
    for subtask in task.subtasks:
        subtask.status = status
        update_subtasks_status(subtask, status)


@task_blueprint.route("/task/<task_id>/status", methods=["PUT"])
@login_required
def update_task_status(task_id):
    try:
        task = Task.query.get(task_id)
        new_status = not task.status
        task.status = new_status

        # If a task is marked as complete
        if new_status:
            update_subtasks_status(task, True)

        # If a child task is marked as incomplete
        elif not new_status and task.parent:
            task.parent.status = False

        # Check if all siblings (including the task itself) are complete
        siblings = Task.query.filter_by(parent_id=task.parent_id).all()
        if all(sibling.status for sibling in siblings) and task.parent:
            task.parent.status = True

        # Commit all changes in a single transaction
        db.session.commit()

        return jsonify(
            {
                "message": f"Successfully updated status of task with id {task_id}.",
                "task": task.to_dict(),
            }
        )
    except Exception as e:
        return jsonify(
            {
                "message": f"Failed to update status of task with id {task_id}. error is {e}"
            }
        )


# move a specific task to a different list
@task_blueprint.route("task/<task_id>/move", methods=["PUT"])
@login_required
def move_task(task_id):
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
