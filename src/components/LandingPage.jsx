/* --- ACTUALIZADO: LandingPage.jsx --- */
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import IniciaNegocio from "../pages/IniciaNegocio";
import CalculadoraNegocio from "./CalculadoraNegocio";
import Carruselimg from "./Carruselimg";
import HeroCarousel from "./HeroCarousel";
import { InlineWidget } from "react-calendly";
import Banner from "./Banner";

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
        {/* HERO SECTION */}
        <header className="relative overflow-hidden bg-slate-900">
          <HeroCarousel />

          {/* Sección de Mensaje Principal (Debajo del Banner) */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-24 md:py-32 text-center">
            {/* Badge simplificado sin animaciones de parpadeo */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#24d4da]"></span>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
                Inicia tu próximo negocio en 2026 
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              Tu Futuro <br />
              <span className="text-[#24d4da]">
                Comienza en Darmax.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 opacity-90">
              No es solo un equipo, es el inicio de tu propio negocio.
              Tecnología de purificación avanzada que te ayuda a invertir con seguridad y crecer paso a paso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() =>
                  document
                    .getElementById("catalogo")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-slate-900 hover:scale-105 transition-transform shadow-[0_10px_20px_rgba(36,212,218,0.2)] active:scale-95"
                style={{ backgroundColor: BRAND_COLOR }}
              >
                Ver Modelos
              </button>
              <a
                href={buildWaUrl({})}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 transition-all active:scale-95"
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
