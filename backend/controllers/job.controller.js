import { Job } from "../models/job.model.js";
import { ExternalJob } from "../models/externalJob.model.js";
import { Company } from "../models/company.model.js";
import { convertUSDToINR, formatSalaryRangeINR, formatSalaryDisplay } from "../utils/currency.js";

// for admin/recruiter
export const postJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      logo,
    } = req.body;
    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      salary === undefined ||
      !location ||
      !jobType ||
      experience === undefined ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Missing required job fields.",
        success: false,
      });
    }

    const numericSalary = Number(salary);
    if (isNaN(numericSalary) || numericSalary < 0) {
      return res.status(400).json({
        message: "Salary must be a valid positive number.",
        success: false,
      });
    }

    // Safely parse requirements
    let parsedRequirements = [];
    if (Array.isArray(requirements)) {
      parsedRequirements = requirements.map((r) => String(r).trim()).filter(Boolean);
    } else if (typeof requirements === "string") {
      parsedRequirements = requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirements: parsedRequirements,
      salary: numericSalary,
      location: location.trim(),
      jobType: jobType.trim(),
      experiencelevel: Number(experience) || 0,
      position: Number(position) || 1,
      company: companyId,
      created_by: userId,
      logo: logo || undefined,
    });

    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.error("[postJob error]:", error);
    return next ? next(error) : res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// for appliers / public
export const getAllJob = async (req, res, next) => {
  try {
    const keyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const [totalInternal, internalJobs] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .populate({ path: "company" })
        .sort({ createdAt: -1 })
        .limit(limit),
    ]);

    const processedInternalJobs = (internalJobs || []).map((j) => {
      const jobObj = j.toObject ? j.toObject() : { ...j };
      jobObj.salaryDisplay = formatSalaryDisplay(jobObj.salary);
      return jobObj;
    });

    // Also fetch external jobs from DB
    let formattedExtJobs = [];
    try {
      const extQuery = keyword
        ? {
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { description: { $regex: keyword, $options: "i" } },
              { skills: { $regex: keyword, $options: "i" } },
              { companyName: { $regex: keyword, $options: "i" } },
            ],
          }
        : {};
      const extDocs = await ExternalJob.find(extQuery)
        .sort({ postedAt: -1 })
        .limit(Math.max(10, limit));

      formattedExtJobs = extDocs.map((j) => {
        const idStr = String(j._id);
        const sal = formatSalaryRangeINR(
          j.salaryMin,
          j.salaryMax,
          j.salaryCurrency || "INR",
          j.salaryDisplay || j.salaryRaw || "Competitive"
        );

        return {
          _id: idStr,
          id: idStr,
          title: j.title,
          description: j.description || "",
          requirements: j.skills || [],
          salary: sal,
          salaryDisplay: sal,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          salaryCurrency: j.salaryCurrency || "INR",
          location: j.location || "Remote",
          jobType: j.jobType || "Full-time",
          experiencelevel: j.experienceLevel || 0,
          position: 1,
          company: {
            _id: idStr,
            name: j.companyName || "Company",
            location: j.location || "Remote",
            logo: j.logo || null,
          },
          created_by: null,
          isExternal: true,
          provider: j.provider || "external",
          externalUrl: j.externalUrl || j.apply_url || "",
          apply_url: j.externalUrl || j.apply_url || "",
          createdAt: j.postedAt || j.importedAt || new Date(),
        };
      });
    } catch (extErr) {
      console.error("[job.controller] Error fetching external jobs for getAllJob:", extErr);
    }

    const allJobs = [...processedInternalJobs, ...formattedExtJobs];

    return res.status(200).json({
      jobs: allJobs,
      success: true,
      count: allJobs.length,
      pagination: {
        total: totalInternal + formattedExtJobs.length,
        page,
        limit,
        totalPages: Math.ceil((totalInternal + formattedExtJobs.length) / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[getAllJob error]:", error);
    return next ? next(error) : res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// for appliers / public
export const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    let job = await Job.findById(jobId).populate({ path: "company" }).catch(() => null);

    if (job) {
      const jobObj = job.toObject ? job.toObject() : { ...job };
      jobObj.salaryDisplay = formatSalaryDisplay(jobObj.salary);
      job = jobObj;
    } else {
      const ext = await ExternalJob.findById(jobId).catch(() => null);
      if (ext) {
        const sal = formatSalaryRangeINR(
          ext.salaryMin,
          ext.salaryMax,
          ext.salaryCurrency || "INR",
          ext.salaryDisplay || ext.salaryRaw || "Competitive"
        );

        job = {
          _id: String(ext._id),
          id: String(ext._id),
          title: ext.title,
          description: ext.description || "",
          requirements: ext.skills || [],
          salary: sal,
          salaryDisplay: sal,
          salaryMin: ext.salaryMin,
          salaryMax: ext.salaryMax,
          salaryCurrency: ext.salaryCurrency || "INR",
          location: ext.location || "Remote",
          jobType: ext.jobType || "Full-time",
          experiencelevel: ext.experienceLevel || 0,
          position: 1,
          company: {
            _id: String(ext._id),
            name: ext.companyName || "Company",
            location: ext.location || "Remote",
            logo: ext.logo || null,
          },
          isExternal: true,
          provider: ext.provider || "external",
          externalUrl: ext.externalUrl || ext.apply_url || "",
          apply_url: ext.externalUrl || ext.apply_url || "",
          createdAt: ext.postedAt || ext.importedAt || new Date(),
        };
      }
    }

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("[getJobById error]:", error);
    return next ? next(error) : res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// how many jobs has admin/recruiter created till now
export const getAdminJobs = async (req, res, next) => {
  try {
    const adminId = req.id;
    const jobs = (await Job.find({ created_by: adminId }).populate({ path: "company" }).sort({ createdAt: -1 })) || [];
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error("[getAdminJobs error]:", error);
    return next ? next(error) : res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
