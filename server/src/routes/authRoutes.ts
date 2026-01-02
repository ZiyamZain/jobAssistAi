import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

const router = express.Router();

// Public routes with Zod validation
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Protected route
router.get("/profile", authenticateToken, getProfile);

export default router;
