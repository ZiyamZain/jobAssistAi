import express from "express";
import {
  optimizeResume,
  generateCoverLetter,
} from "../controllers/aiController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  optimizeResumeSchema,
  generateCoverLetterSchema,
} from "../utils/validationSchemas.js";
import {upload } from '../utils/fileUtils.js';

const router = express.Router();

// Apply auth and validation
router.post(
  "/optimize",
  authenticateToken,
  upload.single('resumeFile'),
  validate(optimizeResumeSchema),
  optimizeResume
);

router.post(
  "/cover-letter",
  authenticateToken,
  validate(generateCoverLetterSchema),
  generateCoverLetter
);

export default router;
