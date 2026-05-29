import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Trash2, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api"; 

export default function AdminDashboard() {
  const { user, ready, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Načítame iba správy, keďže rezervácie sme zrušili
      const resContact = await api.get("/api/contact");
      setMessages(resContact.data.messages || []);
    } catch (err) {
      console.error("CHYBA API:", err.response ? err.response.data : err.message);
      toast.error("Nepodarilo sa načítať správy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && user) loadData();
  }, [ready, user]);

  const removeEntry = async (id) => {
    if (!window.confirm("Naozaj zmazať túto správu?")) return;
    try {
      await api.delete(`/api/contact/${id}`);
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
          <h1 className="text-xl font-bold text-yellow-500">PENZIÓN ŠTRBA - SPRÁVY</h1>
          <button onClick={logout} className="text-sm text-neutral-400 hover:text-white flex items-center gap-2">
            <LogOut size={16} /> Odhlásiť
          </button>
        </header>

        {loading ? (
          <div className="text-center p-20"><Loader2 className="animate-spin mx-auto text-yellow-500" size={32} /></div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="p-4">Klient</th>
                  <th className="p-4">Kontakt</th>
                  <th className="p-4">Predmet a Správa</th>
                  <th className="p-4 text-right">Akcia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {messages.map((item) => (
                  <tr key={item._id} className="hover:bg-neutral-800/30">
                    <td className="p-4 font-semibold">
                      {item.first_name} {item.last_name}
                    </td>
                    <td className="p-4 text-neutral-400 text-sm">
                      <div>{item.email}</div>
                      <div>{item.phone}</div>
                    </td>
                    <td className="p-4 text-neutral-300 text-sm">
                      <div className="font-bold text-yellow-600 mb-1">{item.subject}</div>
                      <div className="max-w-md italic">{item.message}</div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeEntry(item._id)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
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