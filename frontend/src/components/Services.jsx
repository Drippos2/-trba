import React from "react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Coffee,
  ParkingCircle,
  Snowflake,
  Mountain,
  ChefHat,
  GraduationCap,
  Baby,
} from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const ICONS = [UtensilsCrossed, Coffee, ParkingCircle, Snowflake, Mountain, ChefHat, GraduationCap, Baby];

export default function Services() {
  const { tr } = useLang();
  const items = tr("services.items");
  return (
    /* ZMENA: Pozadie sekcie preklopené zo starého var(--bg-soft) na elegantnú čistú bielu */
    <section id="services" className="section bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-14">
          {/* ZMENA: Overline jemne podfarbený našou zlatou farbou */}
          <div className="overline mb-5 text-[#dfb144]">{tr("services.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-zinc-900">
            {tr("services.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(items) ? items : []).map((it, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={i}
                data-testid={`service-item-${i}`}
                /* ZMENA: Pridaný jemný border a hladký prechod farby okraja pri hoveri do zlatej */
                className="surface-card p-6 min-h-[170px] flex flex-col justify-between border border-zinc-100 hover:border-[#dfb144]/30 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                {/* ZMENA: Obal ikony preklopený zo starého modrého akcentu do jemného zlatého tónu (bg-[#dfb144]/10 a text-[#cc9f37]) */}
                <div className="w-10 h-10 rounded-lg bg-[#dfb144]/10 flex items-center justify-center text-[#cc9f37]">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold tracking-tight text-zinc-900">{it.t}</div>
                  <div className="mt-1 text-zinc-500 text-sm">{it.d}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}