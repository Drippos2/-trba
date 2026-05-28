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
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, revenue: 0 });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Debug log
  useEffect(() => {
    console.log("Dashboard - User:", user, "Ready:", ready);
  }, [user, ready]);

  const load = async () => {
    try {
      setLoading(true);
      const [s, r, c] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/reservations"),
        api.get("/api/contact"),
      ]);
      setStats(s.data);
      setReservations(r.data);
      setMessages(c.data);
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

  // Ak sa aplikácia ešte inicializuje, neukazuj nič
  if (!ready) return <div className="p-12 text-white">Načítavam...</div>;
  
  // Ak nie je používateľ, presmeruj na login
  if (!user) return <Navigate to="/admin/login" replace />;

  const updateStatus = async (id, status) => {
    setProcessingId(id);
    try {
      await api.patch(`/api/reservations/${id}`, { status });
      await load();
      toast.success("Status aktualizovaný");
    } catch (err) {
      toast.error("Chyba pri aktualizácii");
    } finally {
      setProcessingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Zmazať túto rezerváciu?")) return;
    try {
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
            <LogOut size={14} /> {tr("admin.logout")}
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Stat title={tr("admin.total")} value={stats.total} />
          <Stat title={tr("admin.pending")} value={stats.pending} />
          <Stat title={tr("admin.confirmed")} value={stats.confirmed} />
          <Stat title={tr("admin.cancelled")} value={stats.cancelled} />
          <Stat title={tr("admin.revenue")} value={`€${stats.revenue ? stats.revenue.toFixed(0) : 0}`} accent />
        </div>

        <div className="flex gap-2 mb-6">
          <TabBtn active={tab === "reservations"} onClick={() => setTab("reservations")} icon={Calendar}>{tr("admin.reservations")}</TabBtn>
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={MessageSquare}>{tr("admin.messages")}</TabBtn>
        </div>

        {loading ? (
          <div className="flex justify-center p-12 text-yellow-500"><Loader2 className="animate-spin" /></div>
        ) : tab === "reservations" ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-800 text-yellow-500 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4 text-left">{tr("admin.guest")}</th>
                  <th className="p-4 text-left">{tr("admin.dates")}</th>
                  <th className="p-4 text-left">Room</th>
                  <th className="p-4 text-left">{tr("admin.status")}</th>
                  <th className="p-4 text-right">{tr("admin.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-800/50 transition">
                    <td className="p-4"><div className="font-medium">{r.first_name} {r.last_name}</div><div className="text-neutral-500 text-xs">{r.email}</div></td>
                    <td className="p-4 text-neutral-400"><div>{r.check_in}</div><div className="text-xs">{r.nights} nights</div></td>
                    <td className="p-4">{r.room_name}</td>
                    <td className="p-4"><span className={`px-2 py-1 rounded border text-[10px] uppercase ${STATUS_BADGE[r.status] || ""}`}>{r.status}</span></td>
                    <td className="p-4 text-right space-x-2">
                      {r.status !== "confirmed" && (
                        <button disabled={processingId === r.id} onClick={() => updateStatus(r.id, "confirmed")} className="text-emerald-500 hover:text-emerald-300 disabled:opacity-50">
                          {processingId === r.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        </button>
                      )}
                      {r.status !== "cancelled" && (
                        <button disabled={processingId === r.id} onClick={() => updateStatus(r.id, "cancelled")} className="text-rose-500 hover:text-rose-300 disabled:opacity-50">
                          <X size={16} />
                        </button>
                      )}
                      <button onClick={() => remove(r.id)} className="text-neutral-500 hover:text-neutral-300"><Trash2 size={16} /></button>
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

function Stat({ title, value, accent }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
      <div className="text-[10px] uppercase text-neutral-500 tracking-widest">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-yellow-500" : "text-white"}`}>{value}</div>
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