// API Configuration
// For production, set VITE_API_BASE_URL environment variable in Vercel
// For local development, this will default to localhost:8000

const getApiBaseUrl = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD) {
    // Use environment variable if set, otherwise use your Vercel backend URL
    return import.meta.env.VITE_API_BASE_URL || "https://campus-connect-backend-phi.vercel.app";
  }
  // Development - use localhost
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl();