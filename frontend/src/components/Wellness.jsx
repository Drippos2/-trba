import React from "react";
import { motion } from "framer-motion";
import { Flame, Droplets, Waves, Sparkles, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

const ICONS = [Flame, Droplets, Waves, Sparkles];

export default function Wellness({ onBookClick }) {
  const { tr } = useLang();
  const items = tr("wellness.items");

  return (
    <section id="wellness" className="section bg-white">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 items-start">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Použitý priamy Tailwind namiesto problematickej globálnej triedy */}
          <div className="text-xs font-semibold tracking-wider uppercase mb-5 text-[#dfb144]">
            {tr("wellness.overline")}
          </div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("wellness.title")}
          </h2>
          <p className="mt-6 text-slate-600 text-base md:text-lg max-w-md">
            {tr("wellness.subtitle")}
          </p>

          <div className="mt-10 p-6 inline-block border border-zinc-100 bg-zinc-50/50 shadow-sm rounded-2xl">
            <div className="text-[10px] font-semibold tracking-wider uppercase mb-2 text-[#dfb144]">
              price
            </div>
            <div className="font-display text-[#cc9f37] text-3xl md:text-4xl font-semibold">
              {tr("wellness.price")}
            </div>
            <div className="mt-1 text-slate-500 text-sm">{tr("wellness.note")}</div>
          </div>

          <button
            data-testid="wellness-book-btn"
            onClick={onBookClick}
            className="mt-8 inline-flex items-center gap-2 bg-zinc-900 hover:bg-[#dfb144] text-white hover:text-zinc-950 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm"
          >
            {tr("nav.book")} <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.div
          className="lg:col-span-7 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {(Array.isArray(items) ? items : []).map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                data-testid={`wellness-item-${i}`}
                className="p-6 md:p-7 min-h-[180px] flex flex-col justify-between group border border-zinc-100 bg-white rounded-2xl hover:border-[#dfb144]/30 transition-all duration-300 shadow-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] transition-colors duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-zinc-900">
                    {it.t}
                  </div>
                  <div className="mt-1.5 text-slate-500 text-sm">{it.d}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}