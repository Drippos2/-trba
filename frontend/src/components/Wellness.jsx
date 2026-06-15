import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Waves, Sparkles, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const ICONS = [Flame, Droplets, Waves, Sparkles];

// Priradenie tvojich fotiek z public priečinka pre wellness sekciu
const WELLNESS_IMAGES = [
  "/sauna.jpg",          // 1. Infra sauna
  "/wellnes.jpg",        // 2. Vírivá vaňa
  "/oddychchova.jpg",    // 3. Oddychová zóna
  "/wellnes.jpg",        // 4. Záložná / Štvrtá karta ak existuje
];

export default function Wellness() {
  const { tr } = useLang();
  const items = tr("wellness.items");

  // Stav pre otvorené vyskakovacie okno (Modal)
  const [activeItem, setActiveItem] = useState(null);

  // Blokovanie scrollovania pozadia, keď je detail otvorený
  useEffect(() => {
    if (activeItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeItem]);

  return (
    <section id="wellness" className="section bg-white relative">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 items-start">
        
        {/* ĽAVÁ STRANA: Nadpisy a informácie o cene */}
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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

          <div>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 bg-zinc-900 hover:bg-[#dfb144] text-white hover:text-zinc-950 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm"
            >
              {tr("nav.book")} <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        {/* PRAVÁ STRANA: Grid s wellness bublinkami */}
        <motion.div
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {(Array.isArray(items) ? items : []).map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            const imagePath = WELLNESS_IMAGES[i % WELLNESS_IMAGES.length] || "/wellnes.jpg";

            return (
              <div
                key={i}
                data-testid={`wellness-item-${i}`}
                onClick={() => setActiveItem({ ...it, image: imagePath, Icon })} // Po kliknutí otvorí detail s fotkou
                className="p-6 md:p-7 min-h-[280px] flex flex-col justify-between group border border-zinc-100 bg-white rounded-3xl hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Ikona */}
                  <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] transition-all duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950 mb-4">
                    <Icon size={20} />
                  </div>

                  {/* NOVÉ: Náhľadová fotka priamo vo wellness karte */}
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-zinc-100 relative">
                    <img 
                      src={imagePath} 
                      alt={it.t} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-[#cc9f37] transition-colors">
                    {it.t}
                  </div>
                  <div className="mt-1.5 text-slate-500 text-sm flex justify-between items-center">
                    <span>{it.d}</span>
                    <span className="text-[#dfb144] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-base ml-2">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* NOVÉ: ANiMOVANÉ VYSKAKOVACIE OKNO (MODAL DETAIl) */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div 
              className="bg-white rounded-[32px] overflow-hidden max-w-2xl w-full shadow-2xl relative border border-zinc-100"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tlačidlo X na zatvorenie */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-50 backdrop-blur-sm"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Veľká fotka wellness služby */}
              <div className="w-full h-64 md:h-85 bg-zinc-900 relative">
                <img 
                  src={activeItem.image} 
                  alt={activeItem.t} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Textový obsah pod fotkou */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={16} />
                  </div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Detail zóny</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 mb-2">
                  {activeItem.t}
                </h3>
                <p className="text-[#cc9f37] text-sm font-medium mb-3">
                  {activeItem.d}
                </p>
                <p className="text-zinc-600 text-base leading-relaxed">
                  Užite si maximálny relax a oddych v našom modernom wellness centre v Štrbe. Táto zóna je navrhnutá tak, aby poskytla dokonalú regeneráciu vášmu telu po aktívnom dni v regióne Vysokých Tatier.
                </p>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    Zatvoriť
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}