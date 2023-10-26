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
import AddEditDialog from "./AddEditDialog";
import MoveTaskDialog from "./MoveTaskDialog";
import TaskActions from "./TaskActions";
import useApiTasks from "../hooks/useApiTasks";
import { useApi } from "../contexts/ApiProvider";

const NestedAccordion = ({
  title,
  onDelete,
  children,
  canHaveSubtasks,
  hasSubtasks,
  taskID,
  onUpdateTasks,
  depth,
  currentListId,
  status,
  isExpanded,
  onToggleExpanded,
}) => {
  const api = useApi();
  const [completed, setCompleted] = useState(status || false);
  const [expanded, setExpanded] = useState(isExpanded);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to track dialog open status
  const [subtaskName, setSubtaskName] = useState(""); // State to track the subtask name
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State to track edit dialog open status
  const [editedSubtaskName, setEditedSubtaskName] = useState(title); // State to track the edited subtask name
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [lists, setLists] = useState([]);

  const { addSubtask, editSubtask, moveTask } = useApiTasks();

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

  const handleAddDialogSubmit = async () => {
    await addSubtask(taskID, subtaskName);
    setIsDialogOpen(false);
    onUpdateTasks();
    setSubtaskName("");
  };

  const handleEditDialogSubmit = async () => {
    await editSubtask(taskID, editedSubtaskName);
    setIsEditDialogOpen(false);
    onUpdateTasks();
  };

  const handleMoveTaskSubmit = async (selectedListId) => {
    await moveTask(taskID, selectedListId);
    setIsMoveDialogOpen(false);
    onUpdateTasks();
  };

  const handleToggleExpanded = (event, newExpanded) => {
    if (hasSubtasks) {
      setExpanded(newExpanded);
    } else {
      event.stopPropagation();
    }
  };

  const handleToggleCompleted = async (e) => {
    e.stopPropagation();
    try {
      await api.put(`/task/${taskID}/status`);
      setCompleted((prev) => !prev);
      onUpdateTasks(); // Refresh the list after updating the task status
      console.log("Task status updated");
    } catch (error) {
      console.error("Error updating task status:", error);
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

  const handleMoveTask = async () => {
    setIsMoveDialogOpen(true);
  };

  const handleDeleteTask = (id) => {
    onDelete(id);
  };

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={(event, newExpanded) => {
          onToggleExpanded(taskID, newExpanded);
          handleToggleExpanded(event, newExpanded);
        }}
      >
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
              <Checkbox checked={completed} onClick={handleToggleCompleted} />
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
        {hasSubtasks && (
          <AccordionDetails style={{ padding: hasSubtasks ? undefined : "0" }}>
            {children}
          </AccordionDetails>
        )}
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
