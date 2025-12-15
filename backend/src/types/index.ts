import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignedToId?: string;
  creatorId?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
