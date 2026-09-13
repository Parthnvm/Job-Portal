/**
 * JobProvider — Abstract Base Interface
 *
 * All external job providers (Adzuna, Jooble, etc.) must implement this interface.
 * To add a new provider:
 * 1. Extend `JobProvider`.
 * 2. Implement `providerName`, `isConfigured()`, `searchJobs()`, `normalizeJob()`, and `handleError()`.
 * 3. Register the provider in `JobProviderManager`.
 *
 * @abstract
 */
export class JobProvider {
  /**
   * The stable string identifier for this provider (e.g. "adzuna", "jooble").
   * Used as the `provider` field in database models.
   * @returns {string}
   */
  get providerName() {
    throw new Error(`${this.constructor.name} must implement get providerName()`);
  }

  /**
   * Check whether this provider has required credentials configured in the environment.
   * @returns {boolean}
   */
  isConfigured() {
    throw new Error(`${this.constructor.name} must implement isConfigured()`);
  }

  /**
   * Search jobs from the external provider with normalized parameters.
   *
   * @param {Object} params
   * @param {string} [params.keyword]   - Search keyword / job title (e.g. "software developer")
   * @param {string} [params.location]  - Location filter (e.g. "Pune", "Mumbai")
   * @param {number} [params.page=1]    - 1-based page number
   * @param {number} [params.pageSize=20] - Number of results per page
   * @returns {Promise<NormalizedJob[]>}
   */
  async searchJobs({ keyword = "", location = "", page = 1, pageSize = 20 } = {}) {
    throw new Error(`${this.constructor.name} must implement searchJobs()`);
  }

  /**
   * Backward-compatible alias for searchJobs.
   */
  async fetchJobs(params) {
    return this.searchJobs(params);
  }

  /**
   * Normalizes a single provider-specific raw job into the standard NormalizedJob format.
   *
   * @param {Object} rawJob - Raw result item from provider
   * @returns {NormalizedJob}
   */
  normalizeJob(rawJob) {
    throw new Error(`${this.constructor.name} must implement normalizeJob()`);
  }

  /**
   * Handles errors from this provider gracefully with sanitized logging.
   *
   * @param {Error} error - Caught error
   * @param {string} context - Action description (e.g., "searchJobs")
   * @returns {NormalizedJob[]} - Safe fallback empty list
   */
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
 * @property {string}      provider       - Provider identifier ("adzuna" | "jooble")
 * @property {string}      source         - Alias for provider
 * @property {string}      externalId     - Unique ID from provider
 * @property {string}      external_id    - Alias for externalId
 * @property {string}      externalUrl    - Original posting URL
 * @property {string}      apply_url      - Alias for externalUrl
 * @property {string}      source_url     - Alias for externalUrl
 * @property {string}      title          - Job title
 * @property {string}      description    - Clean job description / snippet
 * @property {string}      companyName    - Employer name
 * @property {string}      company        - Alias for companyName
 * @property {string}      location       - Formatted location
 * @property {string}      locationRaw    - Raw provider location string
 * @property {boolean}     isRemote       - Remote position indicator
 * @property {string}      jobType        - Employment type (Full-Time, Contract, etc.)
 * @property {string}      job_type       - Alias for jobType
 * @property {string}      category       - Job category / industry
 * @property {string[]}    skills         - List of recognized tech skills
 * @property {number|null} salaryMin      - Minimum salary threshold (number)
 * @property {number|null} salary_min     - Alias for salaryMin
 * @property {number|null} salaryMax      - Maximum salary threshold (number)
 * @property {number|null} salary_max     - Alias for salaryMax
 * @property {string}      salaryCurrency - ISO currency code ("INR")
 * @property {string}      salary_currency - Alias for salaryCurrency
 * @property {string}      salaryDisplay  - Human-readable salary range string
 * @property {Date|null}   postedAt       - When the job was posted
 * @property {Date|null}   posted_date    - Alias for postedAt
 * @property {Date}        importedAt     - When normalized by system
 * @property {Date}        fetched_at     - Alias for importedAt
 * @property {Date}        expiresAt      - Record expiration date
 */
