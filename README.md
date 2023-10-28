# Project Title

Brief description of your project goes here, outlining the main purpose, features, and technology stack used. This should provide a clear overview for anyone new to the project.

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