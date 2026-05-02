import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { api, formatApiError } from "@/lib/api";
import { useLang } from "@/contexts/LangContext";
import { toast } from "sonner";

export default function BookingDialog({ open, onClose, rooms, initialRoomId }) {
  const { lang, tr } = useLang();
  const [step, setStep] = useState(1);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  
  // OPRAVA: Bezpečnejšia inicializácia roomId
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setDone(false);
      // Ak je zadané initialRoomId, použijeme ho, inak skúsime prvú dostupnú izbu
      if (initialRoomId) {
        setRoomId(initialRoomId);
      } else if (Array.isArray(rooms) && rooms.length > 0) {
        setRoomId(rooms[0].id);
      }
    }
  }, [open, initialRoomId, rooms]);

  // KRITICKÁ OPRAVA: Kontrola, či je 'rooms' pole pred volaním .find()
  const selectedRoom = useMemo(() => {
    if (!Array.isArray(rooms)) return null;
    return rooms.find((r) => r.id === roomId);
  }, [rooms, roomId]);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [wellness, setWellness] = useState(false);
  const [halfBoard, setHalfBoard] = useState(false);
  const [contact, setContact] = useState({ first_name: "", last_name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const nights = useMemo(() => {
    if (!range.from || !range.to) return 0;
    const diff = (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(Math.round(diff), 0);
  }, [range]);

  const total = useMemo(() => {
    if (!selectedRoom || nights === 0) return 0;
    const base = selectedRoom.price_per_night * nights * adults;
    const child = selectedRoom.price_per_night * 0.5 * nights * children;
    const tax = 2 * nights * (adults + children);
    const oneNight = nights === 1 ? 5 * (adults + children) : 0;
    const well = wellness ? 30 : 0;
    const hb = halfBoard ? 10 * (adults + children) * nights : 0;
    return Math.round((base + child + tax + oneNight + well + hb) * 100) / 100;
  }, [selectedRoom, nights, adults, children, wellness, halfBoard]);

  const canProceed1 = range.from && range.to && nights >= 2 && roomId;
  const canProceed2 = adults >= 1 && (adults + children) <= (selectedRoom?.capacity ?? 99);
  const canSubmit = contact.first_name && contact.last_name && contact.email && contact.phone;

  const toISO = (d) => (d ? d.toISOString().slice(0, 10) : null);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.post("/reservations", {
        ...contact,
        check_in: toISO(range.from),
        check_out: toISO(range.to),
        room_type_id: roomId,
        guests_adults: adults,
        guests_children: children,
        wellness,
        half_board: halfBoard,
        language: lang,
      });
      setDone(true);
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
          data-testid="booking-overlay"
        />
        <motion.div
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          data-testid="booking-dialog"
        >
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-slate-200 p-5 md:p-7 flex items-start justify-between rounded-t-2xl">
            <div>
              <div className="overline mb-1.5">
                {!done ? `${tr("booking.step")} ${step} ${tr("booking.of")} 3` : ""}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                {done ? tr("booking.thanks") : tr("booking.title")}
              </h3>
              {!done && <p className="mt-1 text-slate-500 text-sm max-w-lg">{tr("booking.subtitle")}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1"
              data-testid="booking-close-btn"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>

          {done ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[color:var(--accent)] text-white mx-auto flex items-center justify-center">
                <Check size={28} />
              </div>
              <p className="mt-6 text-slate-600 text-base md:text-lg max-w-md mx-auto">
                {tr("booking.thanksBody")}
              </p>
              <button onClick={onClose} className="btn-primary mt-8" data-testid="booking-done-close">
                {tr("booking.close")}
              </button>
            </div>
          ) : (
            <div className="p-5 md:p-8">
              <div className="flex gap-2 mb-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1 rounded-full flex-1 transition-colors ${
                      n <= step ? "bg-[color:var(--accent)]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="overline mb-3 block">{tr("booking.room")}</label>
                    <div className="space-y-2">
                      {Array.isArray(rooms) && rooms.map((r) => {
                        const name = r[`name_${lang}`] || r.name_sk;
                        const selected = roomId === r.id;
                        return (
                          <button
                            key={r.id}
                            data-testid={`booking-room-${r.id}`}
                            onClick={() => setRoomId(r.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                              selected
                                ? "border-[color:var(--accent)] bg-[color:var(--accent-soft)]/40"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-display font-semibold text-slate-900">{name}</div>
                              <div className="text-[color:var(--accent)] font-display font-semibold text-sm">
                                €{r.price_per_night}
                                <span className="text-slate-400 text-xs ml-1 font-normal">{tr("rooms.night")}</span>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {tr("rooms.guests")}: {r.capacity}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="overline mb-3 block">{tr("booking.chooseDates")}</label>
                    <div
                      className="bg-white border border-slate-200 rounded-xl p-2 flex justify-center"
                      data-testid="booking-calendar"
                    >
                      <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        numberOfMonths={1}
                        disabled={{ before: new Date() }}
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <Mini label={tr("booking.checkin")} value={range.from?.toLocaleDateString()} />
                      <Mini label={tr("booking.checkout")} value={range.to?.toLocaleDateString()} />
                      <Mini label={tr("booking.nights")} value={nights} />
                    </div>
                    {nights === 1 && (
                      <div className="mt-2 text-xs text-[color:var(--accent)]">
                        min. 2 nights (1-night fee: €5 / person applies)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="overline mb-3 block">{tr("booking.adults")}</label>
                    <Counter value={adults} onChange={setAdults} min={1} max={selectedRoom?.capacity || 4} testid="adults" />
                    <label className="overline mt-6 mb-3 block">{tr("booking.children")}</label>
                    <Counter value={children} onChange={setChildren} min={0} max={4} testid="children" />
                  </div>
                  <div className="space-y-4">
                    <CheckboxRow checked={wellness} onChange={setWellness} label={tr("booking.wellness")} testid="wellness" />
                    <CheckboxRow checked={halfBoard} onChange={setHalfBoard} label={tr("booking.halfBoard")} testid="halfboard" />

                    <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-[color:var(--bg-soft)]">
                      <div className="overline mb-3">{tr("booking.summary")}</div>
                      <SummaryRow label={tr("booking.room")} value={selectedRoom?.[`name_${lang}`] || selectedRoom?.name_sk} />
                      <SummaryRow label={tr("booking.nights")} value={nights} />
                      <SummaryRow label={tr("booking.adults")} value={adults} />
                      <SummaryRow label={tr("booking.children")} value={children} />
                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-end justify-between">
                        <div className="text-slate-500 text-xs tracking-[0.15em] uppercase">
                          {tr("booking.total")}
                        </div>
                        <div className="font-display text-2xl font-semibold text-[color:var(--accent)]">
                          €{total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <InputRow label={tr("booking.firstName")} value={contact.first_name} onChange={(v) => setContact({ ...contact, first_name: v })} testid="first_name" />
                    <InputRow label={tr("booking.lastName")} value={contact.last_name} onChange={(v) => setContact({ ...contact, last_name: v })} testid="last_name" />
                    <InputRow label={tr("booking.email")} value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" testid="email" />
                    <InputRow label={tr("booking.phone")} value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} testid="phone" />
                    <div>
                      <label className="overline mb-2 block">{tr("booking.notes")}</label>
                      <textarea
                        className="input-light min-h-[90px]"
                        value={contact.notes}
                        onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                        data-testid="booking-notes"
                      />
                    </div>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200 bg-[color:var(--bg-soft)] h-fit">
                    <div className="overline mb-3">{tr("booking.summary")}</div>
                    <SummaryRow label={tr("booking.room")} value={selectedRoom?.[`name_${lang}`] || selectedRoom?.name_sk} />
                    <SummaryRow label={tr("booking.checkin")} value={range.from?.toLocaleDateString()} />
                    <SummaryRow label={tr("booking.checkout")} value={range.to?.toLocaleDateString()} />
                    <SummaryRow label={tr("booking.nights")} value={nights} />
                    <SummaryRow label={tr("booking.adults")} value={adults} />
                    <SummaryRow label={tr("booking.children")} value={children} />
                    <SummaryRow label={tr("booking.wellness")} value={wellness ? "✓" : "—"} />
                    <SummaryRow label={tr("booking.halfBoard")} value={halfBoard ? "✓" : "—"} />
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-end justify-between">
                      <div className="text-slate-500 text-xs tracking-[0.15em] uppercase">
                        {tr("booking.total")}
                      </div>
                      <div className="font-display text-2xl font-semibold text-[color:var(--accent)]">
                        €{total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  data-testid="booking-back-btn"
                  className="btn-outline disabled:opacity-40 text-sm"
                >
                  <ChevronLeft size={16} /> {tr("booking.back")}
                </button>

                {step < 3 && (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={(step === 1 && !canProceed1) || (step === 2 && !canProceed2)}
                    data-testid="booking-next-btn"
                    className="btn-primary disabled:opacity-50 text-sm"
                  >
                    {tr("booking.next")} <ChevronRight size={16} />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={submit}
                    disabled={!canSubmit || submitting}
                    data-testid="booking-submit-btn"
                    className="btn-primary disabled:opacity-50 text-sm"
                  >
                    {submitting ? "..." : tr("booking.confirm")}
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Pomocné komponenty zostávajú nezmenené
function Counter({ value, onChange, min = 0, max = 10, testid }) {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white" data-testid={`counter-${testid}`}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-l-xl"
        data-testid={`counter-${testid}-minus`}
      >
        −
      </button>
      <div className="px-6 py-3 font-display font-semibold text-lg min-w-[60px] text-center text-slate-900">
        {value}
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-r-xl"
        data-testid={`counter-${testid}-plus`}
      >
        +
      </button>
    </div>
  );
}

function CheckboxRow({ checked, onChange, label, testid }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
          checked ? "bg-[color:var(--accent)] border-[color:var(--accent)]" : "border-slate-300"
        }`}
        data-testid={`checkbox-${testid}`}
      >
        {checked && <Check size={14} className="text-white" />}
      </button>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function InputRow({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <label className="overline mb-2 block">{label}</label>
      <input
        className="input-light"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        data-testid={`booking-${testid}`}
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 text-right max-w-[60%] truncate">{value ?? "—"}</span>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div>
      <div className="text-slate-500 text-xs">{label}</div>
      <div className="font-display font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}