import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import Parallax from "parallax-js";
import SEO from "../components/SEO";
import Calendar from "../components/Calendar";
import VendingPrecise3D from "../components/Vending";

/* =========================
   ANIMACIONES Y HELPERS
========================= */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05 },
  transition: { duration: 0.6, delay: d, ease: "easeOut" }
});

const Counter = ({ value, prefix = "", duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ""));
      const controls = animate(0, numericValue, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{prefix}{count}</span>;
};

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
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.05 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, amount: 0.05 },
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
    nombre: "Máquina Vending",
    imagen: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png",
    precio: 54950,
    descripcion:
      "Automatización total 24/7. Genera ingresos pasivos con tecnología de despacho automático y cero personal.",
    rutaInfo: "/vending-info",
  },
  {
    id: "Purificadora",
    nombre: "Mostrador Darmax",
    imagen: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/2mostrador_iajzgl.png",
    precio: 52950,
    descripcion:
      "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
  },
  {
    id: "Vending-Limpieza",
    nombre: "Vending Limpieza",
    imagen: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/3productos_dcha1t.png",
    precio: 34950,
    descripcion:
      "Diversifica tu portafolio. Despacho automático de productos de limpieza a granel de alta demanda.",
    rutaInfo: "/vending-limpieza-info",
  },
  {
    id: "Duo-Emprendedor",
    nombre: "Paquete Dúo Emprendedor",
    imagen:
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/4emprendedor_lxuzyt.png",
    precio: 89900,
    descripcion:
      "Paquete integral que combina la venta de agua purificada con productos de limpieza a granel, maximizando tu oferta y rentabilidad en un solo espacio.",
    rutaInfo: "/duo-emprendedor-info",
  },
  {
    id: "Tridente",
    nombre: "Paquete Tridente",
    imagen:
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/puri3_sr1yoc.png",
    precio: 107900,
    descripcion:
      "Paquete completo de alto impacto que integra agua purificada, productos de limpieza y otros artículos esenciales en una solución llave en mano.",
    rutaInfo: "/tridente-info",
  },
  {
    id: "Megalodon",
    nombre: "Paquete Megalodon",
    imagen: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/6megalodon_wd13q6.png",
    precio: 117900,
    descripcion:
      "Nuestro paquete más avanzado y de mayor capacidad. La estación de vending definitiva para ubicaciones de alto tráfico.",
    rutaInfo: "/megalodon-info",
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
      className="font-bold tracking-widest text-sm uppercase mb-3 block"
      style={{ color: BRAND_COLOR }}
    >
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
      {title}
    </h2>
  </motion.div>
);

