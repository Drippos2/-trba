import axios from "axios";

const BACKEND_URL = "https://trba.onrender.com";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Ak cesta už začína /api/, nepridávaj ho. 
  // Ak nezačína, pridaj ho.
  if (!config.url.startsWith('/api/')) {
    const cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
    config.url = `/api${cleanUrl}`;
  }

  const token = localStorage.getItem("ps_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export function formatApiError(detail) {
  if (detail == null) return "Niečo sa stalo. Skúste to prosím znova.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}