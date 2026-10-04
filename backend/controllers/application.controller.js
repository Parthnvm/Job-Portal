import crypto from "crypto";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { isValidApplicationStatus } from "../utils/validator.js";
import emailService from "../services/emailService.js";
import { extractSkills } from "../utils/skillExtractor.js";
import { streamResumeFile } from "../utils/resumeStorage.js";

export const applyJob = async (req, res, next) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID parameter is required.",
        success: false,
      });
    }

    // Recruiters cannot apply to jobs
    if (req.user && req.user.role === "recruiter") {
      return res.status(403).json({
        message: "Recruiters cannot apply to job postings. Please switch to a student account.",
        success: false,
      });
    }

    // Check target job exists
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({
        message: "Job posting not found.",
        success: false,
      });
    }

    // Block creator from applying to their own job
    if (job.created_by && job.created_by.toString() === userId) {
      return res.status(400).json({
        message: "You cannot apply to a job posting you created.",
        success: false,
      });
    }

    // Reject duplicate applications
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job posting.",
        success: false,
      });
    }

    // Applicant must have an uploaded resume (hard business rule)
    const applicant = await User.findById(userId);
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant user profile not found.",
        success: false,
      });
    }

    const resumeMeta = applicant.profile?.resumeMetadata;
    const hasResume = Boolean((resumeMeta && resumeMeta.fileId) || applicant.profile?.resume);
    if (!hasResume) {
      return res.status(400).json({
        message: "Resume required. Please upload a resume before applying.",
        success: false,
      });
    }

    // Snapshot the resume at application time (immutable)
    const resumeSnapshot = {
      fileId: resumeMeta?.fileId || crypto.randomUUID(),
      storageKey: resumeMeta?.storageKey || applicant.profile?.resume,
      originalName: resumeMeta?.originalName || applicant.profile?.resumeOriginalName || "resume.pdf",
      mimeType: resumeMeta?.mimeType || "application/pdf",
      size: resumeMeta?.size || 0,
      submittedAt: new Date(),
    };

    // Calculate ATS match score at submission time
    const jobText = `${job.title || ""} ${job.description || ""} ${(job.requirements || []).join(" ")}`;
    const jobSkills = extractSkills(jobText);
    const applicantSkills = applicant.profile?.skills || [];
    const matched = jobSkills.filter((js) =>
      applicantSkills.some((as) => as.toLowerCase() === js.toLowerCase())
    );
    const atsScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : null;

    // Persist new application with resume snapshot and ATS match
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      resume: resumeSnapshot,
      atsScore,
      matchedSkills: matched,
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Send confirmation email (fire-and-forget)
    const applicantEmail = req.user?.email || (await User.findById(userId).select("email").lean())?.email;
    if (applicantEmail) {
      const companyName = job.company?.name || "the hiring team";
      emailService.sendApplicationSubmittedEmail(applicantEmail, job.title, companyName).catch((err) => {
        console.warn("[applyJob] Confirmation email delivery failed:", err.message);
      });
    }

    return res.status(201).json({
      message: "Job applied successfully.",
      applicationId: newApplication._id,
      success: true,
    });
  } catch (error) {
    console.error("[applyJob error]:", error);
    // Handle duplicate key race condition from unique index
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this job posting.",
        success: false,
      });
    }
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.id;
    const application =
      (await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "job",
          populate: {
            path: "company",
          },
        })) || [];

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.error("[getAppliedJobs error]:", error);
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Recruiter: fetch all applicants for a specific owned job
export const getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // IDOR: only the job creator (or admin) may view applicants
    if (job.created_by.toString() !== req.id && req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to view applicants for this job.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("[getApplicants error]:", error);
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status || !isValidApplicationStatus(status)) {
      return res.status(400).json({
        message: "Valid status ('pending', 'accepted', 'rejected') is required.",
        success: false,
      });
    }

    // Populate job + applicant to verify recruiter ownership and send notification
    const application = await Application.findById(applicationId)
      .populate({ path: "job", populate: { path: "company" } })
      .populate({ path: "applicant", select: "email fullname" });

    if (!application) {
      return res.status(404).json({
        message: "Application record not found.",
        success: false,
      });
    }

    // IDOR: recruiter must own the job linked to this application
    if (
      application.job &&
      application.job.created_by.toString() !== req.id &&
      req.user?.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Forbidden: You do not own the job posting for this application.",
        success: false,
      });
    }


    application.status = status.toLowerCase().trim();
    await application.save();

    // Notify applicant of status change (fire-and-forget)
    if (application.applicant?.email) {
      const jobTitle = application.job?.title || "Position";
      const companyName = application.job?.company?.name || "the hiring company";
      emailService.sendApplicationStatusUpdateEmail(
        application.applicant.email,
        jobTitle,
        companyName,
        application.status
      ).catch((err) => {
        console.warn("[updateStatus] Notification email delivery failed:", err.message);
      });
    }

    return res.status(200).json({
      message: `Application status updated to '${application.status}'.`,
      application,
      success: true,
    });
  } catch (error) {
    console.error("[updateStatus error]:", error);
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Batch-fetch all applicants across all recruiter's jobs (avoids N+1)
export const getRecruiterAllApplicants = async (req, res, next) => {
  try {
    const recruiterId = req.id;
    const recruiterJobs = await Job.find({ created_by: recruiterId }).select("_id title");
    const jobIds = recruiterJobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate({ path: "job", select: "title location salary company" })
      .populate({ path: "applicant", select: "-password" });

    return res.status(200).json({
      success: true,
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error("[getRecruiterAllApplicants error]:", error);
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// getApplicationResume — applicant or owning recruiter only
export const getApplicationResume = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "Application ID parameter is required.",
      });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application record not found.",
      });
    }

    // IDOR: applicant or owning recruiter or admin only
    const isApplicant = application.applicant?.toString() === req.id;
    const isJobOwner = application.job?.created_by?.toString() === req.id;
    const isAdmin = req.user?.role === "admin";

    if (!isApplicant && !isJobOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resume.",
      });
    }

    const resumeSnapshot = application.resume;
    if (!resumeSnapshot || !resumeSnapshot.storageKey) {
      return res.status(404).json({
        success: false,
        message: "No submitted resume recorded for this application.",
      });
    }

    const download = req.query.download === "true" || req.query.download === "1";
    return streamResumeFile(res, {
      storageKey: resumeSnapshot.storageKey,
      originalName: resumeSnapshot.originalName,
      mimeType: resumeSnapshot.mimeType,
      download,
    });
  } catch (error) {
    console.error("[getApplicationResume error]:", error);
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Resume file not found on disk.",
      });
    }
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};