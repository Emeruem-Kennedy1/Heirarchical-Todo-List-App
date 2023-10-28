import React from "react";
import DialogBox from "./DialogBox";

/**
 * Renders a dialog box for adding or editing a todo item.
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Whether the dialog box is open or not.
 * @param {function} props.onClose - The function to call when the dialog box is closed.
 * @param {function} props.onSubmit - The function to call when the form is submitted.
 * @param {string} props.name - The name of the todo item.
 * @param {function} props.setName - The function to call when the name of the todo item is changed.
 * @param {string} props.type - The type of the todo item.
 * @param {string} props.label - The label for the todo item.
 * @param {string} props.title - The title for the dialog box.
 * @returns {JSX.Element} - The rendered component.
 */
const AddEditDialog = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  setName,
  type,
  label,
  title,
}) => {
  return (
    <DialogBox
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      name={name}
      setName={setName}
      type={type}
      label={label}
      title={title}
    />
  );
};

export default AddEditDialog;