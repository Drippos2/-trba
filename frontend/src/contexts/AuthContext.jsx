import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ps_token");
    if (!token) {
      setReady(true);
      return;
    }
    // OPRAVENÉ: Pridané /api pred /auth/me
    api
      .get("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem("ps_token");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    // OPRAVENÉ: Pridané /api pred /auth/login
    const { data } = await api.post("/api/auth/login", { email, password });
    localStorage.setItem("ps_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ps_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}