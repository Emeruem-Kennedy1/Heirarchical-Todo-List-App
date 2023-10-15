import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const EditListDialog = ({
  isOpen,
  onClose,
  onSubmit,
  editedName,
  setEditedName,
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
      <DialogTitle>Edit List</DialogTitle>
      <DialogContent>
        <TextField
          label="List Name"
          variant="outlined"
          fullWidth
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
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
          disabled={!editedName} // Disable if editedName is empty
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditListDialog;
