import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, ParkingCircle, Star } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import BookingDialog from "./BookingDialog";

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_mountain-escape-23/artifacts/wnn6gm19_IMG_6789.jpg";

export default function Hero() {
  const { tr } = useLang();
  const [isWellnessOpen, setIsWellnessOpen] = useState(false);

  // Funkcia pre plynulý posun na sekciu rezervácií
  const scrollToRooms = (e) => {
    e.preventDefault();
    const section = document.querySelector('#rooms');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-end overflow-hidden bg-white"
    >
      <div className="absolute inset-0">
        <motion.img
          src={HERO_IMAGE}
          alt="Vysoké Tatry"
          className="absolute inset-0 w-full h-full object-cover hero-photo"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/10" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 pb-20 md:pb-32 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl"
        >
          {/* Eyebrow s ikonami */}
          <div className="flex flex-wrap items-center gap-2 mb-5" data-testid="hero-overline">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent-hover)] text-xs font-semibold">
              <MapPin size={12} /> {tr("hero.kmTag")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <ParkingCircle size={12} /> {tr("hero.parking")}
            </span>
          </div>

          <p className="text-sm md:text-base text-slate-600 mb-3 max-w-xl font-medium">
            {tr("hero.overline")}
          </p>

          <h1
            className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.98] tracking-tight text-slate-900"
            data-testid="hero-title"
          >
            <span className="block">{tr("hero.title1")}</span>
            <span className="block text-[color:var(--accent)]">{tr("hero.title2")}</span>
          </h1>
          
          <p className="mt-7 max-w-xl text-slate-700 text-base md:text-lg leading-relaxed font-bold">
            {tr("hero.subtitle")}
          </p>

          <div className="mt-9 flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white/40 w-fit px-4 py-1.5 rounded-full">
               <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">
                 {tr("hero.priceTagLabel")}
               </span>
               <span className="text-lg font-bold text-[color:var(--accent)]">
                 {tr("hero.priceTag")}
               </span>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              {/* TLAČIDLO PRE IZBY - Teraz plynulo scrolluje na sekciu #rooms */}
              <button 
                data-testid="hero-cta-btn" 
                onClick={scrollToRooms} 
                className="btn-primary"
              >
                {tr("hero.cta")}
              </button>

              {/* TLAČIDLO PRE WELLNESS - Otvára interný BookingDialog */}
              <button 
                onClick={() => setIsWellnessOpen(true)}
                className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                {tr("hero.ctaWellness")}
              </button>

              <a href="#about" className="btn-outline" data-testid="hero-secondary-btn">
                {tr("hero.ctaSecondary")}
              </a>
            </div>
          </div>
        </motion.div>

        <a
          href="#about"
          className="absolute left-6 md:left-10 bottom-10 flex items-center gap-3 text-xs tracking-[0.25em] text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span>SCROLL</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ArrowDown size={14} />
          </motion.span>
        </a>
      </div>

      {/* Wellness rezervačný dialóg */}
      <BookingDialog 
        open={isWellnessOpen} 
        onClose={() => setIsWellnessOpen(false)} 
      />
    </section>
  );
}