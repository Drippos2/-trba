import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Coffee,
  ParkingCircle,
  Snowflake,
  Mountain,
  ChefHat,
  GraduationCap,
  Baby,
  Wifi,
  Smile
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function Services() {
  const { tr } = useLang();
  const rawItems = tr("services.items");
  const baseItems = Array.isArray(rawItems) ? rawItems : [];

  // FIXNÉ SPÁROVANIE Služieb s presnými fotkami a ikonami
  const allItems = [
    {
      t: baseItems[0]?.t || "Reštaurácia & Pizzeria",
      d: baseItems[0]?.d || "Tradičné jedlá aj skvelá pizza",
      image: "/pizzeria.jpg",
      Icon: UtensilsCrossed
    },
    {
      t: baseItems[1]?.t || "Jedáleň / Kuchynky na poschodí",
      d: baseItems[1]?.d || "Kompletne vybavené pre hostí",
      image: "/kuch.jpg",
      Icon: ChefHat
    },
    {
      t: baseItems[2]?.t || "Raňajkový bufet / Školiaca miestnosť",
      d: baseItems[2]?.d || "Bohaté raňajky pre štart do dňa",
      image: null, // Majiteľ nedodal fotku - zrušené
      Icon: Coffee
    },
    {
      t: baseItems[3]?.t || "Wifi zdarma",
      d: baseItems[3]?.d || "Vysokorýchlostný internet v celom objekte",
      image: "/wifi.jpg",
      Icon: Wifi
    },
    {
      t: baseItems[4]?.t || "Bezplatné parkovanie",
      d: baseItems[4]?.d || "Priamo pred objektom penziónu",
      image: "/parkovanie.jpg",
      Icon: ParkingCircle
    },
    {
      t: baseItems[5]?.t || "Nefajčiarsky objekt",
      d: baseItems[5]?.d || "Čisté a bezpečné prostredie pre všetkých",
      image: "/nefajci.jpg",
      Icon: Snowflake
    },
    {
      t: baseItems[6]?.t || "Lyžiareň",
      d: baseItems[6]?.d || "Bezpečné odkladanie lyží a snowboardov",
      image: "/lyziaren.jpg",
      Icon: Mountain
    },
    {
      t: baseItems[7]?.t || "Požičovňa lyží",
      d: baseItems[7]?.d || "Zľavy na lyžiarsku výstroj pre hostí",
      image: "/pozicovna.jpg", // Opravená nefunkčná fotka
      Icon: GraduationCap
    },
    {
      t: baseItems[8]?.t || "Detský kútik",
      d: baseItems[8]?.d || "Zábava pre vaše ratolesti",
      image: "/kutik.jpg", // Opravená fotka kútika
      Icon: Baby
    }
  ];

  // Stav pre otvorené vyskakovacie okno
  const [activeItem, setActiveItem] = useState(null);

  // Blokovanie scrollovania pozadia
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
    <section id="services" className="section bg-white relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold tracking-wider uppercase mb-5 text-[#dfb144]">
            {tr("services.overline")}
          </div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("services.title")}
          </h2>
        </div>

        {/* Mriežka s bublinkami */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allItems.map((it, i) => {
            const Icon = it.Icon;

            return (
              <motion.div
                key={i}
                data-testid={`service-item-${i}`}
                className="p-6 min-h-[240px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-3xl bg-white shadow-sm"
                onClick={() => setActiveItem(it)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                <div>
                  {/* Ikona */}
                  <div className="w-10 h-10 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  
                  {/* Náhľadová fotka (ak existuje) */}
                  {it.image && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-zinc-50 relative border border-zinc-100/50">
                      <img 
                        src={it.image} 
                        alt={it.t} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* VYSKAKOVACIE OKNO (MODAL) */}
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
              {/* Horné tlačidlo X v rohu */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors z-50 backdrop-blur-sm border border-zinc-200"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Veľký obrázok alebo záložný blok s ikonou */}
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
                <div className="w-full h-36 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center text-[#cc9f37]">
                  <activeItem.Icon size={44} strokeWidth={1.5} />
                </div>
              )}

              {/* Obsah pod fotkou */}
              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={14} />
                  </div>
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">Detail služby</span>
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-zinc-900 mb-1.5">
                  {activeItem.t}
                </h3>
                <p className="text-[#cc9f37] text-xs font-medium mb-3">
                  {activeItem.d}
                </p>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  V našom penzióne dbáme na maximálne pohodlie, čistotu a spokojnosť hostí. Táto služba je plne k dispozícii pre všetkých ubytovaných návštevníkov počas celého pobytu u nás v Štrbe.
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