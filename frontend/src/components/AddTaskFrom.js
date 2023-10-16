import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const AddTaskForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

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
        />
        <Button type="submit" variant="contained" color="primary" disabled={!taskName}>
          Add Task
        </Button>
      </Box>
    </form>
  );
};

export default AddTaskForm;
