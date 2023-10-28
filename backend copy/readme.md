# API Documentation

## Overview
This API serves a Flask application designed to manage lists and tasks, featuring user authentication and cross-origin resource sharing. The endpoints are grouped under Lists, Tasks, and Authentication, each serving a distinct function within the application.

---

## Base URL
All endpoints are prefixed with: `/api`

---

## Authentication
To access the API, a user must first authenticate by providing a valid username and password via the `/api/login` endpoint. The application uses Flask-Login to manage user sessions and cookies.

---

## Lists Endpoints
Manage user-specific lists, including tasks within each list.

### GET `/api/lists`
- **Description:** Retrieves all lists for the authenticated user.
- **Auth Required:** Yes

### GET `/api/lists/<list_id>`
- **Description:** Fetches details of a specific list.
- **Auth Required:** Yes

### POST `/api/lists`
- **Description:** Creates a new list.
- **Auth Required:** Yes

### DELETE `/api/lists/<list_id>`
- **Description:** Deletes a specific list along with its tasks.
- **Auth Required:** Yes

### PUT `/api/lists/<list_id>`
- **Description:** Updates the name of a specific list.
- **Auth Required:** Yes

### GET `/api/lists/<list_id>/tasks`
- **Description:** Retrieves all tasks in a specific list.
- **Auth Required:** Yes

### POST `/api/lists/<list_id>/tasks`
- **Description:** Adds a new task to a specific list.
- **Auth Required:** Yes

---

## Tasks Endpoints
Focused on managing tasks and their hierarchical subtasks.

### GET `/api/task/<task_id>/subtasks`
- **Description:** Retrieves subtasks of a specific task.
- **Auth Required:** Yes

### POST `/api/task/<task_id>/subtasks`
- **Description:** Creates a new subtask under a specific task.
- **Auth Required:** Yes

### PUT `/api/task/<task_id>`
- **Description:** Updates details of a specific task.
- **Auth Required:** Yes

### DELETE `/api/task/<task_id>`
- **Description:** Removes a specific task.
- **Auth Required:** Yes

### PUT `/api/task/<task_id>/status`
- **Description:** Toggles and updates the status of a task and its related subtasks.
- **Auth Required:** Yes

### PUT `/api/task/<task_id>/move`
- **Description:** Moves a task to a different list.
- **Auth Required:** Yes

---

## General Notes
- User authentication is mandatory for accessing all endpoints.
- The application uses SQLAlchemy for database operations and Flask-Login for user session management.
- Configuration settings like database connection, session cookies, and security keys are managed via environment variables.

---