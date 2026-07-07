import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

export default function CtaStrip({ onBookClick }) {
  const { tr } = useLang();

  // Táto podmienka skontroluje, či existuje text pre titulok. 
  // Ak si ho z prekladov vymazal, komponent nevráti nič a zmizne aj ten modrý box so šípkou.
  if (!tr("cta.title")) {
    return null;
  }

  return (
    <section className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          /* Preklopené zo svetlomodrej (sky) do elegantnej neutrálnej sivej s mäkkým prechodom */
          className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-zinc-50 via-white to-zinc-100 border border-zinc-200 p-10 md:p-16"
        >
          {/* Dekoratívne rozmazané kruhy v pozadí zmenené z modrej na teplú zlatú s jemnou priesvitnosťou */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#dfb144] opacity-10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-[#dfb144] opacity-5 blur-3xl" />

          <div className="relative max-w-3xl">
            {/* OPRAVA PRE PAGESPEED CONTRAST: Farba textu jemne stmavená na #c29630, aby prešla testom čitateľnosti na svetlom pozadí */}
            <div className="overline mb-5 text-[#c29630] font-medium tracking-wider uppercase text-xs">
              {tr("cta.overline")}
            </div>
            
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.04] tracking-tight whitespace-pre-line text-slate-900">
              {tr("cta.title")}
            </h2>
            <p className="mt-6 text-slate-600 text-base md:text-lg max-w-xl">
              {tr("cta.body")}
            </p>
            
            {/* Tlačidlo upravené na oválne, zlaté, s čiernym písmom presne podľa štýlu z hlavnej stránky */}
            <button
              data-testid="cta-book-btn"
              onClick={onBookClick}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-slate-900 bg-[#dfb144] hover:bg-[#cc9f37] rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:scale-102 mt-9 min-h-[44px]"
            >
              {tr("cta.btn")} 
              <ArrowRight size={16} className="shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}