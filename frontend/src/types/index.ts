export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  assigned: number;
  created: number;
  overdue: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}
