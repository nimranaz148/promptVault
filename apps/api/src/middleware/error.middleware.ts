import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/** 404 handler — placed after all routes in app.ts. */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

/** Central error handler — the only place that formats an error response. */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'Internal server error';

  if (!isAppError) {
    // Unexpected errors are logged in full server-side (PRD Section 10, Observability)
    // but never leak stack traces to the client in production.
    console.error('[Unhandled Error]', err);
  }

  res.status(statusCode).json({
    error: message,
    ...(env.nodeEnv === 'development' && !isAppError ? { stack: err.stack } : {}),
  });
}
