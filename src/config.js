// API Configuration
// For production, set VITE_API_BASE_URL environment variable in Vercel
// For local development, this will default to localhost:8000

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";