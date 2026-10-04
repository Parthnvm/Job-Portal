import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { saveJob, unsaveJob, getSavedJobs, getSavedJobIds } from "../controllers/savedJob.controller.js";

const router = express.Router();

// All saved-job routes require authentication
router.post("/save", isAuthenticated, saveJob);
router.post("/unsave", isAuthenticated, unsaveJob);
router.get("/", isAuthenticated, getSavedJobs);
router.get("/ids", isAuthenticated, getSavedJobIds);

export default router;
