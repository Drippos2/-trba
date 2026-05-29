import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Calendar, MessageSquare, Trash2, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api"; 
import Logo from "@/components/Logo";

const STATUS_BADGE = {
  pending: "bg-amber-900/20 text-amber-500 border-amber-800",
  confirmed: "bg-emerald-900/20 text-emerald-500 border-emerald-800",
  cancelled: "bg-rose-900/20 text-rose-500 border-rose-800",
};

export default function AdminDashboard() {
  const { user, ready, logout } = useAuth();
  const { tr } = useLang();
  const [tab, setTab] = useState("reservations");
  const [stats, setStats] = useState({ total: 0 });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      // Backend teraz vracia objekty, preto pristupujeme k .data.reservations a .data.messages
      const [s, r, c] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/reservations"),
        api.get("/api/contact"),
      ]);
      setStats(s.data);
      setReservations(r.data.reservations || []);
      setMessages(c.data.messages || []);
    } catch (err) {
      console.error("Chyba načítania dát:", err);
      toast.error("Nepodarilo sa načítať dáta z backendu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user) {
      load();
    }
  }, [ready, user]);

  if (!ready) return <div className="p-12 text-white">Načítavam...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const remove = async (id) => {
    if (!window.confirm("Zmazať túto rezerváciu?")) return;
    try {
      // Endpoint musí súhlasiť s backendom
      await api.delete(`/api/reservations/${id}`);
      await load();
      toast.success("Rezervácia zmazaná");
    } catch (err) {
      toast.error("Chyba pri mazaní");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-neutral-900 border-b border-yellow-600/30">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <Logo size={40} />
            <div className="pl-3 border-l border-yellow-600">
              <div className="text-[10px] tracking-[0.3em] text-yellow-500">ADMIN PANEL</div>
            </div>
          </Link>
          <button onClick={logout} className="text-white hover:text-yellow-500 transition flex items-center gap-2 text-sm">
            <LogOut size={14} /> Odhlásiť
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Stat title="Celkom" value={stats.total} />
        </div>

        <div className="flex gap-2 mb-6">
          <TabBtn active={tab === "reservations"} onClick={() => setTab("reservations")} icon={Calendar}>Rezervácie</TabBtn>
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={MessageSquare}>Správy</TabBtn>
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-yellow-500"><Loader2 className="animate-spin" /></div>
        ) : tab === "reservations" ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800 text-yellow-500 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4 text-left">Hosť</th>
                  <th className="p-4 text-left">Termín</th>
                  <th className="p-4 text-left">Izba/Status</th>
                  <th className="p-4 text-right">Akcie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/50 transition">
                    <td className="p-4"><div className="font-medium">{r.guest_name}</div><div className="text-neutral-500 text-xs">{r.guest_email}</div></td>
                    <td className="p-4 text-neutral-400"><div>{r.check_in} - {r.check_out}</div></td>
                    <td className="p-4">
                        <div>Izba č.{r.room_id}</div>
                        <span className={`px-2 py-0.5 rounded border text-[9px] uppercase ${STATUS_BADGE[r.status] || ""}`}>{r.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => remove(r.id)} className="text-neutral-500 hover:text-rose-500 transition"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {messages.map((m) => (
              <div key={m.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                <div className="font-bold">{m.name}</div>
                <div className="text-xs text-neutral-500 mb-3">{m.email}</div>
                <p className="text-sm text-neutral-300 leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
      <div className="text-[10px] uppercase text-neutral-500 tracking-widest">{title}</div>
      <div className="text-2xl font-bold mt-1 text-white">{value}</div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-medium border transition flex items-center gap-2 ${active ? "bg-yellow-600 text-black border-yellow-600 font-bold" : "bg-neutral-900 border-neutral-800 text-white hover:border-yellow-600"}`}>
      <Icon size={15} /> {children}
    </button>
  );
}