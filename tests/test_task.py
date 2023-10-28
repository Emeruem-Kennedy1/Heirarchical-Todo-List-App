from flask_login import current_user
from Backend.models import List, Task, User
from Backend import db
from flask import url_for
from flask_testing import TestCase
from Backend import create_app
from werkzeug.security import generate_password_hash


class TestTask(TestCase):
    def create_app(self):
        app = create_app(
            {
                "TESTING": True,
                "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
                "SQLALCHEMY_TRACK_MODIFICATIONS": False,
                "WTF_CSRF_ENABLED": False,
            }
        )
        return app

    def setUp(self):
        db.create_all()
        user = User(
            username="test_user",
            email="test@mail.com",
            password_hash=generate_password_hash("test_password"),
        )
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_move_task(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create two lists
            list1 = List(name="test_list1", user_id=current_user.id)
            db.session.add(list1)
            list2 = List(name="test_list2", user_id=current_user.id)
            db.session.add(list2)
            db.session.commit()

            # Create a task in list1
            task = Task(name="test_task", list_id=list1.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Move the task to list2
            response = self.client.put(
                url_for("task.move_task", task_id=task.id),
                json={"new_list_id": list2.id},
            )
            self.assertEqual(response.status_code, 200)

            # Check that the task is now in list2
            response = self.client.get(url_for("list.get_tasks", list_id=list2.id))
            self.assertEqual(response.status_code, 200)
            self.assertIn("test_task", str(response.data))

    def test_get_subtasks(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create a list
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()

            # Create a task in list
            task = Task(name="test_task", list_id=list.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Create a subtask of task
            subtask = Task(
                name="test_subtask", list_id=list.id, task_depth=1, parent_id=task.id
            )
            db.session.add(subtask)
            db.session.commit()

            # Get the subtasks of task
            response = self.client.get(url_for("task.get_subtasks", task_id=task.id))
            self.assertEqual(response.status_code, 200)
            self.assertIn("test_subtask", str(response.data))

    def test_create_subtask(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create a list
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()

            # Create a task in list
            task = Task(name="test_task", list_id=list.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Create a subtask of task
            response = self.client.post(
                url_for("task.create_subtask", task_id=task.id),
                json={"name": "test_subtask"},
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn("test_subtask", str(response.data))

    def test_update_task(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create a list
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()

            # Create a task in list
            task = Task(name="test_task", list_id=list.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Update the task
            response = self.client.put(
                url_for("task.update_task", task_id=task.id),
                json={"name": "test_updated_task"},
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn("test_updated_task", str(response.data))

    def test_delete_task(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create a list
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()

            # Create a task in list
            task = Task(name="test_task", list_id=list.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Delete the task
            response = self.client.delete(url_for("task.delete_task", task_id=task.id))
            self.assertEqual(response.status_code, 200)

    def test_update_task_status(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )

            # Create a list
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()

            # create 2 tasks in list
            task1 = Task(name="test_task1", list_id=list.id, task_depth=0)
            db.session.add(task1)
            task2 = Task(name="test_task2", list_id=list.id, task_depth=0)
            db.session.add(task2)

            # create a subtask of task1
            subtask = Task(
                name="test_subtask", list_id=list.id, task_depth=1, parent_id=task1.id
            )
            db.session.add(subtask)
            db.session.commit()

            # update the status of task1
            response = self.client.put(
                url_for("task.update_task_status", task_id=task1.id),
                json={"status": True},
            )

            # check that the status of task1 is updated
            self.assertEqual(response.status_code, 200)
            self.assertEqual(task1.status, True)
