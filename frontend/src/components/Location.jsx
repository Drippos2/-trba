import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Snowflake, Sparkles, MapPin, ExternalLink, Train, Bus, Car } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Lokálny prekladový slovník pre sekciu Location
const locationDict = {
  sk: {
    overline: "Lokalita",
    title: "8 km od Štrbského plesa.",
    subtitle: "Diaľnica 5 minút autom  •  vlak 10 minút pešo  •  autobus 5 minút.",
    summer: "Leto",
    winter: "Zima",
    relax: "Relax",
    summerItems: ["Vysokohorské túry", "160+ km cyklotrás", "Člnkovanie na Plese", "Spišský hrad"],
    winterItems: ["Štrbské Pleso lyžovanie", "Lučivná", "Bežkovanie", "Skialpinizmus"],
    relaxItems: ["Aquacity Poprad", "Tatralandia", "Bešeňová", "Jaskyne"],
    addressLabel: "Adresa",
    addressTitle: "Horská 1130/31",
    addressSubtitle: "059 41 Tatranská Štrba, Slovensko",
    gps: "GPS: 49° 5′ 15.35″ N, 20° 4′ 16.65″ E",
    carTimeLabel: "Auto",
    carTimeValue: "5 min",
    carTimeSub: "diaľnica",
    trainTimeLabel: "Vlak",
    trainTimeValue: "10 min",
    trainTimeSub: "pešo",
    busTimeLabel: "Bus",
    busTimeValue: "5 min",
    busTimeSub: "zastávka",
    openMapBtn: "Otvoriť v Google Maps",
    loadingMap: "Načítavam mapu...",
    directionsOverline: "Navigačné pokyny",
    directionsTitle: "Ako sa k nám dostanete?",
    trainTitle: "Zo železničnej stanice (cca 10 min)",
    trainStep1: "Na konci staničnej budovy sa vydajte po chodníku rovno až k benzínovej pumpe (cca 500m).",
    trainStep2: "Ďalej prejdete po prechode cez hlavnú cestu na druhú stranu.",
    trainStep3: "Pokračujte po chodníku okolo Slovenskej Koliby a ďalej rovno na sever (cca 400m).",
    trainStep4: "Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou.",
    busTitle: "Z autobusovej zastávky (cca 5 min)",
    busStep1: "Po vystúpení z autobusu sa vydajte rovno, smerom na Štrbské Pleso až ku Slovenskej Kolibe (cca 50m).",
    busStep2: "Pokračujte po chodníku rovno okolo Slovenskej Koliby smerom na sever (cca 400m).",
    busStep3: "Po ľavej strane uvidíte budovu potravín a reštaurácie.",
    busStep4: "Vchod do penziónu je hneď za reštauráciou.",
    carEastTitle: "Autom od Prešova / Popradu (cca 5 min)",
    carEastStep1: "Za tunelom Bôrik použite výjazd z diaľnice na Štrbu.",
    carEastStep2: "Potom pokračujte stále rovno, smerom na Tatranskú Štrbu.",
    carEastStep3: "Na najbližšej križovatke v Tatranskej Štrbe pokračujte rovno, smerom na Štrbské Pleso.",
    carEastStep4: "Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou.",
    carWestTitle: "Autom od Žiliny / Lipt. Mikuláša (cca 5 min)",
    carWestStep1: "Na diaľnici použite výjazd na Štrbu.",
    carWestStep2: "Potom pokračujte stále rovno, smerom na Tatranskú Štrbu.",
    carWestStep3: "Na najbližšej križovatke v Tatranskej Štrbe pokračujte rovno, smerom na Štrbské Pleso.",
    carWestStep4: "Po ľavej strane uvidíte budovu potravín a reštaurácie – vchod do penziónu je hneď za reštauráciou."
  },
  en: {
    overline: "Location",
    title: "8 km from Štrbské Pleso.",
    subtitle: "Highway 5 min by car  •  train 10 min on foot  •  bus 5 min.",
    summer: "Summer",
    winter: "Winter",
    relax: "Relax",
    summerItems: ["High-altitude hiking", "160+ km of bike trails", "Boating on the lake", "Spiš Castle"],
    winterItems: ["Štrbské Pleso skiing", "Lučivná", "Cross-country skiing", "Ski touring"],
    relaxItems: ["Aquacity Poprad", "Tatralandia", "Bešeňová", "Caves"],
    addressLabel: "Address",
    addressTitle: "Horská 1130/31",
    addressSubtitle: "059 41 Tatranská Štrba, Slovakia",
    gps: "GPS: 49° 5′ 15.35″ N, 20° 4′ 16.65″ E",
    carTimeLabel: "Car",
    carTimeValue: "5 min",
    carTimeSub: "highway",
    trainTimeLabel: "Train",
    trainTimeValue: "10 min",
    trainTimeSub: "on foot",
    busTimeLabel: "Bus",
    busTimeValue: "5 min",
    busTimeSub: "stop",
    openMapBtn: "Open in Google Maps",
    loadingMap: "Loading map...",
    directionsOverline: "Navigation directions",
    directionsTitle: "How to get to us?",
    trainTitle: "From the railway station (approx. 10 min)",
    trainStep1: "At the end of the station building, head straight along the sidewalk to the gas station (approx. 500m).",
    trainStep2: "Then cross the main road to the other side using the crosswalk.",
    trainStep3: "Continue along the sidewalk past Slovenská Koliba and straight north (approx. 400m).",
    trainStep4: "On the left side, you will see the grocery and restaurant building – the guesthouse entrance is right behind the restaurant.",
    busTitle: "From the bus stop (approx. 5 min)",
    busStep1: "After getting off the bus, head straight towards Štrbské Pleso until you reach Slovenská Koliba (approx. 50m).",
    busStep2: "Continue straight along the sidewalk past Slovenská Koliba heading north (approx. 400m).",
    busStep3: "On the left side, you will see the grocery and restaurant building.",
    busStep4: "The entrance to the guesthouse is right behind the restaurant.",
    carEastTitle: "By car from Prešov / Poprad (approx. 5 min)",
    carEastStep1: "After the Bôrik tunnel, take the exit from the highway toward Štrba.",
    carEastStep2: "Then continue straight towards Tatranská Štrba.",
    carEastStep3: "At the nearest intersection in Tatranská Štrba, continue straight toward Štrbské Pleso.",
    carEastStep4: "On the left side, you will see the grocery and restaurant building – the guesthouse entrance is right behind the restaurant.",
    carWestTitle: "By car from Žilina / Lipt. Mikuláš (approx. 5 min)",
    carWestStep1: "On the highway, take the exit toward Štrba.",
    carWestStep2: "Then continue straight towards Tatranská Štrba.",
    carWestStep3: "At the nearest intersection in Tatranská Štrba, continue straight toward Štrbské Pleso.",
    carWestStep4: "On the left side, you will see the grocery and restaurant building – the guesthouse entrance is right behind the restaurant."
  },
  de: {
    overline: "Lage",
    title: "8 km vom Štrbské Pleso.",
    subtitle: "Autobahn 5 Min mit Auto  •  Bahn 10 Min zu Fuß  •  Bus 5 Min.",
    summer: "Sommer",
    winter: "Winter",
    relax: "Relax",
    summerItems: ["Hochgebirgswandern", "160+ km Radwege", "Bootfahren am See", "Burg Zips"],
    winterItems: ["Skifahren in Štrbské Pleso", "Lučivná", "Langlauf", "Skitouren"],
    relaxItems: ["Aquacity Poprad", "Tatralandia", "Bešeňová", "Höhlen"],
    addressLabel: "Adresse",
    addressTitle: "Horská 1130/31",
    addressSubtitle: "059 41 Tatranská Štrba, Slowakei",
    gps: "GPS: 49° 5′ 15.35″ N, 20° 4′ 16.65″ E",
    carTimeLabel: "Auto",
    carTimeValue: "5 Min",
    carTimeSub: "Autobahn",
    trainTimeLabel: "Zug",
    trainTimeValue: "10 Min",
    trainTimeSub: "zu Fuß",
    busTimeLabel: "Bus",
    busTimeValue: "5 Min",
    busTimeSub: "Haltestelle",
    openMapBtn: "In Google Maps öffnen",
    loadingMap: "Karte wird geladen...",
    directionsOverline: "Wegbeschreibung",
    directionsTitle: "Wie Sie zu uns kommen?",
    trainTitle: "Vom Bahnhof (ca. 10 Min.)",
    trainStep1: "Gehen Sie am Ende des Bahnhofsgebäudes geradeaus auf dem Gehweg bis zur Tankstelle (ca. 500m).",
    trainStep2: "Überqueren Sie anschließend die Hauptstraße über den Fußgängerüberweg auf die andere Seite.",
    trainStep3: "Gehen Sie weiter auf dem Gehweg an der Slovenská Koliba vorbei und geradeaus nach Norden (ca. 400m).",
    trainStep4: "Auf der linken Seite sehen Sie das Gebäude mit Lebensmittelgeschäft und Restaurant – der Hoteleingang befindet sich direkt hinter dem Restaurant.",
    busTitle: "Von der Bushaltestelle (ca. 5 Min.)",
    busStep1: "Gehen Sie nach dem Aussteigen aus dem Bus geradeaus in Richtung Štrbské Pleso bis zur Slovenská Koliba (ca. 50m).",
    busStep2: "Folgen Sie dem Gehweg geradeaus an der Slovenská Koliba vorbei nach Norden (ca. 400m).",
    busStep3: "Auf der linken Seite sehen Sie das Gebäude des Lebensmittelgeschäfts und Restaurants.",
    busStep4: "Der Eingang zur Pension befindet sich direkt hinter dem Restaurant.",
    carEastTitle: "Mit dem Auto von Prešov / Poprad (ca. 5 Min.)",
    carEastStep1: "Nehmen Sie nach dem Bôrik-Tunnel die Autobahnausfahrt nach Štrba.",
    carEastStep2: "Fahren Sie anschließend geradeaus weiter in Richtung Tatranská Štrba.",
    carEastStep3: "An der nächsten Kreuzung in Tatranská Štrba fahren Sie geradeaus weiter in Richtung Štrbské Pleso.",
    carEastStep4: "Auf der linken Seite sehen Sie das Gebäude mit Lebensmittelgeschäft und Restaurant – der Hoteleingang befindet sich direkt hinter dem Restaurant.",
    carWestTitle: "Mit dem Auto von Žilina / Lipt. Mikuláš (ca. 5 Min.)",
    carWestStep1: "Nehmen Sie auf der Autobahn die Ausfahrt nach Štrba.",
    carWestStep2: "Fahren Sie anschließend geradeaus weiter in Richtung Tatranská Štrba.",
    carWestStep3: "An der nächsten Kreuzung in Tatranská Štrba fahren Sie geradeaus weiter in Richtung Štrbské Pleso.",
    carWestStep4: "Auf der linken Seite sehen Sie das Gebäude mit Lebensmittelgeschäft und Restaurant – der Hoteleingang befindet sich direkt hinter dem Restaurant."
  }
};

