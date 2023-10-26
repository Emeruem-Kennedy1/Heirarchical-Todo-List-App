// hooks/useApiTasks.js
import { useApi } from "../contexts/ApiProvider";

const useApiTasks = () => {
  const api = useApi();

  const addSubtask = async (taskId, subtaskName) => {
    try {
      await api.post(`/task/${taskId}/subtasks`, { name: subtaskName });
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const editSubtask = async (taskId, editedName) => {
    try {
      await api.put(`/task/${taskId}`, { name: editedName });
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const moveTask = async (taskId, selectedListId) => {
    try {
      await api.put(`/task/${taskId}/move`, { new_list_id: selectedListId });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const changeStatus = async (taskId, status) => {
    try {
      await api.put(`/task/${taskId}/status`, { status: status });
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  return {
    addSubtask,
    editSubtask,
    moveTask,
    changeStatus,
  };
};

export default useApiTasks;
