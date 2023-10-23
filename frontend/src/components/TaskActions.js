import React from "react";
import { Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";

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