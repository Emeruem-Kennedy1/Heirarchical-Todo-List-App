import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
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
            <ListItem
              key={list.id}
              onClick={() => handleMoveTaskSubmit(list.id)}
            >
              <ListItemText primary={list.name} />
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
};

export default MoveTaskDialog;