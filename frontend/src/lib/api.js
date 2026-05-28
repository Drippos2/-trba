import axios from "axios";

// Pevne nastavená správna URL
const BACKEND_URL = "https://trba.onrender.com";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor sa postará o automatické pridávanie tokenu ku každej požiadavke
api.interceptors.request.use((config) => {
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