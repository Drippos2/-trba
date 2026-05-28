import React, { createContext, useContext, useEffect, useState } from "react";
import { SUPPORTED_LANGS, dict } from "@/lib/i18n";
import { api } from "@/lib/api";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ps_lang");
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    }
    return "sk";
  });

  useEffect(() => {
    localStorage.setItem("ps_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Vylepšená funkcia na preklady, ktorá bezpečne vracia texty aj polia (napr. wellness.items)
  const tr = (path) => {
    if (!path) return "";
    
    const parts = path.split(".");
    let cur = dict[lang] || dict.sk;
    
    for (const p of parts) {
      if (cur == null) return "";
      cur = cur[p];
    }
    
    // Ak je výsledok pole alebo objekt, vrátime ho priamo (aby .map() vo Wellness fungovalo)
    if (Array.isArray(cur) || (cur !== null && typeof cur === "object")) {
      return cur;
    }
    
    // Inak vrátime string, prípadne prázdny reťazec ako fallback
    return cur ?? "";
  };

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}