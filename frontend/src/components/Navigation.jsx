import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { api } from "@/lib/api";

const links = [
  { href: "#about", key: "nav.about" },
  { href: "#rooms", key: "nav.rooms" },
  { href: "#wellness", key: "nav.wellness" },
  { href: "#audiences", key: "nav.audiences" },
  { href: "#services", key: "nav.services" },
  { href: "#location", key: "nav.location" },
  { href: "#reviews", key: "nav.reviews" },
  { href: "#contact", key: "nav.contact" },
];

export default function Navigation() {
  const { tr, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lokalizované preklady a odkazy pre tlačidlo dostupnosti
  const buttonContent = {
    sk: {
      text: "Overiť dostupnosť",
      url: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=sk&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    },
    en: {
      text: "Check availability",
      url: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=en&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    },
    de: {
      text: "Verfügbarkeit prüfen",
      url: "https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=de&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1"
    }
  };

  const currentButton = buttonContent[lang] || buttonContent.sk;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blokovanie scrollovania pozadia
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || isMobileMenuOpen ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      {/* OPRAVENÉ: Pridané flex w-full a plynulé zarovnanie */}
      <div className="max-w-[1400px] mx-auto h-20 md:h-24 px-4 flex items-center justify-between w-full">
        
        {/* Logo */}
        <a href="#top" data-testid="brand-logo" className="flex items-center gap-3 shrink-0 z-50">
          <Logo size={64} />
        </a>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.key.split(".")[1]}`}
              className="hover:text-zinc-300 transition-colors duration-200"
            >
              {tr(l.key)}
            </a>
          ))}
        </nav>

        {/* Pravá časť pre PC */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3 text-white">
            <a href="https://www.facebook.com/penzion.strba/" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb144] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb144] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <LanguageSwitcher />
          <a 
            href={currentButton.url} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-slate-900 bg-[#dfb144] hover:bg-[#cc9f37] rounded-full font-semibold text-xs transition-all duration-300 shadow-md hover:scale-105 whitespace-nowrap"
          >
            {currentButton.text}
          </a>
        </div>

        {/* MOBILNÁ LIŠTA */}
        <div className="flex lg:hidden items-center gap-3 z-50">
          <a 
            href={currentButton.url} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-slate-900 bg-[#dfb144] rounded-full font-bold text-[11px] uppercase tracking-wider shadow-sm"
          >
            {currentButton.text}
          </a>

          {/* OPRAVENÁ FUNKCIA ONCLICK TU: */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none p-2"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl font-bold font-mono block transition-transform duration-200 rotate-90">✕</span>
            ) : (
              <span className="text-2xl font-bold font-mono block">☰</span>
            )}
          </button>
        </div>

      </div>

      {/* MOBILNÉ MENU OVERLAY */}
      <div
        className={`
          fixed inset-0 top-0 left-0 h-screen w-screen bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"} 
          lg:hidden
        `}
      >
        <nav className="flex flex-col items-center gap-6 text-lg font-medium text-white text-center">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#dfb144] transition-colors duration-200 py-1 block"
            >
              {tr(l.key)}
            </a>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-zinc-800 w-48 flex flex-col items-center gap-6">
          <div className="scale-110">
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-5 text-white">
            <a href="https://www.facebook.com/penzion.strba/" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#dfb144] transition-colors">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#dfb144] transition-colors">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0 3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}