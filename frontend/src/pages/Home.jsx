import React, { useState, lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";

// Kritické sekcie hneď pod záhybom načítame s predstihom, ale stále oddelene
const About = lazy(() => import("@/components/About"));
const Rooms = lazy(() => import("@/components/Rooms"));

// Nekritické sekcie hlboko na stránke sa načítajú až pri scrollnutí (Lazy Loading)
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

  const openBooking = (roomId) => {
    setInitialRoomId(roomId ?? null);
    setBookingOpen(true);
  };

  return (
    <div className="App bg-white text-slate-700 min-h-screen">
      {/* Tieto prvky sa vykreslia OKAMŽITE pre bleskové LCP a FCP skóre */}
      <Navigation onBookClick={() => openBooking(null)} />
      <Hero onBookClick={() => openBooking(null)} />
      <TrustStrip />

      {/* Zvyšok stránky beží v odľahčenom režime */}
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <About />
        <Rooms onBookRoom={(id) => openBooking(id)} />
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
    </div>
  );
}