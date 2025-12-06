
// Logic to determine API URL

// Check if we are in a production build but served locally vs truly in dev mode
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// If running locally, ALWAYS use local backend to avoid issues with stale .env vars or production redirects
export const API_URL = isLocal ? "http://localhost:3001" : (import.meta.env.VITE_API_URL || "https://tradestack-kn6d.onrender.com");

console.log("Configured API_URL:", API_URL); // Debug logging
