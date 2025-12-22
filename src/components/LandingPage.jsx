/* --- ACTUALIZADO: LandingPage.jsx --- */
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import IniciaNegocio from "../pages/IniciaNegocio";
import CalculadoraNegocio from "./CalculadoraNegocio";
import Carruselimg from "./Carruselimg";
import HeroCarousel from "./HeroCarousel";

const BRAND_COLOR = "#24d4da"; // Tu color cyan
const WHATSAPP_PHONE = "525519655369";
const buildWaUrl = ({ modeloId, modeloNombre }) => {
  const text = `Hola, me interesa el modelo premium ${
    modeloNombre || "Darmax"
  } (ID: ${modeloId || "-"}) visto en su web.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

export default function LandingPage() {
  const inicioRef = useRef(null);
  const calculadoraRef = useRef(null);

  const scrollToRef = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>Darmax | Inicio</title>
      </Helmet>

      <main className="min-h-screen bg-slate-900 selection:bg-[#24d4da] selection:text-white">
        {/* HERO SECTION (Estilo Dark Tech) */}
        <header className="relative pb-32 overflow-hidden">
          {/* Glow Effects Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#24d4da] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
          </div>

          <HeroCarousel className="pb-12" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24d4da] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#24d4da]"></span>
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Nueva Generación 2025
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6">
              Tu Futuro <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24d4da] to-cyan-200">
                Comienza Aquí.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Tecnología de purificación avanzada con diseño industrial de
              vanguardia. Elige la herramienta que transformará tu inversión.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document
                    .getElementById("catalogo")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-full font-bold text-slate-900 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(36,212,218,0.4)]"
                style={{ backgroundColor: BRAND_COLOR }}
              >
                Ver Modelos
              </button>
              <a
                href={buildWaUrl({})}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-colors"
              >
                Hablar con Asesor
              </a>
            </div>
          </div>
        </header>

      {/* SECCIONES CON REF */}
      <div ref={inicioRef} className="scroll-mt-1">
        <IniciaNegocio />
      </div>
      <Carruselimg />

      <div ref={calculadoraRef} id="calculadora-negocio" className="scroll-mt-1">
        <CalculadoraNegocio />
      </div>
      </main>
    </>
  );
}