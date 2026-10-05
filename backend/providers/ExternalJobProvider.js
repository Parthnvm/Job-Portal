/** Abstract base interface for external job providers. */
export class JobProvider {
  /** Provider identifier (e.g. "adzuna", "jooble"). */
  get providerName() {
    throw new Error(`${this.constructor.name} must implement get providerName()`);
  }

  /** Checks if provider credentials are configured in environment. */
  isConfigured() {
    throw new Error(`${this.constructor.name} must implement isConfigured()`);
  }

  /** Searches jobs from external provider. */
  async searchJobs({ keyword = "", location = "", page = 1, pageSize = 20 } = {}) {
    throw new Error(`${this.constructor.name} must implement searchJobs()`);
  }

  /** Alias for searchJobs. */
  async fetchJobs(params) {
    return this.searchJobs(params);
  }

  /** Normalizes raw provider job to standard schema. */
  normalizeJob(rawJob) {
    throw new Error(`${this.constructor.name} must implement normalizeJob()`);
  }

  /** Handles provider errors with formatted logging. */
  handleError(error, context = "fetch") {
    const status = error.response?.status;
    const name = this.providerName.toUpperCase();

    if (status === 401 || status === 403) {
      console.error(`[${name}] Authentication failed (${status}). Check API credentials.`);
    } else if (status === 429) {
      console.warn(`[${name}] Rate limit exceeded (429). Throttling requests.`);
    } else if (status >= 500) {
      console.error(`[${name}] Remote server error (${status}) during ${context}.`);
    } else if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      console.warn(`[${name}] Request timed out during ${context}.`);
    } else if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.warn(`[${name}] Network unreachable (${error.code}).`);
    } else {
      console.error(`[${name}] Error during ${context}:`, error.message);
    }

    return [];
  }
}

// Backward-compatible alias
export const ExternalJobProvider = JobProvider;

/**
 * @typedef {Object} NormalizedJob
 * @property {string} provider
 * @property {string} externalId
 * @property {string} externalUrl
 * @property {string} title
 * @property {string} description
 * @property {string} companyName
 * @property {string} location
 * @property {boolean} isRemote
 * @property {string} jobType
 * @property {string[]} skills
 * @property {number|null} salaryMin
 * @property {number|null} salaryMax
 * @property {string} salaryCurrency
 * @property {string} salaryDisplay
 * @property {Date|null} postedAt
 * @property {Date} importedAt
 * @property {Date} expiresAt
 */
