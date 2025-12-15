import { z } from 'zod';

export const createTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: z.string(),
  dueDate: z.string().datetime({ message: 'Invalid date format' }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assignedToId: z.string().uuid().optional().nullable(),
});

export const updateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
