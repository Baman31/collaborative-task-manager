import prisma from '../config/database.js';
import { Task, Priority, Status } from '@prisma/client';
import { TaskFilters } from '../types/index.js';

export const taskRepository = {
  async create(data: {
    title: string;
    description: string;
    dueDate: Date;
    priority: Priority;
    creatorId: string;
    assignedToId?: string | null;
  }): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async findAll(filters: TaskFilters = {}): Promise<Task[]> {
    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status as Status;
    }
    if (filters.priority) {
      where.priority = filters.priority as Priority;
    }
    if (filters.assignedToId) {
      where.assignedToId = filters.assignedToId;
    }
    if (filters.creatorId) {
      where.creatorId = filters.creatorId;
    }

    const orderBy: Record<string, string> = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.order || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return prisma.task.findMany({
      where,
      orderBy,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async findByAssignedTo(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { assignedToId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  },

  async findByCreator(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { creatorId: userId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findOverdue(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        OR: [{ assignedToId: userId }, { creatorId: userId }],
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  },

  async countByUser(userId: string): Promise<{
    total: number;
    assigned: number;
    created: number;
    overdue: number;
  }> {
    const [total, assigned, created, overdue] = await Promise.all([
      prisma.task.count({
        where: { OR: [{ assignedToId: userId }, { creatorId: userId }] },
      }),
      prisma.task.count({ where: { assignedToId: userId } }),
      prisma.task.count({ where: { creatorId: userId } }),
      prisma.task.count({
        where: {
          OR: [{ assignedToId: userId }, { creatorId: userId }],
          dueDate: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      }),
    ]);
    return { total, assigned, created, overdue };
  },
};
