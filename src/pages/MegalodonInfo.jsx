import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CardFeatureKey from "../components/CardFeatureKey";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/megalodon.png"; // Placeholder

const highlights = [
  { titulo: "Ultra Capacidad", desc: "Para zonas de tráfico masivo", icono: "🌊" },
  { titulo: "Tecnología de Punta", desc: "La mejor experiencia de usuario", icono: "💻" },
  { titulo: "Máximo Impacto", desc: "Diseño que atrae multitudes", icono: "🌟" },
  { titulo: "Operación Premium", desc: "Totalmente automatizado", icono: "🤖" },
];

const especificaciones = [
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Dispensadores Múltiples",
    descripcion: "Equipado con una gran cantidad de dispensadores para una variedad de productos y alta demanda.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Pantallas Interactivas",
    descripcion: "Grandes pantallas táctiles que guían al usuario y permiten publicidad dinámica.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Capacidad Industrial",
    descripcion: "Tanques y almacenamiento de gran volumen para minimizar la frecuencia de reabastecimiento.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Analíticas Avanzadas",
    descripcion: "Obtén datos detallados de ventas, comportamiento del consumidor y rendimiento del equipo.",
  },
];

const faqs = [
  {
    q: "¿Para qué tipo de ubicación es el Megalodon?",
    a: "Está diseñado para lugares con un flujo de personas masivo: aeropuertos, estaciones de metro, grandes centros comerciales, estadios y arenas. Su capacidad y velocidad de despacho están optimizadas para la alta demanda.",
  },
  {
    q: "¿Es muy complejo de operar?",
    a: "A pesar de su tamaño y tecnología, la operación es sorprendentemente simple gracias a nuestro software de gestión centralizado. Las alertas de inventario y el autodiagnóstico facilitan el mantenimiento.",
  },
  {
    q: "¿Qué nivel de personalización ofrece?",
    a: "El Megalodon es nuestro modelo más personalizable. Podemos adaptar la configuración de dispensadores, el software de la interfaz y el diseño exterior para que se alinee perfectamente con tu marca o la del lugar de instalación.",
  },
];

/* ====== Componente principal ====== */
export default function MegalodonInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const contRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => contRef.current?.scrollIntoView({ behavior: "auto" }), 200);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div ref={contRef} className="min-h-screen bg-white">
      <Helmet>
        <title>Estación Megalodon - Darmax</title>
        <meta
          name="description"
          content="La bestia del vending. Una estación de ultra capacidad y tecnología de vanguardia diseñada para dominar los puntos de mayor tráfico."
        />
      </Helmet>
      
      {/* ===== Header blanco + banner full-bleed ===== */}
      <section className="bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
            Conoce más
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            La bestia del vending para tráfico masivo
          </p>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Modelo Megalodon"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== Bloque oscuro pegado ===== */}
      <section className="relative -mt-4">
        <div className="bg-[#1e2533]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-14">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold italic text-white leading-tight">
                Estación Megalodon <span className="not-italic text-[#ccff00]">Darmax</span>
              </h1>
              <p className="mt-7 max-w-4xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                Una estación de ultra capacidad y tecnología de vanguardia diseñada para dominar los puntos de mayor tráfico.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.titulo}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="flex flex-col items-center justify-center min-h-[120px] rounded-lg bg-[#2f3947] border border-white/40 px-4 py-5 text-center text-white"
                >
                  <div className="text-3xl">{h.icono}</div>
                  <div className="text-base font-semibold leading-tight mt-2">{h.titulo}</div>
                  <div className="text-sm italic text-white/80">{h.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Megalodon"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#ccff00" }}
              >
                Configurar mi Megalodon
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition"
              >
                Volver
              </button>
            </div>
          </div>
          
          <svg className="w-full block -mb-px" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,56 C240,0 960,160 1440,56 L1440,140 L0,140 Z" />
          </svg>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Características Clave
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Diseñado para un rendimiento y una presencia inigualables.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {especificaciones.map((e, i) => (
            <CardFeatureKey
              key={i}
              imagen={e.imagen}
              titulo={e.titulo}
              descripcion={e.descripcion}
            />
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Preguntas Frecuentes
        </h2>
        <div className="mt-6 divide-y rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {faqs.map((f, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer list-none p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between">
                {f.q}
                <span className="ml-4 text-slate-400 transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="px-5 md:px-6 pb-6 text-slate-600">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
