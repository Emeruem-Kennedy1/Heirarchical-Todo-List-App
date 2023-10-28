// hooks/useApiTasks.js
import { useApi } from "../contexts/ApiProvider";

/**
 * A custom hook that provides functions for interacting with the API for tasks.
 * @returns {Object} - An object containing functions for adding subtasks, editing subtasks, moving tasks, and changing task status.
 */
const useApiTasks = () => {
  const api = useApi();

  /**
   * Adds a subtask to a task.
   * @param {string} taskId - The ID of the task to add the subtask to.
   * @param {string} subtaskName - The name of the subtask to add.
   * @returns {Promise<void>} - A Promise that resolves when the subtask has been added.
   */
  const addSubtask = async (taskId, subtaskName) => {
    try {
      await api.post(`/task/${taskId}/subtasks`, { name: subtaskName });
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  /**
   * Edits the name of a subtask.
   * @param {string} taskId - The ID of the task that the subtask belongs to.
   * @param {string} editedName - The new name for the subtask.
   * @returns {Promise<void>} - A Promise that resolves when the subtask has been edited.
   */
  const editSubtask = async (taskId, editedName) => {
    try {
      await api.put(`/task/${taskId}`, { name: editedName });
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  /**
   * Moves a task to a different list.
   * @param {string} taskId - The ID of the task to move.
   * @param {string} selectedListId - The ID of the list to move the task to.
   * @returns {Promise<void>} - A Promise that resolves when the task has been moved.
   */
  const moveTask = async (taskId, selectedListId) => {
    try {
      await api.put(`/task/${taskId}/move`, { new_list_id: selectedListId });
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  /**
   * Changes the status of a task.
   * @param {string} taskId - The ID of the task to change the status of.
   * @param {string} status - The new status for the task.
   * @returns {Promise<void>} - A Promise that resolves when the task status has been changed.
   */
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
