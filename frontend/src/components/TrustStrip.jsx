import React from "react";
import { Star, MapPin, ParkingCircle, CalendarDays } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

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
      className="bg-white border-y border-slate-100 py-6 md:py-8 px-6 md:px-10"
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
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  it.highlight
                    ? "bg-amber-50 text-amber-500"
                    : "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                }`}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="font-display font-semibold text-slate-900 text-sm md:text-base leading-tight">
                  {it.value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{it.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
