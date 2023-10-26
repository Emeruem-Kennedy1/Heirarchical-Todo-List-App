import React, { useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const AddListForm = ({ onUpdateLists }) => {
  const api = useApi();
  const [listName, setListName] = useState("");

  const handleInputChange = (e) => {
    setListName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!listName.trim()) {
      // Input is empty, don't submit
      return;
    }

    try {
      // Make a POST request to create a new list
      await api.post("/lists", { name: listName });

      // Update the lists after successful submission
      onUpdateLists();

      // Reset the input field
      setListName("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <TextField
          label="List Name"
          variant="outlined"
          value={listName}
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
          name="listname"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!listName.trim()} // Disable if the input is empty
        >
          Create List
        </Button>
      </Box>
    </form>
  );
};

export default AddListForm;
