import { Request, Response, NextFunction, Router } from 'express';
import { authService } from '../services/authService.js';
import { registerDto, loginDto } from '../dtos/authDto.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { AuthenticatedRequest } from '../types/index.js';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = registerDto.parse(req.body);
    const user = await authService.register(validated.email, validated.name, validated.password);
    res.status(201).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = loginDto.parse(req.body);
    const { user, token } = await authService.login(validated.email, validated.password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user!.id);
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export default router;
