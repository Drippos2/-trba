import React, { useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

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
    <section id="rooms" className="section bg-[color:var(--bg-soft)]">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Tvoje texty */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="overline mb-5">{tr("rooms.overline")}</div>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {tr("rooms.title")}
            </h2>
            <p className="text-slate-600 mt-6 text-lg">
              {tr("rooms.subtitle")}
            </p>
          </div>
        </div>

        {/* TOTO TU MUSÍ BYŤ, aby Previo vedelo, kam sa má vykresliť */}
        {/* Je to úplne bez štýlov, aby to nepridávalo žiaden box navyše */}
        <div id="previo-booking-engine"></div>

      </div>
    </section>
  );
}