import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useApi } from "../contexts/ApiProvider";

function EditListForm({ list_name, list_id, onUpdateLists }) {
  const [name, setName] = useState(list_name);
  const api = useApi();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // handle form submission here
    try {
      // Make a PUT request to update the list
      await api.put(`/lists/${list_id}`, { name });

      // Update the lists after successful submission
      onUpdateLists();

      // Reset the input field
      setName("");
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="List Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={handleNameChange}
      />
      <input type="hidden" name="id" value={list_id} />
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </form>
  );
}

export default EditListForm;
