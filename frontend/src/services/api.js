import axios from "axios";

const rawApiUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
  "http://localhost:8000";
const cleanBaseUrl = rawApiUrl.replace(/\/+$/, "");

const API = axios.create({
  baseURL: cleanBaseUrl.endsWith("/api/v1") ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`,
  withCredentials: true, // Critical for cookie-based authentication and CSRF double-submit
});

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

let cachedCsrfToken = null;
let csrfFetchPromise = null;

/**
 * Safely reads the csrf_token cookie if available on the current document domain.
 */
function readCsrfCookie() {
  try {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Retrieves a valid CSRF token, reusing existing token or in-flight promise.
 */
export async function getCsrfToken(forceRefresh = false) {
  if (!forceRefresh) {
    if (cachedCsrfToken) return cachedCsrfToken;
    const cookieToken = readCsrfCookie();
    if (cookieToken) {
      cachedCsrfToken = cookieToken;
      return cachedCsrfToken;
    }
  }

  if (csrfFetchPromise) {
    return csrfFetchPromise;
  }

  csrfFetchPromise = API.get("/user/csrf-token", {
    // Avoid triggering request interceptor loops
    _skipCsrf: true,
  })
    .then((res) => {
      const token = res.data?.csrfToken || res.headers?.["x-csrf-token"];
      if (token) {
        cachedCsrfToken = token;
      }
      return cachedCsrfToken;
    })
    .catch((err) => {
      console.warn("[CSRF] Failed to fetch CSRF token:", err?.message || err);
      return cachedCsrfToken; // fallback to whatever we had
    })
    .finally(() => {
      csrfFetchPromise = null;
    });

  return csrfFetchPromise;
}

// Automatically attach stored user auth headers and CSRF tokens
API.interceptors.request.use(
  async (config) => {
    // 1. Bearer Token
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore localStorage access error
    }

    // 2. CSRF Token on mutating requests
    const method = (config.method || "get").toLowerCase();
    if (MUTATING_METHODS.has(method) && !config._skipCsrf) {
      let csrf = cachedCsrfToken || readCsrfCookie();
      if (!csrf) {
        csrf = await getCsrfToken();
      }
      if (csrf) {
        config.headers["x-csrf-token"] = csrf;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: capture fresh CSRF tokens, handle 401 expiration, and auto-retry on CSRF 403
API.interceptors.response.use(
  (response) => {
    // Keep CSRF token in sync if server returned a new one
    const newCsrf = response.headers?.["x-csrf-token"];
    if (newCsrf) {
      cachedCsrfToken = newCsrf;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 CSRF token missing / mismatch: refresh token and retry once
    if (
      error.response &&
      error.response.status === 403 &&
      originalRequest &&
      !originalRequest._retryCsrf &&
      typeof error.response.data?.message === "string" &&
      error.response.data.message.toLowerCase().includes("csrf")
    ) {
      originalRequest._retryCsrf = true;
      cachedCsrfToken = null; // bust cache
      const freshToken = await getCsrfToken(true);
      if (freshToken) {
        originalRequest.headers["x-csrf-token"] = freshToken;
        return API(originalRequest);
      }
    }

    // Handle 401 unauthenticated
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {
        // Ignore
      }
      window.dispatchEvent(new CustomEvent("auth:session-expired"));
    }

    return Promise.reject(error);
  }
);

// Proactively pre-fetch CSRF token on startup (non-blocking)
if (typeof window !== "undefined") {
  getCsrfToken().catch(() => {});
}

export default API;
