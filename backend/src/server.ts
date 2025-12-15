import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authController from './controllers/authController.js';
import taskController from './controllers/taskController.js';
import userController from './controllers/userController.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5000',
];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed.split('//')[0] + '//' + allowed.split('//')[1]?.split(':')[0]))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  },
});

app.set('io', io);

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authController);
app.use('/api/tasks', taskController);
app.use('/api/users', userController);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'healthy' } });
});

setupSocketHandlers(io);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server, io };
