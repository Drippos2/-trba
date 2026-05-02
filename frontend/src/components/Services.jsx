import React from "react";
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
    <section id="services" className="section bg-[color:var(--bg-soft)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-14">
          <div className="overline mb-5">{tr("services.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
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
                className="surface-card p-6 min-h-[170px] flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              >
                <div className="w-10 h-10 rounded-lg bg-[color:var(--accent-soft)] flex items-center justify-center text-[color:var(--accent)]">
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold tracking-tight text-slate-900">{it.t}</div>
                  <div className="mt-1 text-slate-500 text-sm">{it.d}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
