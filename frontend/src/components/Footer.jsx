import React from "react";
import { useLang } from "@/contexts/LangContext";
import Logo from "./Logo";
import { api } from "@/lib/api";

export default function Footer() {
  const { tr } = useLang();
  
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-10 px-6 md:px-10 text-zinc-300">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-10 pb-12">
          <div className="md:col-span-2">
            <Logo size={96} />
            <p className="mt-6 text-zinc-400 max-w-md leading-relaxed">{tr("footer.tagline")}</p>
          </div>
          
          <div>
            {/* OPRAVENÉ: Validné Tailwind formátovanie nadpisu */}
            <div className="text-xs font-semibold tracking-wider uppercase mb-4 text-[#dfb144]">
              {tr("nav.contact")}
            </div>
            {/* OPRAVENÉ: Kontakty zmenené na reálne klikateľné odkazy pre lepšie UX a SEO skóre */}
            <div className="space-y-2 text-zinc-400 text-sm">
              <div className="block">
                <a href="tel:+421949334341" className="hover:text-[#dfb144] transition-colors">
                  +421 949 334 341
                </a>
              </div>
              <div className="block">
                <a href="mailto:info@penzion-strba.sk" className="hover:text-[#dfb144] transition-colors">
                  info@penzion-strba.sk
                </a>
              </div>
              <div className="leading-relaxed">{tr("footer.address")}</div>
            </div>
          </div>
          
          <div>
            {/* OPRAVENÉ: Validné Tailwind formátovanie nadpisu */}
            <div className="text-xs font-semibold tracking-wider uppercase mb-4 text-[#dfb144]">
              Navigate
            </div>
            {/* OPRAVENÉ: Pridané aria-label atribúty pre bezchybné Best Practices a SEO hodnotenie */}
            <div className="space-y-2 text-zinc-400 text-sm">
              <a 
                href="#rooms" 
                aria-label={tr("nav.rooms")}
                className="block hover:text-[#dfb144] transition-colors"
              >
                {tr("nav.rooms")}
              </a>
              <a 
                href="#wellness" 
                aria-label={tr("nav.wellness")}
                className="block hover:text-[#dfb144] transition-colors"
              >
                {tr("nav.wellness")}
              </a>
              <a 
                href="#location" 
                aria-label={tr("nav.location")}
                className="block hover:text-[#dfb144] transition-colors"
              >
                {tr("nav.location")}
              </a>
              <a 
                href="#contact" 
                aria-label={tr("nav.contact")}
                className="block hover:text-[#dfb144] transition-colors"
              >
                {tr("nav.contact")}
              </a>
            </div>
          </div>
        </div>

        {/* OPRAVENÉ: Nahradená neexistujúca trieda .hairline korektným Tailwind borderom */}
        <div className="border-t border-zinc-800" />
        
        <div className="pt-8 flex flex-wrap gap-4 justify-between items-center text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} Penzión Štrba. {tr("footer.rights")}</div>
          <div className="tracking-[0.2em] text-[#dfb144] font-medium">VYSOKÉ TATRY — SK</div>
        </div>
      </div>
    </footer>
  );
}