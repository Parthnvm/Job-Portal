import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // critical for cookie-based authentication
});

// Automatically attach stored user auth headers
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?._id) {
        config.headers['x-user-id'] = user._id;
      }
    }
  } catch (e) {
    // Ignore localStorage parse error
  }
  return config;
});

export default API;
