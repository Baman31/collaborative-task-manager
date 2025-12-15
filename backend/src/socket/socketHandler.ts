import { Server, Socket } from 'socket.io';
import { authService } from '../services/authService.js';

export const setupSocketHandlers = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('authenticate', (token: string) => {
      try {
        const user = authService.validateToken(token);
        socket.join(`user:${user.id}`);
        socket.emit('authenticated', { userId: user.id });
        console.log(`User ${user.id} authenticated via socket`);
      } catch {
        socket.emit('auth_error', { message: 'Invalid token' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
