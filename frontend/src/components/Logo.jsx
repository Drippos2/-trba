import React from "react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_mountain-escape-23/artifacts/rrbwu1nr_Penzion%20%C5%A1trba%20logo.jpg";

/**
 * Logo component — displays the official Penzión Štrba logo.
 * Uses CSS multiply blend so the white background of the JPG disappears
 * onto white / light surfaces. `size` controls vertical height in px.
 */
export default function Logo({ size = 44, className = "" }) {
  return (
    <img
      src={LOGO_URL}
      alt="Penzión Štrba — Vysoké Tatry"
      style={{ height: size, width: "auto", mixBlendMode: "multiply" }}
      className={`select-none ${className}`}
      draggable="false"
      data-testid="brand-logo-img"
    />
  );
}
