import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const EditSubtaskDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editedSubtaskName,
  setEditedSubtaskName,
}) => {
  const handleEditSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleDialogClick = (e) => {
    // Stop propagation to prevent the card click event when clicking inside the dialog
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} onClick={handleDialogClick}>
      <DialogTitle>Edit Subtask</DialogTitle>
      <DialogContent>
        <TextField
          label="Subtask Name"
          variant="outlined"
          fullWidth
          value={editedSubtaskName}
          onChange={(e) => setEditedSubtaskName(e.target.value)}
          sx={{ marginTop: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleEditSubmit}
          color="primary"
          disabled={!editedSubtaskName} // Disable if editedSubtaskName is empty
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSubtaskDialog;
