import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Waves, Sparkles, ArrowRight, Home } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Základné ikony pre pôvodné wellness položky
const ICONS = [Flame, Droplets, Waves, Sparkles];

// Kompletné pole obrázkov vrátane nových troch súborov a, b, c
const WELLNESS_IMAGES = [
  "/sauna.jpg",      // 1. Infra sauna
  null,              // 2. Vírivá vaňa (bez obrázka)
  "/oddychova.jpg",  // 3. Oddychová zóna
  null,              // 4. Záložná karta ak existuje
  "/a.jpg",          // 5. Nová fotka A
  "/b.jpg",          // 6. Nová fotka B
  "/c.jpg",          // 7. Nová fotka C
];

export default function Wellness() {
  const { tr } = useLang();
  const rawItems = tr("wellness.items");
  
  // Zabezpečíme, že máme pole pôvodných položiek
  const baseItems = Array.isArray(rawItems) ? rawItems : [];

  // Vytvorenie výsledného zoznamu bubliniek vrátane 3 nových fotiek
  const allItems = [
    ...baseItems,
    // Ak by v JSON prekladoch chýbali indexy 4, 5, 6, použijú sa tieto slovenské texty
    { 
      t: baseItems[4]?.t || "Penzión Štrba - Pohľad spredu", 
      d: baseItems[4]?.d || "Exteriér a hlavný vstup do budovy" 
    },
    { 
      t: baseItems[5]?.t || "Areál penziónu", 
      d: baseItems[5]?.d || "Pohľad na ubytovaciu časť z boku" 
    },
    { 
      t: baseItems[6]?.t || "Ubytovacie krídlo", 
      d: baseItems[6]?.d || "Detailná snímka komplexu penziónu" 
    }
  ];

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

        {/* PRAVÁ STRANA: Grid so všetkými bublinkami (pôvodné + 3 nové) */}
        <motion.div
          className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {allItems.map((it, i) => {
            // Pre prvé 4 položky použijeme pôvodné ikony, pre nové fotky (a,b,c) priradíme ikonu domčeka (Home)
            const Icon = i < baseItems.length ? ICONS[i % ICONS.length] : Home;
            const imagePath = WELLNESS_IMAGES[i];

            return (
              <div
                key={i}
                data-testid={`wellness-item-${i}`}
                onClick={() => setActiveItem({ ...it, image: imagePath, Icon })} // Otvorí detail
                className="p-6 md:p-7 min-h-[180px] flex flex-col justify-between group border border-zinc-100 bg-white rounded-3xl hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 shadow-sm"
              >
                <div>
                  {/* Ikona */}
                  <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] transition-all duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950 mb-4">
                    <Icon size={20} />
                  </div>

                  {/* Náhľadová fotka v karte */}
                  {imagePath && (
                    <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-zinc-50 relative flex items-center justify-center border border-zinc-100/50">
                      <img 
                        src={imagePath} 
                        alt={it.t} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-[#cc9f37] transition-colors mt-2">
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

      {/* ANiMOVANÉ VYSKAKOVACIE OKNO (MODAL DETAIl) */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div 
              className="bg-white rounded-[32px] overflow-hidden max-w-lg w-full shadow-2xl relative border border-zinc-100 my-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tlačidlo X na zatvorenie */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors z-50 backdrop-blur-sm border border-zinc-200"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Fotka s chránenou kompaktnou výškou na PC */}
              {activeItem.image ? (
                <div className="w-full h-64 md:h-80 bg-zinc-950 flex items-center justify-center relative">
                  <img 
                    src={activeItem.image} 
                    alt={activeItem.t} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center text-[#cc9f37]">
                  <activeItem.Icon size={40} strokeWidth={1.5} />
                </div>
              )}

              {/* Textový obsah pod fotkou */}
              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={14} />
                  </div>
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Detail zóny</span>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-zinc-900 mb-1.5">
                  {activeItem.t}
                </h3>
                <p className="text-[#cc9f37] text-xs font-medium mb-3">
                  {activeItem.d}
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Užite si maximálny relax a príjemné prostredie v našom modernom komplexe v Štrbe. Naše priestory sú kompletne pripravené poskytnúť vám dokonalé zázemie a komfort počas vášho celého pobytu v regióne Vysokých Tatier.
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
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