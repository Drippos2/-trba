import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Snowflake, Sparkles, MapPin, ExternalLink, Train, Bus, Car } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

export default function Location() {
  const { tr } = useLang();
  const [tab, setTab] = useState("summer");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRef = useRef(null);

  const tabs = [
    { id: "summer", icon: Sun, labelKey: "location.summer", items: tr("location.summerItems") },
    { id: "winter", icon: Snowflake, labelKey: "location.winter", items: tr("location.winterItems") },
    { id: "relax", icon: Sparkles, labelKey: "location.relax", items: tr("location.relaxItems") },
  ];
  const active = tabs.find((t) => t.id === tab);

  // OPTIMALIZÁCIA: Načítanie ťažkého iframe elementu až pri reálnom vstupe na sekciu (ochrana pred preletom robota)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" } // Aktivuje sa až na presnej hranici viditeľnosti
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="location" 
      className="section bg-white py-24" 
      ref={mapRef}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 1000px" }}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="max-w-3xl mb-12">
          <div className="overline mb-5 text-[#dfb144]">{tr("location.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-slate-900">
            {tr("location.title")}
          </h2>
          <p className="mt-5 text-slate-600 text-base md:text-lg">{tr("location.subtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon;
            const activeTab = tab === t.id;
            return (
              <button
                key={t.id}
                data-testid={`location-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeTab
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md shadow-zinc-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#dfb144] hover:text-slate-900"
                }`}
              >
                <Icon size={15} className={activeTab ? "text-[#dfb144]" : ""} />
                {tr(t.labelKey)}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {(Array.isArray(active?.items) ? active.items : []).map((item, i) => (
              <div
                key={item}
                data-testid={`location-item-${tab}-${i}`}
                className="surface-card p-6 min-h-[140px] flex flex-col justify-between border border-slate-100 hover:border-[#dfb144]/40 transition-colors duration-300"
              >
                <div className="overline text-[#dfb144]">0{i + 1}</div>
                <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-slate-900">{item}</div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 surface-card p-6 md:p-8 flex flex-col justify-between border border-slate-100">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="overline mb-1 text-[#dfb144]">Adresa</div>
                  <div className="font-display text-2xl font-semibold text-slate-900">Horská 1130/31</div>
                  <div className="text-slate-500 mt-1">059 41 Tatranská Štrba, Slovensko</div>
                  <div className="text-xs text-[#dfb144] font-medium mt-1">GPS: 49° 5′ 15.35″ N, 20° 4′ 16.65″ E</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Auto</div>
                  <div className="font-display font-semibold text-slate-900">5 min</div>
                  <div className="text-xs text-slate-500">diaľnica</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Vlak</div>
                  <div className="font-display font-semibold text-slate-900">10 min</div>
                  <div className="text-xs text-slate-500">pešo</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">Bus</div>
                  <div className="font-display font-semibold text-slate-900">5 min</div>
                  <div className="text-xs text-slate-500">zastávka</div>
                </div>
              </div>
            </div>

            <a
              data-testid="location-map-link"
              href="https://maps.google.com/?q=Horska+1130/31,+Tatranska+Strba"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 text-sm font-semibold transition-all duration-300 mt-6 self-start min-h-[44px]"
            >
              Otvoriť v Google Maps <ExternalLink size={14} />
            </a>
          </div>

          <div className="lg:col-span-7 rounded-[12px] overflow-hidden border border-slate-200 surface-card !p-0 min-h-[380px] bg-zinc-50 relative flex items-center justify-center">
            {isMapVisible ? (
              <iframe
                data-testid="location-map-embed"
                title="Penzión Štrba — Google Maps"
                src="https://maps.google.com/maps?q=Horsk%C3%A1%201130/31,%20Tatransk%C3%A1%20%C5%A0trba&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 380, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-[#dfb144] border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs text-zinc-400 font-medium tracking-wide">Načítavam mapu...</p>
              </div>
            )}
          </div>
        </div>

        {/* Sekcia: Detailné pokyny ako sa k nám dostanete */}
        <div className="mt-12 surface-card p-6 md:p-10 border border-slate-100 rounded-[16px]">
          <div className="mb-8">
            <div className="overline mb-2 text-[#dfb144]">Navigačné pokyny</div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">Ako sa k nám dostanete?</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vlak */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Train size={18} />
                </div>
                <span>Zo železničnej stanice (cca 10 min)</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li>Na konci staničnej budovy sa vydajte po chodníku rovno až k benzínovej pumpe (cca 500m).</li>
                <li>Ďalej prejdete po prechode cez hlavnú cestu na druhú stranu.</li>
                <li>Pokračujte po chodníku okolo Slovenskej Koliby a ďalej rovno na sever (cca 400m).</li>
                <li>Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou.</li>
              </ul>
            </div>

            {/* Autobus */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Bus size={18} />
                </div>
                <span>Z autobusovej zastávky (cca 5 min)</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li>Po vystúpení z autobusu sa vydajte rovno, smerom na Štrbské Pleso až ku Slovenskej Kolibe (cca 50m).</li>
                <li>Pokračujte po chodníku rovno okolo Slovenskej Koliby smerom na sever (cca 400m).</li>
                <li>Po ľavej strane uvidíte budovu potravín a reštaurácie.</li>
                <li>Vchod do penziónu je hneď za reštauráciou.</li>
              </ul>
            </div>

            {/* Auto - Východ */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Car size={18} />
                </div>
                <span>Autom od Prešova / Popradu (cca 5 min)</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li>Za tunelom Bôrik použite výjazd z diaľnice na Štrbu.</li>
                <li>Potom pokračujte stále rovno, smerom na Tatranskú Štrbu.</li>
                <li>Na najbližšej križovatke v Tatranskej Štrbe pokračujte rovno, smerom na Štrbské Pleso.</li>
                <li>Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou.</li>
              </ul>
            </div>

            {/* Auto - Západ */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Car size={18} />
                </div>
                <span>Autom od Žiliny / Lipt. Mikuláša (cca 5 min)</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li>Na diaľnici použite výjazd na Štrbu.</li>
                <li>Potom pokračujte stále rovno, smerom na Tatranskú Štrbu.</li>
                <li>Na najbližšej križovatke v Tatranskej Štrbe pokračujte rovno, smerom na Štrbské Pleso.</li>
                <li>Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}