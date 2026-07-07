import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import BookingDialog from "./BookingDialog";
import { api } from "@/lib/api";

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_mountain-escape-23/artifacts/wnn6gm19_IMG_6789.jpg";

export default function Hero() {
  const { lang } = useLang();
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);

  // Kompletné lokalizované texty pre slovenskú, anglickú a nemeckú mutáciu
  const content = {
    sk: {
      overline: "POKOJNÉ UBYTOVANIE VO VYSOKÝCH TATRÁCH",
      titlePre: "Wellness pobyt",
      titleGold: "v srdci Tatier",
      description: "Len pár minút od Štrbského Plesa. Ideálne miesto na oddych, turistiku a relax.",
      btnBook: "Overiť dostupnosť",
      priceFrom: "od",
      priceUnit: "/ noc",
      bookingUrl: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=sk&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    },
    en: {
      overline: "PEACEFUL ACCOMMODATION IN THE HIGH TATRAS",
      titlePre: "Wellness stay",
      titleGold: "in the heart of Tatras",
      description: "Just a few minutes from Štrbské Pleso. An ideal place for relaxation, hiking, and unwind.",
      btnBook: "Check availability",
      priceFrom: "from",
      priceUnit: "/ night",
      bookingUrl: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=en&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    },
    de: {
      overline: "RUHIGE UNTERKUNFT IN DER HOHEN TATRA",
      titlePre: "Wellnessaufenthalt",
      titleGold: "im Herzen der Tatra",
      description: "Nur wenige Minuten von Štrbské Pleso entfernt. Ein idealer Ort für Erholung, Wandern und Entspannung.",
      btnBook: "Verfügbarkeit prüfen",
      priceFrom: "ab",
      priceUnit: "/ Nacht",
      bookingUrl: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=de&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    }
  };

  // Výber prekladu na základe aktívneho jazyka s fallbackom na slovenčinu
  const current = content[lang] || content.sk;

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 text-white"
    >
      {/* Pozadie - OPTIMALIZOVANÉ: Klasický img s CSS animáciou pre bleskové vykreslenie bez preťaženia JS */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt={lang === "en" ? "High Tatras Mountains" : lang === "de" ? "Hohe Tatra Berge" : "Vysoké Tatry"}
          className="absolute inset-0 w-full h-full object-cover hero-photo opacity-40 brightness-75 transition-all duration-[1400ms] ease-out scale-100"
          loading="eager"
          fetchpriority="high"
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Stredový obsah */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 pt-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Horný menší text */}
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-zinc-300 mb-6 font-semibold">
            {current.overline}
          </p>

          {/* Hlavný nadpis */}
          <h1
            className="font-serif font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight text-white mb-6"
            data-testid="hero-title"
          >
            {current.titlePre} <br />
            <span className="text-[#dfb144]">{current.titleGold}</span>
          </h1>
          
          {/* Podnadpis */}
          <p className="max-w-2xl text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-normal">
            {current.description}
          </p>

          {/* Akčná zóna */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Tlačidlo Overiť dostupnosť s dynamickou URL pre správny jazyk */}
            <a 
              href={current.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 text-slate-900 bg-[#dfb144] hover:bg-[#cc9f37] rounded-full font-semibold text-base transition-all duration-300 shadow-lg shadow-black/20 hover:scale-102 tracking-wide"
            >
              {current.btnBook}
            </a>

            {/* Cenovka v elegantnej bubline */}
            <div className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm sm:text-base text-zinc-200 font-medium tracking-wide shadow-md">
              {current.priceFrom} &nbsp;<span className="font-bold text-[#dfb144] text-lg sm:text-xl">59 €</span>&nbsp; {current.priceUnit}
            </div>
          </div>
        </motion.div>
      </div>

      <BookingDialog 
        open={isWellnessOpen} 
        onClose={() => setIsWellnessOpen(false)} 
      />
    </section>
  );
}