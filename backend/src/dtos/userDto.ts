import { z } from 'zod';

export const updateUserDto = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
