import prisma from '../config/database.js';
import { User } from '@prisma/client';

export const userRepository = {
  async create(data: { email: string; password: string; name: string }): Promise<User> {
    return prisma.user.create({ data });
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },
};
