import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Bed, ArrowRight, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

// Komponent pre zobrazenie fotky na celú obrazovku
const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <X size={32} />
      </button>

      <button 
        className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors p-2"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft size={48} />
      </button>

      <motion.img
        key={currentIndex}
        src={images[currentIndex]}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      />

      <button 
        className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors p-2"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight size={48} />
      </button>

      <div className="absolute bottom-6 text-white/60 text-sm tracking-widest">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

const RoomGallery = ({ images, alt, onImageClick }) => {
  const [index, setIndex] = useState(0);

  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden group/gallery cursor-zoom-in" onClick={() => onImageClick(index, images)}>
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/gallery:opacity-100 transition-opacity flex items-center justify-center">
         <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
            <Maximize2 className="text-white" size={20} />
         </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-4 opacity-0 group-hover/gallery:opacity-100 transition-opacity">
        <button onClick={prev} className="p-2 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="p-2 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default function Rooms({ onBookRoom }) {
  const { tr } = useLang();
  const [selectedLightbox, setSelectedLightbox] = useState(null);

  const roomsData = [
    {
      id: "podkrovie-main",
      name_sk: "Štýlová podkrovná izba",
      description_sk: "Zažite neopakovateľnú atmosféru v našej priestrannej podkrovnej izbe. Kombinácia dreva a moderného vybavenia vytvára dokonalé útočisko po dni strávenom v horách.",
      images: [
        "/rooms/podkrovie1.jpg", "/rooms/podkrovie2.jpg", "/rooms/podkrovie3.jpg", "/rooms/podkrovie4.jpg",
        "/rooms/podkrovie5.jpg", "/rooms/podkrovie6.jpg", "/rooms/podkrovie7.jpg", "/rooms/podkrovie8.jpg",
      ],
      price_per_night: 59,
      capacity: 2,
    },
    {
      id: "prizemie-main",
      name_sk: "Komfortná izba na prízemí",
      description_sk: "Moderná a svetlá izba na prízemí s jednoduchým prístupom. Ponúka maximálne pohodlie a štýlový interiér pre váš oddych.",
      images: [
        "/rooms/prizemie1.jpg", "/rooms/prizemie2.jpg", "/rooms/prizemie3.jpg", "/rooms/prizemie4.jpg",
        "/rooms/prizemie5.jpg", "/rooms/prizemie6.jpg"
      ],
      price_per_night: 59,
      capacity: 2,
    },
    {
      id: "bloka-main",
      name_sk: "Apartmán Blok A",
      description_sk: "Exkluzívny priestor v Bloku A s dôrazom na detail a súkromie. Ideálne pre náročných hostí hľadajúcich pokoj.",
      images: [
        "/rooms/bloka1.jpg", "/rooms/bloka2.jpg", "/rooms/bloka3.jpg"
      ],
      price_per_night: 59,
      capacity: 3,
    },
    {
      id: "blokb-main",
      name_sk: "Apartmán Blok B",
      description_sk: "Moderný apartmán v Bloku B navrhnutý pre maximálny relax. Čisté línie a funkčné vybavenie pre váš dokonalý pobyt.",
      images: [
        "/rooms/blokb1.jpg", "/rooms/blokb2.jpg"
      ],
      price_per_night: 59,
      capacity: 2,
    },
    {
      id: "blokc-main",
      name_sk: "Apartmán Blok C",
      description_sk: "Priestranný a svetlý apartmán v Bloku C. Ponúka prémiové vybavenie a výhľad, ktorý vám spríjemní každé ráno.",
      images: [
        "/rooms/blokc1.jpg", "/rooms/blokc2.jpg", "/rooms/blokc3.jpg"
      ],
      price_per_night: 59,
      capacity: 2,
    }
  ];

  const handleOpenLightbox = (index, images) => {
    setSelectedLightbox({ index, images });
  };

  const nextLightbox = () => {
    setSelectedLightbox(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length
    }));
  };

  const prevLightbox = () => {
    setSelectedLightbox(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length
    }));
  };

  return (
    <section id="rooms" className="section bg-[color:var(--bg-soft)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="overline mb-5">{tr("rooms.overline")}</div>
            <h2 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              {tr("rooms.title")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roomsData.map((room) => (
            <motion.div 
              key={room.id}
              className="room-card group flex flex-col bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-100"
            >
              <RoomGallery 
                images={room.images} 
                alt={room.name_sk} 
                onImageClick={handleOpenLightbox} 
              />

              <div className="p-7 flex flex-col flex-grow">
                <h3 className="font-display text-2xl font-semibold text-slate-900 mb-2">{room.name_sk}</h3>
                <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">{room.description_sk}</p>
                
                <div className="flex items-center gap-6 text-xs font-medium text-slate-500 mb-8 mt-auto">
                  <span className="flex items-center gap-2"><Users size={16} className="text-slate-400" /> {room.capacity} osoby</span>
                  <span className="flex items-center gap-2"><Bed size={16} className="text-slate-400" /> Manželská posteľ</span>
                </div>

                <button
                  onClick={() => onBookRoom?.(room.id)}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-[color:var(--accent)] transition-all"
                >
                  Rezervovať od €{room.price_per_night} / noc <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedLightbox !== null && (
          <Lightbox 
            images={selectedLightbox.images}
            currentIndex={selectedLightbox.index}
            onClose={() => setSelectedLightbox(null)}
            onNext={nextLightbox}
            onPrev={prevLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}