import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Sparkles, Check, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

const ICONS = [Users, Briefcase, Sparkles];

/* ZMENA: Farebné akcenty zjednotené do našej luxusnej korporátnej zlaté, 
   aby karty nepôsobili príliš prekombinovane a pestro */
const ACCENTS = [
  { bg: "bg-[#dfb144]/10", text: "text-[#cc9f37]" },
  { bg: "bg-[#dfb144]/10", text: "text-[#cc9f37]" },
  { bg: "bg-[#dfb144]/10", text: "text-[#cc9f37]" },
];

export default function Audiences() {
  const { tr } = useLang();
  const cards = tr("audiences.cards");

  return (
    <section id="audiences" className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-12">
          {/* ZMENA: Overline upravený do našej zlatej farby */}
          <div className="overline mb-5 text-[#dfb144]">{tr("audiences.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("audiences.title")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {(Array.isArray(cards) ? cards : []).map((c, i) => {
            const Icon = ICONS[i % ICONS.length];
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={i}
                data-testid={`audience-card-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                /* ZMENA: Pridaný jemný elegantný border pre karty s decentným prechodom */
                className="surface-card p-7 md:p-8 flex flex-col border border-zinc-100 hover:border-[#dfb144]/20 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent.bg} ${accent.text}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-xs tracking-[0.18em] uppercase font-semibold text-zinc-400">{c.tag}</div>
                </div>
                <h3 className="mt-5 font-display text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed text-sm md:text-base">{c.body}</p>
                <ul className="mt-5 space-y-2 flex-1">
                  {(c.bullets || []).map((b, k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-slate-700">
                      {/* ZMENA: Fajky odrážok preklopené zo starej modrej na čistú zlatú */}
                      <Check size={15} className="text-[#dfb144] mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                
                {/* ZMENA: Tlačidlo preklopené z modrého hover efektu do prémiového čierneho dizajnu (bg-zinc-950 a biely text na hover) */}
                <a
                  href="#contact"
                  data-testid={`audience-cta-${i}`}
                  className="mt-7 inline-flex items-center justify-between gap-2 px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all duration-300 text-sm font-semibold"
                >
                  {tr("audiences.cta")} <ArrowRight size={16} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}