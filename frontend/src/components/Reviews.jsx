import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Tvoje recenzie ako hlavný zdroj dát, aby sme sa vyhli errorom z API
const FALLBACK_REVIEWS = [
  { 
    id: "f1", 
    name: "Miriam Bates", 
    text_sk: "V penzióne sme sa cítili veľmi vítaní, ako doma. Veľmi milí majitelia aj zamestnanci. Izby aj penzión veľmi čisté, jedlo veľmi chutné, domáce výborne koláčiky.", 
    rating: 5, 
    country: "Dovolenka ❘ Rodina" 
  },
  { 
    id: "f2", 
    name: "Dominik Škvarna", 
    text_sk: "Izby boli krásne s milou atmosférou. Postele boli veľmi pohodlné. Celá izba s kúpeľňou boli veľmi čisté. Raňajky a večere úžasné, človek si mal z čoho vybrať.", 
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f3", 
    name: "Jaroslav Gargalik", 
    text_sk: "Skvelý 3 hviezdičky hotel. Izba super čistá, kúpeľňa fajn. Bohatý výber raňajok, 10 minút od zubačky Štrba. Odporúčam aj rodinám s deťmi.", 
    rating: 5, 
    country: "Dovolenka ❘ Sólo" 
  },
  { 
    id: "f4", 
    name: "Dominika Sýkorová", 
    text_sk: "Boli sme veľmi spokojní. Zamestnanci aj pán majiteľ sú veľmi milí a prispôsobia sa vám, aby ste mali čo najlepší zážitok. Určite sa o rok vrátime.", 
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f5", 
    name: "Miloš Villem", 
    text_sk: "Hotel má pekné moderné izby. Všetko je pekne prerobené a čisté. Dobrá poloha, kúsok od zubačky. Výborné raňajky aj večera.", 
    rating: 5, 
    country: "Google Recenzia" 
  }
];

export default function Reviews() {
  const { lang, tr } = useLang();
  const [reviews] = useState(FALLBACK_REVIEWS);

  // OPTIMALIZÁCIA: Zdvojnásobíme dáta cez useMemo, aby sa pole nevytváralo znova pri každom renderi
  const scrollData = useMemo(() => [...reviews, ...reviews], [reviews]);

  return (
    <section id="reviews" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          <div className="overline mb-5 text-[#dfb144]">{tr("reviews.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("reviews.title") || "Čo o nás hovoria hostia?"}
          </h2>
        </div>
      </div>

      <div className="relative flex">
        {reviews.length > 0 && (
          <motion.div
            className="flex gap-6 px-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 50, // Jemne zrýchlené pre plynulejší pocit na mobile
                ease: "linear",
              },
            }}
            // OPTIMALIZÁCIA INP: will-change prenesie rendering animácie na grafickú kartu (GPU) a uvoľní procesor
            style={{ width: "fit-content", willChange: "transform" }}
          >
            {scrollData.map((rev, i) => {
              // Fix pre preklady textu – ak neexistuje mutácia pre daný jazyk, skočí do slovenskej verzie
              const reviewText = rev[`text_${lang}`] || rev.text_sk || "Bez textu";

              return (
                <div
                  key={`${rev.id}-${i}`}
                  className="w-[340px] sm:w-[380px] md:w-[500px] flex-shrink-0 p-8 flex flex-col gap-6 bg-white shadow-sm border border-zinc-100 rounded-[2rem] hover:border-[#dfb144]/30 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start">
                    <Quote className="text-[#dfb144] opacity-25" size={32} />
                    <div className="flex gap-0.5">
                      {[...Array(Number(rev.rating) || 5)].map((_, s) => (
                        <Star
                          key={s}
                          size={14}
                          className="fill-[#dfb144] text-[#dfb144]"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-zinc-700 leading-relaxed text-base md:text-lg flex-1 italic">
                    "{reviewText}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                    <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center text-[#dfb144] font-bold text-sm">
                      {rev.name?.charAt(0) || "H"}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-zinc-900 leading-none">
                        {rev.name || "Hosť"}
                      </div>
                      <div className="text-zinc-400 text-xs mt-1.5 font-medium uppercase tracking-wider">
                        {rev.country || "Google Recenzia"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Bočné prekrývacie gradienty plynule miznúce do bieleho pozadia */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-64 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-64 bg-gradient-to-l from-white via-white/40 to-transparent z-10" />
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white shadow-sm rounded-full border border-zinc-100">
           <span className="text-sm font-semibold text-zinc-700">
             Vynikajúce hodnotenie <span className="text-[#cc9f37] font-bold">4.9/5</span> na Google Maps
           </span>
        </div>
      </div>
    </section>
  );
}