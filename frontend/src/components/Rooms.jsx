import React, { useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

export default function Rooms() {
  const { tr } = useLang();

  useEffect(() => {
    const scriptId = 'previo-loader-script';

    // 1. Konfigurácia
    window.bookingEngineConfig = {
      id: '019e15e7-36b6-7290-b1a1-4576f7b5ad73',
      lang: 'sk',
      currency: 'EUR'
    };

    // 2. Načítanie skriptu
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://booking.previo.app/loader/';
      script.async = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.bookingEngineConfig;
    };
  }, []);

  return (
    <section id="rooms" className="section bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            {/* Vyčistené od starých nánosov, farbu riadi priamo Tailwind */}
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

        {/* Previo kontajner */}
        <div id="previo-booking-engine"></div>

      </div>
    </section>
  );
}