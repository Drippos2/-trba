import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Waves, ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// OPTIMALIZÁCIA: Statická štruktúra vytiahnutá mimo komponent, aby sa nepregenerovávala v pamäti pri každom renderi
const WELLNESS_STRUCTURE = [
  {
    keyIndex: 0,
    defaultTitle: "Infra sauna",
    defaultDesc: "40 – 65 °C • regenerácia svalov",
    image: "/sauna.webp",
    fallbackImage: "/sauna.webp",
    Icon: Flame
  },
  {
    keyIndex: 2,
    defaultTitle: "Oddychová zóna",
    defaultDesc: "Tlmené LED svetlo • ticho",
    image: "/oddychova.webp",
    fallbackImage: "/oddychova.webp",
    Icon: Waves
  },
  {
    keyIndex: 1,
    defaultTitle: "Vírivá vaňa",
    defaultDesc: "Hydromasáž • uvoľnenie",
    image: null,
    fallbackImage: null,
    Icon: Droplets
  }
];

export default function Wellness() {
  const { tr } = useLang();
  const rawItems = tr("wellness.items");
  const baseItems = Array.isArray(rawItems) ? rawItems : [];

  // Presné napárovanie textov z kontextu na našu pevnú štruktúru
  const allItems = WELLNESS_STRUCTURE.map((item) => ({
    ...item,
    t: baseItems[item.keyIndex]?.t || item.defaultTitle,
    d: baseItems[item.keyIndex]?.d || item.defaultDesc
  }));

  const [activeItem, setActiveItem] = useState(null);

  // Inicializácia stavu obrázkov pre ochranu pred CLS skokmi
  const [currentImages, setCurrentImages] = useState(() => {
    const initialImages = {};
    WELLNESS_STRUCTURE.forEach((item, index) => {
      if (item.image) initialImages[index] = item.image;
    });
    return initialImages;
  });
  
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (index, item) => {
    if (currentImages[index] === item.image && item.fallbackImage) {
      setCurrentImages((prev) => ({ ...prev, [index]: item.fallbackImage }));
    } else {
      setFailedImages((prev) => ({ ...prev, [index]: true }));
    }
  };

  // Blokovanie scrollovania pri otvorenom modale
  useEffect(() => {
    document.body.style.overflow = activeItem ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeItem]);

  return (
    <section id="wellness" className="section bg-white relative py-24">
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-12 items-start">
        
        {/* ĽAVÁ STRANA: Hlavička a cena */}
        <div className="lg:col-span-5">
          <div className="text-xs font-semibold tracking-wider uppercase mb-5 text-[#c29630]">
            {tr("wellness.overline")}
          </div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("wellness.title")}
          </h2>
          <p className="mt-6 text-slate-600 text-base md:text-lg max-w-md">
            {tr("wellness.subtitle")}
          </p>

          <div className="mt-10 p-6 inline-block border border-zinc-100 bg-zinc-50/50 shadow-sm rounded-2xl">
            <div className="text-[10px] font-bold tracking-wider uppercase mb-2 text-zinc-500">
              price
            </div>
            <div className="font-display text-[#b58924] text-3xl md:text-4xl font-semibold">
              {tr("wellness.price")}
            </div>
            <div className="mt-1 text-slate-500 text-sm">{tr("wellness.note")}</div>
          </div>

          <div className="mt-8">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-[#dfb144] text-white hover:text-zinc-950 px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-sm min-h-[44px]"
            >
              {tr("nav.book")} <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* PRAVÁ STRANA: Grid wellness kariet */}
        {/* OPTIMALIZÁCIA: Odstránený whileInView pre plynulejší chod na mobilných zariadeniach */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allItems.map((it, i) => {
            const Icon = it.Icon;
            const imgSrc = currentImages[i];
            const isFailed = failedImages[i];

            return (
              <div
                key={i}
                data-testid={`wellness-item-${i}`}
                onClick={() => setActiveItem({ ...it, originalIndex: i })}
                className="p-6 md:p-7 min-h-[180px] flex flex-col justify-between group border border-zinc-100 bg-white rounded-3xl hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 shadow-sm"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#b58924] transition-all duration-300 group-hover:bg-[#dfb144] group-hover:text-zinc-950 mb-4">
                    <Icon size={20} />
                  </div>

                  {it.image && (
                    <div className="w-full h-36 rounded-2xl overflow-hidden mb-4 bg-zinc-50 relative flex items-center justify-center border border-zinc-100/50">
                      {imgSrc && !isFailed ? (
                        <img 
                          src={imgSrc} 
                          alt={it.t} 
                          width="350"
                          height="144"
                          loading="lazy" // Správny odložený prenos obrázkov
                          onError={() => handleImageError(i, it)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-[#dfb144]/40">
                          <Icon size={32} strokeWidth={1.25} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-[#b58924] transition-colors mt-2">
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
        </div>
      </div>

      {/* MODAL DETAIL */}
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
              className="bg-white rounded-[32px] overflow-hidden max-w-lg w-full shadow-2xl relative border border-zinc-100"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors z-50 backdrop-blur-sm border border-zinc-200 min-w-[36px] min-h-[36px]"
                aria-label="Close"
              >
                ✕
              </button>

              {activeItem.image && !failedImages[activeItem.originalIndex] ? (
                <div className="w-full h-64 md:h-80 bg-zinc-950 flex items-center justify-center relative">
                  <img 
                    src={currentImages[activeItem.originalIndex]} 
                    alt={activeItem.t} 
                    width="512"
                    height="320"
                    onError={() => handleImageError(activeItem.originalIndex, activeItem)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center text-[#b58924]">
                  <activeItem.Icon size={40} strokeWidth={1.5} />
                </div>
              )}

              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#b58924]">
                    <activeItem.Icon size={14} />
                  </div>
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Detail zóny</span>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-zinc-900 mb-1.5">
                  {activeItem.t}
                </h3>
                <p className="text-[#b58924] text-xs font-medium mb-3">
                  {activeItem.d}
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {tr("wellness.description") || "Užite si maximálny relax a príjemné prostredie v našom modernom komplexe v Štrbe. Naše priestory sú kompletne pripravené poskytnúť vám dokonalé zázemie a komfort počas vášho celého pobytu v regióne Vysokých Tatier."}
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm min-h-[36px]"
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