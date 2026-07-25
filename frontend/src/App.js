import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "@/contexts/LangContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Dynamický (Lazy) import stránok - stiahnu sa až vtedy, keď na ne používateľ reálne prejde
const Home = lazy(() => import("@/pages/Home"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

// OPTIMALIZÁCIA: Lazy import pre Toaster, aby nezaťažoval úvodné načítanie hlavnej stránky
const Toaster = lazy(() => import("sonner").then(module => ({ default: module.Toaster })));

// Jednoduchý, ultra-ľahký placeholder, kým sa stránka načítava (nezaberá žiadny výkon)
const PageLoader = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-serif">
    <div className="animate-pulse text-[#dfb144] tracking-widest text-sm uppercase">
      Penzión Štrba...
    </div>
  </div>
);

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Suspense obaluje routy aj Toaster a zabezpečuje plynulé lazy loading načítavanie */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            
            {/* Presunuté sem, aby sa Toaster načítal asynchrónne na pozadí */}
            <Toaster theme="light" position="top-right" richColors />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}

export default App;