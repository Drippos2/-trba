import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, MapPin, ParkingCircle, Star } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_mountain-escape-23/artifacts/wnn6gm19_IMG_6789.jpg";

export default function Hero({ onBookClick }) {
  const { tr } = useLang();

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-end overflow-hidden bg-white"
    >
      <div className="absolute inset-0">
        <motion.img
          src={HERO_IMAGE}
          alt="Vysoké Tatry — 8 km od Štrbského Plesa"
          className="absolute inset-0 w-full h-full object-cover hero-photo"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          data-testid="hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/10" />
      </div>

      {/* Floating price tag (desktop) */}
      <div
        data-testid="hero-price-tag"
        className="hidden md:flex absolute z-20 right-8 lg:right-14 top-1/3 flex-col items-end"
      >
        <div className="surface-card !bg-white/90 backdrop-blur-md p-5 rounded-2xl">
          <div className="overline">{tr("hero.priceTagLabel")}</div>
          <div className="font-display text-3xl lg:text-4xl font-semibold text-[color:var(--accent)] mt-1">
            {tr("hero.priceTag")}
          </div>
          <div className="text-xs text-slate-500 mt-1">{tr("hero.kmTag")}</div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-10 pb-20 md:pb-32 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-3xl"
        >
          {/* Eyebrow with stars + headline copy */}
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

          <div className="mt-9 flex flex-wrap gap-3 items-center">
            {/* OPRAVENÉ: Tu som odstránil bodku a cenu */}
            <button data-testid="hero-cta-btn" onClick={onBookClick} className="btn-primary">
              {tr("hero.cta")}
            </button>
            <a href="#about" className="btn-outline" data-testid="hero-secondary-btn">
              {tr("hero.ctaSecondary")}
            </a>
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
    </section>
  );
}