import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Parallax from "parallax-js";
import SEO from "../components/SEO";
import Calendar from "../components/Calendar";
import VendingPrecise3D from "../components/Vending";

/* =========================
   COMPONENTES UI PREMIUM
========================= */

/**
 * Componente para crear fondos con efecto parallax (movimiento de mouse).
 */
const ParallaxBackground = ({ depthElements = [] }) => {
  const sceneRef = useRef(null);

  useEffect(() => {
    let parallaxInstance;

    if (sceneRef.current) {
      parallaxInstance = new Parallax(sceneRef.current, {
        relativeInput: true,
        hoverOnly: true,
        clipRelativeInput: true,
        calibrateX: true,
        calibrateY: true,
        scalarX: 10,
        scalarY: 10,
        frictionX: 0.08,
        frictionY: 0.08,
      });
    }

    return () => {
      if (parallaxInstance) parallaxInstance.destroy();
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="absolute inset-0 pointer-events-none select-none z-0"
    >
      {depthElements.map((el, idx) => (
        <div
          key={idx}
          data-depth={el.depth}
          className="absolute"
          style={{ ...el.style }}
        >
          {el.content}
        </div>
      ))}
    </div>
  );
};

/* =========================
   CONSTANTES Y CONFIGURACIÓN
========================= */
const BRAND_COLOR = "#24d4da";
const BRAND_DARK = "#168387";
const BRAND_TEXT = "#168387";
const WHATSAPP_PHONE = "525519655369";
const BUNDLE_IDS = new Set(["Duo-Emprendedor", "Tridente", "Megalodon"]);

// Animaciones base
const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" },
};

const buildWaUrl = ({ modeloId, modeloNombre }) => {
  const text = `Hola, me interesa el modelo premium ${
    modeloNombre || "Darmax"
  } (ID: ${modeloId || "-"}) visto en su web.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

const formatMXN = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

const getConfigurePath = (modeloId) =>
  BUNDLE_IDS.has(modeloId)
    ? `/configurar-paquete/${modeloId}`
    : `/configurar-maquina/${modeloId}`;

const modelos = [
  {
    id: "Vending",
    nombre: "Vending Touch",
    etiqueta: "Máquina Vending",
    imagen: "/img/vending/vending.png",
    precio: 54950,
    descripcion:
      "Automatización total 24/7. Genera ingresos pasivos con tecnología de despacho automático y cero personal.",
    rutaInfo: "/vending-info",
    badge: "Más popular",
  },
  {
    id: "Purificadora",
    nombre: "Mostrador Darmax",
    etiqueta: "Purificadora",
    imagen: "/img/vending/mostrador.png",
    precio: 52950,
    descripcion:
      "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
    badge: "Más rentable",
  },
  {
    id: "Vending-Limpieza",
    nombre: "Vending Limpieza",
    etiqueta: "Vending Limpieza",
    imagen: "/img/vending/9productos.png",
    precio: 34950,
    descripcion:
      "Diversifica tu portafolio. Despacho automático de productos de limpieza a granel de alta demanda.",
    rutaInfo: "/vending-limpieza-info",
    badge: "Economía inteligente",
  },
  {
    id: "Duo-Emprendedor",
    nombre: "Paquete Dúo Emprendedor",
    etiqueta: "Paquete 2 en 1",
    imagen:
      "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png",
    precio: 89900,
    descripcion:
      "Paquete integral que combina la venta de agua purificada con productos de limpieza a granel, maximizando tu oferta y rentabilidad en un solo espacio.",
    rutaInfo: "/duo-emprendedor-info",
    badge: "Doble Ganancia",
  },
  {
    id: "Tridente",
    nombre: "Paquete Tridente",
    etiqueta: "Paquete Triple Modelo",
    imagen:
      "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767984401/tridente_1_tqcl26.png",
    precio: 107900,
    descripcion:
      "Paquete completo de alto impacto que integra agua purificada, productos de limpieza y otros artículos esenciales en una solución llave en mano.",
    rutaInfo: "/tridente-info",
    badge: "Versatilidad Extrema",
  },
  {
    id: "Megalodon",
    nombre: "Paquete Megalodon",
    etiqueta: "Paquete Mega Vending",
    imagen: "/img/Iniciatunegocio/fachadacalle.jpg",
    precio: 117900,
    descripcion:
      "Nuestro paquete más avanzado y de mayor capacidad. La estación de vending definitiva para ubicaciones de alto tráfico.",
    rutaInfo: "/megalodon-info",
    badge: "Líder del Mercado",
  },
];

/* =========================
   COMPONENTES UI PREMIUM
========================= */

const SectionTitle = ({ subtitle, title, align = "center" }) => (
  <motion.div
    {...fadeInUp}
    className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}
  >
    <span
      className="font-bold tracking-widest text-xs uppercase mb-3 block"
      style={{ color: BRAND_COLOR }}
    >
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
      {title}
    </h2>
  </motion.div>
);

const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);
  const configurePath = getConfigurePath(modelo.id);

  return (
    <motion.article
      variants={fadeInUp}
      className={[
        "group relative flex flex-col h-full rounded-[2.5rem] bg-white border border-slate-100 p-3",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2",
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-slate-50/50 border border-slate-50">
        {!errorImagen ? (
          <img
            src={modelo.imagen}
            alt={modelo.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-2 transition-all duration-500"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm">
            Imagen no disponible
          </div>
        )}

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
          {modelo.badge && (
            <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md text-slate-600 border border-white shadow-sm">
              {modelo.badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(modelo.id);
            }}
            className={[
              "pointer-events-auto h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border",
              isSelected
                ? "bg-[#24d4da] border-[#24d4da] text-white shadow-lg shadow-[#24d4da]/20"
                : "bg-white/60 border-white/40 text-slate-400 hover:bg-white hover:text-[#168387] hover:border-slate-200",
            ].join(" ")}
            aria-label={
              isSelected
                ? `Quitar ${modelo.nombre} de la comparación`
                : `Agregar ${modelo.nombre} a la comparación`
            }
            title={
              isSelected
                ? "Quitar de comparación"
                : "Agregar a comparación"
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSelected ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-4 py-6 sm:px-5">
        <div className="mb-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 block"
            style={{ color: BRAND_COLOR }}
          >
            {modelo.etiqueta}
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#168387] transition-colors">
            {modelo.nombre}
          </h3>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-8 opacity-80">
          {modelo.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">
              Inversión desde
            </span>
            <span className="text-xl font-black text-slate-900 leading-none">
              {formatMXN(modelo.precio)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(modelo.rutaInfo)}
              className="h-10 w-10 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
              title="Saber más"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <button
              onClick={() => navigate(configurePath)}
              className="h-10 px-6 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#168387] hover:shadow-xl hover:shadow-[#168387]/20 transition-all active:scale-95"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* =========================
   SECCIÓN VENTAJAS
========================= */
function VentajasSection() {
  const ventajas = [
    {
      img: "/img/Iniciatunegocio/1.png",
      title: "Acompañamiento 360°",
      desc: "Te guiamos en cada paso, desde la instalación hasta la optimización de tu equipo.",
    },
    {
      img: "/img/Iniciatunegocio/2.png",
      title: "Calidad Premium",
      desc: "Componentes de grado industrial y los más altos estándares de purificación para un producto final insuperable.",
    },
    {
      img: "/img/Iniciatunegocio/3.png",
      title: "Dominio Total del Negocio",
      desc: "Recibe capacitación completa y acceso a nuestra base de conocimiento. Conviértete en un experto del agua.",
    },
    {
      img: "/img/Iniciatunegocio/4.png",
      title: "Modelo de Negocio Escalable",
      desc: "Inicia con una inversión inteligente y expande tu operación a medida que tus ganancias aumentan. El límite lo pones tú.",
    },
    {
      img: "/img/Iniciatunegocio/5.png",
      title: "Operación Simplificada",
      desc: "Nuestros sistemas son tan intuitivos que podrás gestionarlos sin necesidad de personal técnico especializado.",
    },
    {
      img: "/img/Iniciatunegocio/6.png",
      title: "Rápida Puesta en Marcha",
      desc: "Implementamos tu planta en tiempo récord para que empieces a generar ingresos lo antes posible.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 selection:bg-[#24d4da] selection:text-white">
      <ParallaxBackground
        depthElements={[
          {
            depth: 0.15,
            style: { top: "5%", right: "10%" },
            content: (
              <div className="w-96 h-96 bg-[#24d4da]/10 rounded-full blur-3xl" />
            ),
          },
          {
            depth: 0.4,
            style: { bottom: "15%", left: "5%" },
            content: (
              <div className="w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
            ),
          },
        ]}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div {...fadeInUp} className="mx-auto max-w-2xl lg:text-center">
          <h2
            className="text-xs font-extrabold tracking-[0.35em] uppercase"
            style={{ color: "#ffffff" }}
          >
            Tu Éxito, Nuestra Misión
          </h2>

          <p className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitas para emprender.
          </p>

          <p className="mt-6 text-lg leading-8 text-white/75">
            Hemos perfeccionado cada aspecto del negocio para que tu única
            preocupación sea ver crecer tus ganancias.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24"
        >
          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {ventajas.map((v) => (
              <motion.li
                key={v.title}
                variants={fadeInUp}
                className="
                  group relative overflow-hidden rounded-[28px]
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:bg-white/10
                "
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#24d4da]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative px-5 py-8 text-center">
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white border border-white/10">
                    <img
                      src={v.img}
                      alt=""
                      aria-hidden="true"
                      className="h-12 w-12 object-contain drop-shadow"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-[16px] font-extrabold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/75">
                    {v.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================
   PÁGINA PRINCIPAL
========================= */
const IniciaNegocio = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const roiSceneRef = useRef(null);

  useEffect(() => {
    let parallaxInstance;

    if (roiSceneRef.current) {
      parallaxInstance = new Parallax(roiSceneRef.current, {
        relativeInput: true,
        hoverOnly: true,
        clipRelativeInput: true,
        calibrateX: true,
        calibrateY: true,
        scalarX: 12,
        scalarY: 12,
        frictionX: 0.08,
        frictionY: 0.08,
      });
    }

    return () => {
      if (parallaxInstance) parallaxInstance.destroy();
    };
  }, []);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedModels = modelos.filter((m) => selected.includes(m.id));

  return (
    <>
      <SEO
        title="Inicia tu Negocio de Agua Purificada"
        description="Emprende con Darmax: Purificadoras de agua, Máquinas Vending 24/7 y Productos de Limpieza. Modelos rentables y soporte total en México."
        keywords="negocio de agua, franquicia purificadora, vending de agua, darmax, ingresos pasivos"
        localBizData={true}
      />

      {/* ROI */}
      <section
        id="ROI"
        className="relative py-40 min-h-[760px] overflow-hidden z-30 bg-[#0f1115]"
      >
        <div className="absolute inset-0 bg-[#0f1115]" />

        <div className="absolute top-[8%] left-[10%] w-[420px] h-[420px] rounded-full bg-[#168387]/10 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[8%] w-[380px] h-[380px] rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full bg-white/[0.03] blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:26px_26px]" />

        <div
          ref={roiSceneRef}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div data-depth="0.10" className="absolute top-[10%] left-[4%]">
            <div className="w-72 h-72 rounded-full bg-[#1d8f95]/18 blur-3xl" />
          </div>

          <div data-depth="0.18" className="absolute bottom-[10%] right-[8%]">
            <div className="w-80 h-80 rounded-full bg-cyan-300/12 blur-3xl" />
          </div>

          <div data-depth="0.28" className="absolute top-[38%] left-[52%]">
            <div className="w-36 h-36 rounded-full bg-cyan-400/15 blur-2xl" />
          </div>

          <div data-depth="0.35" className="absolute top-[18%] right-[18%]">
            <div className="w-14 h-14 rounded-2xl border border-cyan-300/20 rotate-12 bg-white/[0.02] backdrop-blur-sm" />
          </div>

          <div data-depth="0.22" className="absolute bottom-[22%] left-[18%]">
            <div className="w-20 h-20 rounded-full border border-white/10" />
          </div>

          <div data-depth="0.42" className="absolute top-[28%] left-[30%]">
            <div className="w-4 h-4 rounded-full bg-cyan-300/60 shadow-[0_0_30px_rgba(34,211,238,0.45)]" />
          </div>
        </div>

        <div className="absolute inset-0 bg-black/10" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-300 backdrop-blur-md">
              Rendimiento y automatización
            </span>

            <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-white">
              Una inversión que trabaja por ti
            </h2>

            <p className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed">
              Maximiza ingresos, reduce operación manual y obtén un modelo de
              negocio más inteligente, continuo y rentable.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -80, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -8, rotate: -1 }}
              className="relative group w-full md:w-[320px] aspect-square flex-shrink-0"
            >
              <div className="absolute -inset-3 rounded-[2.8rem] bg-[#168387]/20 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative h-full p-10 rounded-[2.8rem] border border-white/10 bg-[#168387] shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.05]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_45%)] pointer-events-none" />

                <div className="relative z-10 w-16 h-16 rounded-[1.4rem] bg-white/10 flex items-center justify-center text-white mb-6 shadow-inner border border-white/10">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>

                <h3 className="relative z-10 text-3xl font-black text-white tracking-tight mb-4">
                  ROI Superior
                </h3>

                <p className="relative z-10 text-white/90 text-sm leading-relaxed font-medium max-w-[220px]">
                  Recupera tu inversión en
                  <span className="text-cyan-200 font-bold">
                    {" "}
                    solamente 12 meses
                  </span>{" "}
                  con una operación continua y alta demanda.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, rotate: 1 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="relative group w-full md:flex-1 max-w-[760px]"
            >
              <div className="absolute -inset-3 rounded-[2.8rem] bg-[#168387]/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative h-full p-10 md:p-12 rounded-[2.8rem] border border-white/10 bg-[#151922] shadow-[0_20px_80px_rgba(0,0,0,0.28)] flex flex-col sm:flex-row items-start sm:items-center gap-8 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none" />

                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.6rem] bg-[#168387]/15 border border-cyan-300/10 flex items-center justify-center text-cyan-300 shadow-inner">
                  <svg
                    className="w-9 h-9"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                    Automatización Total 24/7
                  </h3>

                  <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                    Reduce dependencia operativa, elimina límites de horario y
                    permite que tus unidades funcionen de forma
                    <span className="text-cyan-300 font-bold">
                      {" "}
                      continua, estable y autónoma
                    </span>
                    , generando una experiencia moderna y escalable.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MODELOS */}
      <section
        id="catalogo"
        className="min-h-screen flex items-center py-24 bg-[#fbfbfd] overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 60,
            duration: 1,
          }}
          className="max-w-7xl mx-auto px-4 w-full"
        >
          <motion.div
            {...fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-4xl">
              <span className="text-[#24d4da] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
                Ecosistemas de Rentabilidad
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                Configura tu <span className="text-[#168387]">modelo de negocio</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">
                Explora diferentes ecosistemas diseñados para maximizar tu
                inversión, desde equipos individuales de alta precisión hasta
                estaciones integrales con operatividad 24/7.
                <span className="text-[#168387] block mt-2 font-bold text-sm uppercase tracking-wider">
                  Pulsa el botón "+" en cada tarjeta para comparar sus
                  beneficios y encontrar tu solución ideal.
                </span>
              </p>
            </div>
          </motion.div>

          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] border border-cyan-100 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-sm font-black text-slate-900">
                  {selected.length} modelo{selected.length > 1 ? "s" : ""} seleccionado
                  {selected.length > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-slate-500">
                  Ya puedes abrir la comparativa técnica.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected([])}
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Limpiar
                </button>

                <button
                  onClick={() => setCompareOpen(true)}
                  className="px-5 py-3 rounded-2xl text-white font-bold shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  Comparar modelos
                </button>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10%" }}
            className="mb-16 pt-4 border-t border-slate-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                Equipos Individuales
              </h3>
              <div className="h-px w-full bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modelos
                .filter((m) => !BUNDLE_IDS.has(m.id))
                .map((modelo) => (
                  <TarjetaModelo
                    key={modelo.id}
                    modelo={modelo}
                    navigate={navigate}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                  />
                ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10%" }}
            className="mb-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-sm font-black text-[#168387] uppercase tracking-[0.2em] whitespace-nowrap">
                Paquetes de Negocio
              </h3>
              <div className="h-px w-full bg-[#168387]/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modelos
                .filter((m) => BUNDLE_IDS.has(m.id))
                .map((modelo) => (
                  <TarjetaModelo
                    key={modelo.id}
                    modelo={modelo}
                    navigate={navigate}
                    selected={selected}
                    onToggleSelect={toggleSelect}
                  />
                ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CICLO */}
      <motion.section id="ciclo" {...fadeInUp}>
        <div className="w-full max-w-5xl mx-auto relative px-4 py-24 border-t border-slate-100 min-h-[60vh] flex flex-col justify-center">
          <div className="text-center mb-20">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              El Ciclo de la Rentabilidad
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {[
              {
                step: "01",
                title: "Selección",
                desc: "Elige tu ecosistema base",
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              },
              {
                step: "02",
                title: "Configuración",
                desc: "Personaliza a tu medida",
                icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.756 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.756 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
              },
              {
                step: "03",
                title: "Comparación",
                desc: "Valida beneficios",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                step: "04",
                title: "Operación",
                desc: "Ingresos en automático",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center group relative"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 transition-all duration-500 relative z-10">
                  <span className="absolute -top-2 -right-2 text-[10px] font-black bg-[#168387] text-white px-2 py-0.5 rounded-full">
                    {item.step}
                  </span>
                  <svg
                    className="w-8 h-8 text-[#168387]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d={item.icon}
                    />
                  </svg>
                </div>
                <h4 className="text-slate-900 font-black text-base mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-xs text-center">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3D */}
      <motion.section
        {...fadeInUp}
        className="relative bg-white border-t border-slate-100 py-24"
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-12">
          <div className="w-full text-center relative z-10">
            <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
              Experiencia Inmersiva
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Conoce tu próxima <br /> máquina de éxito
            </h2>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Interactúa con el modelo 3D de alta precisión. Arrastra para
              rotar, explora los componentes y visualiza la calidad industrial
              de la Vending Touch antes de adquirirla.
            </p>

            <div className="mt-10 flex justify-center">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-[#24d4da]/10 flex items-center justify-center text-[#24d4da]">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                    />
                  </svg>
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold">Rotación 360°</p>
                  <p className="text-xs text-slate-500">Explora cada ángulo</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center relative z-20">
            <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="relative h-[420px] md:h-[520px] lg:h-[600px] flex items-center justify-center">
                <div className="scale-90 md:scale-100 transform-gpu">
                  <VendingPrecise3D />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <VentajasSection />

      <section className="py-24 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle
            title="Agenda una reunión con un asesor experto"
            subtitle="Asesoría Personalizada quieres saber como iniciar tu negocio"
          />
          <motion.div {...fadeInUp} className="mt-12 flex justify-center">
            <Calendar />
          </motion.div>
        </div>
      </section>

      <CompareModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        models={selectedModels}
        navigate={navigate}
      />
    </>
  );
};

/* =========================
   MODAL COMPARAR
========================= */
function CompareModal({ open, onClose, models = [], navigate }) {
  if (!open) return null;

  const rows = [
    { label: "Tipo de negocio", key: "etiqueta" },
    { label: "Descripción", key: "descripcion" },
    { label: "Inversión desde", key: "__precio" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.28em] font-extrabold"
              style={{ color: BRAND_TEXT }}
            >
              Comparativa
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Comparativa Técnica
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Desliza horizontalmente para ver más modelos.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="bg-[#f5f5f7] overflow-auto max-h-[calc(92vh-84px)]">
          <div className="block lg:hidden p-4 sm:p-6">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="snap-center shrink-0 w-[86%] sm:w-[70%]"
                >
                  <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                            {m.nombre}
                          </h4>
                          <p className="text-sm font-semibold text-slate-500 mt-1">
                            {m.etiqueta}
                          </p>
                        </div>

                        <span
                          className="font-extrabold text-sm text-right"
                          style={{ color: BRAND_TEXT }}
                        >
                          <span className="block text-[8px] uppercase opacity-60">
                            Desde
                          </span>
                          {formatMXN(m.precio)}
                        </span>
                      </div>

                      <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 h-44 grid place-items-center overflow-hidden">
                        <img
                          src={m.imagen}
                          alt={m.nombre}
                          className="h-36 w-auto object-contain"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>

                      <div className="mt-5 space-y-3">
                        <Spec label="Tipo de negocio" value={m.etiqueta} />
                        <Spec label="Descripción" value={m.descripcion} />
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => navigate(getConfigurePath(m.id))}
                        className="w-full py-3.5 rounded-2xl font-extrabold text-white shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition-all active:scale-[0.99]"
                        style={{ backgroundColor: BRAND_DARK }}
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              Tip: desliza para comparar modelos →
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="min-w-[980px]">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-6 w-72 bg-white sticky left-0 z-20 border-b border-r border-slate-100">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
                        Características
                      </span>
                    </th>

                    {models.map((m) => (
                      <th
                        key={m.id}
                        className="p-6 bg-white border-b border-slate-100 align-top"
                      >
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                          <img
                            src={m.imagen}
                            className="h-28 w-auto object-contain mx-auto"
                            alt={m.nombre}
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                          <h4 className="mt-3 text-lg font-extrabold text-center text-slate-900 leading-tight">
                            {m.nombre}
                          </h4>
                          <p className="text-center text-slate-500 font-semibold text-sm mt-1">
                            {m.etiqueta}
                          </p>
                          <div className="text-center mt-2">
                            <span className="block text-[8px] font-bold text-[#168387] uppercase tracking-wider">
                              Desde
                            </span>
                            <p
                              className="font-extrabold text-xl leading-none"
                              style={{ color: BRAND_TEXT }}
                            >
                              {formatMXN(m.precio)}
                            </p>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm text-slate-700">
                  {rows.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}
                    >
                      <td className="p-6 font-extrabold text-slate-900 uppercase text-xs tracking-wider border-r border-slate-100 sticky left-0 z-10 bg-inherit">
                        {row.label}
                      </td>

                      {models.map((m) => (
                        <td key={m.id + row.key} className="p-6 align-top">
                          {row.key === "__precio" ? (
                            <span className="font-bold">
                              Desde {formatMXN(m.precio)}
                            </span>
                          ) : (
                            m[row.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  <tr className="bg-white">
                    <td className="p-6 border-r border-slate-100 sticky left-0 bg-white" />
                    {models.map((m) => (
                      <td key={m.id} className="p-6">
                        <button
                          onClick={() => navigate(getConfigurePath(m.id))}
                          className="w-full py-3 rounded-2xl font-extrabold text-white shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition-all active:scale-[0.99]"
                          style={{ backgroundColor: BRAND_DARK }}
                        >
                          Seleccionar
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:hidden px-4 sm:px-6 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-extrabold text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            Cerrar comparación
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}

export default IniciaNegocio;