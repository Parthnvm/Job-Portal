import { Job } from "../models/job.model.js";
import { ExternalJob } from "../models/externalJob.model.js";
import { Company } from "../models/company.model.js";

// for admin
export const postJob = async (req, res) => {
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
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experiencelevel: experience,
      position,
      company: companyId,
      created_by: userId,
      logo,
    });
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for appliers
export const getAllJob = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const internalJobs = (await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 })) || [];

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
        .limit(40);

      formattedExtJobs = extDocs.map((j) => {
        const idStr = String(j._id);
        const sal = j.salaryMax
          ? j.salaryMin
            ? `₹${Math.round(j.salaryMin / 1000)}k - ₹${Math.round(j.salaryMax / 1000)}k`
            : `Up to ₹${Math.round(j.salaryMax / 1000)}k`
          : j.salaryMin
          ? `From ₹${Math.round(j.salaryMin / 1000)}k`
          : j.salaryRaw || "Competitive";

        return {
          _id: idStr,
          id: idStr,
          title: j.title,
          description: j.description || "",
          requirements: j.skills || [],
          salary: sal,
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

    const allJobs = [...internalJobs, ...formattedExtJobs];

    return res.status(200).json({
      jobs: allJobs,
      success: true,
      count: allJobs.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// for appliers
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    let job = await Job.findById(jobId).populate({ path: "company" }).catch(() => null);

    if (!job) {
      const ext = await ExternalJob.findById(jobId).catch(() => null);
      if (ext) {
        const sal = ext.salaryMax
          ? ext.salaryMin
            ? `₹${Math.round(ext.salaryMin / 1000)}k - ₹${Math.round(ext.salaryMax / 1000)}k`
            : `Up to ₹${Math.round(ext.salaryMax / 1000)}k`
          : ext.salaryMin
          ? `From ₹${Math.round(ext.salaryMin / 1000)}k`
          : ext.salaryRaw || "Competitive";

        job = {
          _id: String(ext._id),
          id: String(ext._id),
          title: ext.title,
          description: ext.description || "",
          requirements: ext.skills || [],
          salary: sal,
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
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

//how many jobs has admin created till now
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
