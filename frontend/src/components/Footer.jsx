import React from "react";
import { useLang } from "@/contexts/LangContext";
import Logo from "./Logo";

export default function Footer() {
  const { tr } = useLang();
  return (
    <footer className="bg-[color:var(--bg-soft)] border-t border-slate-200 pt-16 pb-10 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-4 gap-10 pb-12">
          <div className="md:col-span-2">
            <Logo size={96} />
            <p className="mt-6 text-slate-600 max-w-md leading-relaxed">{tr("footer.tagline")}</p>
          </div>
          <div>
            <div className="overline mb-4">{tr("nav.contact")}</div>
            <div className="space-y-2 text-slate-600 text-sm">
              <div>+421 949 334 341</div>
              <div>info@penzion-strba.sk</div>
              <div>{tr("footer.address")}</div>
            </div>
          </div>
          <div>
            <div className="overline mb-4">Navigate</div>
            <div className="space-y-2 text-slate-600 text-sm">
              <a href="#rooms" className="block hover:text-slate-900">{tr("nav.rooms")}</a>
              <a href="#wellness" className="block hover:text-slate-900">{tr("nav.wellness")}</a>
              <a href="#location" className="block hover:text-slate-900">{tr("nav.location")}</a>
              <a href="#contact" className="block hover:text-slate-900">{tr("nav.contact")}</a>
            </div>
          </div>
        </div>

        <div className="hairline" />
        <div className="pt-8 flex flex-wrap gap-4 justify-between items-center text-xs text-slate-500">
          <div>© {new Date().getFullYear()} Penzión Štrba. {tr("footer.rights")}</div>
          <div className="tracking-[0.2em]">VYSOKÉ TATRY — SK</div>
        </div>
      </div>
    </footer>
  );
}
