import React from "react";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

/**
 * Renders a set of buttons for performing actions on a task.
 * @param {Object} props - The component props.
 * @param {boolean} props.canHaveSubtasks - Indicates whether the task can have subtasks.
 * @param {Function} props.handleAddSubtask - The function to handle adding a subtask.
 * @param {Function} props.handleEditSubtask - The function to handle editing a subtask.
 * @param {Function} props.handleDeleteTask - The function to handle deleting a task.
 * @param {Function} props.handleMoveTask - The function to handle moving a task.
 * @param {number} props.depth - The depth of the task in the hierarchy.
 * @returns {JSX.Element} - The rendered component.
 */
const TaskActions = ({
  canHaveSubtasks,
  handleAddSubtask,
  handleEditSubtask,
  handleDeleteTask,
  handleMoveTask,
  depth,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {canHaveSubtasks && (
        <Button onClick={handleAddSubtask} size="small">
          Add Subtask
        </Button>
      )}
      <Button onClick={handleEditSubtask} startIcon={<EditIcon />} />
      <Button onClick={handleDeleteTask} startIcon={<DeleteIcon />} />
      {depth === 0 && (
        <Button onClick={handleMoveTask} startIcon={<DriveFileMoveIcon />} />
      )}
    </Box>
  );
};

export default TaskActions;