import React from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Sparkles, Check, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const ICONS = [Users, Briefcase, Sparkles];
const ACCENTS = [
  { bg: "bg-rose-50", text: "text-rose-500" },
  { bg: "bg-indigo-50", text: "text-indigo-500" },
  { bg: "bg-[color:var(--accent-soft)]", text: "text-[color:var(--accent)]" },
];

export default function Audiences() {
  const { tr } = useLang();
  const cards = tr("audiences.cards");

  return (
    <section id="audiences" className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="overline mb-5">{tr("audiences.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
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
                className="surface-card p-7 md:p-8 flex flex-col"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.bg} ${accent.text}`}>
                    <Icon size={20} />
                  </div>
                  <div className="text-xs tracking-[0.18em] uppercase font-semibold text-slate-500">{c.tag}</div>
                </div>
                <h3 className="mt-5 font-display text-xl md:text-2xl font-semibold tracking-tight text-slate-900 leading-tight">
                  {c.title}
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed text-sm md:text-base">{c.body}</p>
                <ul className="mt-5 space-y-2">
                  {(c.bullets || []).map((b, k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={15} className="text-[color:var(--accent)] mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                
                {/* ZMENA: Button zmenený na Anchor link smerujúci na #contact */}
                <a
                  href="#contact"
                  data-testid={`audience-cta-${i}`}
                  className="mt-7 inline-flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors text-sm font-medium"
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