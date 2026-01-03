import express from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../utils/validationSchemas.js";

const router = express.Router();

// Apply authentication to all routes in this file
router.use(authenticateToken);

/**
 * Route: /api/applications
 */
router
  .route("/")
  .get(getApplications)
  .post(validate(createApplicationSchema), createApplication);

/**
 * Route: /api/applications/:id
 */
router
  .route("/:id")
  .put(validate(updateApplicationSchema), updateApplication)
  .delete(deleteApplication);

export default router;
