import React, { createContext, useContext, useEffect, useState } from "react";
import { SUPPORTED_LANGS, dict } from "@/lib/i18n";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("ps_lang");
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    return "sk";
  });

  useEffect(() => {
    localStorage.setItem("ps_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const tr = (path) => {
    const parts = path.split(".");
    let cur = dict[lang] || dict.sk;
    for (const p of parts) {
      if (cur == null) return "";
      cur = cur[p];
    }
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
