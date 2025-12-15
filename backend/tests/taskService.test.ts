import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockTaskRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../src/repositories/taskRepository', () => ({
  taskRepository: mockTaskRepository,
}));

import { taskService, TaskError, ValidationError } from '../src/services/taskService';

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create task with valid data', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test description',
        dueDate: new Date().toISOString(),
        priority: 'HIGH' as const,
      };

      const expectedTask = {
        id: 'task-uuid',
        ...taskData,
        creatorId: 'user-id',
        status: 'TODO',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await taskService.createTask(taskData, 'user-id');

      expect(result).toHaveProperty('id');
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test description',
        dueDate: expect.any(Date),
        priority: 'HIGH',
        creatorId: 'user-id',
        assignedToId: null,
      });
    });

    it('should reject task with invalid title (empty)', async () => {
      const taskData = {
        title: '',
        description: 'Test',
        dueDate: new Date().toISOString(),
        priority: 'HIGH' as const,
      };

      await expect(taskService.createTask(taskData, 'user-id')).rejects.toThrow(
        ValidationError
      );
    });

    it('should reject task with title exceeding 100 characters', async () => {
      const taskData = {
        title: 'a'.repeat(101),
        description: 'Test',
        dueDate: new Date().toISOString(),
        priority: 'HIGH' as const,
      };

      await expect(taskService.createTask(taskData, 'user-id')).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe('updateTask', () => {
    it('should prevent unauthorized task updates', async () => {
      const existingTask = {
        id: 'task-id',
        title: 'Existing Task',
        description: 'Description',
        dueDate: new Date(),
        priority: 'MEDIUM',
        status: 'TODO',
        creatorId: 'user1',
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);

      await expect(
        taskService.updateTask('task-id', { title: 'Updated' }, 'user2')
      ).rejects.toThrow(TaskError);

      await expect(
        taskService.updateTask('task-id', { title: 'Updated' }, 'user2')
      ).rejects.toThrow('Not authorized to update this task');
    });

    it('should allow creator to update task', async () => {
      const existingTask = {
        id: 'task-id',
        title: 'Existing Task',
        description: 'Description',
        dueDate: new Date(),
        priority: 'MEDIUM',
        status: 'TODO',
        creatorId: 'user1',
        assignedToId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = { ...existingTask, title: 'Updated Task' };

      mockTaskRepository.findById.mockResolvedValue(existingTask);
      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(
        'task-id',
        { title: 'Updated Task' },
        'user1'
      );

      expect(result.task.title).toBe('Updated Task');
    });
  });

  describe('deleteTask', () => {
    it('should throw error when task not found', async () => {
      mockTaskRepository.findById.mockResolvedValue(null);

      await expect(taskService.deleteTask('non-existent', 'user-id')).rejects.toThrow(
        TaskError
      );
    });

    it('should prevent non-creator from deleting task', async () => {
      const existingTask = {
        id: 'task-id',
        creatorId: 'user1',
      };

      mockTaskRepository.findById.mockResolvedValue(existingTask);

      await expect(taskService.deleteTask('task-id', 'user2')).rejects.toThrow(
        'Not authorized to delete this task'
      );
    });
  });
});
