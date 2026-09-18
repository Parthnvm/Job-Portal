import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resumeHash: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    modelUsed: {
      type: String,
      default: "openai/gpt-oss-120b",
    },
    usage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    },
    // Retain analysis for 30 days by default (automatic TTL cleanup)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// Compound index for instant cache lookup by user + hash
resumeAnalysisSchema.index({ userId: 1, resumeHash: 1 });

// TTL index for automatic expiry
resumeAnalysisSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
