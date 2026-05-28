import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Všetku prácu s API a tokenom robí AuthContext.login
      await login(email, password); 
      
      toast.success("Prihlásenie úspešné!");
      navigate("/admin");
    } catch (err) {
      console.error("Chyba:", err);
      toast.error("Neplatné údaje alebo chyba servera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-soft)] text-slate-900 px-4">
      <div className="absolute top-6 right-6"><LanguageSwitcher /></div>
      <div className="w-full max-w-md surface-card p-8 md:p-10">
        <Logo size={64} className="mb-6" />
        <h1 className="text-3xl font-semibold">Prihlásenie</h1>
        <input type="email" className="input-light mt-4" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="input-light mt-4" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="button" onClick={handleLogin} className="btn-primary w-full mt-8" disabled={loading}>
          {loading ? "Čakám..." : "Prihlásiť sa"}
        </button>
      </div>
    </div> 
  );
}