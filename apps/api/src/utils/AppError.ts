/**
 * Standard operational error used across controllers/services.
 * The global error middleware (middleware/error.middleware.ts) knows
 * how to translate this into a clean HTTP response.
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static forbidden(message = 'You do not have access to this resource') {
    return new AppError(message, 403);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, 401);
  }

  static badRequest(message = 'Invalid request') {
    return new AppError(message, 400);
  }

  static conflict(message = 'Conflict with existing resource') {
    return new AppError(message, 409);
  }
}
