// api.js
import axios from "axios";

const baseURL =
  process.env.REACT_APP_BASE_URL || "https://prep-project-zej8.onrender.com/api/v1/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Single request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log("[api] request →", config.url, "| token:", token ? "present" : "MISSING");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;