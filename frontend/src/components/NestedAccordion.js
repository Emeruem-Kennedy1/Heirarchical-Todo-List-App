import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddSubtaskDialog from "./AddSubtaskDialog";
import { useApi } from "../contexts/ApiProvider";
import EditSubtaskDialog from "./EditSubtaskDialog";

const NestedAccordion = ({
  title,
  onDelete,
  children,
  parentCompleted,
  canHaveSubtasks,
  hasSubtasks,
  taskID,
  onUpdateTasks,
}) => {
  const api = useApi();
  const [completed, setCompleted] = useState(parentCompleted || false);
  const [expanded, setExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to track dialog open status
  const [subtaskName, setSubtaskName] = useState(""); // State to track the subtask name
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State to track edit dialog open status
  const [editedSubtaskName, setEditedSubtaskName] = useState(title); // State to track the edited subtask name

  const handleToggleExpanded = (event, newExpanded) => {
    if (hasSubtasks) {
      setExpanded(newExpanded);
    } else {
      event.stopPropagation(); // Prevent expansion if there are no subtasks
    }
  };

  const handleToggleCompleted = (e) => {
    e.stopPropagation();
    setCompleted((prev) => !prev);
  };

  useEffect(() => {
    if (parentCompleted !== undefined) {
      setCompleted(parentCompleted);
    }
  }, [parentCompleted]);

  const handleDialogSubmit = async () => {
    try {
      await api.post(`/task/${taskID}/subtasks`, { name: subtaskName });

      setIsDialogOpen(false);

      // Update the lists after successful update
      onUpdateTasks();

      // Reset the subtask name
      setSubtaskName("");
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const handleAddSubtask = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleEditSubtask = (e) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };

  const handleEditDialogSubmit = async () => {
    try {
      // Make a PUT request to update the subtask name
      await api.put(`/task/${taskID}`, { name: editedSubtaskName });

      setIsEditDialogOpen(false);

      // Update the tasks after successful update
      onUpdateTasks();

      // Reset the edited subtask name
      setEditedSubtaskName("");
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={handleToggleExpanded}>
        <AccordionSummary expandIcon={hasSubtasks ? <ExpandMoreIcon /> : null}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={completed}
                onChange={handleToggleCompleted}
                onClick={(e) => e.stopPropagation()}
              />
              <Typography
                style={{ textDecoration: completed ? "line-through" : "none" }}
              >
                {title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {canHaveSubtasks && (
                <Button onClick={handleAddSubtask} size="small">
                  Add Subtask
                </Button>
              )}
              <Button onClick={handleEditSubtask} startIcon={<EditIcon />} />
              <Button
                onClick={() => onDelete(taskID)}
                startIcon={<DeleteIcon />}
              />
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { parentCompleted: completed });
            }
            return child;
          })}
        </AccordionDetails>
      </Accordion>
      {canHaveSubtasks && (
        <AddSubtaskDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          subtaskName={subtaskName}
          setSubtaskName={setSubtaskName}
        />
      )}
      <EditSubtaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditDialogSubmit}
        editedSubtaskName={editedSubtaskName}
        setEditedSubtaskName={setEditedSubtaskName}
      />
    </>
  );
};

export default NestedAccordion;
