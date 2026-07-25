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
    
    // Nastavíme autorizáciu pri štarte, ak máme token
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    api
      .get("/api/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem("ps_token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    // 1. Prihlásenie
    const { data } = await api.post("/api/auth/login", { email, password });
    
    // 2. Uloženie tokenu
    localStorage.setItem("ps_token", data.access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    
    // 3. Po úspešnom logine načítame profil, aby sme mali 'user' objekt
    const profile = await api.get("/api/auth/me");
    setUser(profile.data);
    
    return profile.data;
  };

  const logout = () => {
    localStorage.removeItem("ps_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/admin/login"; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {ready ? children : <div className="min-h-screen flex items-center justify-center bg-black text-white">Načítavam...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}