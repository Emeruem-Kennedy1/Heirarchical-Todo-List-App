from flask import Blueprint, request, jsonify  # noqa
from .models import Task, db
from flask_login import login_required

task_blueprint = Blueprint("task", __name__)


# get subtasks from a specific task
@task_blueprint.route("/task/<task_id>/subtasks", methods=["GET"])
@login_required
def get_subtasks(task_id):
    try:
        task = db.session.get(Task, task_id)
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
        parent_task = db.session.get(Task, task_id)
        parent_task.task_depth = parent_task.calculate_depth()
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
        task = db.session.get(Task, task_id)
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
        task = db.session.get(Task, task_id)
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


def update_parent_status(task):
    """Recursively update the status of parent tasks based on the status of their children."""
    if task.parent:
        # Fetch all siblings (including the current task)
        siblings = db.session.query(Task).filter_by(parent_id=task.parent_id).all()

        # Check if all siblings are complete
        if all(sibling.status for sibling in siblings):
            # If all siblings are complete and the parent's status is not complete, update it
            if not task.parent.status:
                task.parent.status = True
                update_parent_status(
                    task.parent
                )  # Recursively update the parent's parent
        else:
            # If any sibling is incomplete and the parent's status is not incomplete, update it
            if task.parent.status:
                task.parent.status = False
                update_parent_status(
                    task.parent
                )  # Recursively update the parent's parent


@task_blueprint.route("/task/<task_id>/status", methods=["PUT"])
@login_required
def update_task_status(task_id):
    try:
        task = db.session.get(Task, task_id)
        new_status = not task.status
        task.status = new_status

        # Update all subtasks if the task is marked as complete/incomplete
        update_subtasks_status(task, new_status)

        # Commit the status change of the task and its subtasks
        db.session.commit()

        # Re-fetch the task to ensure we have the latest data
        task = db.session.get(Task, task_id)

        # Update parent status based on the status of siblings
        update_parent_status(task)

        # Commit any changes made by updating the parent status
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
                "message": f"Failed to update status of task with id {task_id}. Error: {e}"
            }
        )


# move a specific task to a different list
@task_blueprint.route("task/<task_id>/move", methods=["PUT"])
@login_required
def move_task(task_id):
    try:
        new_list_id = request.json.get("new_list_id")
        task = db.session.get(Task, task_id)
        task.list_id = new_list_id
        db.session.commit()

        return jsonify(
            {
                "message": f"I moved the task with id {task_id} to list with id {new_list_id}"
            }
        )
    except Exception as e:
        return jsonify({"message": f"Failed to move the task. error is {e}"}), 400
