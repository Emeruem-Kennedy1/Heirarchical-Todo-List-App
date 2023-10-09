from flask import Blueprint, request, jsonify  # noqa
from db.models import List, Task, db  # noqa

task_blueprint = Blueprint("task", __name__)


# get subtasks from a specific task
@task_blueprint.route("/task/<task_id>/subtasks", methods=["GET"])
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
def create_subtask(task_id):
    try:
        parent_task = Task.query.get(task_id)
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
            can_have_subtasks=can_have_subtasks,
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
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
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
