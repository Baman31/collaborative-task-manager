import { Response, NextFunction, Router } from 'express';
import { taskService } from '../services/taskService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { AuthenticatedRequest, TaskFilters } from '../types/index.js';
import { Server } from 'socket.io';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters: TaskFilters = {
      status: req.query.status as string | undefined,
      priority: req.query.priority as string | undefined,
      assignedToId: req.query.assignedToId as string | undefined,
      creatorId: req.query.creatorId as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      order: req.query.order as 'asc' | 'desc' | undefined,
    };
    const tasks = await taskService.getTasks(filters);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.body, req.user!.id);
    const io: Server = req.app.get('io');
    io.emit('task:created', task);
    res.status(201).json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await taskService.getTaskStats(req.user!.id);
    res.json({ success: true, data: { stats } });
  } catch (error) {
    next(error);
  }
});

router.get('/assigned', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getMyAssignedTasks(req.user!.id);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.get('/created', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getMyCreatedTasks(req.user!.id);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.get('/overdue', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getOverdueTasks(req.user!.id);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user!.id);
    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { task, previousAssignedTo } = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user!.id
    );
    const io: Server = req.app.get('io');
    io.emit('task:updated', task);

    if (task.assignedToId && task.assignedToId !== previousAssignedTo) {
      io.to(`user:${task.assignedToId}`).emit('task:assigned', task);
    }

    res.json({ success: true, data: { task } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.deleteTask(req.params.id, req.user!.id);
    const io: Server = req.app.get('io');
    io.emit('task:deleted', { id: task.id });
    res.json({ success: true, data: { message: 'Task deleted' } });
  } catch (error) {
    next(error);
  }
});

export default router;
