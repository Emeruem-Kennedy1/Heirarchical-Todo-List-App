import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const DialogBox = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  title,
  type,
  label
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          label={label}
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          disabled={!name} // Disable if name is empty
        >
          {type === "edit" ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
