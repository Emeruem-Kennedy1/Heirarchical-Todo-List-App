/**
 * A component that renders a nested accordion for a task and its subtasks.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the task.
 * @param {function} props.onDelete - The function to call when the task is deleted.
 * @param {ReactNode} props.children - The subtasks of the task.
 * @param {boolean} props.canHaveSubtasks - Whether the task can have subtasks.
 * @param {boolean} props.hasSubtasks - Whether the task has subtasks.
 * @param {string} props.taskID - The ID of the task.
 * @param {function} props.onUpdateTasks - The function to call when the tasks are updated.
 * @param {number} props.depth - The depth of the task in the hierarchy.
 * @param {string} props.currentListId - The ID of the current list.
 * @param {boolean} props.status - The status of the task.
 * @param {boolean} props.isExpanded - Whether the task is expanded.
 * @param {function} props.onToggleExpanded - The function to call when the task is expanded or collapsed.
 * @returns {JSX.Element} The JSX element representing the nested accordion.
 */
import React, { useState } from "react";
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
  const [lists] = useState(JSON.parse(localStorage.getItem("lists") || []));

  const { addSubtask, editSubtask, moveTask } = useApiTasks();

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
      event.preventDefault();
    }
  };

  const handleToggleCompleted = async (e) => {
    e.stopPropagation();
    try {
      await api.put(`/task/${taskID}/status`);
      setCompleted((prev) => !prev);
      onUpdateTasks(); // Refresh the list after updating the task status
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

  const handleMoveTask = async (e) => {
    setIsMoveDialogOpen(true);
    e.stopPropagation();
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
