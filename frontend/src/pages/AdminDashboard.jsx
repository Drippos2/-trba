import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Calendar, MessageSquare, Trash2, Check, X } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import Logo from "@/components/Logo";

const STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function AdminDashboard() {
  const { user, ready, logout } = useAuth();
  const { tr } = useLang();
  const [tab, setTab] = useState("reservations");
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, revenue: 0 });
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, r, c] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/reservations"),
        api.get("/contact"),
      ]);
      setStats(s.data);
      setReservations(r.data);
      setMessages(c.data);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user) load();
  }, [ready, user]);

  if (!ready) return null;
  if (!user) return <Navigate to="/admin/login" replace />;

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}`, { status });
      await load();
      toast.success("Status updated");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete reservation?")) return;
    try {
      await api.delete(`/reservations/${id}`);
      await load();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg-soft)] text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3" data-testid="admin-home-link">
            <Logo size={40} />
            <div className="hidden sm:block pl-3 border-l border-slate-200">
              <div className="text-[10px] tracking-[0.3em] text-slate-500">ADMIN PANEL</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="hidden sm:block">{user.email}</span>
            <button
              onClick={logout}
              className="btn-ghost inline-flex items-center gap-2 text-sm"
              data-testid="admin-logout-btn"
            >
              <LogOut size={14} /> {tr("admin.logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Stat title={tr("admin.total")} value={stats.total} testid="stat-total" />
          <Stat title={tr("admin.pending")} value={stats.pending} testid="stat-pending" />
          <Stat title={tr("admin.confirmed")} value={stats.confirmed} testid="stat-confirmed" />
          <Stat title={tr("admin.cancelled")} value={stats.cancelled} testid="stat-cancelled" />
          <Stat title={tr("admin.revenue")} value={`€${stats.revenue.toFixed(0)}`} testid="stat-revenue" accent />
        </div>

        <div className="flex gap-2 mb-6">
          <TabBtn active={tab === "reservations"} onClick={() => setTab("reservations")} icon={Calendar} testid="tab-reservations">
            {tr("admin.reservations")} ({reservations.length})
          </TabBtn>
          <TabBtn active={tab === "messages"} onClick={() => setTab("messages")} icon={MessageSquare} testid="tab-messages">
            {tr("admin.messages")} ({messages.length})
          </TabBtn>
        </div>

        {loading ? (
          <div className="text-slate-500 p-6">Loading…</div>
        ) : tab === "reservations" ? (
          <div className="surface-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="reservations-table">
                <thead className="bg-slate-50 text-left text-xs tracking-[0.15em] uppercase text-slate-500">
                  <tr>
                    <th className="p-4 font-medium">{tr("admin.guest")}</th>
                    <th className="p-4 font-medium">{tr("admin.dates")}</th>
                    <th className="p-4 font-medium">Room</th>
                    <th className="p-4 font-medium">{tr("admin.price")}</th>
                    <th className="p-4 font-medium">{tr("admin.status")}</th>
                    <th className="p-4 font-medium text-right">{tr("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">No reservations yet.</td>
                    </tr>
                  )}
                  {reservations.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-slate-100 hover:bg-slate-50/50"
                      data-testid={`reservation-row-${r.id}`}
                    >
                      <td className="p-4">
                        <div className="font-display font-semibold text-slate-900">
                          {r.first_name} {r.last_name}
                        </div>
                        <div className="text-slate-500 text-xs">{r.email}</div>
                        <div className="text-slate-500 text-xs">{r.phone}</div>
                      </td>
                      <td className="p-4 text-slate-700">
                        <div>{r.check_in}</div>
                        <div className="text-slate-500">→ {r.check_out}</div>
                        <div className="text-slate-400 text-xs">{r.nights} nights</div>
                      </td>
                      <td className="p-4 text-slate-700">
                        {r.room_name}
                        <div className="text-slate-500 text-xs">{r.guests_adults} + {r.guests_children}</div>
                      </td>
                      <td className="p-4 font-display font-semibold text-[color:var(--accent)]">
                        €{r.total_price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded-md border uppercase tracking-wider font-medium ${STATUS_BADGE[r.status] || ""}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {r.status !== "confirmed" && (
                          <button
                            onClick={() => updateStatus(r.id, "confirmed")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs"
                            data-testid={`confirm-${r.id}`}
                          >
                            <Check size={12} /> {tr("admin.markConfirmed")}
                          </button>
                        )}
                        {r.status !== "cancelled" && (
                          <button
                            onClick={() => updateStatus(r.id, "cancelled")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs"
                            data-testid={`cancel-${r.id}`}
                          >
                            <X size={12} /> {tr("admin.markCancelled")}
                          </button>
                        )}
                        <button
                          onClick={() => remove(r.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs"
                          data-testid={`delete-${r.id}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4" data-testid="messages-list">
            {messages.length === 0 && <div className="text-slate-400 p-6">No messages.</div>}
            {messages.map((m) => (
              <div key={m.id} className="surface-card p-6" data-testid={`message-${m.id}`}>
                <div className="flex justify-between">
                  <div className="font-display font-semibold text-slate-900">{m.name}</div>
                  <div className="text-xs text-slate-400">{new Date(m.created_at).toLocaleString()}</div>
                </div>
                <div className="text-slate-500 text-xs mt-1">{m.email} · {m.phone || "—"}</div>
                {m.subject && <div className="text-[color:var(--accent)] text-sm mt-3 font-medium">{m.subject}</div>}
                <p className="mt-3 text-slate-700 leading-relaxed text-sm">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ title, value, testid, accent }) {
  return (
    <div className="surface-card p-5 md:p-6" data-testid={testid}>
      <div className="text-xs tracking-[0.18em] uppercase text-slate-500">{title}</div>
      <div
        className={`mt-2 font-display text-2xl md:text-3xl font-semibold ${
          accent ? "text-[color:var(--accent)]" : "text-slate-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children, testid }) {
  return (
    <button
      data-testid={testid}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
        active
          ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)] shadow-md shadow-sky-200"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
      }`}
    >
      <Icon size={15} />
      {children}
    </button>
  );
}
