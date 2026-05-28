import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { formatApiError, api } from "@/lib/api"; // Uisti sa, že importuješ aj 'api'
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const { user, login, ready } = useAuth();
  const { tr } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ready) return null;
  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    console.log("Klikol si na prihlásenie!");
    console.log("Adresa backendu (baseURL):", api.defaults.baseURL);
    
    setLoading(true);
    try {
      await login(email, password);
      console.log("Login úspešný, presmerovávam...");
      navigate("/admin");
    } catch (err) {
      console.error("Chyba pri prihlásení:", err);
      if (err.response) {
        console.error("Detail chyby od servera:", err.response.data);
      }
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
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