import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import DialogBox from "./DialogBox";

const ListCard = ({ list_id, list_name, onUpdateLists }) => {
  const navigate = useNavigate();
  const api = useApi();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedName, setEditedName] = useState(list_name);
  const [showIcons, setShowIcons] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const match = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(match);
  }, []);

  const handleCardClick = (e) => {
    if (!e.target.closest(".iconButton")) {
      navigate(`/list/${list_id}`);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    try {
      await api.delete(`/lists/${list_id}`);
      onUpdateLists();
    } catch (error) {
      console.error("Error deleting list:", error);
    }
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
      await api.put(`/lists/${list_id}`, { name: editedName });
      onUpdateLists();
      setIsEditOpen(false);
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
          ".iconButton": {
            opacity: 1,
          },
        },
        ".toggleButton": {
          display: isTouchDevice ? "block" : "none",
        },
        ".iconButton": {
          opacity: showIcons ? 1 : 0,
        },
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Typography variant="h6" align="center">
        {list_name}
      </Typography>

      <MoreVertIcon
        className="toggleButton"
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowIcons(!showIcons);
        }}
      />

      {isHovered && (
        <>
          <DeleteIcon
            className="iconButton"
            sx={{
              position: "absolute",
              top: "10px",
              right: "40px",
              cursor: "pointer",
            }}
            onClick={handleDeleteClick}
          />
          <EditIcon
            className="iconButton"
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
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
