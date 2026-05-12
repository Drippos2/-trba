import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LangContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

// Definícia odkazov v menu
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
        scrolled ? "glass-nav" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 h-20 md:h-24">
        {/* Logo s návratom na vrch stránky */}
        <a href="#top" data-testid="brand-logo" className="flex items-center gap-3">
          <Logo size={64} />
        </a>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-7 text-sm text-slate-600">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-${l.key.split(".")[1]}`}
              className="hover:text-slate-900 transition-colors"
            >
              {tr(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {/* Tlačidlo Rezervovať bolo úspešne odstránené */}
        </div>
      </div>
    </header>
  );
}