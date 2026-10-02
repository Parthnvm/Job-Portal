import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const cleanBaseUrl = rawApiUrl.replace(/\/+$/, "");

const API = axios.create({
  baseURL: cleanBaseUrl.endsWith("/api/v1") ? cleanBaseUrl : `${cleanBaseUrl}/api/v1`,
  withCredentials: true, // critical for cookie-based authentication
});

// Automatically attach stored user auth headers
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore localStorage access error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthenticated responses cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default API;
