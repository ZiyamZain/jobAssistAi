import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const errors = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  };
};
