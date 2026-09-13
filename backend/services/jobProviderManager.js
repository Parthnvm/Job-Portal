import { AdzunaJobProvider } from "../providers/AdzunaJobProvider.js";
import { JoobleJobProvider } from "../providers/JoobleJobProvider.js";
import { ExternalJob } from "../models/externalJob.model.js";
import { SearchCache } from "../models/searchCache.model.js";
import { RateLimiter } from "./rateLimiter.js";
import { deduplicateJobs } from "./jobDeduplicator.js";

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export class JobProviderManager {
  constructor() {
    this._providers = new Map();
    this._registerDefaultProviders();
  }

  _registerDefaultProviders() {
    this.registerProvider(new AdzunaJobProvider());
    this.registerProvider(new JoobleJobProvider());
  }

  /**
   * Registers a provider instance.
   * @param {import('../providers/ExternalJobProvider.js').JobProvider} provider
   */
  registerProvider(provider) {
    this._providers.set(provider.providerName.toLowerCase(), provider);
  }

  getProvider(name) {
    return this._providers.get((name || "").toLowerCase());
  }

  getAllProviders() {
    return Array.from(this._providers.values());
  }

  /**
   * Generates a deterministic cache key for a search query.
   */
  static getCacheKey({ query = "", location = "", source = "all", page = 1 }) {
    const q = (query || "").trim().toLowerCase();
    const loc = (location || "").trim().toLowerCase();
    const src = (source || "all").trim().toLowerCase();
    return `${src}:${loc}:${q}:${page}`;
  }

  /**
   * Searches jobs with query-through caching, rate-limit awareness, and provider isolation.
   *
   * @param {Object} params
   * @param {string} [params.query]     - Search query / keywords (e.g. "software developer")
   * @param {string} [params.location]  - Location (e.g. "Pune", "Mumbai")
   * @param {string} [params.source]    - "adzuna" | "jooble" | "all"
   * @param {number} [params.page=1]    - 1-based page number
   * @param {number} [params.limit=20]  - Results per page
   * @param {boolean} [params.force]    - Bypass cache
   * @returns {Promise<{ jobs: any[], total: number, page: number, limit: number, fromCache: boolean, providersStatus: any }>}
   */
  async searchJobs({ query = "", location = "", source = "all", page = 1, limit = 20, force = false } = {}) {
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
    const normalizedSource = (source || "all").toLowerCase().trim();
    const cacheKey = JobProviderManager.getCacheKey({ query, location, source: normalizedSource, page: pageNum });

    // 1. Check SearchCache if not forcing refresh
    if (!force) {
      try {
        const cachedEntry = await SearchCache.findOne({ cacheKey, expiresAt: { $gt: new Date() } }).lean();
        if (cachedEntry && Array.isArray(cachedEntry.jobIds) && cachedEntry.jobIds.length > 0) {
          const cachedJobs = await ExternalJob.find({ _id: { $in: cachedEntry.jobIds } }).lean();
          if (cachedJobs.length > 0) {
            console.log(`[JobProviderManager] Cache hit for "${cacheKey}". Returning ${cachedJobs.length} cached jobs.`);
            return {
              jobs: cachedJobs,
              total: cachedEntry.totalCount || cachedJobs.length,
              page: pageNum,
              limit: limitNum,
              fromCache: true,
              providersStatus: { cache: "hit" },
            };
          }
        }
      } catch (cacheErr) {
        console.warn("[JobProviderManager] Cache lookup error:", cacheErr.message);
      }
    }

    // 2. Determine target providers
    const targetProviders = [];
    if (normalizedSource === "adzuna") {
      const p = this.getProvider("adzuna");
      if (p) targetProviders.push(p);
    } else if (normalizedSource === "jooble") {
      const p = this.getProvider("jooble");
      if (p) targetProviders.push(p);
    } else {
      // "all" or unspecified
      targetProviders.push(...this.getAllProviders());
    }

    // 3. Check rate limits & configuration for each provider
    const providersToExecute = [];
    const providersStatus = {};

    for (const provider of targetProviders) {
      const name = provider.providerName;
      if (!provider.isConfigured()) {
        providersStatus[name] = "not_configured";
        continue;
      }

      const budget = await RateLimiter.checkLimit(name);
      if (!budget.allowed) {
        console.warn(`[JobProviderManager] Provider [${name}] throttled: ${budget.reason}`);
        providersStatus[name] = "rate_limited";
        continue;
      }

      providersToExecute.push(provider);
    }

    // 4. Execute external queries with Provider Failure Isolation (Promise.allSettled)
    const fetchedJobs = [];

    if (providersToExecute.length > 0) {
      const results = await Promise.allSettled(
        providersToExecute.map(async (provider) => {
          const name = provider.providerName;
          await RateLimiter.recordHit(name);
          const jobs = await provider.searchJobs({
            keyword: query,
            location,
            page: pageNum,
            pageSize: limitNum,
          });
          return { name, jobs };
        })
      );

      for (let i = 0; i < results.length; i++) {
        const res = results[i];
        const providerName = providersToExecute[i].providerName;

        if (res.status === "fulfilled") {
          const { jobs } = res.value;
          providersStatus[providerName] = "success";
          fetchedJobs.push(...jobs);
        } else {
          providersStatus[providerName] = "failed";
          console.error(`[JobProviderManager] Provider [${providerName}] failed:`, res.reason?.message || res.reason);
        }
      }
    }

    // 5. If live providers fetched jobs, deduplicate and upsert to MongoDB
    if (fetchedJobs.length > 0) {
      const uniqueJobs = deduplicateJobs(fetchedJobs);
      const upsertedJobIds = [];

      for (const job of uniqueJobs) {
        try {
          const filter = { provider: job.provider, externalId: job.externalId };
          const update = {
            $set: {
              externalUrl: job.externalUrl,
              title: job.title,
              description: job.description,
              companyName: job.companyName,
              location: job.location,
              locationRaw: job.locationRaw,
              isRemote: job.isRemote,
              jobType: job.jobType,
              category: job.category,
              skills: job.skills || [],
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              salaryCurrency: job.salaryCurrency,
              salaryDisplay: job.salaryDisplay,
              postedAt: job.postedAt,
              expiresAt: job.expiresAt,
              importedAt: new Date(),
            },
          };

          const doc = await ExternalJob.findOneAndUpdate(filter, update, {
            upsert: true,
            returnDocument: "after",
            setDefaultsOnInsert: true,
          }).lean();

          if (doc && doc._id) {
            upsertedJobIds.push(doc._id);
          }
        } catch (dbErr) {
          console.error(`[JobProviderManager] Error upserting job ${job.externalId}:`, dbErr.message);
        }
      }

      // Save to SearchCache
      if (upsertedJobIds.length > 0) {
        try {
          await SearchCache.updateOne(
            { cacheKey },
            {
              $set: {
                query,
                location,
                source: normalizedSource,
                page: pageNum,
                jobIds: upsertedJobIds,
                totalCount: upsertedJobIds.length,
                providersQueried: providersToExecute.map((p) => p.providerName),
                expiresAt: new Date(Date.now() + CACHE_TTL_MS),
              },
            },
            { upsert: true }
          );
        } catch (cacheSaveErr) {
          console.warn("[JobProviderManager] Failed to save search cache:", cacheSaveErr.message);
        }
      }

      // Fetch freshly stored jobs from DB to return complete Mongoose documents
      const jobsToReturn = await ExternalJob.find({ _id: { $in: upsertedJobIds } }).lean();
      return {
        jobs: jobsToReturn,
        total: jobsToReturn.length,
        page: pageNum,
        limit: limitNum,
        fromCache: false,
        providersStatus,
      };
    }

    // 6. Fallback: If live providers returned 0 jobs or were throttled/failed, query existing MongoDB jobs
    const dbFilter = {};
    if (query && query.trim()) {
      dbFilter.$or = [
        { title: { $regex: query.trim(), $options: "i" } },
        { companyName: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
      ];
    }
    if (location && location.trim()) {
      dbFilter.location = { $regex: location.trim(), $options: "i" };
    }
    if (normalizedSource !== "all") {
      dbFilter.provider = normalizedSource;
    }

    const skip = (pageNum - 1) * limitNum;
    const [fallbackJobs, totalCount] = await Promise.all([
      ExternalJob.find(dbFilter).sort({ importedAt: -1 }).skip(skip).limit(limitNum).lean(),
      ExternalJob.countDocuments(dbFilter),
    ]);

    return {
      jobs: fallbackJobs,
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      fromCache: true,
      fallbackUsed: true,
      providersStatus,
    };
  }
}

// Global Singleton Instance
export const jobProviderManager = new JobProviderManager();
