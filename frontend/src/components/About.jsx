import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function About() {
  const { tr } = useLang();
  const stats = tr("about.stats");
  return (
    <section id="about" className="section bg-white">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <motion.div
          className="lg:col-span-5 lg:sticky lg:top-28"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fade}
        >
          {/* ZMENA: Vynútené preklopenie overline do korporátnej zlatej farby pomocou !text-[#dfb144] */}
          <div className="overline mb-6 !text-[#dfb144]">{tr("about.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("about.title")}
          </h2>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fade}
        >
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
            {tr("about.body")}
          </p>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Array.isArray(stats) ? stats : []).map((s, i) => (
              <div
                key={i}
                data-testid={`about-stat-${i}`}
                /* ZMENA: Pridané jemné orámovanie a plynulý prechod pre zjednotenie dizajnu štatistických boxov */
                className="surface-card p-6 border border-zinc-100 hover:border-[#dfb144]/20 transition-all duration-300 shadow-sm"
              >
                <div className="font-display text-3xl md:text-4xl text-zinc-900 tracking-tight font-semibold">
                  {s.value}
                </div>
                <div className="mt-2 text-xs tracking-[0.18em] uppercase text-zinc-400 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}