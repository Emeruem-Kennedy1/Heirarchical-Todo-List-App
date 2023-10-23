import React from "react";
import DialogBox from "./DialogBox";

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