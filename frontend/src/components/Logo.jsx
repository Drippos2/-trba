import React from "react";
import { api } from "@/lib/api";

// Cesta upravená na tvoj nový optimalizovaný WebP obrázok v public zložke
const LOGO_URL = "/logo.webp";

/**
 * Logo component — displays the official Penzión Štrba logo.
 * Uses CSS multiply blend so the white background disappears
 * onto white / light surfaces. `size` controls vertical height in px.
 */
export default function Logo({ size = 44, className = "" }) {
  /* ZMENA: mixBlendMode sa aplikuje iba vtedy, ak trieda neobsahuje "invert" (napr. v tmavom footri), 
      aby logo na čiernom podklade nezmizlo, ale zostalo viditeľné */
  const isDarkContext = className.includes("invert") || className.includes("brightness");

  // OPRAVA PRE PAGESPEED: Výpočet šírky podľa reálneho pomeru strán loga (približne 2.5x väčšia šírka ako výška)
  // Vďaka tomu vieme poslať presné čísla do HTML atribútov width a height
  const calculatedWidth = Math.round(size * 2.5);

  return (
    <img
      src={LOGO_URL}
      alt="Penzión Štrba — Vysoké Tatry"
      // Pridané natívne HTML atribúty pre PageSpeed analyzátor
      width={calculatedWidth}
      height={size}
      style={{ 
        height: size, 
        width: "auto", 
        mixBlendMode: isDarkContext ? "normal" : "multiply" 
      }}
      className={`select-none ${className}`}
      draggable="false"
      data-testid="brand-logo-img"
    />
  );
}