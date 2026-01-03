import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      // 1. Check if it's actually a Zod error
      if (error instanceof ZodError) {
        // 2. Use .issues (Zod's correct property name)
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
        return; // Ensure we exit
      }

      // 3. Fallback for non-Zod errors
      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};
