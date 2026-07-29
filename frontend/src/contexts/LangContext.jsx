import React, { createContext, useContext, useEffect, useState } from "react";
import { SUPPORTED_LANGS, dict } from "@/lib/i18n";
import { useNavigate, useLocation } from "react-router-dom";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Zistíme jazyk z aktuálnej URL (napr. /de/.. -> "de", /en/.. -> "en", inak "sk")
  const getLangFromPath = (pathname) => {
    const segments = pathname.split("/");
    const potentialLang = segments[1]; // Druhý segment po prvom lomítku
    if (SUPPORTED_LANGS.includes(potentialLang)) {
      return potentialLang;
    }
    return "sk"; // Predvolená slovenčina pre "/"
  };

  const [lang, setLangState] = useState(() => getLangFromPath(window.location.pathname));

  // Ak sa zmení URL (napr. užívateľ klikne na odkaz alebo späť v prehliadači), aktualizujeme stav jazyka
  useEffect(() => {
    const currentLang = getLangFromPath(location.pathname);
    if (currentLang !== lang) {
      setLangState(currentLang);
    }
    document.documentElement.lang = currentLang;
  }, [location.pathname]);

  // Vlastná funkcia na zmenu jazyka, ktorá reálne presmeruje na správnu URL pod-cestu
  const setLang = (newLang) => {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    
    setLangState(newLang);
    localStorage.setItem("ps_lang", newLang);

    // Zistíme čistú cestu bez aktuálneho jazykového prefixu
    const segments = location.pathname.split("/");
    if (SUPPORTED_LANGS.includes(segments[1])) {
      segments.splice(1, 1); // Odstránime starý jazyk
    }
    const cleanPath = segments.join("/") || "/";

    // Presmerujeme na novú URL pre daný jazyk
    if (newLang === "sk") {
      navigate(cleanPath);
    } else {
      navigate(`/${newLang}${cleanPath === "/" ? "" : cleanPath}`);
    }
  };

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