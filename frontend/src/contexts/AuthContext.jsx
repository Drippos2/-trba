import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Nastavenie interceptora, aby sa token posielal ku každej požiadavke
  useEffect(() => {
    const token = localStorage.getItem("ps_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("ps_token");
    if (!token) {
      setReady(true);
      return;
    }

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
    // 1. Pošleme prihlasovacie údaje
    const { data } = await api.post("/api/auth/login", { email, password });
    
    // 2. Uložíme token do localStorage
    localStorage.setItem("ps_token", data.access_token);
    
    // 3. Nastavíme token do axios inštancie, aby ho server videl v budúcich volaniach
    api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
    
    // 4. Nastavíme užívateľa zo získaných dát (backend vracia objekt 'user')
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("ps_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    window.location.href = "/login"; // Force reload na reset stavu
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {ready ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}