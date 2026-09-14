import mongoose from "mongoose";
import dotenv from "dotenv";
import { Job } from "./models/job.model.js";
import { convertUSDToINR, USD_TO_INR } from "./utils/currency.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for salary migration.");
    console.log(`Using USD to INR conversion rate: 1 USD = ₹${USD_TO_INR}`);

    // Identify legacy USD records where salary < 500,000 (all seed jobs were in USD 80k-220k)
    // Any modern Indian annual salary or recruiter posted salary is >= 500,000
    const legacyJobs = await Job.find({ salary: { $lt: 500000 } });
    console.log(`Found ${legacyJobs.length} legacy job records with USD salaries to convert.`);

    if (legacyJobs.length === 0) {
      console.log("All job records in database are already in INR. No migration needed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    let updatedCount = 0;
    for (const job of legacyJobs) {
      const oldSalary = job.salary;
      const inrSalary = convertUSDToINR(oldSalary);
      await Job.updateOne({ _id: job._id }, { $set: { salary: inrSalary } });
      console.log(`Updated [${job.title}]: $${oldSalary.toLocaleString()} -> ₹${inrSalary.toLocaleString('en-IN')}`);
      updatedCount++;
    }

    console.log(`\nSuccessfully converted ${updatedCount} jobs to INR!`);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Salary migration failed:", err);
    process.exit(1);
  }
}

migrate();
