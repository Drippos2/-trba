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
  Sparkles,
  Cake,
  FileText 
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function Services() {
  const { tr } = useLang();
  const rawItems = tr("services.items");
  const baseItems = Array.isArray(rawItems) ? rawItems : [];

  // Pomocná funkcia na inteligentné spárovanie textov podľa kľúčového slova v preklade
  const findItemByKeyword = (keyword, fallbackTitle, fallbackDesc) => {
    const found = baseItems.find(
      (item) =>
        item?.t?.toLowerCase().includes(keyword.toLowerCase()) ||
        item?.d?.toLowerCase().includes(keyword.toLowerCase())
    );
    return {
      t: found?.t || fallbackTitle,
      d: found?.d || fallbackDesc,
    };
  };

  // Spárovanie textov z prekladov podľa kľúčových slov
  const pizzerieTexts = findItemByKeyword("pizz", "Reštaurácia & Pizzeria", "Tradičné jedlá aj skvelá pizza");
  const kuchynkyTexts = findItemByKeyword("kuch", "Jedáleň / Kuchynky na poschodí", "Kompletne vybavené pre hostí");
  const ranajkyTexts = findItemByKeyword("raňaj", "Raňajkový bufet / Školiaca miestnosť", "Bohaté raňajky pre štart do dňa");
  const wifiTexts = findItemByKeyword("wifi", "Wifi zdarma", "Vysokorýchlostný internet v celom objekte");
  const parkovanieTexts = findItemByKeyword("park", "Bezplatné parkovanie", "Priamo pred objektom penziónu");
  const nefajciarTexts = findItemByKeyword("fajč", "Nefajčiarsky objekt", "Čisté a bezpečné prostredie pre všetkých");
  const lyziarenTexts = findItemByKeyword("lyžiar", "Lyžiareň", "Bezpečné odkladanie lyží a snowboardov");
  const pozicovnaTexts = findItemByKeyword("požič", "Požičovňa lyží", "Zľavy na lyžiarsku výstroj pre hostí");
  const kutikTexts = findItemByKeyword("kútik", "Detský kútik", "Zábava pre vaše deti");
  const wellnessTexts = findItemByKeyword("weln", "Privátne Wellness", "Dokonalý relax v saune a vírivke");
  const oslavyTexts = findItemByKeyword("oslav", "Rodinné oslavy", "Ideálny priestor pre vaše životné udalosti");
  const letakTexts = findItemByKeyword("leták", "Informačný leták", "Kompletné informácie o oslavách a podujatiach");

  // PREHODENÉ PORADIE: Leták ide na 3. miesto, Raňajky idú na koniec (12. miesto)
  const allItems = [
    {
      ...pizzerieTexts,
      image: "/pizzeria.jpg",
      fallbackImage: "/pizzeria.JPG",
      Icon: UtensilsCrossed
    },
    {
      ...kuchynkyTexts,
      image: "/kuch.jpg",
      fallbackImage: "/kuch.JPG",
      Icon: ChefHat
    },
    {
      ...letakTexts, // Informačný leták presunutý sem hore
      image: "/letak.png",
      fallbackImage: "/letak.PNG",
      Icon: FileText
    },
    {
      ...wifiTexts,
      image: "/wifi.jpg",
      fallbackImage: "/wifi.JPG",
      Icon: Wifi
    },
    {
      ...parkovanieTexts,
      image: "/parkovanie.jpg",
      fallbackImage: "/parkovanie.JPG",
      Icon: ParkingCircle
    },
    {
      ...nefajciarTexts,
      image: "/nefajci.jpg",
      fallbackImage: "/nefajci.JPG",
      Icon: Snowflake
    },
    {
      ...lyziarenTexts,
      image: "/lyziaren.jpg",
      fallbackImage: "/lyziaren.JPG",
      Icon: Mountain
    },
    {
      ...pozicovnaTexts,
      image: "/pozicovna.JPG",
      fallbackImage: "/pozicovna.jpg",
      Icon: GraduationCap
    },
    {
      ...kutikTexts,
      image: "/kutik.JPG",
      fallbackImage: "/kutik.jpg",
      Icon: Baby
    },
    {
      ...wellnessTexts,
      image: "/welnes.JPG",
      fallbackImage: "/welnes.jpg",
      Icon: Sparkles
    },
    {
      ...oslavyTexts,
      image: "/oslava.jpg",
      fallbackImage: "/oslava.JPG",
      Icon: Cake
    },
    {
      ...ranajkyTexts, // Raňajkový bufet presunutý sem na koniec
      image: null,
      fallbackImage: null,
      Icon: Coffee
    }
  ];

  // Stav pre otvorené vyskakovacie okno
  const [activeItem, setActiveItem] = useState(null);

  // Sledovanie ciest obrázkov (ak zlyhá základná, prepne sa na záložnú)
  const [currentImages, setCurrentImages] = useState({});
  // Sledovanie definitívnych chýb (ak zlyhá aj záložný variant)
  const [failedImages, setFailedImages] = useState({});

  // Inicializácia základných ciest obrázkov pri načítaní komponentu alebo zmene allItems
  useEffect(() => {
    const initialImages = {};
    allItems.forEach((item, index) => {
      if (item.image) {
        initialImages[index] = item.image;
      }
    });
    setCurrentImages(initialImages);
  }, []);

  const handleImageError = (index, item) => {
    if (currentImages[index] === item.image && item.fallbackImage) {
      setCurrentImages((prev) => ({ ...prev, [index]: item.fallbackImage }));
    } else {
      setFailedImages((prev) => ({ ...prev, [index]: true }));
    }
  };

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
            const imgSrc = currentImages[i];
            const isFailed = failedImages[i];

            return (
              <motion.div
                key={i}
                data-testid={`service-item-${i}`}
                className="p-6 min-h-[240px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/40 hover:shadow-md cursor-pointer transition-all duration-300 group rounded-3xl bg-white shadow-sm"
                onClick={() => setActiveItem({ ...it, originalIndex: i })}
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
                  
                  {/* Náhľadová fotka */}
                  {it.image && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-zinc-50 relative flex items-center justify-center border border-zinc-100/50">
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

              {/* Veľký obrázok alebo záložná ikona */}
              {activeItem.image && !failedImages[activeItem.originalIndex] ? (
                <div className="w-full h-64 md:h-80 bg-zinc-900 flex items-center justify-center relative p-2">
                  <img 
                    src={currentImages[activeItem.originalIndex]} 
                    alt={activeItem.t} 
                    onError={() => handleImageError(activeItem.originalIndex, activeItem)}
                    className="w-full h-full object-contain rounded-2xl" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none rounded-2xl" />
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