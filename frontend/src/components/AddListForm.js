import React, { useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/**
 * A form component for adding a new list.
 * @param {Object} props - The component props.
 * @param {Function} props.onUpdateLists - A function to call after a new list is created.
 * @returns {JSX.Element} - The JSX element for the component.
 */
const AddListForm = ({ onUpdateLists }) => {
  const api = useApi();
  const [listName, setListName] = useState("");

  /**
   * Updates the list name state when the input changes.
   * @param {Object} e - The input change event.
   */
  const handleInputChange = (e) => {
    setListName(e.target.value);
  };

  /**
   * Handles form submission.
   * @param {Object} e - The form submission event.
   */
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
