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
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.8, delay: d, ease: [0.22, 0.61, 0.36, 1] }
});

const Counter = ({ value, prefix = "", duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    let controls;
    if (isInView) {
      controls = animate(0, parseInt(value), {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => setCount(Math.floor(latest)),
      });
    } else {
      setCount(0);
    }
    return () => controls?.stop();
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

  return (
    <motion.article
      variants={fadeInUp}
      className={[
        "group relative flex flex-col h-full rounded-[3rem] bg-white p-4",
        "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3",
        isBundle ? "border-2 border-cyan-100/50 bg-gradient-to-b from-white to-cyan-50/20" : "border border-slate-100",
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* BADGE DE ESCALA (Solo para Bundles) */}
      {isBundle && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 bg-[#168387] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
          Ecosistema Premium
        </div>
      )}

      {/* IMAGEN Y CONTROL */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-slate-50/50 border border-slate-50 mb-6 isolate">
        {!errorImagen ? (
          <motion.img
            src={modelo.imagen}
            alt={modelo.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-6 transition-transform duration-1000 group-hover:scale-110 will-change-transform"
            style={{ transform: "translateZ(0)" }}
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm">
            Imagen de negocio
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(modelo.id);
          }}
          className={[
            "absolute top-4 right-4 h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-xl border z-30",
            isSelected
              ? "bg-[#24d4da] border-[#24d4da] text-white shadow-xl shadow-cyan-500/40 rotate-90"
              : "bg-white/80 border-white text-slate-400 hover:bg-white hover:text-[#168387] scale-90 group-hover:scale-100",
          ].join(" ")}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSelected ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
          </svg>
        </button>
      </div>

      {/* CONTENIDO DE NEGOCIO */}
      <div className="flex flex-col flex-1 px-2">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest">
              {modelo.etiqueta}
            </span>
            {modelo.badge && (
              <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                {modelo.badge}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-[#168387] transition-colors duration-500">
            {modelo.nombre}
          </h3>
        </div>

        {/* BUSINESS SPECS (NUEVA CAPA DE VALOR) */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { label: "Autonomía", val: "24/7", icon: CpuChipIcon },
            { label: "Demanda", val: "Alta", icon: ArrowTrendingUpIcon },
            { label: "ROI Est.", val: "12m", icon: CurrencyDollarIcon }
          ].map((spec, i) => (
            <div key={i} className="p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex flex-col items-center text-center group/spec hover:bg-white hover:shadow-sm transition-all">
              <spec.icon className="w-3.5 h-3.5 text-slate-400 group-hover/spec:text-[#168387] transition-colors" />
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">{spec.label}</span>
              <span className="text-[10px] font-bold text-slate-700">{spec.val}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-8 opacity-75 font-medium">
          {modelo.descripcion}
        </p>

        {/* FOOTER DE CONVERSIÓN */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="relative group/price">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Inversión Inicial</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter group-hover/price:text-[#168387] transition-colors">
              {formatMXN(modelo.precio)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(modelo.rutaInfo)}
              className="h-12 w-12 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 hover:bg-[#168387] hover:text-white hover:border-[#168387] transition-all duration-500 group/info"
              title="Análisis de Negocio"
            >
              <InformationCircleIcon className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigate(configurePath)}
              className="h-12 px-8 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#168387] hover:shadow-[0_15px_30px_-5px_rgba(22,131,135,0.4)] transition-all duration-500 active:scale-95"
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
    <section className="relative overflow-hidden bg-slate-950 py-32 selection:bg-[#24d4da] selection:text-white">
      <ParallaxBackground
        depthElements={[
          {
            depth: 0.1,
            style: { top: "10%", right: "5%" },
            content: <div className="w-[50rem] h-[50rem] rounded-full blur-[120px]" style={{ backgroundColor: `${BRAND_COLOR}15` }} />
          },
          {
            depth: 0.2,
            style: { bottom: "-10%", left: "5%" },
            content: <div className="w-[40rem] h-[40rem] rounded-full blur-[100px]" style={{ backgroundColor: `${BRAND_DARK}15` }} />
          }
        ]}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeUp(0)} className="max-w-3xl mb-24">
          <span className="font-black tracking-[0.3em] text-[10px] uppercase mb-4 block" style={{ color: BRAND_COLOR }}>
            El Ecosistema Darmax
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
            Todo lo que necesitas <br />
            <span className="text-3xl md:text-5xl" style={{ color: BRAND_COLOR }}>para que tu éxito sea inevitable.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1 * i)}
              className="group relative p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-700"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: `${BRAND_COLOR}20`, color: BRAND_COLOR }}>
                <p.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{p.t}</h3>
              <p className="text-slate-400 text-base leading-relaxed font-medium">
                {p.d}
              </p>
              
              <div className="mt-8 flex items-center gap-2">
                <div className="h-px w-8 group-hover:w-12 transition-all duration-500" style={{ backgroundColor: `${BRAND_COLOR}50` }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: `${BRAND_COLOR}80` }}>Pilar 0{i+1}</span>
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
            className="text-center mb-16"
          >
            <span className="text-[#24d4da] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
              Tu camino al éxito
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              Una historia de <span className="text-[#24d4da]">libertad financiera</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* PASO 1 */}
            <motion.div
              {...fadeUp(0.1)}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${BRAND_COLOR}20`, color: BRAND_COLOR }}>
                <span className="text-2xl font-black">
                  <Counter value="1" prefix="0" />
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">La Visión</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Transformas tu capital inicial en un activo inteligente que no descansa.
              </p>
            </motion.div>

            {/* PASO 2 */}
            <motion.div
              {...fadeUp(0.2)}
              className="p-8 rounded-[2.5rem] border border-white/10 shadow-2xl group hover:scale-[1.02] transition-all text-center relative overflow-hidden"
              style={{ backgroundColor: BRAND_DARK }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
              <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">
                  <Counter value="2" prefix="0" />
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">La Operación</h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Tecnología 24/7 trabajando para ti mientras disfrutas de lo que importa.
              </p>
            </motion.div>

            {/* PASO 3 */}
            <motion.div
              {...fadeUp(0.3)}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${BRAND_COLOR}20`, color: BRAND_COLOR }}>
                <span className="text-2xl font-black">
                  <Counter value="3" prefix="0" />
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">El Resultado</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Recuperas tu inversión y escalas tu negocio a nuevos niveles.
              </p>
            </motion.div>
          </div>

          <div className="mt-16 text-center">
            <motion.div 
              {...fadeUp(0.4)}
              className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-bold"
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND_COLOR }} />
              ROI Proyectado: 12 meses para el retorno total de inversión
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="catalogo"
        className="min-h-screen flex items-center py-24 bg-[#fbfbfd] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* NARRATIVA DE ENTRADA */}
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div className="max-w-3xl">
              <span className="text-[#24d4da] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
                Diseña tu futuro
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                Elige la escala de tu <br />
                <span className="text-[#168387]">próximo éxito</span>
              </h2>
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Esencial</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#168387]/5 rounded-xl border border-[#168387]/10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#168387]" />
                  <span className="text-[10px] font-black text-[#168387] uppercase tracking-widest">Escalable</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/5 rounded-xl border border-cyan-500/10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Ecosistema</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block max-w-xs text-right">
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Desde unidades autónomas hasta modelos híbridos. <br />
                <span className="text-[#168387] font-bold">Todo diseñado para crecer contigo.</span>
              </p>
            </div>
          </motion.div>

          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2.5rem] border border-cyan-100 bg-white p-6 shadow-xl shadow-cyan-900/5"
            >
              <div>
                <p className="text-sm font-black text-slate-900">
                  {selected.length} modelo{selected.length > 1 ? "s" : ""} seleccionado{selected.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-500">Comparativa técnica lista para visualizar.</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelected([])}
                  className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition"
                >
                  Limpiar
                </button>

                <button
                  onClick={() => setCompareOpen(true)}
                  className="px-6 py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#168387]/20 hover:shadow-[#168387]/40 transition"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  Comparar ahora
                </button>
              </div>
            </motion.div>
          )}

          {/* GRUPO 1: INICIO */}
          <motion.div
            {...fadeUp(0.1)}
            className="mb-20 pt-8 border-t border-slate-100"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Nivel 01</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Equipos Individuales</h3>
              </div>
              <div className="h-px w-full bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            className="mb-24"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="shrink-0">
                <span className="text-[10px] font-black text-[#168387] uppercase tracking-[0.3em]">Nivel 02</span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Paquetes de Negocio</h3>
              </div>
              <div className="h-px w-full bg-[#168387]/10" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* HISTORIAS DE ÉXITO (TESTIMONIOS) */}
      <section id="testimonios" className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <motion.div
            {...fadeUp(0)}
            className="text-center mb-20"
          >
            <span className="text-[#24d4da] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
              Resultados Reales
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              Más que clientes, <span className="text-[#168387]">historias de éxito</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* GERARDO ADRIAN CHAVEZ */}
            <motion.div
              {...fadeUp(0.1)}
              className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 flex flex-col group hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#168387] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-cyan-900/10">
                  GA
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg leading-tight">Gerardo Adrian Chávez</h4>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Emprendedor Darmax</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                "Un aliado fundamental para dar el primer paso. Su tecnología me dio la confianza necesaria para iniciar mi propio camino en el negocio del agua."
              </p>
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-4 h-4 text-[#168387]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negocio en Operación</span>
                </div>
              </div>
            </motion.div>

            {/* SALVADOR GUERRERO */}
            <motion.div
              {...fadeUp(0.2)}
              className="p-8 rounded-[3rem] bg-[#168387] text-white flex flex-col shadow-2xl shadow-[#168387]/20 relative overflow-hidden group hover:scale-[1.02] transition-all duration-700"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white text-[#168387] flex items-center justify-center text-xl font-black">
                  SG
                </div>
                <div>
                  <h4 className="font-black text-white text-lg leading-tight">Salvador Guerrero</h4>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">Inversionista Escalable</p>
                </div>
              </div>
              <p className="text-cyan-50 text-sm leading-relaxed font-medium italic relative z-10">
                "Empecé con una sola Vending, pero los resultados fueron tan claros que pronto escalamos a un modelo híbrido con mostrador. La mejor decisión de inversión."
              </p>
              <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                <div className="flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-cyan-200" />
                  <span className="text-[10px] font-black text-cyan-100/60 uppercase tracking-widest">Crecimiento Multi-Unidad</span>
                </div>
              </div>
            </motion.div>

            {/* PURIFICADORA MAITREYA */}
            <motion.div
              {...fadeUp(0.3)}
              className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 flex flex-col group hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black">
                  PM
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg leading-tight">Purificadora Maitreya</h4>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Proyecto Especial</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                "Necesitábamos una solución única y personalizada para nuestra marca. Darmax diseñó una Vending especial que se adapta perfectamente a nuestra identidad."
              </p>
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <WrenchScrewdriverIcon className="w-4 h-4 text-slate-900" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diseño a la Medida</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3D: ANATOMÍA DEL ÉXITO */}
      <motion.section
        id="experiencia-3d"
        {...fadeUp(0)}
        className="relative bg-white border-t border-slate-100 py-24 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* TEXTO NARRATIVO (IZQUIERDA) */}
            <div className="lg:col-span-5 space-y-12 relative z-10">
              <div>
                <span className="text-[#24d4da] font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
                  Ingeniería de Precisión
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                  La anatomía de <br />
                  <span className="text-[#168387]">tu éxito</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  No es solo una máquina, es una pieza de ingeniería diseñada para operar sin descanso.
                </p>
              </div>

              <div className="space-y-8">
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
                    className="flex gap-6 group"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#168387] group-hover:text-white transition-all duration-500 shadow-sm">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base mb-1">{item.t}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* MODELO 3D (DERECHA) */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-[4rem] bg-slate-50 border border-slate-100 p-4 md:p-8 shadow-inner group">
                <div className="absolute top-8 right-8 z-20">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vista 360° Interactiva</span>
                  </div>
                </div>

                <div className="h-[400px] md:h-[550px] flex items-center justify-center">
                  <div className="scale-100 transition-none">
                    <VendingPrecise3D />
                  </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Arrastra para explorar cada ángulo
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

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