import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Snowflake, Sparkles, MapPin, ExternalLink } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function Location() {
  const { tr } = useLang();
  const [tab, setTab] = useState("summer");

  const tabs = [
    { id: "summer", icon: Sun, labelKey: "location.summer", items: tr("location.summerItems") },
    { id: "winter", icon: Snowflake, labelKey: "location.winter", items: tr("location.winterItems") },
    { id: "relax", icon: Sparkles, labelKey: "location.relax", items: tr("location.relaxItems") },
  ];
  const active = tabs.find((t) => t.id === tab);

  return (
    <section id="location" className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-12">
          {/* ZMENA: Overline jemne podfarbený do našej zlatej */}
          <div className="overline mb-5 text-[#dfb144]">{tr("location.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-slate-900">
            {tr("location.title")}
          </h2>
          <p className="mt-5 text-slate-600 text-base md:text-lg">{tr("location.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                data-testid={`location-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  active
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md shadow-zinc-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#dfb144] hover:text-slate-900"
                }`}
              >
                <Icon size={15} className={active ? "text-[#dfb144]" : ""} />
                {tr(t.labelKey)}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {(Array.isArray(active?.items) ? active.items : []).map((item, i) => (
              <div
                key={item}
                data-testid={`location-item-${tab}-${i}`}
                className="surface-card p-6 min-h-[140px] flex flex-col justify-between border border-slate-100 hover:border-[#dfb144]/40 transition-colors duration-300"
              >
                <div className="overline text-[#dfb144]">0{i + 1}</div>
                <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-slate-900">{item}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface-card p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <div className="overline mb-1 text-[#dfb144]">Adresa</div>
                <div className="font-display text-2xl font-semibold text-slate-900">Horská 1130/31</div>
                <div className="text-slate-500 mt-1">059 41 Tatranská Štrba, Slovensko</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Auto</div>
                <div className="font-display font-semibold text-slate-900">5 min</div>
                <div className="text-xs text-slate-500">diaľnica</div>
              </div>
              <div>
                <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Vlak</div>
                <div className="font-display font-semibold text-slate-900">10 min</div>
                <div className="text-xs text-slate-500">pešo</div>
              </div>
              <div>
                <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Bus</div>
                <div className="font-display font-semibold text-slate-900">5 min</div>
                <div className="text-xs text-slate-500">zastávka</div>
              </div>
            </div>
            <a
              data-testid="location-map-link"
              href="https://maps.google.com/?q=Horská+1130/31,+Tatranská+Štrba"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 text-sm font-semibold transition-all duration-300 mt-6 self-start"
            >
              Otvoriť v Google Maps <ExternalLink size={14} />
            </a>
          </div>

          <div className="lg:col-span-7 rounded-[12px] overflow-hidden border border-slate-200 surface-card !p-0">
            <iframe
              data-testid="location-map-embed"
              title="Penzión Štrba — Google Maps"
              /* SEM VLOŽ SVOJ REÁLNY EMBED LINK Z GOOGLE MAPS */
              src="https://www.google.com/maps?q=Horsk%C3%A1+1130%2F31%2C+059+41+Tatransk%C3%A1+%C5%A0trba&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 380, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </div>
    </section>
  );
}