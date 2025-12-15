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

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5000',
    'http://localhost:5173',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5173',
  ];
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  if (process.env.REPLIT_DEV_DOMAIN) {
    origins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }
  return origins;
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      callback(null, true);
      return;
    }
    const allowedOrigins = getAllowedOrigins();
    const isAllowed = allowedOrigins.some(allowed => 
      origin === allowed || origin.endsWith('.replit.dev') || origin.endsWith('.repl.co')
    );
    callback(null, isAllowed);
  },
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

app.set('io', io);

app.use(cors(corsOptions));
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
