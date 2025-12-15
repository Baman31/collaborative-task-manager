import useSWR from 'swr';
import { taskAPI } from '../services/api';
import { Task, TaskFilters, TaskStats } from '../types';

const fetcher = async <T>(url: string, params?: TaskFilters): Promise<T> => {
  if (url === '/tasks') {
    const response = await taskAPI.getTasks(params);
    return response.data.data as T;
  }
  if (url === '/tasks/stats') {
    const response = await taskAPI.getStats();
    return response.data.data as T;
  }
  if (url === '/tasks/assigned') {
    const response = await taskAPI.getAssigned();
    return response.data.data as T;
  }
  if (url === '/tasks/created') {
    const response = await taskAPI.getCreated();
    return response.data.data as T;
  }
  if (url === '/tasks/overdue') {
    const response = await taskAPI.getOverdue();
    return response.data.data as T;
  }
  throw new Error('Unknown endpoint');
};

export const useTasks = (filters: TaskFilters = {}) => {
  const { data, error, mutate, isLoading } = useSWR<{ tasks: Task[] }>(
    ['/tasks', filters],
    () => fetcher('/tasks', filters),
    { revalidateOnFocus: false }
  );

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
  };
};

export const useTaskStats = () => {
  const { data, error, mutate, isLoading } = useSWR<{ stats: TaskStats }>(
    '/tasks/stats',
    () => fetcher('/tasks/stats'),
    { revalidateOnFocus: false }
  );

  return {
    stats: data?.stats || { total: 0, assigned: 0, created: 0, overdue: 0 },
    isLoading,
    error,
    mutate,
  };
};

export const useAssignedTasks = () => {
  const { data, error, mutate, isLoading } = useSWR<{ tasks: Task[] }>(
    '/tasks/assigned',
    () => fetcher('/tasks/assigned'),
    { revalidateOnFocus: false }
  );

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
  };
};

export const useCreatedTasks = () => {
  const { data, error, mutate, isLoading } = useSWR<{ tasks: Task[] }>(
    '/tasks/created',
    () => fetcher('/tasks/created'),
    { revalidateOnFocus: false }
  );

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
  };
};

export const useOverdueTasks = () => {
  const { data, error, mutate, isLoading } = useSWR<{ tasks: Task[] }>(
    '/tasks/overdue',
    () => fetcher('/tasks/overdue'),
    { revalidateOnFocus: false }
  );

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    mutate,
  };
};
