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
      

      <main className="min-h-screen bg-white selection:bg-[#24d4da] selection:text-white">
        {/* HERO SECTION */}
        <header className="relative overflow-hidden bg-white">
          <HeroCarousel />
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
