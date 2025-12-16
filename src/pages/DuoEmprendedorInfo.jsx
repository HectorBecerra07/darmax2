import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
              Conoce más
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Dúo Emprendedor 2 en 1 <span className="text-[#ccff00]">Darmax</span>
            </h1>
            <p className="mt-3 text-white/80">
              La solución definitiva que combina una purificadora de agua y un vending de productos de limpieza. Doble impacto, doble ganancia.
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

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <img
              src={HERO_IMG}
              alt="Modelo Duo Emprendedor 2 en 1"
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
          Todo lo que necesitas para un negocio diversificado y exitoso.
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
