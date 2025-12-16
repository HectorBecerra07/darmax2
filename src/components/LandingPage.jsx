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
          Darmax Agua | Purificadoras, Vending y Limpieza para Negocios
        </title>
      </Helmet>

      {/* HERO */}
      <section
        className="text-white px-4 md:px-8 pt-24 pb-16 md:pt-32 md:pb-24 lg:aspect-[3.5/1] lg:pt-0 lg:pb-0"
        style={{
          backgroundImage: 'url("/img/banner.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 md:gap-2 w-full max-w-7xl mx-auto lg:h-full">
          <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x2 font-black tracking-tight leading-tight mt-0 md:mt-1 mb-1 md:mb-3">
              <span style={{ color: '#ffff00' }}>
                Negocios
              </span> de Agua Purificada, Vending y Limpieza
            </h1>
            <p className="text-base md:text-lg lg:text-lg text-white leading-relaxed mb-6 md:mb-8">
              Con Darmax, inicia tu emprendimiento con purificadoras de agua, máquinas vending 24/7 y productos de limpieza de alta calidad.
            </p>
            <button
              onClick={() => scrollToRef(calculadoraRef)}
              className="inline-block text-black font-semibold py-2 px-4 md:px-6 rounded shadow transition hover:brightness-90 bg-[#ffff00] text-sm md:text-base"
            >
              CALCULA TUS GANANCIAS
            </button>
          </div>

          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/img/darmax-logo.png"
              alt="Logo Darmax"
              className="w-[200px] sm:w-[250px] md:w-[300px] lg:w-[300px] h-auto object-contain"
            />
          </div>
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