import React from "react";
import { motion } from "framer-motion";
import { Check, Info, Calendar } from "lucide-react";
import { api } from "@/lib/api";

export default function Pricing() {
  const pricingData = [
    {
      category: "Mimosezóna",
      period: "Jar / Jeseň",
      price: "59€",
      features: ["Ubytovanie pre 2 osoby", "Raňajky v cene", "Parkovanie zadarmo", "Wi-Fi pripojenie"],
      highlight: false
    },
    {
      category: "Hlavná Sezóna",
      period: "Leto / Zima",
      price: "69€",
      features: ["Ubytovanie pre 2 osoby", "Raňajky v cene", "Vstup do wellness", "Parkovanie zadarmo"],
      highlight: true
    },
    {
      category: "Top Sezóna",
      period: "Vianoce / Silvester",
      price: "85€",
      features: ["Ubytovanie pre 2 osoby", "Slávnostné menu", "Neobmedzený wellness", "Welcome drink"],
      highlight: false
    }
  ];

  return (
    /* ZMENA: Pozadie sekcie jemne upravené zo slate-50 na čistejšie biele/neutrálne pozadie podčiarkujúce luxusný štýl */
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16">
          {/* ZMENA: Podnadpis prepnutý zo starej premennej na našu korporátnu zlatú farbu */}
          <span className="text-[#dfb144] font-bold tracking-widest uppercase text-sm">Ceny a podmienky</span>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4 text-zinc-900">Cenník ubytovania</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              /* ZMENA: Zvýraznená karta (Hlavná Sezóna) preklopená do luxusnej čiernej (bg-zinc-950) so zlatým tieňom, ostatné karty majú jemný čistý border */
              className={`p-8 rounded-3xl border transition-all duration-300 ${
                item.highlight 
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-xl shadow-zinc-200/50 scale-105" 
                  : "bg-white text-zinc-900 border-zinc-100 shadow-sm hover:border-[#dfb144]/30"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">{item.category}</h3>
              {/* ZMENA: Farba kalendára a textu upravená na neutrálne odtiene pre svetlú aj tmavú kartu */}
              <p className={`text-sm mb-6 flex items-center gap-2 ${item.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                <Calendar size={14} className="text-[#dfb144]" /> {item.period}
              </p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{item.price}</span>
                <span className={item.highlight ? "text-zinc-400" : "text-zinc-500"}> / noc</span>
              </div>
              <ul className="space-y-4 mb-8">
                {item.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${item.highlight ? "text-zinc-300" : "text-zinc-600"}`}>
                    {/* ZMENA: Ikonka fajky (Check) upravená na zlatú farbu namiesto zelenej, aby nenútene ladila */}
                    <Check size={16} className="text-[#dfb144]" /> {f}
                  </li>
                ))}
              </ul>
              
              {/* ZMENA: Tlačidlá preklopené – na tmavej zvýraznenej karte svieti zlaté tlačidlo, na bielych kartách čisté elegantné čierne tlačidlo */}
              <a 
                href="#contact"
                className={`block w-full py-4 rounded-xl font-bold text-center transition-all duration-300 ${
                  item.highlight 
                    ? "bg-[#dfb144] text-zinc-900 hover:bg-[#cc9f37]" 
                    : "bg-zinc-950 text-white hover:bg-zinc-800"
                }`}
              >
                Overiť dostupnosť
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}