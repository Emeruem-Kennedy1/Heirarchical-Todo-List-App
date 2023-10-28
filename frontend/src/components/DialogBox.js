import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

/**
 * A dialog box component that can be used for adding or editing items.
 * @param {Object} props - The props object containing the following properties:
 * @param {boolean} props.isOpen - Whether the dialog box is open or not.
 * @param {function} props.onClose - The function to call when the dialog box is closed.
 * @param {function} props.onSubmit - The function to call when the form is submitted.
 * @param {string} props.name - The name of the item being added or edited.
 * @param {function} props.setName - The function to call when the name of the item is changed.
 * @param {string} props.title - The title of the dialog box.
 * @param {string} props.type - The type of the dialog box (either "add" or "edit").
 * @param {string} props.label - The label to display for the input field.
 * @returns {JSX.Element} - The JSX element representing the dialog box.
 */
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
