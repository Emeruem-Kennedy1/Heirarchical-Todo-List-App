import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

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