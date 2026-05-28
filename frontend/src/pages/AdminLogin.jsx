import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setLoading(true);
    console.log("Pokúšam sa o pripojenie na:", "https://trba-1.onrender.com/api/auth/login");

    try {
      const response = await fetch("https://trba-1.onrender.com/api/auth/login", {
        method: "POST",
        mode: "cors", // KĽÚČOVÉ PRE CORS
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Odpoveď servera:", data);

      if (response.ok) {
        toast.success("Prihlásenie úspešné!");
        navigate("/admin");
      } else {
        toast.error(`Chyba: ${data.detail || "Neznáma chyba"}`);
      }
    } catch (err) {
      console.error("KRITICKÁ CHYBA (CORS/Network):", err);
      toast.error("Prehliadač zablokoval spojenie. Skontroluj konzolu (F12).");
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
        <button type="button" onClick={submit} className="btn-primary w-full mt-8" disabled={loading}>
          {loading ? "Čakám..." : "Prihlásiť sa"}
        </button>
      </div>
    </div> 
  );
}

// Do AdminLogin.jsx pridaj toto:
const { login } = useAuth(); // Získame funkciu login z kontextu

// Vnútri funkcie submit po úspešnom response.ok:
if (response.ok) {
    const userData = await response.json(); // predpokladám, že server vráti dáta
    login(userData); // TOTO JE KĽÚČOVÉ: uloženie používateľa do stavu
    toast.success("Prihlásenie úspešné!");
    navigate("/admin"); // Presmerovanie
}