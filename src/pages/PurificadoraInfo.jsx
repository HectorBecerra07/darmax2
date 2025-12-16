import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

/* ====== Datos ====== */
const HERO_IMG = "/img/vending/mostrador.jpg";

const highlights = [
  {
    icono: "/icon/ry.png",
    titulo: "3,000 L/día",
    desc: "Capacidad máxima estimada",
  },
  {
    icono: "/icon/tj.png",
    titulo: "Pago",
    desc: "Efectivo",
  },
  {
    icono: "/icon/es.png",
    titulo: "Acero 304",
    desc: "Grado alimenticio",
  },
  {
    icono: "/icon/hr.png",
    titulo: "Operación",
    desc: "24 / 7",
  },
];


const especificacionesPurificadora = [
  {
    imagen: "/img/purificadora/filtrado.png",
    titulo: "Filtración en etapas",
    descripcion: "Sistema de múltiples etapas para pureza consistente.",
  },
  {
    imagen: "/img/purificadora/uv.png",
    titulo: "Desinfección avanzada",
    descripcion: "Luz ultravioleta y ozono para reforzar la inocuidad.",
  },
  {
    imagen: "/img/purificadora/tanque.png",
    titulo: "Tanques sanitarios",
    descripcion: "Acero inoxidable grado alimenticio para contacto seguro.",
  },
  {
    imagen: "/img/purificadora/diseno.png",
    titulo: "Diseño compacto",
    descripcion: "Aprovecha el espacio en locales pequeños.",
  },
  {
    imagen: "/img/purificadora/produccion.png",
    titulo: "Alto rendimiento",
    descripcion: "Capacidad de hasta 3,000 litros por día.",
  },
];

const pasos = [
  {
    icono: "📍",
    titulo: "Ubicación",
    desc: "Te ayudamos a evaluar la zona con mayor potencial.",
  },
  {
    icono: "🛠️",
    titulo: "Instalación",
    desc: "Montaje, puesta en marcha y capacitación.",
  },
  {
    icono: "🧾",
    titulo: "Operación",
    desc: "Reabastecimiento y mantenimiento sencillo.",
  },
  {
    icono: "📈",
    titulo: "Crecimiento",
    desc: "Escala agregando equipos según la demanda.",
  },
];

const faqs = [
  {
    q: "¿Qué espacio necesito?",
    a: "Depende del modelo. En general, un área compacta con toma de agua, drenaje, energía y ventilación.",
  },
  {
    q: "¿Cómo se cobra a los clientes?",
    a: "Puede ser efectivo y/o métodos habilitados según el equipo. Te asesoramos según tu ubicación.",
  },
  {
    q: "¿Cuál es el mantenimiento?",
    a: "Cambio de consumibles, sanitización y verificación de parámetros. Incluimos guía y soporte.",
  },
  {
    q: "¿Ofrecen garantía?",
    a: "Sí, contamos con garantía y soporte técnico. Los términos dependen del modelo adquirido.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <span
          className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden px-5 md:px-6 pb-6 text-slate-600">
          {a}
        </div>
      </div>
    </div>
  );
}

