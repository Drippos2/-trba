import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LangProvider } from "@/contexts/LangContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Dynamický (Lazy) import stránok
const Home = lazy(() => import("@/pages/Home"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

// Lazy import pre Toaster
const Toaster = lazy(() => import("sonner").then(module => ({ default: module.Toaster })));

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
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Slovenčina (predvolená hlavná URL) */}
              <Route path="/" element={<Home lang="sk" />} />
              
              {/* Jazykové sub-cesty pre SEO (Nemčina a Angličtina) */}
              <Route path="/de" element={<Home lang="de" />} />
              <Route path="/en" element={<Home lang="en" />} />

              {/* Administrácia */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Fallback pre neexistujúce stránky */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster theme="light" position="top-right" richColors />
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}

export default App;