import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CardFeatureKey from "../components/CardFeatureKey";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/duo-emprendedor.png"; // Placeholder

const highlights = [
  { titulo: "Agua + Limpieza", desc: "Dos negocios en uno", icono: "🚀" },
  { titulo: "Alta Rentabilidad", desc: "Maximiza ingresos por m²", icono: "💰" },
  { titulo: "Operación Sencilla", desc: "Gestión unificada", icono: "⚙️" },
  { titulo: "Crecimiento Rápido", desc: "Capta más clientes", icono: "📈" },
];

const especificaciones = [
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Doble Dispensador",
    descripcion: "Sistemas independientes para agua purificada y productos de limpieza a granel.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Cobro Integrado",
    descripcion: "Un solo punto de cobro para todos los productos, compatible con múltiples métodos de pago.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Diseño Compacto",
    descripcion: "Optimiza el espacio al combinar dos máquinas en una estructura robusta y eficiente.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Monitoreo Remoto",
    descripcion: "Controla inventarios y ventas de ambos negocios desde una sola plataforma.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Personalizable",
    descripcion: "Elige la combinación de productos de limpieza que mejor se adapte a tu mercado local.",
  },
];

const faqs = [
  {
    q: "¿Qué ventajas ofrece el modelo 2 en 1?",
    a: "La principal ventaja es la diversificación de ingresos y la captación de una base de clientes más amplia. Ofreces dos servicios esenciales en un solo punto, aumentando la rentabilidad por metro cuadrado.",
  },
  {
    q: "¿La gestión es complicada?",
    a: "No, el sistema está diseñado para ser gestionado de forma centralizada. El reabastecimiento y mantenimiento son sencillos y te capacitamos para que puedas hacerlo tú mismo.",
  },
  {
    q: "¿Puedo elegir qué productos de limpieza vender?",
    a: "Sí, el sistema es modular y te permite seleccionar una gama de productos de limpieza según la demanda de tu zona, como detergente, suavizante, cloro, etc.",
  },
];

/* ====== Componente principal ====== */
export default function DuoEmprendedorInfo() {
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
        <title>Dúo Emprendedor 2 en 1 - Darmax</title>
        <meta
          name="description"
          content="La solución definitiva que combina una purificadora de agua y un vending de productos de limpieza. Doble impacto, doble ganancia."
        />
      </Helmet>

      {/* ===== Header blanco + banner full-bleed ===== */}
      <section className="bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
            Conoce más
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Doble impacto, doble ganancia
          </p>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Modelo Duo Emprendedor 2 en 1"
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
                Dúo Emprendedor 2 en 1 <span className="not-italic text-[#ccff00]">Darmax</span>
              </h1>
              <p className="mt-7 max-w-4xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                La solución definitiva que combina una purificadora de agua y un vending de productos de limpieza. Doble impacto, doble ganancia.
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
                to="/configurar-maquina/Duo-Emprendedor"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#ccff00" }}
              >
                Configurar mi Dúo
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
          Todo lo que necesitas para un negocio diversificado y exitoso.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
