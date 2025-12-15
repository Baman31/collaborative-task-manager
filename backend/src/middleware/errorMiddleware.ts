import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AuthError } from '../services/authService.js';
import { TaskError, ValidationError } from '../services/taskService.js';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.errors,
      },
    });
    return;
  }

  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR',
        details: error.details,
      },
    });
    return;
  }

  if (error instanceof AuthError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode === 401 ? 'UNAUTHORIZED' : 'AUTH_ERROR',
      },
    });
    return;
  }

  if (error instanceof TaskError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code:
          error.statusCode === 404
            ? 'NOT_FOUND'
            : error.statusCode === 403
              ? 'FORBIDDEN'
              : 'TASK_ERROR',
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
};
