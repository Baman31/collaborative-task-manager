import { Response, NextFunction, Router } from 'express';
import { userService } from '../services/userService.js';
import { taskService } from '../services/taskService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { AuthenticatedRequest } from '../types/index.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: { users } });
  } catch (error) {
    next(error);
  }
});

router.get('/me/tasks', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getMyAssignedTasks(req.user!.id);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.get('/me/created', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getMyCreatedTasks(req.user!.id);
    res.json({ success: true, data: { tasks } });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: { message: 'User not found', code: 'NOT_FOUND' },
      });
      return;
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

export default router;
