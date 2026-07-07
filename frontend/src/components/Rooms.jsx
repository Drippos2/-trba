import React, { useEffect, useState, useRef } from "react";
import { useLang } from "@/contexts/LangContext";

export default function Rooms() {
  const { lang, tr } = useLang();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef(null);

  // OPTIMALIZÁCIA: Sledovanie, kedy užívateľ docestuje k sekcii izieb
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect(); // Akonáhle ho raz uvidí, odpojíme observer
        }
      },
      { rootMargin: "200px" } // Začne načítavať Previo už 200px pred doscrollom, aby užívateľ nečakal
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Načítanie Previo widgetu až po priblížení k sekcii
  useEffect(() => {
    if (!isIntersecting) return;

    const scriptId = 'previo-loader-script';

    // 1. Konfigurácia (dynamicky odovzdávame aktuálny jazyk)
    window.bookingEngineConfig = {
      id: '019e15e7-36b6-7290-b1a1-4576f7b5ad73',
      lang: lang || 'sk',
      currency: 'EUR'
    };

    // 2. Načítanie skriptu na pozadí
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://booking.previo.app/loader/';
      script.async = true;
      document.head.appendChild(script);
    } else {
      // Ak už skript existuje (napr. pri re-renderi), reinicializujeme engine ak je dostupný
      if (window.PrevioBookingEngine) {
        try {
          window.PrevioBookingEngine.init();
        } catch (e) {
          console.log("Previo re-init čaká na načítanie.");
        }
      }
    }

    return () => {
      delete window.bookingEngineConfig;
    };
  }, [isIntersecting, lang]);

  return (
    <section id="rooms" className="section bg-white py-24" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-4">
        
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-wider uppercase mb-5 text-[#dfb144]">
              {tr("rooms.overline")}
            </div>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
              {tr("rooms.title")}
            </h2>
            <p className="text-slate-600 mt-6 text-lg">
              {tr("rooms.subtitle")}
            </p>
          </div>
        </div>

        {/* Previo kontajner s inteligentným načítaním */}
        <div id="previo-booking-engine" className="min-h-[400px] relative">
          {!isIntersecting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 border border-zinc-100 rounded-2xl p-8">
              <div className="w-10 h-10 border-4 border-[#dfb144] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-zinc-400 font-medium tracking-wide animate-pulse">
                Načítavam ponuku izieb...
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}