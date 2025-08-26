/* --- ACTUALIZADO: LandingPage.jsx --- */
import React, { useRef } from "react";
import { Helmet } from "react-helmet-async";
import IniciaNegocio from "../pages/IniciaNegocio";
import CalculadoraNegocio from "./CalculadoraNegocio";
import Carruselimg from "./Carruselimg";

export default function LandingPage() {
  const inicioRef = useRef(null);
  const calculadoraRef = useRef(null);

  const scrollToRef = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>
          Darmax | Purificadoras de Agua, Máquinas Vending y Negocios de Limpieza
        </title>
      </Helmet>

      {/* HERO */}
      <section
        className="relative w-screen text-white px-4 md:px-16 pt-32 pb-40 overflow-hidden"
        style={{
          backgroundImage: 'url("/img/fondos.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-7xl mx-auto">
          <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              IMPULSA TU{" "}
              <span className="text-accent -skew-x-6 inline-block">NEGOCIO</span>
            </h2>
            <p className="text-white text-base md:text-lg mb-6">
              Lleva tu emprendimiento al siguiente nivel con tecnología inteligente y rentable.
            </p>
            <button
              onClick={() => scrollToRef(calculadoraRef)}
              className="inline-block text-black font-semibold py-2 px-6 rounded shadow transition hover:brightness-90 bg-accent"
            >
              CALCULA TUS GANANCIAS
            </button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/img/darmax-logo.png"
              alt="Logo Darmax"
              className="w-[350px] h-auto object-contain"
            />
          </div>
        </div>

        {/* FLECHA ↓ */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 block md:hidden z-50">
          <button
            onClick={() => scrollToRef(inicioRef)}
            className="text-black text-3xl animate-bounce bg-white/80 rounded-full px-3 py-1 shadow-md"
          >
            ↓
          </button>
        </div>

        {/* ONDA */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
          <svg
            className="w-full h-[150px] md:h-[200px] lg:h-[240px]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path fill="#ffffff" d="M0,128 C240,320 960,0 1440,192 L1440,320 L0,320 Z" />
          </svg>
        </div>
      </section>

      {/* SECCIONES CON REF */}
      <div ref={inicioRef} className="scroll-mt-1">
        <IniciaNegocio />
      </div>

      
      <Carruselimg />

      <div ref={calculadoraRef} className="scroll-mt-1">
        <CalculadoraNegocio />
      </div>
    </>
  );
}
