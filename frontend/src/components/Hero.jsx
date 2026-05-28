import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/contexts/LangContext";
import BookingDialog from "./BookingDialog";
import { api } from "@/lib/api";

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_mountain-escape-23/artifacts/wnn6gm19_IMG_6789.jpg";

export default function Hero() {
  const { tr } = useLang();
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 text-white"
    >
      {/* Pozadie */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src={HERO_IMAGE}
          alt="Vysoké Tatry"
          className="absolute inset-0 w-full h-full object-cover hero-photo opacity-40 brightness-75"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Stredový obsah */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 pt-28 text-center flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Horný menší text */}
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-zinc-300 mb-6 font-semibold">
            POKOJNÉ UBYTOVANIE VO VYSOKÝCH TATRÁCH
          </p>

          {/* Hlavný nadpis */}
          <h1
            className="font-serif font-normal text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight text-white mb-6"
            data-testid="hero-title"
          >
            Wellness pobyt <br />
            <span className="text-[#dfb144]">v srdci Tatier</span>
          </h1>
          
          {/* Podnadpis */}
          <p className="max-w-2xl text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-normal">
            Len pár minút od Štrbského Plesa. Ideálne miesto na oddych, turistiku a relax.
          </p>

          {/* Akčná zóna */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Tlačidlo Overiť dostupnosť */}
            <a 
              href="https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=sk&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 text-slate-900 bg-[#dfb144] hover:bg-[#cc9f37] rounded-full font-semibold text-base transition-all duration-300 shadow-lg shadow-black/20 hover:scale-102 tracking-wide"
            >
              Overiť dostupnosť
            </a>

            {/* Cenovka v elegantnej bubline */}
            <div className="inline-flex items-center justify-center px-6 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm sm:text-base text-zinc-200 font-medium tracking-wide shadow-md">
              od &nbsp;<span className="font-bold text-[#dfb144] text-lg sm:text-xl">59 €</span>&nbsp; / noc
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