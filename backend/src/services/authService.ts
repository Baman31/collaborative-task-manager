import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository.js';
import { jwtConfig } from '../config/jwt.js';
import { UserPayload } from '../types/index.js';

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async register(email: string, name: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AuthError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError('Invalid email or password');
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  validateToken(token: string): UserPayload {
    try {
      const payload = jwt.verify(token, jwtConfig.secret) as UserPayload;
      return payload;
    } catch {
      throw new AuthError('Invalid or expired token');
    }
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AuthError('User not found', 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
