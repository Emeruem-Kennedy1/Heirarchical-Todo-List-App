import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

/**
 * A form component for adding a new task.
 * @param {Object} props - The props object.
 * @param {Function} props.onAddTask - The function to call when a new task is added.
 * @returns {JSX.Element} - The JSX element for the form.
 */
const AddTaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  /**
   * Handles the form submission.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTask(taskName);
    setTaskName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={2}
      >
        <TextField
          label="New Task"
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          sx={{ marginBottom: 2 }}
          name="taskname"
        />
        <Button type="submit" variant="contained" color="primary" disabled={!taskName}>
          Add Task
        </Button>
      </Box>
    </form>
  );
};

export default AddTaskForm;
