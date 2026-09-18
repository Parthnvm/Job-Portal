import express from "express";
import { login, logout, register, updateProfile, analyzeResume, getLatestResumeAnalysis, googleLogin, githubCallback, getCurrentUser, unlinkSocialAccount } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated,updateProfile);
router.route("/profile/unlink").post(isAuthenticated, unlinkSocialAccount);
router.route("/analyze-resume").post(isAuthenticated, singleUpload, analyzeResume);
router.route("/resume-analysis/latest").get(isAuthenticated, getLatestResumeAnalysis);
router.route("/auth/google").post(googleLogin);
router.route("/auth/github/callback").get(githubCallback);

export default router;
