import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import DialogBox from "./DialogBox";

const ListCard = ({ list_id, list_name, onUpdateLists }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedName, setEditedName] = useState(list_name);
  const api = useApi();

  const handleCardClick = () => {
    navigate(`/list/${list_id}`);
  };

  const handleDeleteClick = async (e) => {
    // Stop propagation to prevent the card click event when clicking on the edit button
    e.stopPropagation();
    // Handle the edit action here
    try {
      // Make a DELETE request to delete the list
      await api.delete(`/lists/${list_id}`);

      // Update the lists after successful deletion
      onUpdateLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
    // You can navigate to the edit page or trigger an edit function
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditOpen(false);
  };

  const handleEditSubmit = async (e) => {
    try {
      // Make a PUT request to update the list name
      await api.put(`/lists/${list_id}`, { name: editedName });

      // Update the lists after successful update
      onUpdateLists();
      setIsEditOpen(false);
      setIsHovered(false);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: "black",
        padding: "2rem",
        borderRadius: "10px",
        color: "white",
        "&:hover": {
          backgroundColor: "#333",
          ".closeButton": {
            opacity: 1,
          },
          ".editButton": {
            opacity: 1,
          },
        },
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography variant="h6" align="center">
        {list_name}
      </Typography>
      {isHovered && (
        <>
          <DeleteIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "40px",
              opacity: 0.7,
              cursor: "pointer",
            }}
            onClick={handleDeleteClick}
          />
          <EditIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              opacity: 0.7,
              cursor: "pointer",
            }}
            onClick={handleEditClick}
          />
        </>
      )}

      <DialogBox
        isOpen={isEditOpen}
        onClose={handleEditDialogClose}
        onSubmit={handleEditSubmit}
        name={editedName}
        setName={setEditedName}
        type="edit"
        label="List Name"
        title={`Edit ${list_name}`}
      />
    </Box>
  );
};

export default ListCard;
