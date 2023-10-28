import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

/**
 * Renders a dialog box for moving a task to a different list.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Whether the dialog box is open.
 * @param {Function} props.onClose - The function to call when the dialog box is closed.
 * @param {Array} props.lists - The array of lists to display as options for moving the task.
 * @param {string} props.currentListId - The ID of the current list that the task belongs to.
 * @param {Function} props.handleMoveTaskSubmit - The function to call when the user selects a new list to move the task to.
 * @returns {JSX.Element} - The MoveTaskDialog component.
 */
const MoveTaskDialog = ({
  isOpen,
  onClose,
  lists,
  currentListId,
  handleMoveTaskSubmit,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Move Task to:</DialogTitle>
      <List>
        {lists
          .filter((list) => list.id !== currentListId)
          .map((list) => (
            <ListItemButton
              key={list.id}
              onClick={() => handleMoveTaskSubmit(list.id)}
            >
              <ListItemText primary={list.name} />
            </ListItemButton>
          ))}
      </List>
    </Dialog>
  );
};

export default MoveTaskDialog;