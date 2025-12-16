import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/TOUCHAGUA.png";

const highlights = [
  {
    icono: "/icon/ry.png",
    titulo: "1200 garrafones/mes",
    desc: "Capacidad máxima estimada",
  },
  { icono: "/icon/tj.png", titulo: "Pago", desc: "Efectivo" },
  { icono: "/icon/es.png", titulo: "Acero inoxidable", desc: "Construcción robusta" },
  { icono: "/icon/hr.png", titulo: "Operación", desc: "24 / 7" },
];

const especificaciones = [
  {
    imagen: "/img/vending/produccion.png",
    titulo: "Alta producción",
    descripcion: "Capacidad de producción de hasta 1200 garrafones mensuales.",
  },
  {
    imagen: "/img/vending/cobro.png",
    titulo: "Cobro automático",
    descripcion: "Sistema de llenado y cobro totalmente automatizado.",
  },
  {
    imagen: "/img/vending/pagos.png",
    titulo: "Pagos modernos",
    descripcion: "Compatible con efectivo, tarjeta y códigos QR.",
  },
  {
    imagen: "/img/vending/acero.png",
    titulo: "Material premium",
    descripcion: "Construcción en acero inoxidable para máxima durabilidad.",
  },
  {
    imagen: "/img/vending/ubicacion.png",
    titulo: "Instalación versátil",
    descripcion: "Ideal para plazas, tiendas y espacios públicos.",
  },
];

const pasos = [
  { icono: "📍", titulo: "Ubicación", desc: "Te ayudamos a evaluar la zona con mayor potencial." },
  { icono: "⚙️", titulo: "Instalación", desc: "Montaje, puesta en marcha y capacitación." },
  { icono: "💧", titulo: "Operación", desc: "Reabastecimiento y mantenimiento sencillo." },
  { icono: "📈", titulo: "Crecimiento", desc: "Escala agregando equipos según la demanda." },
];

const faqs = [
  {
    q: "¿Qué necesito para instalarla?",
    a: "Un punto con toma de agua, drenaje, energía eléctrica y espacio seguro/visible. Nosotros te guiamos en todo.",
  },
  {
    q: "¿Cómo se cobra a los clientes?",
    a: "El equipo permite efectivo, tarjeta y QR. Puedes habilitar uno o varios métodos a la vez.",
  },
  {
    q: "¿Cuál es el mantenimiento?",
    a: "Cambio de consumibles, sanitización y revisión general. Incluimos capacitación y soporte.",
  },
  {
    q: "¿Ofrecen garantía?",
    a: "Sí. Incluimos garantía y soporte técnico. Consúltanos los términos según tu modelo.",
  },
];

