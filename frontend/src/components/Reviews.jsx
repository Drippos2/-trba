import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LangContext";

export default function Reviews() {
  const { lang, tr } = useLang();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get("/reviews").then((r) => setReviews(r.data)).catch(() => {});
  }, []);

  return (
    <section id="reviews" className="section bg-[color:var(--bg-soft)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="overline mb-5">{tr("reviews.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            {/* ZMENA: Tu som nahradil preklad pevným textom */}
            Čo o nás hovoria hosťia?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.id || i}
              data-testid={`review-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="surface-card p-7 md:p-8 flex flex-col gap-5 min-h-[300px]"
            >
              <Quote className="text-[color:var(--accent)]" size={28} />
              <p className="text-slate-700 leading-relaxed text-base flex-1">
                {rev[`text_${lang}`] || rev.text_sk}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display font-semibold text-slate-900">{rev.name}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{rev.country}</div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(rev.rating || 5)].map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className="fill-[color:var(--accent)] text-[color:var(--accent)]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}