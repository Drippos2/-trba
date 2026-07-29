import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Recenzie s pridanými prekladmi pre jednotlivé jazyky (sk, en, de)
const FALLBACK_REVIEWS = [
  { 
    id: "f1", 
    name: "Miriam Bates", 
    text_sk: "V penzióne sme sa cítili veľmi vítaní, ako doma. Veľmi milí majitelia aj zamestnanci. Izby aj penzión veľmi čisté, jedlo veľmi chutné, domáce výborne koláčiky.",
    text_en: "We felt very welcome at the guesthouse, right at home. Very nice owners and staff. The rooms and guesthouse were very clean, the food was delicious, and the homemade cakes were excellent.",
    text_de: "Wir haben uns in der Pension sehr willkommen gefühlt, wie zu Hause. Sehr nette Besitzer und Personal. Die Zimmer und die Pension waren sehr sauber, das Essen sehr lecker und die hausgemachten Kuchen ausgezeichnet.",
    rating: 5, 
    country: "Dovolenka ❘ Rodina" 
  },
  { 
    id: "f2", 
    name: "Dominik Škvarna", 
    text_sk: "Izby boli krásne s milou atmosférou. Postele boli veľmi pohodlné. Celá izba s kúpeľňou boli veľmi čisté. Raňajky a večere úžasné, človek si mal z čoho vybrať.",
    text_en: "The rooms were beautiful with a lovely atmosphere. The beds were very comfortable. The entire room and bathroom were very clean. Breakfast and dinner were amazing, with plenty of choices.",
    text_de: "Die Zimmer waren wunderschön mit einer angenehmen Atmosphäre. Die Betten waren sehr bequem. Das gesamte Zimmer und das Badezimmer waren sehr sauber. Frühstück und Abendessen waren wunderbar, man hatte eine tolle Auswahl.",
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f3", 
    name: "Jaroslav Gargalik", 
    text_sk: "Skvelý 3 hviezdičky hotel. Izba super čistá, kúpeľňa fajn. Bohatý výber raňajok, 10 minút od zubačky Štrba. Odporúčam aj rodinám s deťmi.",
    text_en: "Great 3-star hotel. Super clean room, nice bathroom. Rich breakfast selection, 10 minutes from the Štrba cog railway. I also recommend it to families with children.",
    text_de: "Tolles 3-Sterne-Hotel. Super sauberes Zimmer, schönes Badezimmer. Reichhaltige Frühstücksauswahl, 10 Minuten von der Zahnradbahn Štrba entfernt. Ich empfehle es auch Familien mit Kindern.",
    rating: 5, 
    country: "Dovolenka ❘ Sólo" 
  },
  { 
    id: "f4", 
    name: "Dominika Sýkorová", 
    text_sk: "Boli sme veľmi spokojní. Zamestnanci aj pán majiteľ sú veľmi milí a prispôsobia sa vám, aby ste mali čo najlepší zážitok. Určite sa o rok vrátime.",
    text_en: "We were very satisfied. Both the staff and the owner are very kind and accommodate you to ensure the best possible experience. We will definitely be back next year.",
    text_de: "Wir waren sehr zufrieden. Das Personal und der Besitzer sind sehr nett und gehen auf Ihre Wünsche ein, um Ihnen das beste Erlebnis zu bieten. Wir werden nächstes Jahr auf jeden Fall wiederkommen.",
    rating: 5, 
    country: "Dovolenka ❘ Pár" 
  },
  { 
    id: "f5", 
    name: "Miloš Villem", 
    text_sk: "Hotel má pekné moderné izby. Všetko je pekne prerobené a čisté. Dobrá poloha, kúsok od zubačky. Výborné raňajky aj večera.",
    text_en: "The hotel has nice modern rooms. Everything is nicely renovated and clean. Good location, a short walk from the cog railway. Excellent breakfast and dinner.",
    text_de: "Das Hotel hat schöne, moderne Zimmer. Alles ist schön renoviert und sauber. Gute Lage, nur ein Stück von der Zahnradbahn entfernt. Ausgezeichnetes Frühstück und Abendessen.",
    rating: 5, 
    country: "Google Recenzia" 
  }
];

// Pomocný slovník pre spodný text o hodnotení na Google Maps
const googleBadgeDict = {
  sk: <>Vynikajúce hodnotenie <span className="text-[#cc9f37] font-bold">4.9/5</span> na Google Maps</>,
  en: <>Excellent rating of <span className="text-[#cc9f37] font-bold">4.9/5</span> on Google Maps</>,
  de: <>Ausgezeichnete Bewertung von <span className="text-[#cc9f37] font-bold">4.9/5</span> auf Google Maps</>
};

export default function Reviews() {
  const { lang, tr } = useLang();
  const [reviews] = useState(FALLBACK_REVIEWS);

  // OPTIMALIZÁCIA: Zdvojnásobíme dáta cez useMemo pre plynulý nekonečný scroll
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
                duration: 50,
                ease: "linear",
              },
            }}
            style={{ width: "fit-content", willChange: "transform" }}
          >
            {scrollData.map((rev, i) => {
              // Dynamický výber textu recenzie podľa aktuálneho jazyka (lang), s fallbackom na slovenčinu
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

        {/* Bočné prekrývacie gradienty */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-64 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-64 bg-gradient-to-l from-white via-white/40 to-transparent z-10" />
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white shadow-sm rounded-full border border-zinc-100">
           <span className="text-sm font-semibold text-zinc-700">
             {googleBadgeDict[lang] || googleBadgeDict.sk}
           </span>
        </div>
      </div>
    </section>
  );
}