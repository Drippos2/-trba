import React from "react";
import { useLang } from "@/contexts/LangContext";
import { SUPPORTED_LANGS } from "@/lib/i18n";

const LABELS = { sk: "SK", en: "EN", de: "DE" };

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div data-testid="language-switcher" className="flex items-center gap-1 text-xs tracking-[0.2em] font-semibold">
      {SUPPORTED_LANGS.map((code, i) => (
        <React.Fragment key={code}>
          {/* Jemné deliace lomky zladené do polopriesvitnej bielej */}
          {i > 0 && <span className="text-zinc-500">/</span>}
          <button
            data-testid={`lang-${code}`}
            onClick={() => setLang(code)}
            className={`px-1.5 py-1 transition-colors duration-200 ${
              lang === code 
                ? "text-[#dfb144]" 
                : "text-zinc-400 hover:text-white"
            }`}
            aria-label={`Switch to ${code.toUpperCase()}`}
          >
            {LABELS[code]}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}