import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useApi } from "../contexts/ApiProvider";
import AddEditDialog from "./AddEditDialog";
import MoveTaskDialog from "./MoveTaskDialog";
import TaskActions from "./TaskActions";


const NestedAccordion = ({
  title,
  onDelete,
  children,
  parentCompleted,
  canHaveSubtasks,
  hasSubtasks,
  taskID,
  onUpdateTasks,
  depth,
  currentListId,
}) => {
  const api = useApi();
  const [completed, setCompleted] = useState(parentCompleted || false);
  const [expanded, setExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to track dialog open status
  const [subtaskName, setSubtaskName] = useState(""); // State to track the subtask name
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State to track edit dialog open status
  const [editedSubtaskName, setEditedSubtaskName] = useState(title); // State to track the edited subtask name
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get("/lists");
        setLists(response.body.lists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [api]);

  const handleMoveTaskSubmit = async (selectedListId) => {
    try {
      await api.put(`/task/${taskID}/move`, { new_list_id: selectedListId });
      setIsMoveDialogOpen(false);
      onUpdateTasks();
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

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

  const handleAddDialogSubmit = async () => {
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
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const handleMoveTask = async () => {
    setIsMoveDialogOpen(true);
  };

  const handleDeleteTask = (id) => {
    onDelete(id);
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
            <TaskActions
              canHaveSubtasks={canHaveSubtasks}
              handleAddSubtask={handleAddSubtask}
              handleEditSubtask={handleEditSubtask}
              handleDeleteTask={() => handleDeleteTask(taskID)}
              handleMoveTask={handleMoveTask}
              depth={depth}
            />
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
      <AddEditDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddDialogSubmit}
        name={subtaskName}
        setName={setSubtaskName}
        type="add"
        label="Subtask Name"
        title={`Add Subtask to ${title}`}
      />
      <AddEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditDialogSubmit}
        name={editedSubtaskName}
        setName={setEditedSubtaskName}
        type="edit"
        label="Subtask Name"
        title={`Edit ${title}`}
      />
      <MoveTaskDialog
        isOpen={isMoveDialogOpen}
        onClose={() => setIsMoveDialogOpen(false)}
        lists={lists}
        currentListId={currentListId}
        handleMoveTaskSubmit={handleMoveTaskSubmit}
      />
    </>
  );
};

export default NestedAccordion;
