import express from "express";
import { login, logout, register, updateProfile, analyzeResume, getLatestResumeAnalysis, googleLogin, githubCallback, getCurrentUser, unlinkSocialAccount } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from "../middlewares/rateLimitMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again after one minute.",
});

const resumeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Resume analysis rate limit reached. Please wait before submitting another resume.",
});

router.route("/register").post(authLimiter, register);
router.route("/login").post(authLimiter, login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/profile/unlink").post(isAuthenticated, unlinkSocialAccount);
router.route("/analyze-resume").post(isAuthenticated, resumeLimiter, singleUpload, analyzeResume);
router.route("/resume-analysis/latest").get(isAuthenticated, getLatestResumeAnalysis);
router.route("/auth/google").post(authLimiter, googleLogin);
router.route("/auth/github/callback").get(githubCallback);

export default router;

