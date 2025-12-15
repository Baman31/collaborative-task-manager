import { taskRepository } from '../repositories/taskRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { CreateTaskDto, UpdateTaskDto, createTaskDto, updateTaskDto } from '../dtos/taskDto.js';
import { TaskFilters } from '../types/index.js';
import { ZodError } from 'zod';

export class TaskError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'TaskError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const taskService = {
  async createTask(data: CreateTaskDto, userId: string) {
    try {
      const validated = createTaskDto.parse(data);
      
      if (validated.assignedToId) {
        const assignee = await userRepository.findById(validated.assignedToId);
        if (!assignee) {
          throw new TaskError('Assigned user not found', 400);
        }
      }
      
      const task = await taskRepository.create({
        title: validated.title,
        description: validated.description,
        dueDate: new Date(validated.dueDate),
        priority: validated.priority,
        creatorId: userId,
        assignedToId: validated.assignedToId || null,
      });
      return task;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  },

  async getTasks(filters: TaskFilters) {
    return taskRepository.findAll(filters);
  },

  async getTaskById(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new TaskError('Task not found', 404);
    }
    return task;
  },

  async updateTask(id: string, data: UpdateTaskDto, userId: string) {
    try {
      const validated = updateTaskDto.parse(data);
      const task = await taskRepository.findById(id);
      
      if (!task) {
        throw new TaskError('Task not found', 404);
      }

      if (task.creatorId !== userId && task.assignedToId !== userId) {
        throw new TaskError('Not authorized to update this task', 403);
      }

      const updateData: Record<string, unknown> = {};
      if (validated.title !== undefined) updateData.title = validated.title;
      if (validated.description !== undefined) updateData.description = validated.description;
      if (validated.dueDate !== undefined) updateData.dueDate = new Date(validated.dueDate);
      if (validated.priority !== undefined) updateData.priority = validated.priority;
      if (validated.status !== undefined) updateData.status = validated.status;
      if (validated.assignedToId !== undefined) updateData.assignedToId = validated.assignedToId;

      const updatedTask = await taskRepository.update(id, updateData);
      return { task: updatedTask, previousAssignedTo: task.assignedToId };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError('Validation failed', error.errors);
      }
      throw error;
    }
  },

  async deleteTask(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new TaskError('Task not found', 404);
    }

    if (task.creatorId !== userId) {
      throw new TaskError('Not authorized to delete this task', 403);
    }

    await taskRepository.delete(id);
    return task;
  },

  async getMyAssignedTasks(userId: string) {
    return taskRepository.findByAssignedTo(userId);
  },

  async getMyCreatedTasks(userId: string) {
    return taskRepository.findByCreator(userId);
  },

  async getOverdueTasks(userId: string) {
    return taskRepository.findOverdue(userId);
  },

  async getTaskStats(userId: string) {
    return taskRepository.countByUser(userId);
  },
};
