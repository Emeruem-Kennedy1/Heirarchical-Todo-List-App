import { React, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import NestedAccordion from "../components/NestedAccordion";
import { useApi } from "../contexts/ApiProvider";
import AddTaskForm from "../components/AddTaskFrom";
import { Container, Typography } from "@mui/material";

const ListPage = () => {
  const { listId } = useParams();
  const api = useApi();
  const [tasks, setTasks] = useState([]);
  const [listName, setListName] = useState("");
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);


  const fetchList = useCallback(async () => {
    try {
      const data = await api.get(`/lists/${listId}`);
      const list = data.body.list;
      setTasks(list.tasks);
      setListName(list.name);
      setForceUpdate((prev) => prev + 1);
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
      depth={task.task_depth}
      currentListId={Number(listId)}
      status={task.status}
      isExpanded={expandedTasks.includes(task.id)}
      onToggleExpanded={(taskId, isExpanded) => {
        if (isExpanded) {
          setExpandedTasks((prev) => [...prev, taskId]);
        } else {
          setExpandedTasks((prev) => prev.filter((id) => id !== taskId));
        }
      }}
    >
      {task.subtasks.map((subtask) => renderTask(subtask))}
    </NestedAccordion>
  );

  return (
    <Container
      sx={{
        height: "100%",
        marginBottom: "10vh",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          marginTop: "5%",
          marginBottom: "5%",
        }}
      >
        {listName}
      </Typography>
      <AddTaskForm onAddTask={handleAddTask} />
      <div key={forceUpdate} style={{ width: "80%", margin: "20px auto" }}>
        {tasks.map((task) => renderTask(task))}
      </div>
    </Container>
  );
};

export default ListPage;
