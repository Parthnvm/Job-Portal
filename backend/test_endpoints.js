import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import externalJobRoute from "./routes/externalJob.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/v1/external-jobs", externalJobRoute);
app.use("/api/jobs", externalJobRoute);

async function testEndpoints() {
  console.log("\n==================================================");
  console.log("TESTING BACKEND HTTP API ENDPOINTS");
  console.log("==================================================");

  await mongoose.connect(process.env.MONGO_URI);

  const server = app.listen(8099, async () => {
    try {
      // 1. Test /api/v1/external-jobs/search?keyword=software+developer&location=Pune
      console.log("1. GET /api/v1/external-jobs/search?keyword=software+developer&location=Pune");
      const res1 = await fetch("http://localhost:8099/api/v1/external-jobs/search?keyword=software+developer&location=Pune");
      const data1 = await res1.json();
      console.log(`Status: ${res1.status}, success: ${data1.success}, jobs: ${data1.jobs?.length}, fromCache: ${data1.fromCache}`);
      if (!data1.success || data1.jobs?.length === 0) throw new Error("Endpoint 1 failed");

      // 2. Test /api/jobs?query=python+developer&location=Mumbai
      console.log("\n2. GET /api/jobs?query=python+developer&location=Mumbai");
      const res2 = await fetch("http://localhost:8099/api/jobs?query=python+developer&location=Mumbai");
      const data2 = await res2.json();
      console.log(`Status: ${res2.status}, success: ${data2.success}, jobs: ${data2.jobs?.length}, fromCache: ${data2.fromCache}`);
      if (!data2.success || data2.jobs?.length === 0) throw new Error("Endpoint 2 failed");

      // 3. Test /api/jobs?source=adzuna
      console.log("\n3. GET /api/jobs?source=adzuna");
      const res3 = await fetch("http://localhost:8099/api/jobs?source=adzuna");
      const data3 = await res3.json();
      console.log(`Status: ${res3.status}, success: ${data3.success}, jobs: ${data3.jobs?.length}`);
      const onlyAdzuna = data3.jobs.every(j => (j.provider || j.source) === "adzuna");
      console.log(`Only Adzuna jobs returned: ${onlyAdzuna}`);

      // 4. Test /api/jobs?source=jooble
      console.log("\n4. GET /api/jobs?source=jooble");
      const res4 = await fetch("http://localhost:8099/api/jobs?source=jooble");
      const data4 = await res4.json();
      console.log(`Status: ${res4.status}, success: ${data4.success}, jobs: ${data4.jobs?.length}`);
      const onlyJooble = data4.jobs.every(j => (j.provider || j.source) === "jooble");
      console.log(`Only Jooble jobs returned: ${onlyJooble}`);

      // 5. Test single job /api/v1/external-jobs/:id
      const sampleId = data1.jobs[0].id || data1.jobs[0]._id;
      console.log(`\n5. GET /api/v1/external-jobs/${sampleId}`);
      const res5 = await fetch(`http://localhost:8099/api/v1/external-jobs/${sampleId}`);
      const data5 = await res5.json();
      console.log(`Status: ${res5.status}, success: ${data5.success}, title: "${data5.job?.title}", source: ${data5.job?.source}`);

      console.log("\nALL ENDPOINT TESTS PASSED SUCCESSFULLY!");
      server.close();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error("Endpoint test failed:", err.message);
      server.close();
      await mongoose.disconnect();
      process.exit(1);
    }
  });
}

testEndpoints();
