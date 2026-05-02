import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

const links = [
  { href: "#about", key: "nav.about" },
  { href: "#rooms", key: "nav.rooms" },
  { href: "#wellness", key: "nav.wellness" },
  { href: "#audiences", key: "nav.audiences" },
  { href: "#pricing", key: "nav.pricing" }, // Pridaný odkaz na cenník
  { href: "#services", key: "nav.services" },
  { href: "#location", key: "nav.location" },
  { href: "#reviews", key: "nav.reviews" },
  { href: "#contact", key: "nav.contact" },
];

export default function Navigation({ onBookClick }) {
  const { tr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        <a href="#top" data-testid="brand-logo" className="flex items-center gap-3">
          <Logo size={64} />
        </a>

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
          <button
            data-testid="nav-book-btn"
            onClick={onBookClick}
            className="btn-primary hidden md:inline-flex !py-2.5 !px-5 text-sm"
          >
            {tr("nav.book")}
          </button>

          <button
            data-testid="nav-mobile-toggle"
            className="lg:hidden text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="lg:hidden glass-nav border-t border-slate-200">
          <div className="px-6 py-6 flex flex-col gap-4 text-slate-700">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-1"
                data-testid={`nav-mob-${l.key.split(".")[1]}`}
              >
                {tr(l.key)}
              </a>
            ))}
            <button
              data-testid="nav-mob-book-btn"
              onClick={() => {
                setOpen(false);
                onBookClick?.();
              }}
              className="btn-primary text-sm mt-2 justify-center"
            >
              {tr("nav.book")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}