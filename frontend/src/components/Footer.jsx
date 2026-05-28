import React from "react";
import { useLang } from "@/contexts/LangContext";
import Logo from "./Logo";
import { api } from "@/lib/api";

export default function Footer() {
  const { tr } = useLang();
  return (
    /* ZMENA: Pozadie zmenené na sýtu tmavú a horný okraj na jemný tmavý border */
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-10 px-6 md:px-10 text-zinc-300">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-10 pb-12">
          <div className="md:col-span-2">
            <Logo size={96} />
            {/* ZMENA: Text upravený na svetlejší sivý, aby netopil v tmavom pozadí */}
            <p className="mt-6 text-zinc-400 max-w-md leading-relaxed">{tr("footer.tagline")}</p>
          </div>
          <div>
            <div className="overline mb-4 text-[#dfb144]">{tr("nav.contact")}</div>
            {/* ZMENA: Farba textu kontaktov z text-slate-600 na text-zinc-400 */}
            <div className="space-y-2 text-zinc-400 text-sm">
              <div>+421 949 334 341</div>
              <div>info@penzion-strba.sk</div>
              <div>{tr("footer.address")}</div>
            </div>
          </div>
          <div>
            <div className="overline mb-4 text-[#dfb144]">Navigate</div>
            {/* ZMENA: Odkazy preklopené do text-zinc-400 a pri prejdení myšou idú do našej zlatej */}
            <div className="space-y-2 text-zinc-400 text-sm">
              <a href="#rooms" className="block hover:text-[#dfb144] transition-colors">{tr("nav.rooms")}</a>
              <a href="#wellness" className="block hover:text-[#dfb144] transition-colors">{tr("nav.wellness")}</a>
              <a href="#location" className="block hover:text-[#dfb144] transition-colors">{tr("nav.location")}</a>
              <a href="#contact" className="block hover:text-[#dfb144] transition-colors">{tr("nav.contact")}</a>
            </div>
          </div>
        </div>

        <div className="hairline border-zinc-800" />
        {/* ZMENA: Spodný copyright upravený na jemnejšiu sivú pre tmavé pozadie */}
        <div className="pt-8 flex flex-wrap gap-4 justify-between items-center text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} Penzión Štrba. {tr("footer.rights")}</div>
          <div className="tracking-[0.2em] text-[#dfb144]">VYSOKÉ TATRY — SK</div>
        </div>
      </div>
    </footer>
  );
}