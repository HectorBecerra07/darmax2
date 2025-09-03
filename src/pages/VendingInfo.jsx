import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/TOUCHAGUA.png";

const highlights = [
  { titulo: "1200 garrafones/mes", desc: "Capacidad máxima estimada", icono: "⚡" },
  { titulo: "Pago ", desc: "Efectivo", icono: "💳" },
  { titulo: "Acero inoxidable", desc: "Construcción robusta", icono: "🛡️" },
  { titulo: "Operación 24/7", desc: "Automática y segura", icono: "🕛" },
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

/* ====== Componente principal ====== */
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-black" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-[11px] uppercase tracking-widest bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
              Conoce más
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Máquinas Vending de Agua <span className="text-[#ccff00]">Darmax</span>
            </h1>
            <p className="mt-3 text-white/80">
              Automatiza la venta de agua purificada con equipos robustos, métodos de pago modernos
              y operación 24/7. Ideal para plazas, tiendas y espacios públicos.
            </p>

            {/* Highlights */}
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

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/configurar-maquina/Vending"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
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

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <img
              src={HERO_IMG}
              alt="Máquina Vending Darmax"
              className="w-full max-w-md object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.5)]"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </motion.div>
        </div>

        {/* Onda */}
        <svg className="relative z-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#fff" d="M0,64 C240,160 960,0 1440,96 L1440,120 L0,120 Z" />
        </svg>
      </section>

      {/* Especificaciones (tarjetas) */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Características clave
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Diseñadas para operar con alta disponibilidad y mínimo mantenimiento.
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

      {/* Cómo funciona */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-black text-white p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold">¿Cómo funciona?</h2>
          <p className="text-white/80 mt-2 max-w-2xl">
            Te acompañamos desde la elección del lugar hasta la operación diaria del equipo.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pasos.map((p, i) => (
              <motion.div
                key={p.titulo}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-4"
              >
                <div className="text-3xl">{p.icono}</div>
                <div className="mt-2 font-bold">{p.titulo}</div>
                <div className="text-sm text-white/80">{p.desc}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-7">
            <Link
              to="/contacto"
              className="inline-flex px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
              style={{ backgroundColor: "#ccff00" }}
            >
              Quiero asesoría
            </Link>
          </div>
        </div>
      </section>

      {/* Galería simple */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          Instalaciones reales
        </h2>
        <p className="text-slate-600 text-center mt-2">
          Una muestra de ubicaciones donde nuestras vending operan con éxito.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["/img/trabajos/trabajos1.jpg", "/img/trabajos/trabajos2.jpg", "/img/trabajos/trabajos3.jpg", "/img/trabajos/trabajos5.jpg"].map(
            (src, i) => (
              <motion.div
                key={src + i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="h-40 md:h-48 rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
              >
                <img
                  src={src}
                  alt={`Galería ${i}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* FAQ */}
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
