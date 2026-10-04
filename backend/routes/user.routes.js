import express from "express";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  updateProfile,
  analyzeResume,
  getLatestResumeAnalysis,
  googleLogin,
  githubInitiate,
  githubCallback,
  getCurrentUser,
  unlinkSocialAccount,
  uploadProfileResume,
  getProfileResume,
  deleteProfileResume,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRole from "../middlewares/authorizeRole.js";
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

// Password reset endpoints (Fix #27)
router.route("/forgot-password").post(authLimiter, forgotPassword);
router.route("/reset-password").post(authLimiter, resetPassword);

// Logout: supports POST (primary) and GET, does not block expired sessions
router.route("/logout").post(logout).get(logout);

router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated, updateProfile);
router.route("/profile/unlink").post(isAuthenticated, unlinkSocialAccount);

// Profile resume management (Job Seeker / Student role only)
router
  .route("/profile/resume")
  .post(isAuthenticated, authorizeRole("student"), resumeLimiter, singleUpload, uploadProfileResume)
  .get(isAuthenticated, authorizeRole("student"), getProfileResume)
  .delete(isAuthenticated, authorizeRole("student"), deleteProfileResume);

// Also support /resume alias for convenience
router
  .route("/resume")
  .get(isAuthenticated, authorizeRole("student"), getProfileResume);

router.route("/analyze-resume").post(isAuthenticated, resumeLimiter, singleUpload, analyzeResume);
router.route("/resume-analysis/latest").get(isAuthenticated, getLatestResumeAnalysis);

// Google OAuth
router.route("/auth/google").post(authLimiter, googleLogin);

// GitHub OAuth — initiate generates a server-side cryptographic state nonce
router.route("/auth/github").get(authLimiter, githubInitiate);
router.route("/auth/github/callback").get(githubCallback);

export default router;
