from flask_login import current_user
from Backend.models import List, Task, User
from Backend import db
from flask import url_for
from flask_testing import TestCase
from Backend import create_app
from werkzeug.security import generate_password_hash


class TestList(TestCase):
    def create_app(self):
        app = create_app({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
            "WTF_CSRF_ENABLED": False,
        })
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

    def test_get_all_lists(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )
            response = self.client.get(url_for("list.get_all_lists"))
            self.assertEqual(response.status_code, 200)

    def test_get_list(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()
            response = self.client.get(url_for("list.get_list", list_id=list.id))
            self.assertEqual(response.status_code, 200)

    def test_create_list(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )
            response = self.client.post(
                url_for("list.create_list"), json={"name": "test_list"}
            )
            self.assertEqual(response.status_code, 200)

    def test_delete_list(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()
            response = self.client.delete(url_for("list.delete_list", list_id=list.id))
            self.assertEqual(response.status_code, 200)

    def test_update_list(self):
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
            # Update the list
            response = self.client.put(
                url_for("list.update_list", list_id=list.id), json={"name": "new_name"}
            )
            self.assertEqual(response.status_code, 200)

    def test_get_tasks(self):
        with self.client:
            self.client.post(
                url_for("auth.login"),
                json={"email": "test@mail.com", "password": "test_password"},
                follow_redirects=True,
            )
            # Create a list and a task
            list = List(name="test_list", user_id=current_user.id)
            db.session.add(list)
            db.session.commit()
            task = Task(name="test_task", list_id=list.id, task_depth=0)
            db.session.add(task)
            db.session.commit()

            # Get the tasks
            response = self.client.get(url_for("list.get_tasks", list_id=list.id))
            self.assertEqual(response.status_code, 200)

    def test_create_task(self):
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
            # Create a task
            response = self.client.post(
                url_for("list.create_task", list_id=list.id), json={"name": "test_task"}
            )
            self.assertEqual(response.status_code, 200)
