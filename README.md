# Two-Do (A heirarchical todo list app)

This is a simple todo list app that allows users to create and manage heirarchical todo lists.

## Demo
Here is a demo of the app on loom:

[Video Demo](https://www.loom.com/share/fccdf880728c4c16bba602e7732dab83?sid=6de1b51c-b4be-4381-a84a-a8f13fe3135c)

## Technologies Used
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [React](https://reactjs.org/)

To see the folder structure of the project, click [here](#folder-structure).

## Features
- Sign up and login
- Create multiple todo lists
- Create multiple tasks in each todo list
- Create subtasks in each task
- Create subtasks in each subtask
- Mark tasks as complete (subtasks too)
- Move top-level tasks to other todo lists
- edit tasks, subtasks and todo lists
- delete tasks, subtasks and todo lists

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

List any prerequisites, libraries, OS version, etc., needed before installing the project. For example:

- Node.js (v14 or later)
- npm (v6 or later)
- Python (v3.8 or later)

### Installing

#### Backend Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/Emeruem-Kennedy1/Heirarchical-Todo-List-App.git
    ```

2. **create and activate a virtual environment:**
    
    ```bash
    python -m venv venv
    source venv/bin/activate
    ``` 



2. **Navigate to the backend directory:**

    ```bash
    cd /backend
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set environment variables:**
   
   Create a `.env` file in the backend directory and update the necessary environment variables.

    ```dotenv
    DATABASE_URL=your_database_url
    SECRET_KEY=your_secret_key
    ```
#### Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2. **Install NPM packages:**

    ```bash
    npm install
    ```
3. **Set environment variables:**
   
   Create a `.env` file in the frontend directory and update the necessary environment variables.

    ```dotenv
    REACT_APP_BASE_API_URL=http://127.0.0.1:7000
    ```

### Starting the Application

#### Running the Backend

- In the main project directory, run the following command:

    ```bash
    python main.py
    ```

  This will start the backend server on `http://127.0.0.1:7000`.

#### Running the Frontend

- In a new terminal, navigate to the frontend directory:

    ```bash
    npm start
    ```

  This will start the React app and should automatically open `http://localhost:3000/` in your web browser.

## Testing

In the project root directory, run the following command:

```bash
python -m unittest discover
```


## Folder Structure
```
Heirarchical-Todo-List-App
│
├── Backend/                  # Backend API developed with Flask
│   ├── __init__.py           # Initialization of the Flask app
│   ├── auth.py               # Authentication related operations
│   ├── list.py               # Handling todo list operations
│   ├── models.py             # Database models
│   ├── readme.md             # Backend specific documentation
│   ├── requirements.txt      # Dependencies for the backend
│   └── task.py               # Task management operations
│
├── frontend/                 # Frontend developed using React
│   ├── package-lock.json     # Locked versions of npm dependencies
│   ├── package.json          # NPM package configuration
│   ├── public/               # Public assets like HTML, logo, etc.
│   │   ├── index.html        # Entry HTML file
│   │   ├── logo.png          # App logo
│   │   └── manifest.json     # Web app manifest file
│   ├── src/                  # Source files for React components
│   │   ├── App.js            # Main React application component
│   │   ├── ListAppApiclient.js # API client for backend communication
│   │   ├── components/       # Reusable React components
│   │   ├── contexts/         # React contexts for state management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── index.js          # Entry point for React app
│   │   ├── theme.js          # Theme configuration for the app
│   │   └── views/            # React components for different views/pages
│   └── ...
│
├── tests/                    # Tests for the application
│   ├── __init__.py           # Initialization for tests
│   ├── test_list.py          # Tests for list operations
│   └── test_task.py          # Tests for task operations
│
├── .env                      # Environment variables
├── main.py                   # Main entry point for the Flask application
└── README.md                 # General documentation for the entire project
```