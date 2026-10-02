import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("[connectDB] Warning: MONGO_URI is not set. Database queries will fail until configured.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("[connectDB error]: Failed to connect to MongoDB:", error.message);
    return false;
  }
};

export default connectDB;