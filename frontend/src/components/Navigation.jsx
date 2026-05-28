import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

// Definícia odkazov v menu - kompletne zachovaná pôvodná štruktúra sekcií
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
  const { tr } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-20 md:h-24">
        {/* Logo s návratom na vrch stránky */}
        <a href="#top" data-testid="brand-logo" className="flex items-center gap-3">
          <Logo size={64} />
        </a>

        {/* Desktop menu - Zachované všetky položky, text upravený na biely pre tmavý podklad */}
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

        {/* Pravá časť: Sociálne siete, Jazyky a Oválne zlaté tlačidlo */}
        <div className="flex items-center gap-5">
          
          {/* Sociálne siete zladené do bielej farby s hoverom do zlata */}
          <div className="hidden sm:flex items-center gap-3 text-white">
            <a 
              href="https://www.facebook.com/vas-profil" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#dfb144] transition-colors duration-200"
              title="Facebook"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/vas-profil" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#dfb144] transition-colors duration-200"
              title="Instagram"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>

          <LanguageSwitcher />

          {/* TLAČIDLO: Identická zlatá farba zo stredovej sekcie, tmavý text a border-radius: 999px (rounded-full) */}
          <a 
            href="https://booking.previo.cz/stay/index/step-2/?hotId=41403&currency=EUR&lang=sk&redirectType=iframe&PHPSESSID=1bjsr5lq8rasqn6vqjrj236ed8&stayId=65505&singleStay=1" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2 md:px-6 md:py-2.5 text-slate-900 bg-[#dfb144] hover:bg-[#cc9f37] rounded-full font-semibold text-xs md:text-sm transition-all duration-300 shadow-md tracking-wide hover:scale-103"
          >
            Overiť dostupnosť
          </a>

        </div>
      </div>
    </header>
  );
}