import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
              Conoce más
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Estación Megalodon <span className="text-[#ccff00]">Darmax</span>
            </h1>
            <p className="mt-3 text-white/80">
              La bestia del vending. Una estación de ultra capacidad y tecnología de vanguardia diseñada para dominar los puntos de mayor tráfico.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.titulo}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl bg-white/10 border border-white/20 text-white p-3 backdrop-blur"
                >
                  <div className="text-2xl">{h.icono}</div>
                  <div className="text-sm mt-1 font-semibold">{h.titulo}</div>
                  <div className="text-[12px] opacity-80">{h.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <img
              src={HERO_IMG}
              alt="Modelo Megalodon"
              className="w-full max-w-md object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </motion.div>
        </div>
        <svg className="relative z-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#fff" d="M0,64 C240,160 960,0 1440,96 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Características Clave
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Diseñado para un rendimiento y una presencia inigualables.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {especificaciones.map((e, i) => (
            <motion.article
              key={e.titulo + i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              <div className="h-44 bg-white flex items-center justify-center p-4">
                <img
                  src={e.imagen}
                  alt={e.titulo}
                  className="h-full w-full object-contain"
                  onError={(ev) => (ev.currentTarget.style.display = "none")}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">{e.titulo}</h3>
                <p className="text-sm text-slate-600 mt-1">{e.descripcion}</p>
              </div>
            </motion.article>
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
