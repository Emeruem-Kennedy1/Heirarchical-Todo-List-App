from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    tasks = db.relationship("Task", backref="list", lazy=True)

    def __repr__(self):
        return f"List('{self.name}')"

    def to_dict(self):

        tasks = []

        for task in self.tasks:
            if task.parent_id is None:
                tasks.append(task.to_dict())

        return {
            "id": self.id,
            "name": self.name,
            "tasks": tasks,
        }


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    list_id = db.Column(db.Integer, db.ForeignKey("list.id"), nullable=False)
    task_depth = db.Column(db.Integer, nullable=False)
    can_have_subtasks = db.Column(db.Boolean, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("task.id"))
    subtasks = db.relationship(
        "Task",
        backref=db.backref("parent", remote_side=[id]),
        lazy=True,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"Task('{self.name}')"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "list_id": self.list_id,
            "subtasks": [subtask.to_dict() for subtask in self.subtasks],
            "task_depth": self.task_depth,
            "can_have_subtasks": self.can_have_subtasks,
        }

    def calculate_depth(self):
        if self.parent_id is None:
            return 0
        else:
            return 1 + Task.query.get(self.parent_id).calculate_depth()