export default function Location() {
  const { lang } = useLang();
  const t = locationDict[lang] || locationDict.sk;

  const [tab, setTab] = useState("summer");
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRef = useRef(null);

  const tabs = [
    { id: "summer", icon: Sun, label: t.summer, items: t.summerItems },
    { id: "winter", icon: Snowflake, label: t.winter, items: t.winterItems },
    { id: "relax", icon: Sparkles, label: t.relax, items: t.relaxItems },
  ];
  const active = tabs.find((item) => item.id === tab);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
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
          <div className="overline mb-5 text-[#dfb144]">{t.overline}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-slate-900">
            {t.title}
          </h2>
          <p className="mt-5 text-slate-600 text-base md:text-lg">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tabItem) => {
            const Icon = tabItem.icon;
            const activeTab = tab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                data-testid={`location-tab-${tabItem.id}`}
                onClick={() => setTab(tabItem.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeTab
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-md shadow-zinc-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-[#dfb144] hover:text-slate-900"
                }`}
              >
                <Icon size={15} className={activeTab ? "text-[#dfb144]" : ""} />
                {tabItem.label}
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
            {(Array.isArray(active?.items) ? active.items : []).map((itemText, i) => (
              <div
                key={itemText}
                data-testid={`location-item-${tab}-${i}`}
                className="surface-card p-6 min-h-[140px] flex flex-col justify-between border border-slate-100 hover:border-[#dfb144]/40 transition-colors duration-300"
              >
                <div className="overline text-[#dfb144]">0{i + 1}</div>
                <div className="font-display text-lg md:text-xl font-semibold tracking-tight text-slate-900">{itemText}</div>
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
                  <div className="overline mb-1 text-[#dfb144]">{t.addressLabel}</div>
                  <div className="font-display text-2xl font-semibold text-slate-900">{t.addressTitle}</div>
                  <div className="text-slate-500 mt-1">{t.addressSubtitle}</div>
                  <div className="text-xs text-[#dfb144] font-medium mt-1">{t.gps}</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">{t.carTimeLabel}</div>
                  <div className="font-display font-semibold text-slate-900">{t.carTimeValue}</div>
                  <div className="text-xs text-slate-500">{t.carTimeSub}</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">{t.trainTimeLabel}</div>
                  <div className="font-display font-semibold text-slate-900">{t.trainTimeValue}</div>
                  <div className="text-xs text-slate-500">{t.trainTimeSub}</div>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase text-slate-400 mb-1">{t.busTimeLabel}</div>
                  <div className="font-display font-semibold text-slate-900">{t.busTimeValue}</div>
                  <div className="text-xs text-slate-500">{t.busTimeSub}</div>
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
              {t.openMapBtn} <ExternalLink size={14} />
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
                <p className="text-xs text-zinc-400 font-medium tracking-wide">{t.loadingMap}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sekcia: Detailné pokyny ako sa k nám dostanete */}
        <div className="mt-12 surface-card p-6 md:p-10 border border-slate-100 rounded-[16px]">
          <div className="mb-8">
            <div className="overline mb-2 text-[#dfb144]">{t.directionsOverline}</div>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">{t.directionsTitle}</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vlak */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Train size={18} />
                </div>
                <span>{t.trainTitle}</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li className="text-slate-600">{t.trainStep1}</li>
                <li className="text-slate-600">{t.trainStep2}</li>
                <li className="text-slate-600">{t.trainStep3}</li>
                <li className="text-slate-600">{t.trainStep4}</li>
              </ul>
            </div>

            {/* Autobus */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Bus size={18} />
                </div>
                <span>{t.busTitle}</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li className="text-slate-600">{t.busStep1}</li>
                <li className="text-slate-600">{t.busStep2}</li>
                <li className="text-slate-600">{t.busStep3}</li>
                <li className="text-slate-600">{t.busStep4}</li>
              </ul>
            </div>

            {/* Auto - Východ */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Car size={18} />
                </div>
                <span>{t.carEastTitle}</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li className="text-slate-600">{t.carEastStep1}</li>
                <li className="text-slate-600">{t.carEastStep2}</li>
                <li className="text-slate-600">{t.carEastStep3}</li>
                <li className="text-slate-600">{t.carEastStep4}</li>
              </ul>
            </div>

            {/* Auto - Západ */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-900 font-semibold font-display text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#dfb144] shrink-0">
                  <Car size={18} />
                </div>
                <span>{t.carWestTitle}</span>
              </div>
              <ul className="space-y-2 text-slate-600 text-sm pl-11 list-disc marker:text-[#dfb144]">
                <li className="text-slate-600">{t.carWestStep1}</li>
                <li className="text-slate-600">{t.carWestStep2}</li>
                <li className="text-slate-600">{t.carWestStep3}</li>
                <li className="text-slate-600">{t.carWestStep4}</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}