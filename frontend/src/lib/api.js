import axios from "axios";

// 1. Nastavenie základnej URL
const BACKEND_URL = "https://trba.onrender.com/api";

// 2. Vytvorenie inštancie axios
export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Interceptor na automatické pridávanie tokenu
// Tento kúsok zabezpečí, že každý request od admina bude mať v sebe token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ps_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 4. Funkcia na formátovanie chýb (zostáva tvoja)
export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}