import { StarIcon } from "@heroicons/react/24/solid";
import { 
  BeakerIcon, 
  CircleStackIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  CpuChipIcon,
  InformationCircleIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);
  const isBundle = BUNDLE_IDS.has(modelo.id);
  const configurePath = getConfigurePath(modelo.id);

  // Determinar el distintivo de nivel
  const getLevelBadge = () => {
    let label = "";
    let bgColor = "bg-slate-900"; // Default
    
    if (modelo.id === "Vending" || modelo.id === "Vending-Limpieza") {
      label = "Esencial";
      bgColor = "bg-slate-800";
    } else if (modelo.id === "Purificadora") {
      label = "Escalable";
      bgColor = "bg-[#168387]";
    }

    if (!label) return null;

    return (
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 ${bgColor} text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap`}>
        {label}
      </div>
    );
  };

  return (
    <motion.article
      variants={fadeInUp}
      className={[
        "group relative flex flex-col h-full rounded-[2rem] sm:rounded-[2.5rem] bg-white p-4 sm:p-4",
        "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-2",
        "lg:max-w-[360px] lg:mx-auto",
        isBundle 
          ? "border-2 border-cyan-200/60 bg-gradient-to-b from-white to-cyan-50/30 shadow-lg shadow-cyan-900/5 hover:border-cyan-300" 
          : "border border-slate-200 shadow-sm hover:border-slate-300",
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* BADGE DE NIVEL */}
      {!isBundle ? getLevelBadge() : (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 bg-[#168387] text-white text-xs font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap">
          {modelo.id === "Duo-Emprendedor" ? "Escalable" : "Ecosistema Premium"}
        </div>
      )}

      {/* IMAGEN Y CONTROL */}
      <div 
        onClick={() => navigate(configurePath)}
        className="relative aspect-video overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50 isolate cursor-pointer group/img mb-3 sm:mb-4 transition-all duration-500 hover:shadow-inner"
      >
        {!errorImagen ? (
          <motion.img
            src={modelo.imagen}
            alt={modelo.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-1 sm:p-2 transition-transform duration-1000 group-hover/img:scale-110"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm font-bold uppercase">
            Vista previa
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(modelo.id);
          }}
          className={[
            "absolute top-2 sm:top-3 right-2 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 backdrop-blur-xl border z-30",
            isSelected
              ? "bg-[#24d4da] border-[#24d4da] text-white shadow-xl shadow-cyan-500/40 rotate-90"
              : "bg-white/80 border-white text-slate-400 hover:bg-white hover:text-[#168387] scale-90 group-hover/img:scale-100",
          ].join(" ")}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSelected ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
          </svg>
        </button>
      </div>

      {/* CONTENIDO DE NEGOCIO */}
      <div className="flex flex-col flex-grow text-center">
        <div className="mb-1.5 sm:mb-2">
          <h3 className="text-xl sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-500 uppercase">
            {modelo.nombre}
          </h3>
        </div>

        {/* BUSINESS SPECS */}
        <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
          {[
            { label: "Autonomía", val: "24/7", icon: CpuChipIcon },
            { label: "Demanda", val: "Alta", icon: ArrowTrendingUpIcon },
            { label: "ROI Est.", val: "12m", icon: CurrencyDollarIcon }
          ].map((spec, i) => (
            <div key={i} className="p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group/spec hover:bg-white hover:shadow-sm transition-all min-w-0">
              <spec.icon className="w-3.5 h-3.5 text-slate-400 group-hover/spec:text-[#168387] transition-colors mb-0.5" />
              <span className="text-[7px] sm:text-xs font-black text-slate-400 uppercase tracking-wider truncate w-full">{spec.label}</span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-800 truncate w-full">{spec.val}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-500 leading-relaxed mb-3 sm:mb-4 font-medium line-clamp-2 px-1">
          {modelo.descripcion}
        </p>

        {/* FOOTER DE CONVERSIÓN */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-100">
          <div className="relative group/price mb-3 sm:mb-4">
            <span className="block text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Inversión desde</span>
            <span className="text-2xl sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tighter group-hover/price:text-[#168387] transition-colors">
              {formatMXN(modelo.precio)}
            </span>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => navigate(configurePath)}
              className="w-full h-10 px-6 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-[#168387] shadow-lg shadow-slate-900/10 transition-all duration-300 active:scale-[0.98]"
            >
              Configurar
            </button>

            <button
              onClick={() => navigate(modelo.rutaInfo)}
              className="w-full h-10 px-6 rounded-xl border border-slate-200 text-slate-900 text-xs sm:text-sm font-black uppercase tracking-widest hover:border-[#168387] hover:text-[#168387] transition-all duration-300 active:scale-[0.98]"
            >
              Conoce más
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

/* =========================
   SECCIÓN: TU NEGOCIO EN MARCHA
========================= */
function VentajasSection() {
  const pilares = [
    {
      t: "Soporte Total",
      d: "Desde la capacitación hasta la puesta en marcha. Nunca caminas solo.",
      icon: UserGroupIcon
    },
    {
      t: "Simplicidad Operativa",
      d: "Gestionas tu negocio sin necesidad de personal técnico especializado.",
      icon: SparklesIcon
    },
    {
      t: "Retorno Acelerado",
      d: "Implementación en tiempo récord para empezar a facturar de inmediato.",
      icon: RocketLaunchIcon
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] py-20 sm:py-32 selection:bg-white selection:text-[#168387]">
      <ParallaxBackground
        depthElements={[
          {
            depth: 0.1,
            style: { top: "10%", right: "5%" },
            content: <div className="w-[30rem] sm:w-[50rem] h-[30rem] sm:h-[50rem] rounded-full blur-[80px] sm:blur-[120px]" style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
          },
          {
            depth: 0.2,
            style: { bottom: "-10%", left: "5%" },
            content: <div className="w-[20rem] sm:w-[40rem] h-[20rem] sm:h-[40rem] rounded-full blur-[60px] sm:blur-[100px]" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }} />
          }
        ]}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="max-w-3xl mb-12 sm:mb-24">
          <span className="font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-3 sm:mb-4 block text-cyan-100 opacity-80">
            El Ecosistema Darmax
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            Todo lo que necesitas <br />
            <span className="text-2xl sm:text-3xl md:text-5xl text-white/90">para que tu éxito sea inevitable.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1 * i)}
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: i * 0.4,
                ...fadeUp(0.1 * i).transition 
              }}
              className="group relative p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] bg-white/20 border border-white/40 backdrop-blur-md hover:bg-white/30 transition-all duration-700 shadow-2xl shadow-cyan-950/10"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 bg-white text-[#168387] shadow-lg group-hover:scale-110 transition-transform duration-500">
                <p.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-tight">{p.t}</h3>
              <p className="text-cyan-50 text-sm sm:text-base leading-relaxed font-medium">
                {p.d}
              </p>
              
              <div className="mt-6 sm:mt-8 flex items-center gap-2">
                <div className="h-px w-6 sm:w-8 bg-white/40 group-hover:w-12 transition-all duration-500" />
                <span className="text-xs font-black uppercase tracking-widest text-cyan-100/60">Pilar 0{i+1}</span>
              </div>
            </motion.div>
          ))}
        </div>
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
        className="relative py-20 sm:py-40 min-h-[600px] sm:min-h-[760px] overflow-hidden z-30 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e]" />

        {/* Círculos de luz mejorados para el nuevo fondo */}
        <div className="absolute top-[8%] left-[10%] w-[250px] sm:w-[420px] h-[250px] sm:h-[420px] rounded-full bg-white/10 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[5%] right-[8%] w-[200px] sm:w-[380px] h-[200px] sm:h-[380px] rounded-full bg-cyan-200/10 blur-[80px] sm:blur-[120px]" />
        
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:26px_26px]" />

        <div
          ref={roiSceneRef}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div data-depth="0.10" className="absolute top-[10%] left-[4%]">
            <div className="w-40 sm:w-72 h-40 sm:h-72 rounded-full bg-white/5 blur-2xl sm:blur-3xl" />
          </div>
          <div data-depth="0.35" className="absolute top-[18%] right-[18%]">
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-xl sm:rounded-2xl border border-white/20 rotate-12 bg-white/10 backdrop-blur-sm" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-12 sm:mb-16"
          >
            <span className="text-cyan-100 font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-3 sm:mb-4 block opacity-80">
              Tu camino al éxito
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
              Una historia de <span className="text-white underline decoration-cyan-400/30 underline-offset-[8px] sm:underline-offset-[12px] decoration-2">libertad financiera</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* PASO 1 */}
            <motion.div
              {...fadeUp(0.1)}
              className="p-6 sm:p-8 rounded-[2.5rem] bg-white/20 border border-white/40 backdrop-blur-md group hover:bg-white/30 transition-all text-center shadow-xl shadow-cyan-950/10"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 bg-white text-[#168387] shadow-lg group-hover:scale-110 transition-transform"
              >
                <span className="text-xl sm:text-2xl font-black">
                  <Counter value="1" prefix="0" />
                </span>
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-tight">La Visión</h3>
              <p className="text-cyan-50 text-base sm:text-lg font-medium leading-relaxed">
                Transformas tu capital inicial en un activo inteligente que no descansa.
              </p>
            </motion.div>

            {/* PASO 2 */}
            <motion.div
              {...fadeUp(0.2)}
              className="p-6 sm:p-8 rounded-[2.5rem] bg-white/20 border border-white/40 backdrop-blur-md group hover:bg-white/30 transition-all text-center shadow-xl shadow-cyan-950/10"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white text-[#168387] shadow-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform"
              >
                <span className="text-xl sm:text-2xl font-black">
                  <Counter value="2" prefix="0" />
                </span>
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-tight">La Operación</h3>
              <p className="text-cyan-50 text-base sm:text-lg font-medium leading-relaxed">
                Tecnología 24/7 trabajando para ti mientras disfrutas de lo que importa.
              </p>
            </motion.div>

            {/* PASO 3 */}
            <motion.div
              {...fadeUp(0.3)}
              className="p-6 sm:p-8 rounded-[2.5rem] bg-white/20 border border-white/40 backdrop-blur-md group hover:bg-white/30 transition-all text-center shadow-xl shadow-cyan-950/10"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white text-[#168387] shadow-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform"
              >
                <span className="text-xl sm:text-2xl font-black">
                  <Counter value="3" prefix="0" />
                </span>
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-tight">El Resultado</h3>
              <p className="text-cyan-50 text-base sm:text-lg font-medium leading-relaxed">
                Recuperas tu inversión y escalas tu negocio a nuevos niveles.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 sm:mt-20 text-center">
            <motion.div 
              {...fadeUp(0.4)}
              className="inline-flex items-center gap-3 sm:gap-6 p-4 sm:p-8 rounded-3xl sm:rounded-[3rem] bg-white/20 border border-white/40 text-white text-lg sm:text-3xl font-black backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="w-3 h-3 sm:w-5 sm:h-5 rounded-full animate-pulse bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              ROI Proyectado: 12 meses para el retorno total de inversión
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="catalogo"
        className="min-h-screen flex items-center py-16 sm:py-24 bg-[#fbfbfd] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* NARRATIVA DE ENTRADA */}
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col items-center text-center mb-12 sm:mb-20 gap-6 sm:gap-8 mx-auto"
          >
            <div className="max-w-4xl flex flex-col items-center">
              <span className="text-[#24d4da] font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-3 sm:mb-4 block">
                Diseña tu futuro
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-4 sm:mb-6">
                Elige la escala de tu <br />
                <span className="text-[#168387]">próximo éxito</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-lg font-medium leading-relaxed mb-6 sm:mb-10">
                Desde unidades autónomas hasta modelos híbridos. <span className="text-[#168387] font-bold">Todo diseñado para crecer contigo.</span>
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Esencial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[#168387]/5 rounded-xl border border-[#168387]/10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#168387]" />
                  <span className="text-xs font-black text-[#168387] uppercase tracking-widest">Escalable</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-500/5 rounded-xl border border-cyan-500/10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-xs font-black text-cyan-500 uppercase tracking-widest">Ecosistema</span>
                </div>
              </div>
            </div>
          </motion.div>

          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] sm:rounded-[2.5rem] border border-cyan-100 bg-white p-5 sm:p-6 shadow-xl shadow-cyan-900/5"
            >
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900">
                  {selected.length} modelo{selected.length > 1 ? "s" : ""} seleccionado{selected.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-500">Comparativa técnica lista para visualizar.</p>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelected([])}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                >
                  Limpiar
                </button>

                <button
                  onClick={() => setCompareOpen(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#168387]/20 hover:shadow-[#168387]/40 transition"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  Comparar
                </button>
              </div>
            </motion.div>
          )}

          {/* GRUPO 1: INICIO */}
          <motion.div
            {...fadeUp(0.1)}
            className="mb-12 sm:mb-20 pt-8 border-t border-slate-200"
          >
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="shrink-0">
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Nivel 01</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Individuales</h3>
              </div>
              <div className="h-px w-full bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

          {/* GRUPO 2: ESCALA */}
          <motion.div
            {...fadeUp(0.2)}
            className="mb-16 sm:mb-24"
          >
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="shrink-0">
                <span className="text-xs font-black text-[#168387] uppercase tracking-[0.2em] sm:tracking-[0.3em]">Nivel 02</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Paquetes de Negocio</h3>
              </div>
              <div className="h-px w-full bg-[#168387]/20" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
        </div>
      </section>

      {/* SECCIÓN 3D: ANATOMÍA DEL ÉXITO */}
      <motion.section
        id="experiencia-3d"
        {...fadeUp(0)}
        className="relative bg-gradient-to-br from-[#0d5a5e] via-[#168387] to-[#24d4da] py-20 sm:py-32 overflow-hidden text-white"
      >
        {/* Fondo con textura sutil */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* TEXTO NARRATIVO (IZQUIERDA) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-10 relative z-10 lg:pr-12">
              <div>
                <span className="text-cyan-100 font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-3 sm:mb-4 block opacity-80">
                  Ingeniería de Precisión
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight mb-4 sm:mb-6">
                  La nueva generación de purificación inteligente
                </h2>
                <p className="text-cyan-50/80 text-sm sm:text-lg font-medium leading-relaxed max-w-md">
                  Cada detalle pensado para impulsar un negocio que nunca se detiene.
                </p>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {[
                  { 
                    t: "Diseño Industrial", 
                    d: "Acero inoxidable y componentes de grado alimenticio para una durabilidad de años.",
                    icon: CheckBadgeIcon 
                  },
                  { 
                    t: "Cerebro Inteligente", 
                    d: "Sistema de gestión que monitorea ventas y niveles en tiempo real.",
                    icon: CpuChipIcon 
                  },
                  { 
                    t: "Interfaz de Usuario", 
                    d: "Experiencia táctil intuitiva que garantiza la recompra de tus clientes.",
                    icon: StarIcon 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    {...fadeUp(0.1 * i)}
                    className="flex gap-4 sm:gap-6 group"
                  >
                    <div className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-white/10 text-cyan-300 flex items-center justify-center group-hover:bg-white group-hover:text-[#168387] transition-all duration-500 shadow-sm">
                      <item.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base sm:text-xl mb-1 sm:mb-2">{item.t}</h4>
                      <p className="text-cyan-100/60 text-sm sm:text-base leading-relaxed font-medium">{item.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* MODELO 3D (DERECHA) */}
            <div className="lg:col-span-6 relative w-full overflow-visible">
              <div className="relative rounded-[2rem] sm:rounded-[3rem] bg-white/5 border border-white/10 p-2 sm:p-6 shadow-2xl backdrop-blur-sm group">
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
                  <div className="flex items-center gap-2 sm:gap-3 px-2 py-1 sm:px-3 sm:py-1.5 bg-white/10 rounded-lg sm:rounded-xl border border-white/20 backdrop-blur-md shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">360° Interactiva</span>
                  </div>
                </div>

                <div className="h-[280px] sm:h-[400px] md:h-[480px] flex items-center justify-center overflow-visible">
                  <VendingPrecise3D />
                </div>

                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap opacity-60">
                  Arrastra para rotar e interactuar
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* HISTORIAS DE ÉXITO (TESTIMONIOS) */}
      <section id="testimonios" className="relative py-20 sm:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <motion.div
            {...fadeUp(0)}
            className="text-center mb-16 sm:mb-24"
          >
            <span className="text-[#24d4da] font-black tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-3 sm:mb-4 block">
              Resultados Reales
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
              Más que clientes, <br />
              <span className="text-slate-900/90">historias de <span className="underline decoration-[#24d4da]/30 underline-offset-[8px] sm:underline-offset-[12px] decoration-2">éxito</span></span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { 
                initials: "GA", 
                name: "Gerardo Adrian Chávez", 
                role: "Emprendedor Darmax", 
                text: "\"Un aliado fundamental para dar el primer paso. Su tecnología me dio la confianza necesaria para iniciar mi propio camino en el negocio del agua.\"",
                badge: "Negocio en Operación",
                Icon: CheckBadgeIcon,
                delay: 0.1
              },
              { 
                initials: "SG", 
                name: "Salvador Guerrero", 
                role: "Inversionista Escalable", 
                text: "\"Empecé con una sola Vending, pero los resultados fueron tan claros que pronto escalamos a un modelo híbrido con mostrador. La mejor decisión de inversión.\"",
                badge: "Crecimiento Multi-Unidad",
                Icon: ArrowTrendingUpIcon,
                delay: 0.2
              },
              { 
                initials: "PM", 
                name: "Purificadora Maitreya", 
                role: "Proyecto Especial", 
                text: "\"Necesitábamos una solución única y personalizada para nuestra marca. Darmax diseñó una Vending especial que se adapta perfectamente a nuestra identidad.\"",
                badge: "Diseño a la Medida",
                Icon: WrenchScrewdriverIcon,
                delay: 0.3
              }
            ].map((testimonio, i) => (
              <motion.div
                key={i}
                {...fadeUp(testimonio.delay)}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative overflow-hidden p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white border border-slate-100 flex flex-col transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(13,90,94,0.3)] shadow-xl shadow-slate-900/5 cursor-default"
              >
                {/* Capa de fondo para el hover (Gradiente de Anatomía 3D) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d5a5e] via-[#168387] to-[#24d4da] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Textura sutil en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px] transition-opacity duration-700" />

                <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8 relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-50 group-hover:bg-white/10 text-[#168387] group-hover:text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-sm group-hover:rotate-6 transition-all duration-500">
                    {testimonio.initials}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-white text-base sm:text-lg leading-tight transition-colors duration-500">
                      {testimonio.name}
                    </h4>
                    <div className="flex gap-0.5 my-1 sm:my-1.5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all" />
                      ))}
                    </div>
                    <p className="text-xs font-bold text-[#168387] group-hover:text-cyan-200 uppercase tracking-widest opacity-80 transition-colors duration-500">
                      {testimonio.role}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 group-hover:text-white text-sm sm:text-base leading-relaxed font-medium italic mb-6 sm:mb-10 opacity-90 relative z-10 transition-colors duration-500">
                  {testimonio.text}
                </p>

                <div className="mt-auto pt-6 sm:pt-8 border-t border-slate-50 group-hover:border-white/10 relative z-10 transition-colors duration-500">
                  <div className="flex items-center gap-3">
                    <testimonio.Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#24d4da] group-hover:text-cyan-300 transition-colors duration-500" />
                    <span className="text-xs font-black text-slate-400 group-hover:text-cyan-100/60 uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-colors duration-500">
                      {testimonio.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VentajasSection />

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

      <div className="relative w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div>
            <p
              className="text-xs uppercase tracking-[0.28em] font-extrabold"
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
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] overflow-hidden">
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
                          <span className="block text-xs uppercase opacity-60">
                            Desde
                          </span>
                          {formatMXN(m.precio)}
                        </span>
                      </div>

                      <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 h-44 grid place-items-center overflow-hidden">
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
                    <th className="p-6 w-72 bg-white sticky left-0 z-20 border-b border-r border-slate-200">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
                        Características
                      </span>
                    </th>

                    {models.map((m) => (
                      <th
                        key={m.id}
                        className="p-6 bg-white border-b border-slate-200 align-top"
                      >
                        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
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
                            <span className="block text-xs font-bold text-[#168387] uppercase tracking-wider">
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
                      <td className="p-6 font-extrabold text-slate-900 uppercase text-xs tracking-wider border-r border-slate-200 sticky left-0 z-10 bg-inherit">
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
                    <td className="p-6 border-r border-slate-200 sticky left-0 bg-white" />
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

        <div className="lg:hidden px-4 sm:px-6 py-4 border-t border-slate-200 bg-white">
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
    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
      <p className="text-xs uppercase tracking-widest font-extrabold text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}

export default IniciaNegocio;
