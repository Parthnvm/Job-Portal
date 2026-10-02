import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRole from "../middlewares/authorizeRole.js";
import {
  searchExternalJobs,
  getExternalJobById,
  triggerSync,
} from "../controllers/externalJob.controller.js";

const router = express.Router();

// Public routes — external jobs are visible without login
// (mirrors how the existing /api/v1/job/get works for applicants)
router.get("/", searchExternalJobs);
router.get("/search", searchExternalJobs);
router.get("/:id", getExternalJobById);

// Sync trigger — restricted to authenticated recruiters and admins
router.post("/sync", isAuthenticated, authorizeRole("recruiter", "admin"), triggerSync);

export default router;

