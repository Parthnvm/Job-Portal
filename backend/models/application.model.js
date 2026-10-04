import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // Durable resume snapshot captured at application time
    resume: {
      fileId: { type: String, required: true },
      storageKey: { type: String, required: true },
      originalName: { type: String, required: true },
      mimeType: { type: String, default: "application/pdf" },
      size: { type: Number, default: 0 },
      submittedAt: { type: Date, default: Date.now },
    },
    // ATS match snapshot calculated against this specific job at application time
    atsScore: {
      type: Number,
      default: null,
    },
    matchedSkills: [{ type: String }],
  },
  { timestamps: true }
);

// Prevent duplicate applications for the same job by the same user at DB level
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, createdAt: -1 });
applicationSchema.index({ job: 1, createdAt: -1 });
applicationSchema.index({ "resume.fileId": 1 });

export const Application = mongoose.model("Application", applicationSchema);