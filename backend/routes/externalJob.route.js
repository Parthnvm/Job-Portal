import express from "express";
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

// Sync trigger — no auth for MVP (internal/dev use only)
router.post("/sync", triggerSync);

export default router;
