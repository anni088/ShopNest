const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://shopnest-production-cda7.up.railway.app"
    : "http://localhost:5000";

export default API_URL;