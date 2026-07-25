import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Coffee,
  ParkingCircle,
  Snowflake,
  Mountain,
  ChefHat,
  Baby,
  Wifi,
  Sparkles,
  Cake,
  Users,
  Scroll 
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function Services() {
  const { tr, lang } = useLang();

  // Pole služieb definované napevno s priamym mapovaním na prekladové kľúče z i18n.js
  const allItems = [
    {
      t: tr("services.items.0.t"), // Reštaurácia & Pizzeria
      d: tr("services.items.0.d"),
      image: "/pizzeria.webp",
      fallbackImage: "/pizzeria.webp",
      Icon: UtensilsCrossed
    },
    {
      t: tr("services.items.8.t"), // Kuchynky na poschodí
      d: tr("services.items.8.d"),
      image: "/kuch.webp",
      fallbackImage: "/kuch.webp",
      Icon: ChefHat
    },
    {
      t: tr("audiences.cards.4.title"), // Rodinné oslavy a spoločenské akcie
      d: tr("audiences.cards.4.tag"),
      image: "/oslava.webp",
      fallbackImage: "/oslava.webp",
      Icon: Cake
    },
    {
      t: tr("services.items.3.t"), // Wifi zdarma
      d: tr("services.items.3.d"),
      image: "/wifi.webp",
      fallbackImage: "/wifi.webp",
      Icon: Wifi
    },
    {
      t: tr("services.items.4.t"), // Bezplatné parkovanie
      d: tr("services.items.4.d"),
      image: "/parkovanie.webp",
      fallbackImage: "/parkovanie.webp",
      Icon: ParkingCircle
    },
    {
      t: tr("services.items.5.t"), // Nefajčiarsky objekt
      d: tr("services.items.5.d"),
      image: "/nefajci.webp",
      fallbackImage: "/nefajci.webp",
      Icon: Snowflake
    },
    {
      t: tr("services.items.6.t"), // Lyžiareň
      d: tr("services.items.6.d"),
      image: "/lyziaren.webp",
      fallbackImage: "/lyziaren.webp",
      Icon: Mountain
    },
    {
      t: tr("services.items.7.t"), // Požičovňa lyží
      d: tr("services.items.7.d"),
      image: "/pozicovna.webp",
      fallbackImage: "/pozicovna.webp",
      Icon: Mountain
    },
    {
      t: tr("services.items.10.t"), // Detský kútik
      d: tr("services.items.10.d"),
      image: "/kutik.webp",
      fallbackImage: "/kutik.webp",
      Icon: Baby
    },
    {
      t: lang === "en" ? "Private Wellness" : lang === "de" ? "Privater Wellnessbereich" : "Privátny Wellness",
      d: lang === "en" ? "Perfect relaxation" : lang === "de" ? "Perfekte Entspannung" : "Dokonalý relax v saune a vírivke",
      image: "/welnes.webp",
      fallbackImage: "/welnes.webp",
      Icon: Sparkles
    },
    {
      // INFORMAČNÝ LETÁK HNEĎ ZA WELLNESSOM
      t: lang === "en" ? "Information Brochure" : lang === "de" ? "Informationsbroschüre" : "Informačný leták",
      d: lang === "en" ? "All information in one place" : lang === "de" ? "Alle Informationen an einem Ort" : "Všetky informácie na jednom mieste",
      image: "/letak.webp",
      fallbackImage: "/letak.webp",
      Icon: Scroll
    },
    {
      t: tr("services.items.9.t"), // Školiaca miestnosť
      d: tr("services.items.9.d"),
      image: null,          
      fallbackImage: null,  
      Icon: Users
    },
    {
      t: tr("services.items.1.t"), // Jedáleň
      d: tr("services.items.1.d"),
      image: null,
      fallbackImage: null,
      Icon: UtensilsCrossed
    },
    {
      t: tr("services.items.2.t"), // Raňajkový bufet
      d: tr("services.items.2.d"),
      image: null,
      fallbackImage: null,
      Icon: Coffee
    }
  ];

  const [activeItem, setActiveItem] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (index) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Blokovanie skrolovania na pozadí pri otvorenom modálnom okne
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

        {/* Mriežka s bublinkami - OPTIMALIZOVANÉ: Odstránené ťažké JS posuny na webe */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allItems.map((it, i) => {
            const Icon = it.Icon;
            const isFailed = failedImages[i];
            const imgSrc = isFailed ? null : it.image;

            return (
              <div
                key={i}
                data-testid={`service-item-${i}`}
                className="p-6 min-h-[240px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-3xl bg-white shadow-sm transform motion-safe:hover:-translate-y-1"
                onClick={() => setActiveItem({ ...it, originalIndex: i })}
              >
                <div>
                  {/* Ikona */}
                  <div className="w-10 h-10 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] mb-4 group-hover:scale-105 transition-transform">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  
                  {/* Náhľadová fotka */}
                  {it.image && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-zinc-50 relative flex items-center justify-center border border-zinc-100/50">
                      {imgSrc ? (
                        <img 
                          src={imgSrc} 
                          alt={it.t} 
                          width={300}
                          height={128}
                          loading="lazy"
                          onError={() => handleImageError(i)}
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
        </div>
      </div>

      {/* VYSKAKOVACIE OKNO (MODAL) - Ponechaná plynulá animácia pre UX */}
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
              <button 
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-zinc-900 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-colors z-50 backdrop-blur-sm border border-zinc-200"
                aria-label="Close"
              >
                ✕
              </button>

              {activeItem.image && !failedImages[activeItem.originalIndex] ? (
                <div className="w-full h-64 md:h-80 bg-zinc-900 flex items-center justify-center relative p-2">
                  <img 
                    src={activeItem.image} 
                    alt={activeItem.t} 
                    className="w-full h-full object-contain rounded-2xl" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-2xl" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-zinc-50 to-zinc-100 border-b border-zinc-100 flex items-center justify-center text-[#cc9f37]">
                  <activeItem.Icon size={54} strokeWidth={1.5} />
                </div>
              )}

              <div className="p-6 md:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                    <activeItem.Icon size={14} />
                  </div>
                  <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider">
                    {lang === "en" ? "Service detail" : lang === "de" ? "Service-Details" : "Detail služby"}
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
                    ? "In our pension, we care about maximum comfort, cleanliness, and guest satisfaction. This service is fully available to all accommodated visitors throughout their stay with us in Štrba."
                    : lang === "de"
                    ? "In einer Pension legen wir großen Wert auf maximalen Komfort, Sauberkeit und die Zufriedenheit unserer Gäste. Dieser Service steht allen übernachtenden Gästen während seines gesamten Aufenthalts in Štrba uneingeschränkt zur Verfügung."
                    : "V našom penzióne dbáme na maximálne pohodlie, čistotu a spokojnosť hostí. Táto služba je plne k dispozícii pre všetkých ubytovaných návštevnických hostí počas celého pobytu u nás v Štrbe."}
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