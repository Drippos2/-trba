import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Calendar, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api"; 
import Logo from "@/components/Logo";

export default function AdminDashboard() {
  const { user, ready, logout } = useAuth();
  const [tab, setTab] = useState("reservations");
  const [stats, setStats] = useState({ total: 0 });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      // Paralelné volania
      const [sRes, rRes, cRes] = await Promise.allSettled([
        api.get("/api/admin/stats"),
        api.get("/api/reservations"),
        api.get("/api/contact"),
      ]);

      if (sRes.status === "fulfilled") setStats(sRes.value.data);
      if (rRes.status === "fulfilled") setReservations(rRes.value.data.reservations || []);
      if (cRes.status === "fulfilled") setMessages(cRes.value.data.messages || []);
      
    } catch (err) {
      console.error("Dashboard load error:", err);
      toast.error("Nepodarilo sa načítať dáta z backendu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user) loadData();
  }, [ready, user]);

  const removeEntry = async (id, type) => {
    if (!window.confirm("Naozaj chcete túto položku natrvalo zmazať?")) return;
    try {
      await api.delete(`/api/${type}/${id}`);
      toast.success("Úspešne zmazané");
      loadData();
    } catch (e) {
      toast.error("Chyba pri mazaní.");
    }
  };

  if (!ready) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Načítavam...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-widest text-yellow-500">PENZIÓN ŠTRBA ADMIN</h1>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition">
            <LogOut size={16} /> Odhlásiť
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <p className="text-neutral-500 text-xs uppercase tracking-widest">Počet rezervácií</p>
            <p className="text-3xl font-bold mt-2 text-white">{stats.total || 0}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setTab("reservations")} className={`px-6 py-2 rounded-lg font-medium transition ${tab === "reservations" ? "bg-yellow-600 text-black" : "bg-neutral-900 border border-neutral-800 text-white hover:border-yellow-600"}`}>Rezervácie</button>
          <button onClick={() => setTab("messages")} className={`px-6 py-2 rounded-lg font-medium transition ${tab === "messages" ? "bg-yellow-600 text-black" : "bg-neutral-900 border border-neutral-800 text-white hover:border-yellow-600"}`}>Správy</button>
        </div>

        {loading ? (
          <div className="text-center p-20"><Loader2 className="animate-spin mx-auto text-yellow-500" size={32} /></div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4">Meno a Kontakt</th>
                  <th className="p-4">Dátum / Info</th>
                  <th className="p-4">Správa</th>
                  <th className="p-4 text-right">Akcia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-sm">
                {(tab === "reservations" ? reservations : messages).length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-neutral-500">Žiadne dáta na zobrazenie.</td></tr>
                ) : (
                  (tab === "reservations" ? reservations : messages).map((item) => (
                    <tr key={item._id} className="hover:bg-neutral-800/30 transition">
                      <td className="p-4">
                        <div className="font-semibold">{item.name || item.first_name || "Neznámy"}</div>
                        <div className="text-neutral-500 text-xs">{item.email}</div>
                      </td>
                      <td className="p-4 text-neutral-300">
                        {item.check_in || item.date || "N/A"}
                      </td>
                      <td className="p-4 text-neutral-400 text-xs max-w-[200px] truncate">
                        {item.message || item.note || "-"}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => removeEntry(item._id, tab === "reservations" ? "reservations" : "contact")} className="text-red-500 hover:text-red-300"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}