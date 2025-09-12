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
        className=" text-white px-4 md:px-50 pt-32 pb-40"
        style={{
          backgroundImage: 'url("/img/fondos.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-7xl mx-auto">
          <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              EMPRENDE TU{" "}
              <span className="text-accent -skew-x-6 inline-block">NEGOCIO</span>
            </h2>
            <p className="text-[#ccff00] text-base md:text-lg mb-6">
              DA EL PRIMER PASO A LA TU LIBERTAD FINANCIERA Y <br></br>
              LLEVA TU EMPRENDIEMITO AL SIGUIENTE NIVEL CON 
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
              className="w-[500px] h-auto object-contain"
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
