import type { TaskAdd, Filters } from "../models/tabs/taskModel";
import apiClient from "../services/apiClient";

const TaskAPI = {
  getTasks: async ({ skip = 0, limit = 10, filters }: { skip?: number; limit?: number; filters?: Filters } = {}) => {
    try {
      const params = [];
      params.push(`skip=${skip}`);
      params.push(`limit=${limit}`);
      if (filters) {
        if (filters.subject) params.push(`subject=${encodeURIComponent(filters.subject)}`);
        if (filters.priority) params.push(`priority=${encodeURIComponent(filters.priority)}`);
        if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
      }
      const query = params.join("&");
      const response = await apiClient.get(`/tasks?${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  createTask: async (taskData: TaskAdd) => {
    try {
      const response = await apiClient.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  updateTask: async (taskId: number, taskData: TaskAdd) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  deleteTask: async (taskId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },
};

export const fetchTasksByDate = async (date: Date) => {
  try {
    const formattedDate = date.toLocaleDateString("en-CA"); // Format date as YYYY-MM-DD
    const response = await apiClient.get(`/tasks/due_date/${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks by date:", error);
    throw error;
  }
};

export default TaskAPI;
