import mongoose from "mongoose";

/**
 * SavedJob model — persists a user's bookmarked jobs.
 *
 * Supports both internal jobs (internalJobId) and external jobs (externalJobId).
 * Exactly one of the two must be set per document (enforced by application logic).
 */
const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // For internal platform jobs
    internalJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    // For external provider jobs (stored by ExternalJob._id)
    externalJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExternalJob",
      default: null,
    },
    // Snapshot of key fields at save time (so saved jobs remain useful even after expiry)
    jobSnapshot: {
      title: { type: String, default: "" },
      companyName: { type: String, default: "" },
      location: { type: String, default: "" },
      jobType: { type: String, default: "" },
      isExternal: { type: Boolean, default: false },
      provider: { type: String, default: "internal" },
      externalUrl: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Compound unique index: one user cannot save the same job twice
savedJobSchema.index({ user: 1, internalJobId: 1 }, { unique: true, sparse: true });
savedJobSchema.index({ user: 1, externalJobId: 1 }, { unique: true, sparse: true });
savedJobSchema.index({ user: 1, createdAt: -1 });

export const SavedJob = mongoose.model("SavedJob", savedJobSchema);
