import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api"; 

export default function AdminDashboard() {
  const { user, ready, logout } = useAuth();
  const [tab, setTab] = useState("reservations");
  const [stats, setStats] = useState({ total: 0 });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Pokúšam sa načítať dáta z API...");
      
      // Voláme presne tie endpointy, ktoré máš v server.py
      const [resStats, resReservations, resContact] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/reservations"),
        api.get("/api/contact"),
      ]);

      console.log("Dáta rezervácií:", resReservations.data);
      console.log("Dáta správ:", resContact.data);

      setStats(resStats.data);
      // Backend vracia objekt, kde dáta sú pod kľúčom "reservations" alebo "messages"
      setReservations(resReservations.data.reservations || []);
      setMessages(resContact.data.messages || []);
      
    } catch (err) {
      console.error("CHYBA API:", err.response ? err.response.data : err.message);
      toast.error("Nepodarilo sa načítať dáta. Skontroluj konzolu (F12).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user) loadData();
  }, [ready, user]);

  const removeEntry = async (id, type) => {
    if (!window.confirm("Naozaj zmazať?")) return;
    try {
      await api.delete(`/api/${type}/${id}`);
      toast.success("Zmazané");
      loadData();
    } catch (e) {
      toast.error("Chyba pri mazaní");
    }
  };

  if (!ready) return <div className="min-h-screen bg-black text-white p-10">Načítavam...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-neutral-800 pb-6">
          <h1 className="text-xl font-bold text-yellow-500">PENZIÓN ŠTRBA ADMIN</h1>
          <button onClick={logout} className="text-sm text-neutral-400 hover:text-white flex items-center gap-2">
            <LogOut size={16} /> Odhlásiť
          </button>
        </header>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab("reservations")} className={`px-6 py-2 rounded-lg ${tab === "reservations" ? "bg-yellow-600 text-black" : "bg-neutral-900 border border-neutral-800"}`}>Rezervácie</button>
          <button onClick={() => setTab("messages")} className={`px-6 py-2 rounded-lg ${tab === "messages" ? "bg-yellow-600 text-black" : "bg-neutral-900 border border-neutral-800"}`}>Správy</button>
        </div>

        {loading ? <div className="text-center p-20"><Loader2 className="animate-spin mx-auto text-yellow-500" size={32} /></div> : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4">Meno</th>
                  <th className="p-4">Info</th>
                  <th className="p-4 text-right">Akcia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {(tab === "reservations" ? reservations : messages).map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-800/30">
                    <td className="p-4">{item.name || item.first_name || "Neznámy"}</td>
                    <td className="p-4 text-neutral-400">{item.check_in || item.date || item.message?.substring(0, 30)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeEntry(item._id, tab === "reservations" ? "reservations" : "contact")} className="text-red-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}