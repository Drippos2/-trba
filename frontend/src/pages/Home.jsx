import React, { useState, useEffect, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";

// Tieto dve sekcie sú hneď pod záhybom - načítame ich štandardne, aby tam pri scrolle nebola diera
import About from "@/components/About";
import Rooms from "@/components/Rooms";

// Ostatné ťažké sekcie nižšie na stránke načítame dynamicky (Lazy)
const Wellness = lazy(() => import("@/components/Wellness"));
const Audiences = lazy(() => import("@/components/Audiences"));
const Services = lazy(() => import("@/components/Services"));
const Location = lazy(() => import("@/components/Location"));
const Reviews = lazy(() => import("@/components/Reviews"));
const CtaStrip = lazy(() => import("@/components/CtaStrip"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));
const BookingDialog = lazy(() => import("@/components/BookingDialog"));

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialRoomId, setInitialRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);
  
  // Stav, ktorý stráži, či už užívateľ začal scrollovať
  const [hasScrolled, setHasScrolled] = useState(false);

  // Akonáhle užívateľ pohne stránkou, povolíme načítanie celého zvyšku webu
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openBooking = (roomId) => {
    setInitialRoomId(roomId ?? null);
    setBookingOpen(true);
    // Pre istotu povolíme načítanie dialogu, ak by klikol na tlačidlo hneď bez scrollu
    setHasScrolled(true);
  };

  return (
    <div className="App bg-white text-slate-700 min-h-screen">
      {/* 1. KRITICKÁ ZÓNA: Načíta sa bleskovo bez JS blokovania */}
      <Navigation onBookClick={() => openBooking(null)} />
      <Hero onBookClick={() => openBooking(null)} />
      <TrustStrip />

      {/* Tieto sekcie vidí človek hneď po jemnom posunutí, preto sú tu napevno */}
      <About />
      <Rooms onBookRoom={(id) => openBooking(id)} />

      {/* 2. NEKRITICKÁ ZÓNA: Načíta sa až vtedy, keď užívateľ reálne začne scrollovať */}
      {hasScrolled ? (
        <Suspense fallback={<div className="h-40 bg-white flex items-center justify-center text-zinc-400 text-xs animate-pulse">Nahráva sa obsah...</div>}>
          <Wellness onBookClick={() => openBooking(null)} />
          <Audiences onBookClick={() => openBooking(null)} />
          <Services />
          <Location />
          <Reviews />
          <CtaStrip onBookClick={() => openBooking(null)} />
          <ContactSection />
          <Footer />

          <BookingDialog
            open={bookingOpen}
            onClose={() => setBookingOpen(false)}
            rooms={rooms}
            initialRoomId={initialRoomId}
          />
        </Suspense>
      ) : (
        // Výkonový placeholder - kým človek nescrolluje, vyhradíme len prázdne miesto, aby neposkočil web (CLS)
        <div className="h-96 bg-white" />
      )}
    </div>
  );
}