export default function PurificadoraInfo() {
  const navigate = useNavigate();
  const contRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(
      () => contRef.current?.scrollIntoView({ behavior: "auto" }),
      150
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={contRef} className="min-h-screen bg-white">
      {/* ===== Header blanco ===== */}
<section className="bg-white overflow-x-hidden">
  {/* TEXTO alineado al grid */}
  <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-6">
    <h2 className="text-2xl md:text-4xl font-extrabold italic text-slate-900">
      Conoce más
    </h2>
    <p className="text-xs md:text-sm text-slate-500 mt-1">
      Inversión inteligente, retorno garantizado
    </p>
  </div>

  {/* BANNER full-bleed */}
  <div className="relative w-screen left-1/2 -translate-x-1/2">
    <div className="relative h-[260px] sm:h-[320px] md:h-[420px] overflow-hidden">
      <img
        src={HERO_IMG}
        alt="Darmax"
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      {/* Overlay sutil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
    </div>
  </div>
</section>


      {/* ===== Bloque oscuro (PEGADO al banner) ===== */}
      <section className="relative -mt-4">
        {/* curva superior: ahora sale desde el blanco y cae al oscuro */}
        <div className="absolute -top-10 left-0 w-full overflow-hidden leading-none">
        </div>

        <div className="bg-[#1e2533]">
          <div className="max-w-7xl mx-auto px-6 md:px-10 ">
<div className="bg-[#1e2533] pt-10">
  <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-14">
    <div className="text-center">
      <h1 className="
        text-4xl 
        md:text-6xl 
        font-extrabold 
        italic 
        text-white 
        leading-tight
      ">
        Plantas Purificadoras{" "}
        <span className="not-italic text-[#ccff00]">Darmax</span>
      </h1>

      <p className="
        mt-7
        max-w-4xl
        mx-auto
        text-white/80
        text-base
        md:text-lg
        leading-relaxed
      ">
        Automatiza tu operación con equipos robustos, múltiples etapas y
        desinfección reforzada. Ideal para operar con alta
        disponibilidad y mínimo mantenimiento.
      </p>
    </div>
  </div>
</div>


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
                  {/* ICONO */}
                  <img
                    src={h.icono}
                    alt={h.titulo}
                    className="mb-3 h-10 w-10 object-contain"
                  />

                  {/* TÍTULO */}
                  <div className="text-base font-semibold leading-tight">
                    {h.titulo}
                  </div>

                  {/* DESCRIPCIÓN */}
                  <div className="text-sm italic text-white/80">{h.desc}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Purificadora"
                className="px-6 py-3 rounded-xl font-semibold text-black shadow-lg hover:brightness-95 transition"
                style={{ backgroundColor: "#ccff00" }}
              >
                Configurar mi planta
              </Link>
              <Link
                to="/productos"
                className="px-6 py-3 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/10 transition"
              >
                Ver accesorios
              </Link>
            </div>
          </div>

          {/* curva inferior a blanco */}
{/* curva inferior invertida */}
<svg
  className="w-full block -mb-px"
  viewBox="0 0 1440 120"
  preserveAspectRatio="none"
>
  <path
    fill="#ffffff"
    d="M0,56 C240,0 960,160 1440,56 L1440,140 L0,140 Z"
  />
</svg>


        </div>
      </section>

      {/* ===== Características clave ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Características clave
          </h2>
          <p className="text-slate-600 mt-2">
            Diseñadas para operar con alta disponibilidad y mínimo
            mantenimiento.
          </p>
        </div>
<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
  {especificacionesPurificadora.map((e, i) => (
    <motion.article
      key={e.titulo + i}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35, delay: i * 0.04 }}
      className="
        rounded-3xl
        border border-slate-100
        bg-white
        shadow-sm
        hover:shadow-lg
        transition
      "
    >
      <div className="px-4 pt-4 pb-4 text-center flex flex-col items-center">
        {/* ICONO */}
        <div
          className="
            h-9 w-9
            rounded-2xl
            border border-slate-100
            bg-slate-50
            flex items-center justify-center
            overflow-hidden
          "
        >
          <img
            src={e.imagen}
            alt={e.titulo}
            className="h-6 w-6 object-contain"
            onError={(ev) => (ev.currentTarget.style.display = 'none')}
          />
        </div>

        {/* TÍTULO */}
        <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
          {e.titulo}
        </h3>

        {/* DESCRIPCIÓN */}
        <p className="mt-0.5 text-xs text-slate-600 leading-snug">
          {e.descripcion}
        </p>
      </div>
    </motion.article>
  ))}
</div>

      </section>

      {/* ===== ¿Cómo funciona? (tarjeta oscura) ===== */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-14">
        <div className="rounded-3xl bg-[#1e2533] text-white p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <h2 className="text-2xl md:text-3xl font-extrabold">
            ¿Cómo funciona?
          </h2>
          <p className="text-white/75 mt-2 max-w-2xl">
            Te acompañamos desde la elección del lugar hasta la operación diaria
            del equipo.
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
            Una muestra de ubicaciones donde nuestros equipos operan con éxito.
          </p>
        </div>

<div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    "/img/trabajos/trabajos1.jpg",
    "/img/trabajos/trabajos3.jpg",
    "/img/trabajos/trabajos6.jpg",
    "/img/trabajos/trabajos7.jpg",
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

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        {" "}
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
          {" "}
          Preguntas frecuentes{" "}
        </h2>{" "}
        <div className="mt-6 divide-y rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {" "}
          {faqs.map((f, i) => (
            <details key={i} className="group">
              {" "}
              <summary className="cursor-pointer list-none p-5 md:p-6 font-semibold text-slate-900 flex items-center justify-between">
                {" "}
                {f.q}{" "}
                <span className="ml-4 text-slate-400 transition group-open:rotate-180">
                  ⌄
                </span>{" "}
              </summary>{" "}
              <div className="px-5 md:px-6 pb-6 text-slate-600">{f.a}</div>{" "}
            </details>
          ))}{" "}
        </div>{" "}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {" "}
          <Link
            to="/configurar-maquina/Purificadora"
            className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
            style={{ backgroundColor: "#ccff00" }}
          >
            {" "}
            Configurar mi planta{" "}
          </Link>{" "}
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-900 transition"
          >
            {" "}
            Volver{" "}
          </button>{" "}
        </div>{" "}
      </section>
    </div>
  );
}
