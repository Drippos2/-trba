import React from "react";
import { motion } from "framer-motion";
import { Check, Info, Calendar } from "lucide-react";

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
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[color:var(--accent)] font-bold tracking-widest uppercase text-sm">Ceny a podmienky</span>
          <h2 className="text-4xl md:text-5xl font-semibold mt-4">Cenník ubytovania</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`p-8 rounded-3xl bg-white border ${item.highlight ? "border-slate-900 shadow-xl scale-105" : "border-slate-100 shadow-sm"}`}
            >
              <h3 className="text-xl font-bold mb-2">{item.category}</h3>
              <p className="text-sm text-slate-500 mb-6 flex items-center gap-2"><Calendar size={14} /> {item.period}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold">{item.price}</span>
                <span className="text-slate-500"> / noc</span>
              </div>
              <ul className="space-y-4 mb-8">
                {item.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <Check size={16} className="text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-4 rounded-xl font-bold ${item.highlight ? "bg-slate-900 text-white" : "bg-slate-100"}`}>
                Overiť dostupnosť
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}