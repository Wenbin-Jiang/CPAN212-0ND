import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // Direct access to the data property
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("authToken");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("No response received:", error.request);
      return Promise.reject({
        success: false,
        message: "No response from server",
      });
    } else {
      // Request setup error
      console.error("Request setup error:", error.message);
      return Promise.reject({
        success: false,
        message: "Request failed",
      });
    }
  }
);

export default api;
