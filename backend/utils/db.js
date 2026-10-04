import mongoose from "mongoose";

/**
 * Connects to MongoDB with sensible pool and timeout settings.
 *
 * Connection settings:
 *   maxPoolSize:              10  — max concurrent connections (suitable for single-instance apps)
 *   minPoolSize:               2  — keep warm connections to avoid cold-start latency
 *   serverSelectionTimeoutMS: 5000  — fail fast if the server is unreachable at startup
 *   socketTimeoutMS:         45000  — drop idle sockets after 45 s (prevents stale connection hangs)
 *   connectTimeoutMS:        10000  — abort connection attempts after 10 s
 *   heartbeatFrequencyMS:    10000  — periodic health check interval
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("[connectDB] Warning: MONGO_URI is not set. Database queries will fail until configured.");
    return false;
  }
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
    });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("[connectDB error]: Failed to connect to MongoDB:", error.message);
    return false;
  }
};

export default connectDB;