import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { sk, enUS, de } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { X, Check, ChevronLeft, ChevronRight, Clock, Users, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";

export default function WellnessBookingDialog({ open, onClose }) {
  const { lang, tr } = useLang();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [contact, setContact] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    phone: "", 
    notes: "" 
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Kapacita nastavená na 2 osoby podľa tvojho zadania
  const MAX_CAPACITY = 2;
  const timeSlots = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  // Reset stavu pri otvorení/zatvorení
  useEffect(() => {
    if (open) {
      setStep(1);
      setDone(false);
      setAdults(2);
      setChildren(0);
      setSelectedDate(undefined);
      setSelectedTime("");
      setContact({ first_name: "", last_name: "", email: "", phone: "", notes: "" });
    }
  }, [open]);

  // Výber správneho jazykového balíka pre kalendár z date-fns
  const calendarLocale = useMemo(() => {
    if (lang === 'sk') return sk;
    if (lang === 'de') return de;
    return enUS;
  }, [lang]);

  // Dynamický výpočet ceny (Dospelý 15€, Dieťa 8€)
  const total = useMemo(() => {
    return (adults * 15) + (children * 8);
  }, [adults, children]);

  // Validácia jednotlivých krokov
  const canProceed1 = selectedDate && selectedTime;
  const canProceed2 = (adults + children) >= 1 && (adults + children) <= MAX_CAPACITY;
  const canSubmit = contact.first_name && contact.last_name && contact.email && contact.phone;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    
    try {
      // Formátovanie dátumu tak, aby sedel s časovým pásmom
      const offset = selectedDate.getTimezoneOffset();
      const correctedDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
      const dateStr = correctedDate.toISOString().split('T')[0];

      await api.post("/wellness-reservations", {
        ...contact,
        date: dateStr,
        time: selectedTime,
        guests_adults: adults,
        guests_children: children,
        language: lang,
      });
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      toast.error(typeof msg === 'string' ? msg : tr("wellness.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        {/* Pozadie / Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          onClick={onClose} 
        />
        
        {/* Modálne okno */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Hlavička */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-start justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {!done ? `${tr("wellness.step")} ${step} / 3` : tr("wellness.done")}
                </span>
                {!done && (
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    • {tr("wellness.overline")}
                  </span>
                )}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {done ? tr("wellness.thanks") : tr("wellness.bookingTitle")}
              </h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {done ? (
              /* Obrazovka po úspešnom odoslaní */
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="p-10 md:p-16 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center mb-8 shadow-inner">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4">{tr("wellness.successTitle")}</h4>
                <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                  {tr("wellness.successMessage")}
                </p>
                <button 
                  onClick={onClose} 
                  className="mt-10 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                >
                  {tr("wellness.close")}
                </button>
              </motion.div>
            ) : (
              <div className="p-6 md:p-8">
                {/* Indikátory postupu */}
                <div className="flex gap-3 mb-10">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex-1">
                      <div className={`h-1.5 rounded-full transition-all duration-500 ${n <= step ? "bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]" : "bg-slate-100"}`} />
                    </div>
                  ))}
                </div>

                {/* KROK 1: Dátum a Čas */}
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="grid lg:grid-cols-2 gap-10"
                  >
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Calendar size={14} className="text-indigo-500" /> 1. {tr("wellness.selectDate")}
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex justify-center shadow-inner">
                        <DayPicker 
                          mode="single" 
                          selected={selectedDate} 
                          onSelect={setSelectedDate} 
                          disabled={{ before: new Date() }}
                          locale={calendarLocale}
                          className="m-0 wellness-datepicker"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Clock size={14} className="text-indigo-500" /> 2. {tr("wellness.selectTime")}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`group p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                              selectedTime === time 
                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-lg shadow-indigo-100 ring-2 ring-indigo-600/10" 
                                : "border-slate-100 hover:border-slate-300 bg-white text-slate-600"
                            }`}
                          >
                            <span className={`text-lg font-bold ${selectedTime === time ? "text-indigo-700" : "text-slate-900"}`}>{time}</span>
                            <span className="text-[10px] uppercase tracking-tighter opacity-60">{tr("wellness.availableEntry")}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* KROK 2: Počet osôb a Súhrn */}
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="grid lg:grid-cols-2 gap-10"
                  >
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <Users size={14} className="text-indigo-500" /> {tr("wellness.adults")} (15€)
                        </label>
                        <Counter value={adults} onChange={setAdults} min={1} max={MAX_CAPACITY - children} />
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                           {tr("wellness.children")} (8€)
                        </label>
                        <Counter value={children} onChange={setChildren} min={0} max={MAX_CAPACITY - adults} />
                      </div>
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold">!</div>
                        <p className="text-amber-800 text-sm leading-snug">{tr("wellness.capacityNote")}</p>
                      </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Users size={120} />
                      </div>
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">{tr("wellness.summary")}</div>
                      <div className="space-y-4 relative z-10">
                        <SummaryRow label={tr("wellness.date")} value={selectedDate?.toLocaleDateString(lang === 'sk' ? 'sk-SK' : 'en-US')} />
                        <SummaryRow label={tr("wellness.time")} value={selectedTime} />
                        <SummaryRow label={tr("wellness.capacity")} value={`${adults + children} / ${MAX_CAPACITY} ${tr("wellness.persons")}`} />
                        <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
                          <div className="text-xs font-bold text-slate-400 uppercase">{tr("wellness.totalPrice")}</div>
                          <div className="text-4xl font-black text-indigo-600">€{total.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* KROK 3: Kontaktné údaje */}
                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="grid lg:grid-cols-2 gap-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputRow label={tr("wellness.firstName")} value={contact.first_name} onChange={(v) => setContact({ ...contact, first_name: v })} />
                      <InputRow label={tr("wellness.lastName")} value={contact.last_name} onChange={(v) => setContact({ ...contact, last_name: v })} />
                      <div className="md:col-span-2">
                        <InputRow label={tr("wellness.email")} value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" />
                      </div>
                      <div className="md:col-span-2">
                        <InputRow label={tr("wellness.phone")} value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
                      </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-200 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-6">{tr("wellness.finalSummary")}</div>
                        <div className="space-y-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-indigo-200 text-[10px] uppercase font-bold">{tr("wellness.date")} & {tr("wellness.time")}</span>
                            <span className="text-xl font-bold">{selectedDate?.toLocaleDateString(lang === 'sk' ? 'sk-SK' : 'en-US')} @ {selectedTime}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-indigo-200 text-[10px] uppercase font-bold">{tr("wellness.guests")}</span>
                            <span className="text-xl font-bold">{adults} {tr("wellness.adultsShort")}, {children} {tr("wellness.childrenShort")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-10 pt-8 border-t border-indigo-500/50 flex items-center justify-between">
                        <div className="text-indigo-100 font-medium">{tr("wellness.payAtPlace")}</div>
                        <div className="text-4xl font-black italic">€{total.toFixed(2)}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Navigačná pätka */}
          {!done && (
            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold hover:text-slate-900 disabled:opacity-0 transition-all"
              >
                <ChevronLeft size={20} /> {tr("wellness.back")}
              </button>

              <div className="flex gap-3">
                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={(step === 1 && !canProceed1) || (step === 2 && !canProceed2)}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
                  >
                    {tr("wellness.continue")} <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                    className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-700 disabled:bg-slate-200 transition-all shadow-xl shadow-indigo-200 tracking-wide uppercase text-sm"
                  >
                    {submitting ? tr("wellness.submitting") : tr("wellness.confirm")}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Sub-komponenty
function Counter({ value, onChange, min, max }) {
  return (
    <div className="flex items-center gap-6 bg-white border border-slate-200 p-2 rounded-2xl w-fit shadow-sm">
      <button 
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))} 
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-20"
        disabled={value <= min}
      >
        −
      </button>
      <div className="w-8 text-center text-2xl font-black text-slate-900">{value}</div>
      <button 
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))} 
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all disabled:opacity-20"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

function InputRow({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">{label}</label>
      <input 
        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 font-medium" 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="..."
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b border-slate-200/50 last:border-0 items-center">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-tight">{label}</span>
      <span className="text-slate-900 font-bold">{value ?? "—"}</span>
    </div>
  );
}