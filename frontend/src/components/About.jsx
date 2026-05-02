import React from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";

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
          <div className="overline mb-6">{tr("about.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
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
                className="surface-card p-6"
              >
                <div className="font-display text-3xl md:text-4xl text-slate-900 tracking-tight font-semibold">
                  {s.value}
                </div>
                <div className="mt-2 text-xs tracking-[0.18em] uppercase text-slate-500">
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
