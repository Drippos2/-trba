import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const { user, ready } = useAuth();
  const { tr } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ready) return null;
  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("--- STARTUJEM PRIAMY DOPYT ---");
    console.log("Posielam na:", "https://trba-1.onrender.com/api/auth/login");

    try {
      const response = await fetch("https://trba-1.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Odpoveď servera:", data);
      console.log("Status kód:", response.status);

      if (response.ok) {
        toast.success("Prihlásenie úspešné!");
        // Ak to prejde, môžeme skúsiť tvoj pôvodný login proces:
        window.location.reload(); 
      } else {
        toast.error(`Chyba: ${data.detail || "Neznáma chyba"}`);
      }
    } catch (err) {
      console.error("Sieťová chyba (CORS/nedostupnosť):", err);
      toast.error("Server neodpovedá, skontroluj konzolu (F12).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-soft)] text-slate-900 px-4">
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="w-full max-w-md surface-card p-8 md:p-10"
      >
        <Logo size={64} className="mb-6" />
        <div className="overline mb-3">PENZIÓN ŠTRBA — ADMIN</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{tr("admin.login")}</h1>
        <p className="mt-2 text-slate-500 text-sm">admin@penzion-strba.sk</p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="overline block mb-2">{tr("admin.email")}</label>
            <input
              type="email"
              className="input-light"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="admin-email-input"
            />
          </div>
          <div>
            <label className="overline block mb-2">{tr("admin.password")}</label>
            <input
              type="password"
              className="input-light"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="admin-password-input"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          data-testid="admin-login-btn"
          className="btn-primary w-full justify-center mt-8 disabled:opacity-60"
        >
          {loading ? "..." : tr("admin.signIn")}
        </button>
      </form>
    </div> 
  );
}