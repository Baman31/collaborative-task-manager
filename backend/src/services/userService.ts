import { userRepository } from '../repositories/userRepository.js';

export const userService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
