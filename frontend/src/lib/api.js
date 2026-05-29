import axios from "axios";

// Pevne nastavená správna URL
const BACKEND_URL = "https://trba.onrender.com";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: pridá token a zaistí, že cesty začínajú /api
api.interceptors.request.use((config) => {
  // Pridanie prefixu /api, ak tam náhodou chýba
  if (!config.url.startsWith('/api/')) {
    config.url = `/api${config.url.startsWith('/') ? '' : '/'}${config.url}`;
  }

  // Automatické pridanie tokenu z localStorage
  const token = localStorage.getItem("ps_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Pomocná funkcia na spracovanie chýb
export function formatApiError(detail) {
  if (detail == null) return "Niečo sa stalo. Skúste to prosím znova.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}