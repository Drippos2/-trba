import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Prihlásenie
      const res = await api.post("/api/auth/login", { email, password });
      
      // 2. Uloženie tokenu
      if (res.data.access_token) {
        localStorage.setItem("ps_token", res.data.access_token);
        toast.success("Prihlásenie úspešné!");
        
        // 3. Okamžité presmerovanie
        window.location.href = "/admin"; 
      }
    } catch (err) {
      console.error(err);
      toast.error("Chybné prihlasovacie údaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-neutral-900 p-8 rounded-2xl w-full max-w-sm border border-neutral-800">
        <h2 className="text-xl font-bold text-yellow-500 mb-6">ADMIN LOGIN</h2>
        <input type="email" placeholder="Email" className="w-full p-3 mb-4 bg-black border border-neutral-800 rounded text-white" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Heslo" className="w-full p-3 mb-6 bg-black border border-neutral-800 rounded text-white" onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full py-3 bg-yellow-600 font-bold rounded hover:bg-yellow-500 transition">
          {loading ? "Čakaj..." : "PRIHLÁSIŤ"}
        </button>
      </form>
    </div>
  );
}