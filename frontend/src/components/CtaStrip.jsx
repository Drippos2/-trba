import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function CtaStrip({ onBookClick }) {
  const { tr } = useLang();
  return (
    <section className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-sky-50 via-white to-sky-100 border border-slate-200 p-10 md:p-16"
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[color:var(--accent)] opacity-10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-sky-300 opacity-10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="overline mb-5">{tr("cta.overline")}</div>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight whitespace-pre-line text-slate-900">
              {tr("cta.title")}
            </h2>
            <p className="mt-6 text-slate-600 text-base md:text-lg max-w-xl">{tr("cta.body")}</p>
            <button
              data-testid="cta-book-btn"
              onClick={onBookClick}
              className="btn-primary mt-9"
            >
              {tr("cta.btn")} <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
