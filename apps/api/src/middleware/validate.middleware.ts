import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Generic request-validation middleware — every route that accepts a body
 * or query params should validate through here BEFORE the controller runs.
 * This is what "Controllers: Parse/validate the request (via Zod)" in
 * PRD Section 3.3 refers to, kept generic so controllers stay thin.
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body ?? req.body;
      req.query = parsed.query ?? req.query;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        return next(AppError.badRequest(message));
      }
      next(err);
    }
  };
}
