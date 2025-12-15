import { Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { AuthenticatedRequest } from '../types/index.js';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' },
      });
      return;
    }

    const user = authService.validateToken(token);
    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token', code: 'UNAUTHORIZED' },
    });
  }
};
