import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

/**
 * Middleware to validate request data using Zod schemas
 */
export function validate(schema: z.ZodObject<z.ZodRawShape> | z.ZodType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({
          error: 'Validation failed',
          details: errors,
        });
      }
      return res.status(500).json({ error: 'Internal validation error' });
    }
  };
}
