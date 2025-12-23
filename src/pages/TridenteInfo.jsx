import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CardFeatureKey from "../components/CardFeatureKey";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/tridente.png"; // Placeholder

const highlights = [
  { titulo: "Triple Negocio", desc: "Agua, limpieza y más", icono: "🔱" },
  { titulo: "Máxima Versatilidad", desc: "Adapta tu oferta", icono: "🔄" },
  { titulo: "Solución Integral", desc: "Todo en un solo lugar", icono: "🏢" },
  { titulo: "Líder del Mercado", desc: "Diferenciación total", icono: "🏆" },
];

const especificaciones = [
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Tres Módulos",
    descripcion: "Integra agua purificada, productos de limpieza y un tercer módulo personalizable (snacks, café, etc.).",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Plataforma Unificada",
    descripcion: "Gestiona los tres negocios desde un solo panel de control, con estadísticas y alertas en tiempo real.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Experiencia de Cliente Superior",
    descripcion: "Ofrece una conveniencia inigualable que fideliza a los clientes y atrae nuevo público.",
  },
  {
    imagen: "/img/placeholder.png", // Placeholder
    titulo: "Diseño Imponente",
    descripcion: "Una estación de vending que no pasa desapercibida, con un diseño moderno y robusto.",
  },
];

const faqs = [
  {
    q: "¿Qué puedo incluir en el tercer módulo?",
    a: "El tercer módulo es flexible. Podemos adaptarlo para vender productos como snacks, bebidas, café, productos de higiene personal, o cualquier otra cosa que se ajuste a un formato de vending.",
  },
  {
    q: "¿Este modelo es para cualquier ubicación?",
    a: "El Tridente es ideal para ubicaciones de alto tráfico como centros comerciales, universidades, grandes complejos de oficinas o residenciales, donde la diversidad de la oferta puede ser plenamente aprovechada.",
  },
  {
    q: "¿Requiere una instalación especial?",
    a: "Requiere un espacio más amplio que un vending tradicional y acceso a toma de agua, drenaje y múltiples conexiones eléctricas. Nuestro equipo técnico evalúa el sitio y se encarga de todo.",
  },
];

/* ====== Componente principal ====== */
export default function TridenteInfo() {
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
        <title>Modelo Tridente - Darmax</title>
        <meta
          name="description"
          content="La estación de multiservicio definitiva. Combina agua, limpieza y un tercer negocio a tu elección para dominar el mercado."
        />
      </Helmet>

      {/* ===== Header blanco + banner full-bleed ===== */}
      <section className="bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
            Conoce más
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            La estación de multiservicio definitiva
          </p>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Modelo Tridente"
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
                Modelo Tridente <span className="not-italic text-[#ccff00]">Darmax</span>
              </h1>
              <p className="mt-7 max-w-4xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                La estación de multiservicio definitiva. Combina agua, limpieza y un tercer negocio a tu elección para dominar el mercado.
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
                to="/configurar-maquina/Tridente"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#ccff00" }}
              >
                Configurar mi Tridente
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
          Una solución integral para una oferta de servicios sin competencia.
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
