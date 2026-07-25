import React from "react";
import { Star, MapPin, ParkingCircle, CalendarDays } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { api } from "@/lib/api";

export default function TrustStrip() {
  const { tr } = useLang();
  
  const items = [
    { icon: Star, value: tr("trust.stars"), sub: tr("trust.starsSub"), highlight: true },
    { icon: MapPin, value: tr("trust.km"), sub: tr("trust.kmSub") },
    { icon: ParkingCircle, value: tr("trust.parking"), sub: tr("trust.parkingSub") },
    { icon: CalendarDays, value: tr("trust.year"), sub: tr("trust.yearSub") },
  ];

  return (
    <section
      data-testid="trust-strip"
      /* Okraje upravené na jemnejší a luxusnejší zinc-100 */
      className="bg-white border-y border-zinc-100 py-6 md:py-8 px-6 md:px-10"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div
              key={i}
              data-testid={`trust-item-${i}`}
              className="flex items-center gap-3 md:justify-center"
            >
              <div
                /* OPRAVA KONTRASTU: Nezostávame pri príliš svetlej text-[#cc9f37] na bledom pozadí.
                   Preklopené na sýtejšiu text-[#b58924], ktorá prejde Lighthouse auditom kontrastu. */
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  it.highlight
                    ? "bg-[#dfb144] text-zinc-950"
                    : "bg-[#dfb144]/10 text-[#b58924]"
                }`}
              >
                <Icon size={18} className={it.highlight ? "fill-zinc-950" : ""} />
              </div>
              
              {/* OPRAVA CLS: Pridaná minimálna šírka (min-w-[100px] na PC) a flex-1, 
                  aby blok držal rozloženie aj počas načítavania prekladov z LangContextu */}
              <div className="flex-1 md:flex-initial md:min-w-[110px]">
                <div className="font-display font-semibold text-zinc-900 text-sm md:text-base leading-tight min-h-[18px]">
                  {it.value || "\u00A0"}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 min-h-[16px]">
                  {it.sub || "\u00A0"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}