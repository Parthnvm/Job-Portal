import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { isValidApplicationStatus } from "../utils/validator.js";

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

    // Role check: Only students/job seekers should apply for jobs
    if (req.user && req.user.role === "recruiter") {
      return res.status(403).json({
        message: "Recruiters cannot apply to job postings. Please switch to a student account.",
        success: false,
      });
    }

    // Check if the target job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job posting not found.",
        success: false,
      });
    }

    // Prevent creator from applying to their own job
    if (job.created_by && job.created_by.toString() === userId) {
      return res.status(400).json({
        message: "You cannot apply to a job posting you created.",
        success: false,
      });
    }

    // Check if the user has already applied for this job
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

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      applicationId: newApplication._id,
      success: true,
    });
  } catch (error) {
    console.error("[applyJob error]:", error);
    // Handle potential duplicate key race condition from unique index
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

// Recruiter checks applicants for a specific job they posted
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

    // IDOR protection: Verify the requesting user is the creator of this job (or an admin)
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

    // Find application and populate job to verify recruiter ownership
    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({
        message: "Application record not found.",
        success: false,
      });
    }

    // IDOR protection: Verify current recruiter owns the job associated with this application
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

    // Update status
    application.status = status.toLowerCase().trim();
    await application.save();

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

// Batch fetch all applicants across all jobs posted by the logged-in recruiter (solves N+1 problem)
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