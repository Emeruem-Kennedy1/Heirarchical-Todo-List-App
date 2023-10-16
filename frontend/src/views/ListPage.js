import { React, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import NestedAccordion from "../components/NestedAccordion";
import { useApi } from "../contexts/ApiProvider";
import AddTaskForm from "../components/AddTaskFrom";
import { Typography } from "@mui/material";

const ListPage = () => {
  const { listId } = useParams();
  const api = useApi();
  const [tasks, setTasks] = useState([]);
  const [listName, setListName] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const data = await api.get(`/lists/${listId}`);
      const list = data.body.list;
      setTasks(list.tasks);
      setListName(list.name);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  }, [api, listId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDeleteTask = useCallback(
    async (taskId) => {
      try {
        await api.delete(`/task/${taskId}`);
        fetchList();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [api, fetchList]
  );

  const handleAddTask = useCallback(
    async (taskName) => {
      try {
        await api.post(`/lists/${listId}/tasks`, { name: taskName });
        fetchList();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },
    [api, fetchList, listId]
  );

  const renderTask = (task) => (
    <NestedAccordion
      key={task.id}
      title={task.name}
      onDelete={handleDeleteTask}
      onAddSubtask={(e) => e.stopPropagation()}
      canHaveSubtasks={task.can_have_subtasks}
      hasSubtasks={task.subtasks.length > 0}
      taskID={task.id}
      onUpdateTasks={fetchList}
    >
      {task.subtasks.map((subtask) => renderTask(subtask))}
    </NestedAccordion>
  );

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom> {listName} </Typography>
      <AddTaskForm onAddTask={handleAddTask}/>
      <div style={{ width: "80%", margin: "20px auto" }}>
        {tasks.map((task) => renderTask(task))}
      </div>
    </>
  );
};

export default ListPage;
