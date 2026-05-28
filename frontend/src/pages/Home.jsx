import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import About from "@/components/About";
import Rooms from "@/components/Rooms";
import Wellness from "@/components/Wellness";
import Audiences from "@/components/Audiences";
// SEM PRIDAJ TENTO IMPORT:
import Services from "@/components/Services";
import Location from "@/components/Location";
import Reviews from "@/components/Reviews";
import CtaStrip from "@/components/CtaStrip";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";


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
      <Navigation onBookClick={() => openBooking(null)} />
      <Hero onBookClick={() => openBooking(null)} />
      <TrustStrip />
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
    </div>
  );
}