import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
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
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const ICONS = [UtensilsCrossed, Coffee, ParkingCircle, Snowflake, Mountain, ChefHat, GraduationCap, Baby];

// Priradenie tvojich fotiek z public priečinka presne podľa poradia bubliniek na webe
const SERVICE_IMAGES = [
  "/pizzeria.jpg",     // 1. Reštaurácia & Pizzeria
  "/kuchynky.jpg",     // 2. Jedáleň / Kuchynky na poschodí
  "/oslava.jpg",       // 3. Raňajkový bufet / Školiaca miestnosť
  "/wifi.jpg",         // 4. Wifi zdarma
  "/parkovanie.jpg",   // 5. Bezplatné parkovanie
  "/nefajci.jpg",      // 6. Nefajčiarsky objekt
  "/lyziaren.jpg",     // 7. Lyžiareň
  "/pozicovna.jpg",    // 8. Požičovňa lyží
];

export default function Services() {
  const { tr } = useLang();
  const items = tr("services.items");

  // Stav pre otvorené vyskakovacie okno. Na začiatku je null (zatvorené).
  const [activeItem, setActiveItem] = useState(null);

  // Blokovanie scrollovania pozadia webu, keď je okno otvorené, aby to nelietalo hore-dole
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
    /* ZMENA: Pozadie sekcie preklopené zo starého var(--bg-soft) na elegantnú čistú bielu */
    <section id="services" className="section bg-white relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-14">
          {/* ZMENA: Overline jemne podfarbený našou zlatou farbou */}
          <div className="overline mb-5 text-[#dfb144]">{tr("services.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("services.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(items) ? items : []).map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            const imagePath = SERVICE_IMAGES[i % SERVICE_IMAGES.length] || "/wifi.jpg";

            return (
              <motion.div
                key={i}
                data-testid={`service-item-${i}`}
                /* ZMENA: Pridaný kurzor pointer, prechod a tieň pre lepšiu klikateľnosť */
                className="surface-card p-6 min-h-[260px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-3xl"
                onClick={() => setActiveItem({ ...it, image: imagePath, Icon })} // Kliknutím uložíme dáta bublinky do stavu
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                <div>
                  {/* Horná časť s ikonou */}
                  <div className="w-10 h-10 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  
                  {/* NOVÉ: Malá zaoblená fotka priamo vo vnútri bublinky pre krajší dizajn */}
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-zinc-100 relative">
                    <img 
                      src={imagePath} 
                      alt={it.t} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="font-display text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-[#cc9f37] transition-colors">
                    {it.t}
                  </div>
                  <div className="mt-1 text-zinc-500 text-sm flex justify-between items-center">
                    <span>{it.d}</span>
                    <span className="text-[#dfb144] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-base ml-2">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* NOVÉ: VYSKAKOVACIE OKNO (MODAL LIGHTBOX) */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[150] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)} // Kliknutie na tmavé pozadie zatvorí okno
          >
            {/* Telo okná */}
            <motion.div 
              className="bg-white rounded-[32px] overflow-hidden max-w-2xl w-full shadow-2xl relative border border-zinc-100"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()} // Zamedzí zatvoreniu okna, keď klikneš do vnútra na fotku/text
            >
              {/* Tlačidlo na zatvorenie v rohu (X) */}
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors z-50 backdrop-blur-sm"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Veľký obrázok v okne */}
              <div className="w-full h-64 md:h-85 bg-zinc-900 relative">
                <img 
                  src={activeItem.image} 
                  alt={activeItem.t} 
                  className="w-full h-full object-cover"
                />
                {/* Malý dizajnový prechod na spodku fotky */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Obsah a texty pod fotkou */}
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={16} strokeWidth={2} />
                  </div>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Detail služby</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-display font-bold text-zinc-900 mb-2">
                  {activeItem.t}
                </h3>
                <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
                  {activeItem.d} – V našom penzióne dbáme na maximálne pohodlie a spokojnosť hostí. Táto služba je plne k dispozícii počas celého vášho pobytu u nás v Štrbe.
                </p>

                {/* Spodné zatváracie tlačidlo pre lepšiu ovládateľnosť na mobile */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                  >
                    Zatvoriť detail
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