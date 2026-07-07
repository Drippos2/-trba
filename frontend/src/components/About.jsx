import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import { Home, Trees, Compass } from "lucide-react"; // Prémiové ikony pre exteriér

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function About() {
  const { tr, lang } = useLang();
  const stats = tr("about.stats");

  // Fixne definované dáta pre presunuté exteriérové bublinky s automatickým prekladom podľa jazyka
  const aboutItems = [
    {
      image: "/a.webp",
      fallbackImage: "/a.webp",
      Icon: Compass,
      ...(lang === "en" 
        ? { t: "Pension Štrba - Front view", d: "Exterior and main entrance to the building" }
        : lang === "de"
        ? { t: "Pension Štrba - Vorderansicht", d: "Außenansicht und Haupteingang des Gebäudes" }
        : { t: "Penzión Štrba - Pohľad spredu", d: "Exteriér a hlavný vstup do budovy" }
      )
    },
    {
      image: "/b.webp",
      fallbackImage: "/b.webp",
      Icon: Trees,
      ...(lang === "en" 
        ? { t: "Pension area", d: "Side view of the accommodation part" }
        : lang === "de"
        ? { t: "Pensionareal", d: "Seitenansicht des Unterkunftsteils" }
        : { t: "Areál penziónu", d: "Pohľad na ubytovaciu časť z boku" }
      )
    },
    {
      image: "/c.webp",
      fallbackImage: "/c.webp",
      Icon: Home,
      ...(lang === "en" 
        ? { t: "Accommodation wing", d: "Detailed shot of the pension complex" }
        : lang === "de"
        ? { t: "Unterkunftstrakt", d: "Detailaufnahme des Pensionskomplexes" }
        : { t: "Ubytovacie krídlo", d: "Detailná snímka komplexu penziónu" }
      )
    }
  ];

  // Stav pre otvorené vyskakovacie okno (Modal)
  const [activeItem, setActiveItem] = useState(null);

  // Sledovanie ciest obrázkov kvôli chybám s veľkosťou písma prípon (.jpg vs .JPG)
  const [currentImages, setCurrentImages] = useState({});
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    const initialImages = {};
    aboutItems.forEach((item, index) => {
      if (item.image) {
        initialImages[index] = item.image;
      }
    });
    setCurrentImages(initialImages);
  }, [lang]); // Pridaná závislosť na jazyku pre správne obnovenie pri prepnutí

  const handleImageError = (index, item) => {
    if (currentImages[index] === item.image && item.fallbackImage) {
      setCurrentImages((prev) => ({ ...prev, [index]: item.fallbackImage }));
    } else {
      setFailedImages((prev) => ({ ...prev, [index]: true }));
    }
  };

  // Blokovanie scrollovania pozadia, keď je detail fotky otvorený
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
    <section id="about" className="section bg-white relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HORNÁ ČASŤ: O Penzióne + Štatistiky */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <motion.div
            className="lg:col-span-5 lg:sticky lg:top-28"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fade}
          >
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
                  className="surface-card p-6 border border-zinc-100 hover:border-[#dfb144]/20 transition-all duration-300 shadow-sm rounded-2xl bg-white"
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

        {/* DOLNÁ ČASŤ: Nová sekcia s exteriérovými bublinkami presunutými z Wellness */}
        <motion.div 
          className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={fade}
        >
          {aboutItems.map((it, i) => {
            const Icon = it.Icon;
            const imgSrc = currentImages[i];
            const isFailed = failedImages[i];

            return (
              <div
                key={i}
                data-testid={`about-item-${i}`}
                onClick={() => setActiveItem({ ...it, originalIndex: i })}
                className="p-6 min-h-[240px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-3xl bg-white shadow-sm"
              >
                <div>
                  {/* Ikona */}
                  <div className="w-10 h-10 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  
                  {/* Fotka exteriéru */}
                  {it.image && (
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-zinc-50 relative flex items-center justify-center border border-zinc-100/50">
                      {imgSrc && !isFailed ? (
                        <img 
                          src={imgSrc} 
                          alt={it.t} 
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
                  <div className="font-display text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-[#cc9f37] transition-colors mt-2">
                    {it.t}
                  </div>
                  <div className="mt-1.5 text-zinc-500 text-sm flex justify-between items-center">
                    <span>{it.d}</span>
                    <span className="text-[#dfb144] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-base ml-2">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>

      {/* ANiMOVANÉ VYSKAKOVACIE OKNO (MODAL DETAIl PRE FOTKY) */}
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

              {/* Veľká fotka v modale */}
              {activeItem.image && !failedImages[activeItem.originalIndex] ? (
                <div className="w-full h-64 md:h-80 bg-zinc-950 flex items-center justify-center relative">
                  <img 
                    src={currentImages[activeItem.originalIndex]} 
                    alt={activeItem.t} 
                    onError={() => handleImageError(activeItem.originalIndex, activeItem)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center text-[#cc9f37]">
                  <activeItem.Icon size={40} strokeWidth={1.5} />
                </div>
              )}

              {/* Text pod fotkou */}
              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={14} />
                  </div>
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Pension Štrba" : lang === "de" ? "Pension Štrba" : "Penzión Štrba"}
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-zinc-900 mb-1.5">
                  {activeItem.t}
                </h3>
                <p className="text-[#cc9f37] text-xs font-medium mb-3">
                  {activeItem.d}
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {lang === "en"
                    ? "View of the architecture and beautiful grounds of our pension in Štrba. The location offers ideal conditions for relaxation and exploring the beauty of the High Tatras throughout the year."
                    : lang === "de"
                    ? "Blick auf die Architektur und das schöne Gelände unserer Pension in Štrba. Die Lage bietet das ganze Jahr über ideale Bedingungen für Erholung und das Erkunden der Schönheit der Hohen Tatra."
                    : "Pohľad na architektúru a krásny areál nášho penziónu v Štrbe. Lokalita ponúka ideálne podmienky na relax a spoznávanie krás Vysokých Tatier počas celého roka."}
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
                  >
                    {lang === "en" ? "Close" : lang === "de" ? "Schließen" : "Zatvoriť"}
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