import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const AddSubtaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  subtaskName,
  setSubtaskName,
}) => {
  const handleAddSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleDialogClick = (e) => {
    // Stop propagation to prevent the card click event when clicking inside the dialog
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} onClick={handleDialogClick}>
      <DialogTitle>Add Subtask</DialogTitle>
      <DialogContent>
        <TextField
          label="Subtask Name"
          variant="outlined"
          fullWidth
          value={subtaskName}
          onChange={(e) => setSubtaskName(e.target.value)}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleAddSubmit}
          color="primary"
          disabled={!subtaskName} // Disable if subtaskName is empty
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubtaskDialog;
