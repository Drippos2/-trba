import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Tvoje recenzie ako hlavný zdroj dát, aby sme sa vyhli errorom z API
const FALLBACK_REVIEWS = [
  { 
    id: "f1", 
    name: "Miriam Bates", 
    text_sk: "V penzióne sme sa cítili veľmi vítaní, ako doma. Veĺmi milí majitelia aj zamestnanci. Izby aj penzión veĺmi čisté, jedlo veĺmi chutné, domáce výborne koláčiky.", 
    rating: 5, 
    country: "Dovolenka ❘ Rodina" 
  },
  { 
    id: "f2", 
    name: "Dominik Škvarna", 
    text_sk: "Izby boli krásne s milou atmosférou. Postele boli veĺmi pohodlné. Celá izba s kúpeĺňou boli veĺmi čisté. Raňajky a večere úžasné, človek si mal z čoho vybrať.", 
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f3", 
    name: "Jaroslav Gargalik", 
    text_sk: "Skvelý 3 hviezdičky hotel. Izba super čistá, kúpeĺňa fajn. Bohatý výber raňajok, 10 minút od zubačky Štrba. Odporúčam aj rodinám s deťmi.", 
    rating: 5, 
    country: "Dovolenka ❘ Sólo" 
  },
  { 
    id: "f4", 
    name: "Dominika Sýkorová", 
    text_sk: "Boli sme veĺmi spokojní. Zamestnanci aj pán majiteľ sú veĺmi milí a prispôsobia sa vám, aby ste mali čo najlepší zážitok. Určite sa o rok vrátime.", 
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f5", 
    name: "Miloš Villem", 
    text_sk: "Hotel má pekné moderné izby. Všetko je pekne prerobené and čisté. Dobrá poloha, kúsok od zubačky. Výborné raňajky aj večera.", 
    rating: 5, 
    country: "Google Recenzia" 
  }
];

export default function Reviews() {
  const { lang, tr } = useLang();
  // Nastavíme recenzie priamo pri štarte, aby sme nečakali na API
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);

  useEffect(() => {
    // API volanie sme odstránili, aby nevznikali chyby localhost:8000
    // Recenzie sa načítajú okamžite z FALLBACK_REVIEWS
    console.log("Recenzie sú načítané lokálne, API chyby sú vypnuté.");
  }, []);

  // Zdvojnásobíme dáta pre nekonečný scroll
  const scrollData = [...reviews, ...reviews];

  return (
    /* ZMENA: Pozadie sekcie preklopené zo starého var(--bg-soft) na čistú elegantnú bielu */
    <section id="reviews" className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 mb-16">
        <div className="max-w-3xl">
          {/* ZMENA: Overline prepnutý zo starej premennej na našu korporátnu zlatú farbu */}
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
                duration: 60,
                ease: "linear",
              },
            }}
            style={{ width: "fit-content" }}
          >
            {scrollData.map((rev, i) => (
              <div
                key={`${rev.id}-${i}`}
                /* ZMENA: Karty majú jemnejší zinc border a pri hoveri získajú decentný zlatý akcent */
                className="w-[380px] md:w-[500px] flex-shrink-0 p-8 flex flex-col gap-6 bg-white shadow-sm border border-zinc-100 rounded-[2rem] hover:border-[#dfb144]/30 transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  {/* ZMENA: Ikona úvodzoviek (Quote) preklopená do našej zlatej */}
                  <Quote className="text-[#dfb144] opacity-25" size={32} />
                  <div className="flex gap-0.5">
                    {[...Array(Number(rev.rating) || 5)].map((_, s) => (
                      <Star
                        key={s}
                        size={14}
                        /* ZMENA: Hviezdičky ratingu zafarbené na zlato */
                        className="fill-[#dfb144] text-[#dfb144]"
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-zinc-700 leading-relaxed text-lg flex-1 italic">
                  "{rev[`text_${lang}`] || rev.text_sk || "Bez textu"}"
                </p>

                <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
                  {/* ZMENA: Kruhový avatar preklopený do luxusného tmavého pozadia so zlatým textom iniciály */}
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
            ))}
          </motion.div>
        )}

        {/* ZMENA: Bočné prekrývacie gradienty upravené z var(--bg-soft) na čistú bielu (white) tak, aby nekonečný pás plynule mizol do bieleho pozadia sekcie */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-white via-white/50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-white via-white/50 to-transparent z-10" />
      </div>

      <div className="mt-16 text-center">
        {/* ZMENA: Spodný odznak preklopený do čistého štýlu s jemným zinc okrajom */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white shadow-sm rounded-full border border-zinc-100">
           {/* ZMENA: "4.9/5" jemne vytiahnuté do zlata pre prémiový dojem */}
           <span className="text-sm font-semibold text-zinc-700">
             Vynikajúce hodnotenie <span className="text-[#cc9f37] font-bold">4.9/5</span> na Google Maps
           </span>
        </div>
      </div>
    </section>
  );
}