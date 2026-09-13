// Centralized API configuration with default fallback
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://border-ai-shzr.onrender.com').replace(/\/$/, '');
