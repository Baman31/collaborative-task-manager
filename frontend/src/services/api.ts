import axios from 'axios';
import { Task, TaskFilters, User, TaskStats, ApiResponse } from '../types';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `${window.location.protocol}//${host}:3000/api`;
  }
  return 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<ApiResponse<{ user: User }>>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: User }>>('/auth/login', data),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  getMe: () => api.get<ApiResponse<{ user: User }>>('/auth/me'),
};

export const taskAPI = {
  getTasks: (params?: TaskFilters) =>
    api.get<ApiResponse<{ tasks: Task[] }>>('/tasks', { params }),
  createTask: (data: Partial<Task>) =>
    api.post<ApiResponse<{ task: Task }>>('/tasks', data),
  updateTask: (id: string, data: Partial<Task>) =>
    api.patch<ApiResponse<{ task: Task }>>(`/tasks/${id}`, data),
  deleteTask: (id: string) =>
    api.delete<ApiResponse<{ message: string }>>(`/tasks/${id}`),
  getStats: () => api.get<ApiResponse<{ stats: TaskStats }>>('/tasks/stats'),
  getAssigned: () => api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/assigned'),
  getCreated: () => api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/created'),
  getOverdue: () => api.get<ApiResponse<{ tasks: Task[] }>>('/tasks/overdue'),
};

export const userAPI = {
  getUsers: () => api.get<ApiResponse<{ users: User[] }>>('/users'),
  getMyTasks: () => api.get<ApiResponse<{ tasks: Task[] }>>('/users/me/tasks'),
  getMyCreated: () => api.get<ApiResponse<{ tasks: Task[] }>>('/users/me/created'),
};

export default api;
