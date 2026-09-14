import dotenv from "dotenv";
import mongoose from "mongoose";

// Load backend env
dotenv.config();

import { AdzunaJobProvider } from "./providers/AdzunaJobProvider.js";
import { JoobleJobProvider } from "./providers/JoobleJobProvider.js";
import { JobProviderManager } from "./services/jobProviderManager.js";
import { RateLimiter } from "./services/rateLimiter.js";
import { deduplicateJobs } from "./services/jobDeduplicator.js";
import { ExternalJob } from "./models/externalJob.model.js";
import express from "express";
import cookieParser from "cookie-parser";
import jobRoute from "./routes/job.route.js";
import { Company } from "./models/company.model.js";
import {
  USD_TO_INR,
  convertUSDToINR,
  formatINR,
  formatSalaryRangeINR,
  parseAndConvertSalaryString
} from "./utils/currency.js";

const results = [];
function record(testName, passed, details = "") {
  results.push({ testName, passed, details });
  console.log(`[${passed ? "PASS" : "FAIL"}] ${testName}${details ? " - " + details : ""}`);
}

async function runTests() {
  console.log("==================================================");
  console.log("STARTING JOB PORTAL PROVIDER & FLOW TEST SUITE");
  console.log("==================================================");

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    record("Database connection", true, "Connected to MongoDB");
  } catch (err) {
    record("Database connection", false, err.message);
    process.exit(1);
  }

  // ─── TEST 1: Adzuna Live Verification ─────────────────────────────────────────
  console.log("\n--- TEST 1: Adzuna Live Verification ---");
  const adzuna = new AdzunaJobProvider();
  record("Adzuna isConfigured()", adzuna.isConfigured() === true, "Credentials loaded from backend/.env");

  // Live test: software developer — Pune
  console.log("\nTesting Adzuna Live Search: software developer — Pune...");
  let puneJobs = [];
  try {
    puneJobs = await adzuna.searchJobs({ keyword: "software developer", location: "Pune", page: 1, pageSize: 5 });
    const hasJobs = puneJobs.length > 0;
    record("Adzuna live search: software developer — Pune", hasJobs, `Received ${puneJobs.length} real jobs`);
    if (hasJobs) {
      const sample = puneJobs[0];
      const validStructure = Boolean(sample.externalId && sample.title && sample.companyName && sample.apply_url);
      record("Adzuna normalization structure", validStructure, `Sample title: "${sample.title}" at "${sample.companyName}"`);
      record("Adzuna skills extraction", Array.isArray(sample.skills), `Extracted skills: ${JSON.stringify(sample.skills)}`);
    }
  } catch (e) {
    record("Adzuna live search: software developer — Pune", false, e.message);
  }

  // Live test: python developer — Mumbai
  console.log("\nTesting Adzuna Live Search: python developer — Mumbai...");
  let mumbaiJobs = [];
  try {
    mumbaiJobs = await adzuna.searchJobs({ keyword: "python developer", location: "Mumbai", page: 1, pageSize: 5 });
    const hasJobs = mumbaiJobs.length > 0;
    record("Adzuna live search: python developer — Mumbai", hasJobs, `Received ${mumbaiJobs.length} real jobs`);
    if (hasJobs) {
      const sample = mumbaiJobs[0];
      record("Adzuna Mumbai job fields", Boolean(sample.location && sample.apply_url), `Location: ${sample.location}`);
    }
  } catch (e) {
    record("Adzuna live search: python developer — Mumbai", false, e.message);
  }

  // ─── TEST 2: Jooble Provider Tests (Live & Fallback) ──────────────────────────
  console.log("\n--- TEST 2: Jooble Provider Tests ---");
  const jooble = new JoobleJobProvider();
  const hasJoobleKey = Boolean(process.env.JOOBLE_API_KEY?.trim());
  record("Jooble isConfigured() matches env", jooble.isConfigured() === hasJoobleKey, `Configured: ${jooble.isConfigured()}`);

  // Test unconfigured behavior with synthetic unconfigured instance
  const unconfiguredJooble = new JoobleJobProvider();
  unconfiguredJooble._apiKey = "";
  const unconfiguredJobs = await unconfiguredJooble.searchJobs({ keyword: "developer", location: "Pune" });
  record("Jooble safe fallback when unconfigured", Array.isArray(unconfiguredJobs) && unconfiguredJobs.length === 0, "Returns empty array without throwing");

  // Test live Jooble query with the real key
  if (hasJoobleKey) {
    console.log("\nTesting Jooble Live Search: software developer — Pune...");
    try {
      const joobleLiveJobs = await jooble.searchJobs({ keyword: "software developer", location: "Pune", page: 1, pageSize: 5 });
      const hasLiveJooble = joobleLiveJobs.length > 0;
      record("Jooble live search: software developer — Pune", hasLiveJooble, `Received ${joobleLiveJobs.length} real jobs from Jooble India`);
      if (hasLiveJooble) {
        const sample = joobleLiveJobs[0];
        record("Jooble live job normalization", Boolean(sample.externalId && sample.title && sample.apply_url), `Title: "${sample.title}", Company: "${sample.companyName}"`);
      }
    } catch (e) {
      record("Jooble live search: software developer — Pune", false, e.message);
    }
  }

  // Test Jooble raw normalization with official documentation payload
  const mockJoobleRaw = {
    id: 987654321,
    title: "Senior Python Developer",
    location: "Mumbai, Maharashtra",
    snippet: "We are seeking a Python Developer with experience in Django, FastAPI, PostgreSQL, and AWS.",
    salary: "₹12,00,000 - ₹18,00,000",
    source: "jooble",
    type: "Full-time",
    link: "https://in.jooble.org/jdp/987654321",
    company: "TechNova Infotech Pvt Ltd",
    updated: "2026-09-10T10:30:00.000Z"
  };

  const normalizedJooble = jooble.normalizeJob(mockJoobleRaw);
  record("Jooble normalization: externalId", normalizedJooble.externalId === "987654321", `ID: ${normalizedJooble.externalId}`);
  record("Jooble normalization: provider", normalizedJooble.provider === "jooble", `Provider: ${normalizedJooble.provider}`);
  record("Jooble normalization: apply_url", normalizedJooble.apply_url === "https://in.jooble.org/jdp/987654321", `URL: ${normalizedJooble.apply_url}`);
  record("Jooble normalization: salary", normalizedJooble.salaryMin === 1200000 && normalizedJooble.salaryMax === 1800000, `Min: ${normalizedJooble.salaryMin}, Max: ${normalizedJooble.salaryMax}`);
  record("Jooble normalization: skills", normalizedJooble.skills.includes("Python") && normalizedJooble.skills.includes("Django"), `Skills: ${JSON.stringify(normalizedJooble.skills)}`);

  // Test Jooble with USD salary payload
  const mockJoobleUSD = {
    id: 987654322,
    title: "US Remote Engineer",
    location: "Remote",
    snippet: "Engineer role",
    salary: "$50,000 - $80,000",
    link: "https://jooble.org/jdp/987654322",
    company: "Global Corp"
  };
  const normalizedJoobleUSD = jooble.normalizeJob(mockJoobleUSD);
  record("Jooble normalization USD conversion",
    normalizedJoobleUSD.salaryMin === 4150000 &&
    normalizedJoobleUSD.salaryMax === 6640000 &&
    normalizedJoobleUSD.salaryCurrency === "INR",
    `Min: ${normalizedJoobleUSD.salaryMin}, Max: ${normalizedJoobleUSD.salaryMax}, Display: "${normalizedJoobleUSD.salaryDisplay}"`
  );

  // ─── TEST 3: Deduplication Service ───────────────────────────────────────────
  console.log("\n--- TEST 3: Deduplication Service ---");
  const dup1 = {
    provider: "adzuna",
    externalId: "1001",
    title: "React Developer",
    companyName: "Infosys Ltd",
    location: "Pune",
    externalUrl: "https://www.adzuna.in/details/1001?utm_source=adzuna&utm_medium=api"
  };
  const dup1Duplicate = {
    provider: "adzuna",
    externalId: "1001",
    title: "React Developer",
    companyName: "Infosys Ltd",
    location: "Pune",
    externalUrl: "https://www.adzuna.in/details/1001?utm_source=adzuna&utm_medium=api"
  };
  const dupCrossProvider = {
    provider: "jooble",
    externalId: "9999",
    title: "React Developer",
    companyName: "Infosys Private Limited",
    location: "Pune",
    externalUrl: "https://in.jooble.org/jdp/9999"
  };
  const distinctJob = {
    provider: "adzuna",
    externalId: "1002",
    title: "React Developer",
    companyName: "TCS",
    location: "Pune",
    externalUrl: "https://www.adzuna.in/details/1002"
  };

  const deduplicated = deduplicateJobs([dup1, dup1Duplicate, dupCrossProvider, distinctJob]);
  record("Deduplication: Provider duplicate filtered", !deduplicated.includes(dup1Duplicate), "Same (provider, externalId) removed");
  record("Deduplication: Cross-provider duplicate filtered", deduplicated.length === 2, `Expected 2 unique jobs, got ${deduplicated.length}`);
  record("Deduplication: Distinct job preserved", deduplicated.some(j => j.companyName === "TCS"), "TCS job retained");

  // ─── TEST 4: Rate Limiting & Quota Tracker ───────────────────────────────────
  console.log("\n--- TEST 4: Rate Limiting ---");
  RateLimiter._resetMinuteBucket("adzuna");
  const initialBudget = await RateLimiter.checkLimit("adzuna");
  record("RateLimiter checkLimit initial", initialBudget.allowed === true, `Usage: ${JSON.stringify(initialBudget.currentUsage)}`);

  // Simulate 25 requests in the minute bucket
  for (let i = 0; i < 25; i++) {
    await RateLimiter.recordHit("adzuna");
  }
  const blockedBudget = await RateLimiter.checkLimit("adzuna");
  record("RateLimiter blocks at 25 hits/min limit", blockedBudget.allowed === false, `Blocked: "${blockedBudget.reason}"`);
  RateLimiter._resetMinuteBucket("adzuna"); // Reset for subsequent tests

  // ─── TEST 5: JobProviderManager Query-Through Cache & Provider Isolation ─────
  console.log("\n--- TEST 5: JobProviderManager Caching & Isolation ---");
  const manager = new JobProviderManager();

  // Fresh search via Manager: python developer — Mumbai
  console.log("Performing search via JobProviderManager (force=true)...");
  const searchRes1 = await manager.searchJobs({
    query: "python developer",
    location: "Mumbai",
    page: 1,
    limit: 5,
    force: true
  });
  record("JobProviderManager live search", searchRes1.jobs.length > 0, `Returned ${searchRes1.jobs.length} jobs, fromCache=${searchRes1.fromCache}`);

  // Second search: same query WITHOUT force -> MUST hit cache
  console.log("Performing identical second search to verify cache hit...");
  const searchRes2 = await manager.searchJobs({
    query: "python developer",
    location: "Mumbai",
    page: 1,
    limit: 5,
    force: false
  });
  record("JobProviderManager cache hit", searchRes2.fromCache === true, `Returned ${searchRes2.jobs.length} cached jobs without API hit`);

  // Provider isolation: test searching with source=jooble
  const joobleSearch = await manager.searchJobs({
    query: "developer",
    location: "Pune",
    source: "jooble"
  });
  record("Provider isolation: Jooble search", Array.isArray(joobleSearch.jobs), `Returned ${joobleSearch.jobs.length} jobs`);

  // ─── TEST 6: MongoDB Persistence & Dual Snake/Camel Format ───────────────────
  console.log("\n--- TEST 6: Database Persistence & Dual Format Support ---");
  const dbSample = await ExternalJob.findOne({ externalId: { $exists: true } }).sort({ importedAt: -1 });
  if (dbSample) {
    const json = dbSample.toJSON();
    const hasCamel = json.externalId !== undefined && json.jobType !== undefined;
    const hasSnake = json.external_id === json.externalId && json.company === json.companyName && json.source === json.provider;
    record("Mongoose dual format: camelCase", hasCamel, `externalId=${json.externalId}`);
    record("Mongoose dual format: snake_case aliases", hasSnake, `external_id=${json.external_id}, source=${json.source}`);
    record("Mongoose skills array stored in DB", Array.isArray(json.skills), `Skills count: ${json.skills.length}`);
  } else {
    record("Database sample job check", false, "No job found in DB");
  }

  // ─── TEST 7: Dashboard Public & External Job Endpoints ──────────────────────
  console.log("\n--- TEST 7: Dashboard Public & External Job Endpoints ---");
  try {
    const testApp = express();
    testApp.use(express.json());
    testApp.use(cookieParser());
    testApp.use("/api/v1/job", jobRoute);

    const testServer = await new Promise((resolve) => {
      const s = testApp.listen(8097, () => resolve(s));
    });

    try {
      // 1. Unauthenticated public access to /api/v1/job/get
      const resGet = await fetch("http://localhost:8097/api/v1/job/get");
      const dataGet = await resGet.json();
      record("Dashboard: Public access to /job/get without 401", resGet.status === 200 && dataGet.success === true, `Status: ${resGet.status}, Jobs count: ${dataGet.jobs?.length}`);

      // 2. Both internal and external jobs included
      const hasInternal = dataGet.jobs && dataGet.jobs.some(j => !j.isExternal);
      const hasExternal = dataGet.jobs && dataGet.jobs.some(j => j.isExternal);
      record("Dashboard: /job/get includes internal jobs", Boolean(hasInternal), "Found internal jobs");
      record("Dashboard: /job/get includes external jobs", Boolean(hasExternal), "Found external jobs from Adzuna / Jooble");

      // 3. Single job lookup for external job via /job/get/:id
      const extSampleJob = dataGet.jobs.find(j => j.isExternal);
      if (extSampleJob) {
        const resSingle = await fetch(`http://localhost:8097/api/v1/job/get/${extSampleJob._id}`);
        const dataSingle = await resSingle.json();
        record("Dashboard: /job/get/:id supports external jobs", resSingle.status === 200 && dataSingle.success === true, `Title: "${dataSingle.job?.title}"`);
      }
    } finally {
      if (testServer.closeAllConnections) testServer.closeAllConnections();
      await new Promise((resolve) => testServer.close(resolve));
    }
  } catch (err) {
    record("Dashboard endpoints test", false, err.message);
  }

  // ─── TEST 6: Currency & Salary System (USD to INR & Indian Formatting) ───────
  console.log("\n--- TEST 6: Currency & Salary System (USD -> INR) ---");
  record("Centralized rate verification", USD_TO_INR === 83, `Rate: 1 USD = ₹${USD_TO_INR}`);

  // Test USD -> INR conversion
  record("USD to INR: 50,000 -> 41,50,000", convertUSDToINR(50000) === 4150000, `Result: ${convertUSDToINR(50000)}`);
  record("USD to INR: 60,000 -> 49,80,000", convertUSDToINR(60000) === 4980000, `Result: ${convertUSDToINR(60000)}`);
  record("USD to INR: 100,000 -> 83,00,000", convertUSDToINR(100000) === 8300000, `Result: ${convertUSDToINR(100000)}`);
  record("USD to INR string: '140k' -> 1,16,20,000", convertUSDToINR("140k") === 11620000, `Result: ${convertUSDToINR("140k")}`);
  record("USD to INR string: '$180k' -> 1,49,40,000", convertUSDToINR("$180k") === 14940000, `Result: ${convertUSDToINR("$180k")}`);

  // Test Indian number formatting
  record("Indian format: 1,00,000", formatINR(100000) === "₹1,00,000", `Formatted: "${formatINR(100000)}"`);
  record("Indian format: 5,50,000", formatINR(550000) === "₹5,50,000", `Formatted: "${formatINR(550000)}"`);
  record("Indian format: 12,50,000", formatINR(1250000) === "₹12,50,000", `Formatted: "${formatINR(1250000)}"`);
  record("Indian format: 25,00,000", formatINR(2500000) === "₹25,00,000", `Formatted: "${formatINR(2500000)}"`);
  record("Indian format: 1,25,00,000", formatINR(12500000) === "₹1,25,00,000", `Formatted: "${formatINR(12500000)}"`);

  // Test salary range formatting & conversion
  const usdRangeFmt = formatSalaryRangeINR(40000, 60000, "USD");
  record("Range USD conversion: $40,000 - $60,000 -> ₹33,20,000 - ₹49,80,000 / yr",
    usdRangeFmt === "₹33,20,000 - ₹49,80,000 / yr",
    `Formatted: "${usdRangeFmt}"`
  );

  const inrRangeFmt = formatSalaryRangeINR(1200000, 1800000, "INR");
  record("Range INR preservation (no double conversion): ₹12,00,000 - ₹18,00,000 / yr",
    inrRangeFmt === "₹12,00,000 - ₹18,00,000 / yr",
    `Formatted: "${inrRangeFmt}"`
  );

  // Test edge cases: missing min, missing max, null, undefined, zero, decimal
  record("Range with min only", formatSalaryRangeINR(1000000, null, "INR") === "From ₹10,00,000 / yr");
  record("Range with max only", formatSalaryRangeINR(null, 2000000, "INR") === "Up to ₹20,00,000 / yr");
  record("Range with nulls", formatSalaryRangeINR(null, null, "INR", "Competitive") === "Competitive");
  record("Null amount conversion", convertUSDToINR(null) === null);
  record("Undefined amount conversion", convertUSDToINR(undefined) === null);
  record("Zero conversion", convertUSDToINR(0) === 0);
  record("Decimal rounding: 1234.56 * 83 -> 102468", convertUSDToINR(1234.56) === 102468);

  // Test string parsing with prevention of double conversion
  const parsedUsdStr = parseAndConvertSalaryString("$140k – $180k");
  record("String parse USD: $140k – $180k -> ₹1,16,20,000 - ₹1,49,40,000",
    parsedUsdStr.includes("₹1,16,20,000") && parsedUsdStr.includes("₹1,49,40,000"),
    `Result: "${parsedUsdStr}"`
  );

  const parsedInrStr = parseAndConvertSalaryString("₹8,00,000 - ₹14,00,000 / yr");
  record("String parse INR preservation: ₹8,00,000 - ₹14,00,000 / yr untouched",
    parsedInrStr === "₹8,00,000 - ₹14,00,000 / yr",
    `Result: "${parsedInrStr}"`
  );
  console.log("\n==================================================");
  console.log("TEST SUMMARY");
  console.log("==================================================");
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL: ${total} | PASSED: ${passed} | FAILED: ${failed}`);

  await mongoose.disconnect();
  setTimeout(() => process.exit(failed > 0 ? 1 : 0), 100);
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