export default function VendingInfo() {
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
        <title>Máquinas Vending de Agua - Darmax</title>
        <meta
          name="description"
          content="Automatiza la venta de agua purificada con equipos robustos, métodos de pago modernos y operación 24/7. Ideal para plazas, tiendas y espacios públicos."
        />
      </Helmet>

      {/* ===== Header blanco + banner full-bleed ===== */}
      <section className="bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
            Conoce más
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Inversión inteligente, retorno garantizado
          </p>
        </div>

        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
            <img
              src={HERO_IMG}
              alt="Máquina Vending Darmax"
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
          {/* Título grande */}
          <div className="pt-10">
            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-14">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold italic text-white leading-tight">
                  Máquinas Vending de Agua{" "}
                  <span className="not-italic text-[#ccff00]">Darmax</span>
                </h1>
                <p className="mt-7 max-w-4xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
                  Automatiza la venta de agua purificada con equipos robustos, métodos de pago modernos
                  y operación 24/7. Ideal para plazas, tiendas y espacios públicos.
                </p>
              </div>

              {/* Highlights (iconos diseñadora) */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {highlights.map((h, i) => (
                  <motion.div
                    key={h.titulo}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="
                      flex flex-col items-center justify-center
                      min-h-[120px]
                      rounded-lg
                      bg-[#2f3947]
                      border border-white/40
                      px-4 py-5
                      text-center
                      text-white
                    "
                  >
                    <img
                      src={h.icono}
                      alt={h.titulo}
                      className="mb-3 h-10 w-10 object-contain"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div className="text-base font-semibold leading-tight">{h.titulo}</div>
                    <div className="text-sm italic text-white/80">{h.desc}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/configurar-maquina/Vending"
                  className="px-6 py-3 rounded-xl font-semibold text-black shadow-lg hover:brightness-95 transition"
                  style={{ backgroundColor: "#ccff00" }}
                >
                  Configurar mi equipo
                </Link>
                <Link
                  to="/productos"
                  className="px-6 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition"
                >
                  Ver más productos
                </Link>
              </div>
            </div>
          </div>

          {/* curva inferior invertida (sin línea) */}
          <svg className="w-full block -mb-px" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,56 C240,0 960,160 1440,56 L1440,140 L0,140 Z" />
          </svg>
        </div>
      </section>

      {/* ===== Características clave (grid 5) ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Características clave
          </h2>
          <p className="text-slate-600 mt-2">
            Diseñadas para operar con alta disponibilidad y mínimo mantenimiento.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {especificaciones.map((e, i) => (
            <motion.article
              key={e.titulo + i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-lg transition"
            >
              <div className="px-4 pt-4 pb-4 text-center flex flex-col items-center">
                <div className="h-9 w-9 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={e.imagen}
                    alt={e.titulo}
                    className="h-6 w-6 object-contain"
                    onError={(ev) => (ev.currentTarget.style.display = "none")}
                  />
                </div>

                <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
                  {e.titulo}
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                  {e.descripcion}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ===== ¿Cómo funciona? ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-14">
        <div className="rounded-3xl bg-[#1e2533] text-white p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <h2 className="text-2xl md:text-3xl font-extrabold">¿Cómo funciona?</h2>
          <p className="text-white/75 mt-2 max-w-2xl">
            Te acompañamos desde la elección del lugar hasta la operación diaria del equipo.
          </p>

          <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pasos.map((p, i) => (
              <motion.div
                key={p.titulo}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-4"
              >
                <div className="text-2xl">{p.icono}</div>
                <div className="mt-2 font-bold">{p.titulo}</div>
                <div className="text-sm text-white/70 mt-1">{p.desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/contacto"
              className="inline-flex px-6 py-3 rounded-xl font-semibold text-black shadow-lg hover:brightness-95 transition"
              style={{ backgroundColor: "#ccff00" }}
            >
              Quiero asesoría
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Instalaciones reales ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Instalaciones reales
          </h2>
          <p className="text-slate-600 mt-2">
            Una muestra de ubicaciones donde nuestras vending operan con éxito.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "/img/trabajos/trabajos1.jpg",
            "/img/trabajos/trabajos2.jpg",
            "/img/trabajos/trabajos3.jpg",
            "/img/trabajos/trabajos5.jpg",
          ].map((src, i) => (
            <motion.div
              key={src + i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
            >
              <div className="h-36 sm:h-40 md:h-44">
                <img
                  src={src}
                  alt={`Instalación ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Preguntas frecuentes
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

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/configurar-maquina/Vending"
            className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
            style={{ backgroundColor: "#ccff00" }}
          >
            Configurar mi equipo
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-900 transition"
          >
            Volver
          </button>
        </div>
      </section>

      {/* CTA fija (desktop) */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-3 rounded-full bg-white border border-gray-200 shadow-lg px-3 py-2">
          <span className="text-sm text-slate-700">¿Listo para empezar?</span>
          <Link
            to="/contacto"
            className="px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "#ccff00", color: "black" }}
          >
            Solicitar propuesta
          </Link>
        </div>
      </div>
    </div>
  );
}
