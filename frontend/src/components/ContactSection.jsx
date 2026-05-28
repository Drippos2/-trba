import React, { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { api, formatApiError } from "@/lib/api"; // PRIDANÝ IMPORT formatApiError

import { useLang } from "@/contexts/LangContext";

export default function ContactSection() {
  const { lang, tr } = useLang();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // OPRAVA: Prefix /api/
      await api.post("/api/contact", { ...form, language: lang });
      toast.success(tr("contact.sent"));
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section bg-white">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="overline mb-5 text-[#dfb144]">{tr("contact.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("contact.title")}
          </h2>

          <div className="mt-10 space-y-5 text-slate-700">
            <a
              href="tel:+421949334341"
              className="flex items-center gap-4 group hover:text-zinc-950 transition-colors"
              data-testid="contact-phone"
            >
              <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] shrink-0 group-hover:scale-105 transition-all duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 tracking-wider uppercase">Telefón</div>
                <div className="font-display font-semibold">+421 949 334 341</div>
              </div>
            </a>
            <a
              href="mailto:info@penzion-strba.sk"
              className="flex items-center gap-4 group hover:text-zinc-950 transition-colors"
              data-testid="contact-email"
            >
              <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] shrink-0 group-hover:scale-105 transition-all duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 tracking-wider uppercase">Email</div>
                <div className="font-display font-semibold">info@penzion-strba.sk</div>
              </div>
            </a>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-500 tracking-wider uppercase">Adresa</div>
                <div className="font-display font-semibold text-zinc-900">Horská 1130/31</div>
                <div className="text-slate-500 text-sm">059 41 Tatranská Štrba</div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="lg:col-span-7 surface-card p-7 md:p-10 space-y-4 border border-zinc-100 hover:border-[#dfb144]/20 transition-colors duration-300 shadow-sm"
          data-testid="contact-form"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input-light focus:border-[#dfb144] focus:ring-1 focus:ring-[#dfb144] transition-all"
              name="name"
              placeholder={tr("contact.name")}
              value={form.name}
              onChange={onChange}
              required
              data-testid="contact-name"
            />
            <input
              className="input-light focus:border-[#dfb144] focus:ring-1 focus:ring-[#dfb144] transition-all"
              name="email"
              type="email"
              placeholder={tr("contact.email")}
              value={form.email}
              onChange={onChange}
              required
              data-testid="contact-email-input"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input-light focus:border-[#dfb144] focus:ring-1 focus:ring-[#dfb144] transition-all"
              name="phone"
              placeholder={tr("contact.phone")}
              value={form.phone}
              onChange={onChange}
              data-testid="contact-phone-input"
            />
            <input
              className="input-light focus:border-[#dfb144] focus:ring-1 focus:ring-[#dfb144] transition-all"
              name="subject"
              placeholder={tr("contact.subject")}
              value={form.subject}
              onChange={onChange}
              data-testid="contact-subject"
            />
          </div>
          <textarea
            className="input-light min-h-[160px] resize-y focus:border-[#dfb144] focus:ring-1 focus:ring-[#dfb144] transition-all"
            name="message"
            placeholder={tr("contact.message")}
            value={form.message}
            onChange={onChange}
            required
            data-testid="contact-message"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="contact-submit"
            className="btn-primary disabled:opacity-60 transition-all duration-300"
          >
            {loading ? "..." : tr("contact.send")} <Send size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}