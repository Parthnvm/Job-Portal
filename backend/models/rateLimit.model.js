import mongoose from "mongoose";

const rateLimitRecordSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      required: true,
      index: true,
    },
    // Period key format: provider:minute:YYYY-MM-DDTHH:mm or provider:day:YYYY-MM-DD or provider:month:YYYY-MM
    periodKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

rateLimitRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimitRecord = mongoose.model("RateLimitRecord", rateLimitRecordSchema);
