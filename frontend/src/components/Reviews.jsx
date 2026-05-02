import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LangContext";

export default function Reviews() {
  const { lang, tr } = useLang();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Pridaná kontrola: uistíme sa, že setujeme pole
    api.get("/reviews")
      .then((r) => {
        if (Array.isArray(r.data)) {
          setReviews(r.data);
        } else {
          setReviews([]); // Ak API vráti niečo iné ako pole, nastavíme prázdne pole
        }
      })
      .catch((err) => {
        console.error("Chyba pri načítaní recenzií:", err);
        setReviews([]); // Pri chybe nastavíme prázdne pole, aby map nezlyhal
      });
  }, []);

  return (
    <section id="reviews" className="section bg-[color:var(--bg-soft)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="overline mb-5">{tr("reviews.overline")}</div>
          <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
            Čo o nás hovoria hostia?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* OPRAVA: Pridaná kontrola Array.isArray, aby n.map nehádzal TypeError */}
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((rev, i) => (
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
                  {rev[`text_${lang}`] || rev.text_sk || "Bez textu"}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-semibold text-slate-900">{rev.name || "Hosť"}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{rev.country || ""}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(Number(rev.rating) || 5)].map((_, s) => (
                      <Star
                        key={s}
                        size={14}
                        className="fill-[color:var(--accent)] text-[color:var(--accent)]"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Ak nie sú žiadne recenzie, zobrazíme toto (voliteľné)
            <div className="col-span-full text-center text-slate-400 py-10">
              Momentálne nemáme žiadne recenzie na zobrazenie.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}