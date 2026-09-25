import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import Parallax from "parallax-js";
import SEO from "../components/SEO";
import Calendar from "../components/Calendar";
import VendingPrecise3D from "../components/Vending";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import { getConfiguradorModels, getCachedConfiguradorModels } from "../services/configuradorService";


/* =========================
   ANIMACIONES Y HELPERS
========================= */
const revealUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.42, delay: d, ease: [0.16, 1, 0.3, 1] }
});

const fadeUp = (d = 0) => revealUp(d);
const slideInLeft = (d = 0) => revealUp(d);
const slideInRight = (d = 0) => revealUp(d);

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

const gridContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
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

const API_URL = import.meta.env.VITE_API_URL;
const INITIAL_MODELOS = [
  {
    id: "Vending",
    nombre: "Máquina Vending",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png", 700),
    precio: 54950,
    descripcion:
      "Automatización total 24/7. Genera ingresos pasivos con tecnología de despacho automático y cero personal.",
    rutaInfo: "/vending-info",
  },
  {
    id: "Vending-Limpieza",
    nombre: "Vending Limpieza",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/3productos_dcha1t.png", 700),
    precio: 34950,
    descripcion:
      "Diversifica tu portafolio. Despacho automático de productos de limpieza a granel de alta demanda.",
    rutaInfo: "/vending-limpieza-info",
  },
  {
    id: "Purificadora",
    nombre: "Mostrador",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/2mostrador_iajzgl.png", 700),
    precio: 52950,
    descripcion:
      "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
  },
  {
    id: "Duo-Emprendedor",
    nombre: "Paquete Dúo Emprendedor",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/4emprendedor_lxuzyt.png", 700),
    precio: 89900,
    descripcion:
      "Paquete integral que combina la venta de agua purificada con productos de limpieza a granel, maximizando tu oferta y rentabilidad en un solo espacio.",
    rutaInfo: "/duo-emprendedor-info",
  },
  {
    id: "Tridente",
    nombre: "Paquete Tridente",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/puri3_sr1yoc.png", 700),
    precio: 107900,
    descripcion:
      "Paquete completo de alto impacto que integra agua purificada, productos de limpieza y otros artículos esenciales en una solución llave en mano.",
    rutaInfo: "/tridente-info",
  },
  {
    id: "Megalodon",
    nombre: "Paquete Megalodon",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/6megalodon_wd13q6.png", 700),
    precio: 117900,
    descripcion:
      "Nuestro paquete más avanzado y de mayor capacidad. La estación de vending definitiva para ubicaciones de alto tráfico.",
    rutaInfo: "/megalodon-info",
  },
];

// Helper para calcular dinamicamente los precios "desde" mas bajos a partir de la BD
const computeMinPrices = (dbModels, baseModelos) => {
  if (!Array.isArray(dbModels) || dbModels.length === 0) return baseModelos;

  const validModels = dbModels.filter(
    (m) => typeof m.basePrice === "number" && m.basePrice > 0
  );

  if (validModels.length === 0) return baseModelos;

  // 1. Modelos Vending de Agua (Atlantis, AtlantisTouch, etc.)
  const vendingAguaModels = validModels.filter((m) => {
    const slug = (m.slug || "").toLowerCase();
    const isVendingType = m.vendingType && m.vendingType !== "NONE";
    const notCleaning = !slug.includes("vending5") && !slug.includes("vending8");
    return slug.includes("atlantis") || m.isAtlantis || (isVendingType && notCleaning);
  });

  // 2. Modelos Purificadora / Mostrador (Neptuno, Poseidon, etc.)
  const purificadoraModels = validModels.filter((m) => {
    const slug = (m.slug || "").toLowerCase();
    return (
      slug.includes("neptuno") ||
      slug.includes("poseidon") ||
      slug.includes("mostrador") ||
      slug.includes("purificadora")
    );
  });

  // 3. Modelos Vending de Limpieza
  const vendingLimpiezaModels = validModels.filter((m) => {
    const slug = (m.slug || "").toLowerCase();
    const name = (m.name || "").toLowerCase();
    return (
      slug === "vending5" ||
      slug === "vending8" ||
      (slug.includes("vending") && !slug.includes("atlantis")) ||
      slug.includes("limpieza") ||
      name.includes("clean") ||
      name.includes("limpieza")
    );
  });

  // 4. Modelos Vending 8 (para Megalodon)
  const vendingLimpieza8Models = validModels.filter((m) => {
    const slug = (m.slug || "").toLowerCase();
    return slug === "vending8" || (slug.includes("8") && slug.includes("vending"));
  });

  // Precios minimos individuales
  const minVendingAgua = vendingAguaModels.length > 0
    ? Math.min(...vendingAguaModels.map((m) => m.basePrice))
    : 54950;

  const minPurificadora = purificadoraModels.length > 0
    ? Math.min(...purificadoraModels.map((m) => m.basePrice))
    : 52950;

  const minVendingLimpieza = vendingLimpiezaModels.length > 0
    ? Math.min(...vendingLimpiezaModels.map((m) => m.basePrice))
    : 34950;

  const minVendingLimpieza8 = vendingLimpieza8Models.length > 0
    ? Math.min(...vendingLimpieza8Models.map((m) => m.basePrice))
    : (vendingLimpiezaModels.find((m) => (m.slug || "").toLowerCase() === "vending8")?.basePrice || 44950);

  // En Tridente y Megalodon, el mostrador en paquete tiene un precio especial base de $18,000 en el configurador (BundleWizard)
  const bundleMostradorBasePrice = 18000;

  return baseModelos.map((item) => {
    let minPrice = item.precio;

    if (item.id === "Vending") {
      minPrice = minVendingAgua;
    } else if (item.id === "Purificadora") {
      minPrice = minPurificadora;
    } else if (item.id === "Vending-Limpieza") {
      minPrice = minVendingLimpieza;
    } else if (item.id === "Duo-Emprendedor") {
      const directModel = validModels.find((m) => (m.slug || "").toLowerCase().includes("duo-emprendedor"));
      minPrice = directModel ? directModel.basePrice : (minVendingAgua + minVendingLimpieza);
    } else if (item.id === "Tridente") {
      const directModel = validModels.find((m) => (m.slug || "").toLowerCase().includes("tridente"));
      minPrice = directModel ? directModel.basePrice : (minVendingAgua + bundleMostradorBasePrice + minVendingLimpieza);
    } else if (item.id === "Megalodon") {
      const directModel = validModels.find((m) => (m.slug || "").toLowerCase().includes("megalodon"));
      minPrice = directModel ? directModel.basePrice : (minVendingAgua + bundleMostradorBasePrice + minVendingLimpieza8);
    }

    return {
      ...item,
      precio: minPrice || item.precio,
    };
  });
};

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
  SparklesIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  UserIcon,
  CubeIcon
} from "@heroicons/react/24/outline";
import { Droplet, HandCoins, SprayCan } from "lucide-react";

const getModelSpecs = (modeloId) => {
  if (modeloId === "Purificadora") {
    return [
      { label: "Atención", val: "Personalizada", icon: BuildingStorefrontIcon },
      { label: "Más", val: "Capacidad", icon: Droplet },
      { label: "Mayor", val: "Rentabilidad", icon: ChartBarIcon },
    ];
  }
  if (modeloId === "Vending-Limpieza") {
    return [
      { label: "Variedad", val: "Productos", icon: SprayCan },
      { label: "Ingresos", val: "Adicionales", icon: HandCoins },
      { label: "Negocio", val: "Automático", icon: Cog6ToothIcon },
    ];
  }
  return [
    { label: "Autonomía", val: "24/7", icon: CpuChipIcon },
    { label: "Demanda", val: "Alta", icon: ArrowTrendingUpIcon },
    { label: "ROI Est.", val: "12m", icon: CurrencyDollarIcon },
  ];
};

const getLevelConfig = (modelId, isBundle) => {
  if (modelId === "Vending" || modelId === "Vending-Limpieza") {
    return {
      label: "Esencial",
      badgeBg: "bg-blue-600 shadow-blue-600/30",
      borderClass: "border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-lg hover:shadow-blue-950/5",
    };
  } else if (modelId === "Purificadora" || modelId === "Duo-Emprendedor") {
    return {
      label: "Escalable",
      badgeBg: "bg-[#168387] shadow-[#168387]/30",
      borderClass: "border-2 border-slate-200 hover:border-[#168387] shadow-sm hover:shadow-lg hover:shadow-cyan-950/5",
    };
  } else if (isBundle) {
    return {
      label: "Premium",
      badgeBg: "bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30",
      borderClass: "border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-lg hover:shadow-amber-950/5",
    };
  }

  return {
    label: "",
    badgeBg: "bg-slate-800",
    borderClass: "border-2 border-slate-200 hover:border-slate-300 shadow-sm",
  };
};

const TarjetaModelo = React.memo(({ modelo, navigate, isSelected, onToggleSelect, isCompact = false }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isBundle = BUNDLE_IDS.has(modelo.id);
  const configurePath = getConfigurePath(modelo.id);
  const levelConfig = useMemo(() => getLevelConfig(modelo.id, isBundle), [modelo.id, isBundle]);
  const specs = useMemo(() => getModelSpecs(modelo.id), [modelo.id]);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={[
        "group relative flex flex-col h-full rounded-[2rem] sm:rounded-[2.25rem] bg-white",
        "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] mx-auto",
        isCompact 
          ? "p-3.5 w-[270px]" 
          : "p-4 sm:p-5 w-full max-w-[335px] sm:max-w-[345px] md:max-w-[350px] lg:max-w-[360px]",
        levelConfig.borderClass,
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* BADGE DE NIVEL */}
      {levelConfig.label && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 ${isCompact ? "px-3 py-0.5 text-[9px]" : "px-3.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs"} ${levelConfig.badgeBg} text-white font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-full shadow-md whitespace-nowrap font-montserrat not-italic`}>
          {levelConfig.label}
        </div>
      )}

      {/* IMAGEN Y CONTROL */}
      <div 
        onClick={() => navigate(configurePath)}
        className={`relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50/80 isolate cursor-pointer group/img ${isCompact ? "mb-2.5 p-1.5" : "mb-3 sm:mb-4 p-1.5 sm:p-2"} transition-all duration-500 hover:shadow-inner flex items-center justify-center`}
      >
        {!errorImagen ? (
          <img
            src={optimizeCloudinaryUrl(modelo.imagen, 700)}
            alt={modelo.nombre}
            decoding="async"
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover/img:scale-105"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300 text-sm font-semibold uppercase font-montserrat not-italic">
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
            "absolute top-2 sm:top-2.5 right-2 sm:right-2.5 h-8 w-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 backdrop-blur-xl border z-30",
            isSelected
              ? "bg-[#24d4da] border-[#24d4da] text-white shadow-lg shadow-cyan-500/40 rotate-90"
              : "bg-white/80 border-white text-slate-400 hover:bg-white hover:text-[#168387] scale-90 group-hover/img:scale-100",
          ].join(" ")}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSelected ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />}
          </svg>
        </button>
      </div>

      {/* CONTENIDO DE NEGOCIO */}
      <div className="flex flex-col flex-grow text-center">
        <div className={isCompact ? "mb-1" : "mb-1.5 sm:mb-2"}>
          <h3 className={`${isCompact ? "text-base leading-tight" : "text-lg sm:text-xl leading-snug"} font-bold text-slate-900 tracking-tight group-hover:text-[#168387] transition-colors duration-500 uppercase font-montserrat not-italic`}>
            {modelo.nombre}
          </h3>
        </div>

        {/* BUSINESS SPECS CON SEPARADORES | */}
        <div className={`flex items-center justify-center gap-1 sm:gap-1.5 ${isCompact ? "max-w-[250px] mb-0.5 py-0.5" : "max-w-[285px] sm:max-w-[305px] mb-1 py-1"} mx-auto w-full`}>
          {specs.map((spec, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={`${isCompact ? "h-5" : "h-6 sm:h-7"} w-[1.5px] bg-slate-200 shrink-0 rounded-full self-center`} />}
              <div className="flex-1 flex flex-col items-center text-center min-w-0 group/spec cursor-default px-0.5">
                <spec.icon className={`${isCompact ? "w-3 h-3 mb-0.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1"} text-slate-400 group-hover/spec:text-[#168387] transition-colors duration-300 shrink-0 stroke-[1.6]`} />
                <span className={`${isCompact ? "text-[8.5px]" : "text-[9.5px] sm:text-[10.5px]"} font-semibold text-slate-400 group-hover/spec:text-slate-600 transition-colors duration-300 uppercase tracking-wider truncate w-full font-montserrat not-italic leading-tight`}>
                  {spec.label}
                </span>
                <span className={`${isCompact ? "text-[9px]" : "text-[10px] sm:text-[11px]"} font-bold text-slate-700 group-hover/spec:text-[#168387] transition-colors duration-300 truncate w-full font-montserrat not-italic mt-0.5 leading-tight`}>
                  {spec.val}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* SEPARADOR HORIZONTAL QUE DIVIDE ESPECIFICACIONES DE INVERSIÓN */}
        <div className={`w-full h-px bg-slate-200/80 ${isCompact ? "my-2" : "my-3 sm:my-3.5"}`} />

        {/* FOOTER DE CONVERSIÓN */}
        <div className="mt-auto">
          <div className={`relative group/price ${isCompact ? "mb-2" : "mb-3 sm:mb-4"}`}>
            <span className="block text-[9.5px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5 font-montserrat not-italic">Inversión desde</span>
            <span className={`${isCompact ? "text-xl" : "text-2xl sm:text-2xl lg:text-[26px]"} font-bold text-slate-900 tracking-tight group-hover/price:text-[#168387] transition-colors font-montserrat not-italic`}>
              {formatMXN(modelo.precio)}
            </span>
          </div>

          <div className={`flex flex-col ${isCompact ? "gap-1.5" : "gap-2.5"} w-full items-center`}>
            <Link
              to={configurePath}
              className={`inline-flex items-center justify-center gap-1.5 w-full ${isCompact ? "max-w-[240px] h-9 text-xs" : "max-w-[260px] sm:max-w-[270px] h-11 sm:h-11 text-xs sm:text-[13px]"} px-5 rounded-2xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-[#168387] shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-[#168387]/20 transition-all duration-300 font-montserrat not-italic group/btn cursor-pointer`}
            >
              <span>Configurar</span>
              <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2] group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to={modelo.rutaInfo}
              className="inline-flex items-center justify-center py-1 text-slate-500 hover:text-[#168387] text-xs font-semibold tracking-wider uppercase underline underline-offset-4 decoration-slate-300 hover:decoration-[#168387] transition-all font-montserrat not-italic cursor-pointer"
            >
              <span>Conoce más</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

/* =========================
   SECCIÓN: TU NEGOCIO EN MARCHA
========================= */
function VentajasSection() {
  const pilares = [
    {
      t: "Soporte Total",
      d: "Asesoramiento personalizado, capacitación y puesta en marcha. Nunca caminas solo.",
      icon: UserGroupIcon
    },
    {
      t: "Simplicidad Operativa",
      d: "Gestionas tu negocio sin necesidad de personal técnico especializado.",
      icon: Cog6ToothIcon
    },
    {
      t: "Retorno Acelerado",
      d: "Implementación en tiempo récord para empezar a facturar de inmediato.",
      icon: RocketLaunchIcon
    }
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20 font-montserrat not-italic">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* CABECERA CENTRADA: DINASTÍA DARMAX */}
        <div className="flex flex-col items-center text-center max-w-5xl xl:max-w-6xl mx-auto mb-8 sm:mb-12">
          <motion.div 
            {...slideInLeft(0, "Más que un socio seremos tu mejor aliado")} 
            className="flex flex-col items-center text-center w-full"
          >
            <span className="text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-sm uppercase mb-2 block font-montserrat not-italic text-center">
              DINASTÍA DARMAX
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-bold tracking-tight leading-[1.15] mb-3.5 sm:mb-4 font-montserrat not-italic text-center overflow-visible">
              <span className="block text-[#031638]">
                Más que un{" "}
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-1 pt-0.5">
                  socio
                </span>
              </span>
              <span className="block text-[#031638]">
                seremos tu mejor{" "}
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-1 pt-0.5">
                  aliado
                </span>
              </span>
            </h2>
            <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center max-w-4xl lg:max-w-5xl xl:max-w-6xl px-1 sm:px-2">
              Cada proyecto es único para nosotros y los resultados finales reflejan nuestra esencia como marca.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl lg:max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              {...slideInLeft(0.04 * (i + 1))}
              className="group relative p-5 sm:p-6 max-w-[320px] md:max-w-none w-full mx-auto rounded-2xl sm:rounded-[1.75rem] bg-white border-[0.5px] border-slate-200/80 hover:border-slate-300 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-cyan-950/10 hover:-translate-y-1.5 flex flex-col justify-between font-montserrat not-italic"
            >
              <div className="flex flex-row-reverse items-start justify-between gap-3.5 sm:flex-col sm:gap-0 sm:justify-start w-full">
                <div className="w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-0 sm:mb-5 bg-[#E0F8F9] text-[#288EB9] group-hover:scale-105 transition-transform duration-300 shadow-xs shrink-0 font-montserrat not-italic mt-0.5 sm:mt-0">
                  <p.icon className="w-8 h-8 sm:w-8 sm:h-8 stroke-[1.8]" />
                </div>
                <div className="flex-1 text-left pr-1 sm:pr-0">
                  <h3 className="text-[19px] sm:text-xl font-bold text-[#031638] mb-1.5 sm:mb-2 tracking-tight font-montserrat not-italic group-hover:text-[#288EB9] transition-colors duration-300 leading-tight">
                    {p.t}
                  </h3>
                  <p className="text-slate-600 text-[13px] sm:text-[13.5px] leading-relaxed font-normal font-montserrat not-italic">
                    {p.d}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-5 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-2 font-montserrat not-italic">
                <div className="h-px w-6 sm:w-8 bg-[#288EB9]/40 group-hover:w-10 transition-all duration-300" />
                <span className="text-[11.5px] sm:text-xs font-bold uppercase tracking-widest text-[#288EB9] font-montserrat not-italic">Pilar 0{i+1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BLOQUE INFERIOR DEBAJO DE LAS TARJETAS */}
        <motion.div 
          {...slideInLeft(0.08, "Todo lo que necesitas para que tu éxito sea inevitable")}
          className="mt-12 sm:mt-16 text-center flex flex-col items-center max-w-5xl xl:max-w-6xl w-full mx-auto px-4"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-tight text-[#031638] font-montserrat not-italic mb-2.5 sm:mb-3 whitespace-normal md:whitespace-nowrap">
            <span>Todo lo que necesitas </span>
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-1">
              para que tu éxito sea inevitable
            </span>
          </h3>
          <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center max-w-none whitespace-normal md:whitespace-nowrap mb-8 sm:mb-10">
            Soluciones integrales, tecnología confiable y acompañamiento real en cada etapa de tu negocio.
          </p>

          {/* Frase entre lineas horizontales cortas */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 select-none">
            <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
            <p className="text-slate-500 font-montserrat not-italic text-[11px] sm:text-xs md:text-[13px] font-bold tracking-widest uppercase leading-relaxed text-center">
              CONFIANZA = RESULTADOS
            </p>
            <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
          </div>
        </motion.div>
      </div>

      {/* Difuminado inferior suave hacia la siguiente sección */}
      <div 
        className="absolute -bottom-px inset-x-0 h-14 sm:h-20 bg-gradient-to-b from-transparent via-[#fbfbfd]/70 to-[#fbfbfd] pointer-events-none z-10" 
        aria-hidden="true"
      />
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
  const [showVendingSpecs, setShowVendingSpecs] = useState(true);
  const [modelosData, setModelosData] = useState(() => {
    const cached = getCachedConfiguradorModels();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return computeMinPrices(cached, INITIAL_MODELOS);
    }
    return INITIAL_MODELOS;
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDbModels = async () => {
      try {
        const data = await getConfiguradorModels();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const updated = computeMinPrices(data, INITIAL_MODELOS);
          setModelosData((prev) => {
            const hasDifference = updated.some(
              (m, idx) => m.precio !== prev[idx]?.precio || m.nombre !== prev[idx]?.nombre
            );
            return hasDifference ? updated : prev;
          });
        }
      } catch (error) {
        console.error("Error fetching models for IniciaNegocio:", error);
      }
    };

    fetchDbModels();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const toggleSelect = useCallback(
    (id) =>
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  );

  const selectedModels = modelosData.filter((m) => selected.includes(m.id));

  // Estado y orden para acordeón de modelos en vista móvil
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileCarouselRef = useRef(null);

  const todosLosModelos = useMemo(() => {
    const individuales = modelosData.filter((m) => !BUNDLE_IDS.has(m.id));
    const paquetes = modelosData.filter((m) => BUNDLE_IDS.has(m.id));
    return [...individuales, ...paquetes];
  }, [modelosData]);

  const numIndividuales = useMemo(
    () => modelosData.filter((m) => !BUNDLE_IDS.has(m.id)).length,
    [modelosData]
  );

  const isNivelDos = activeMobileIndex >= numIndividuales;

  const handleMobileScroll = useCallback(() => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const cardNodes = container.querySelectorAll(".modelo-card-item");
    let closestIdx = 0;
    let minDiff = Infinity;
    cardNodes.forEach((node, idx) => {
      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const diff = Math.abs(center - nodeCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setActiveMobileIndex(closestIdx);
  }, []);

  const scrollToCard = useCallback((index) => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const cardNodes = container.querySelectorAll(".modelo-card-item");
    const targetCard = cardNodes[index];
    if (targetCard) {
      const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2;
      const targetScroll = cardCenter - container.offsetWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, []);

  // Centrar la primera tarjeta al montar en vista móvil
  useEffect(() => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollLeft = 0;
    }
  }, []);

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
        className="relative py-12 sm:py-16 md:py-20 overflow-hidden z-30 bg-[#f8fafc] not-italic"
      >
        {/* IMAGEN DE FONDO */}
        <div className="absolute inset-0 z-0">
          <img 
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_2_rugkl2.png", 1920)} 
            alt="Fondo Historia de Éxito y Retorno de Inversión" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Difuminado superior suave que conecta con las tarjetas de métricas de arriba */}
        <div 
          className="absolute -top-px inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/70 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            {...slideInLeft(0, "Inicia tu libertad financiera")}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
              Tu camino al éxito
            </span>
            <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="block text-[#031638]">
                Inicia Tu
              </span>
              <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                libertad financiera
              </span>
            </h2>
          </motion.div>

          {/* CONTENEDOR DE TARJETAS COMPACTAS CON LINEA CONECTORA */}
          <div className="relative pt-8 sm:pt-9 max-w-4xl mx-auto">
            {/* LINEA CONECTORA EN MEDIO DE LAS TARJETAS (Escritorio / Tablet) */}
            <div 
              className="hidden md:block absolute top-[calc(50%+14px)] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#288EB9]/20 via-[#1DB3BA]/60 to-[#288EB9]/20 -translate-y-1/2 z-0 pointer-events-none" 
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 lg:gap-6 items-stretch relative z-10">
              {/* TARJETA 1: VISIÓN */}
              <motion.div
                {...slideInLeft(0.02)}
                className="relative pt-10 pb-5 px-4 sm:pt-12 sm:pb-6 sm:px-5 max-w-[320px] md:max-w-none w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-start not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LightBulbIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-2 sm:mb-2.5 tracking-tight">
                    Visión
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-[13px] font-normal leading-relaxed text-center font-montserrat not-italic">
                    Crear una comunidad de emprendedores que ofrezcan productos de alto valor y excelente calidad, impulsando la rentabilidad de sus negocios mediante la innovación y un servicio excepcional.
                  </p>
                </div>
              </motion.div>

              {/* TARJETA 2: OPERACIÓN */}
              <motion.div
                {...slideInLeft(0.04)}
                className="relative pt-10 pb-5 px-4 sm:pt-12 sm:pb-6 sm:px-5 max-w-[320px] md:max-w-none w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-start not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cog6ToothIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-2 sm:mb-2.5 tracking-tight">
                    Operación
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-[13px] font-normal leading-relaxed text-center font-montserrat not-italic">
                    Te acompañamos en cada etapa de tu emprendimiento, desde la elección del local ideal hasta la selección y configuración de tu modelo de negocio, con instalación profesional y capacitación especializada.
                  </p>
                </div>
              </motion.div>

              {/* TARJETA 3: RESULTADO */}
              <motion.div
                {...slideInLeft(0.06)}
                className="relative pt-10 pb-5 px-4 sm:pt-12 sm:pb-6 sm:px-5 max-w-[320px] md:max-w-none w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-start not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-2 sm:mb-2.5 tracking-tight">
                    Resultado
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-[13px] font-normal leading-relaxed text-center font-montserrat not-italic">
                    Genera ingresos diarios y recupera tu inversión a corto plazo con un negocio fácil de operar. Brinda seguridad y confianza a tus clientes con el respaldo y la calidad de Darmax Agua.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 flex justify-center px-4">
            <motion.div 
              {...slideInLeft(0.08)}
              className="w-full max-w-md sm:max-w-lg md:max-w-[620px] flex items-center justify-center gap-3.5 sm:gap-6 py-4 px-6 sm:px-10 rounded-2xl sm:rounded-[2rem] bg-[#CAEAEF] border border-[#a6dce4] backdrop-blur-md shadow-md shadow-cyan-950/5 text-left not-italic"
            >
              {/* Icono de flecha de subida en círculo temático */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-md shadow-[#1DB3BA]/30 flex items-center justify-center shrink-0">
                <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
              </div>

              {/* Separador vertical */}
              <div className="h-8 sm:h-10 w-[1.5px] bg-[#031638]/20 shrink-0 rounded-full" />

              <div className="flex flex-col">
                <h4 className="text-sm sm:text-lg md:text-xl font-bold text-[#031638] font-montserrat not-italic tracking-tight leading-tight">
                  ROI Proyectado: 12 meses
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 font-medium font-montserrat not-italic mt-0.5 sm:mt-1">
                  para el retorno total de tu inversión.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Difuminado suave para difuminar la línea divisoria con la siguiente sección */}
        <div 
          className="absolute -bottom-px inset-x-0 h-12 sm:h-20 bg-gradient-to-b from-transparent via-[#fbfbfd]/70 to-[#fbfbfd] pointer-events-none z-10" 
          aria-hidden="true"
        />
      </section>

      <section
        id="catalogo"
        className="pt-6 sm:pt-8 md:pt-10 pb-16 sm:pb-24 bg-[#fbfbfd] overflow-hidden scroll-mt-16 sm:scroll-mt-20 not-italic"
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* NARRATIVA DE ENTRADA */}
          <motion.div
            {...slideInRight(0, "Elige la escala de tu próximo éxito")}
            className="flex flex-col items-center text-center mb-10 sm:mb-16 mx-auto"
          >
            <div className="max-w-4xl flex flex-col items-center">
              <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
                TU PRÓXIMO ÉXITO SE VE ASÍ
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.2] sm:leading-tight mb-4 sm:mb-6 text-center">
                <span className="block text-[#031638] pb-1">
                  Elige tu futuro
                </span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-2 sm:pb-3 pt-0.5">
                  configura tu negocio
                </span>
              </h2>
              <div className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center mb-4 sm:mb-6 max-w-2xl">
                <p>Desde modelos de negocio totalmente automáticos hasta modelos híbridos para generar más ingresos.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 sm:mt-4">
                <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-blue-50/80 rounded-xl border border-blue-200 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-montserrat not-italic">Esencial</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-teal-50/80 rounded-xl border border-[#168387]/30 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#168387]" />
                  <span className="text-xs font-bold text-[#168387] uppercase tracking-widest font-montserrat not-italic">Escalable</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-amber-50/80 rounded-xl border border-amber-300 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-montserrat not-italic">Premium</span>
                </div>
              </div>
            </div>
          </motion.div>

          {selected.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[2rem] sm:rounded-[2.5rem] border border-cyan-100 bg-white p-5 sm:p-6 shadow-xl shadow-cyan-900/5 font-montserrat not-italic"
            >
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 font-montserrat not-italic">
                  {selected.length} modelo{selected.length > 1 ? "s" : ""} seleccionado{selected.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-slate-500 font-montserrat not-italic">Comparativa técnica lista para visualizar.</p>
              </div>

              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelected([])}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition font-montserrat not-italic"
                >
                  Limpiar
                </button>

                <button
                  onClick={() => setCompareOpen(true)}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#168387]/20 hover:shadow-[#168387]/40 transition font-montserrat not-italic"
                  style={{ backgroundColor: BRAND_DARK }}
                >
                  Comparar
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================
              VISTA MÓVIL: FORMATO ACORDEÓN HORIZONTAL CON HEADER DINÁMICO
             ======================================================== */}
          <div className="block sm:hidden mb-12">
            {/* Header dinámico: cambia de Nivel 01 a Nivel 02 según la tarjeta activa */}
            <div className="flex items-center justify-between gap-3 mb-2 px-1">
              <div className="shrink-0 transition-all duration-300">
                <span 
                  className={`text-xs font-bold uppercase tracking-[0.2em] font-montserrat not-italic transition-colors duration-300 block ${
                    isNivelDos ? "text-[#168387]" : "text-slate-400"
                  }`}
                >
                  {isNivelDos ? "Nivel 02" : "Nivel 01"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight font-montserrat not-italic transition-all duration-300">
                  {isNivelDos ? "Paquetes de Negocio" : "Individuales"}
                </h3>
              </div>
              <div 
                className={`h-px flex-1 transition-colors duration-300 ${
                  isNivelDos ? "bg-[#168387]/30" : "bg-slate-200"
                }`} 
              />
              <span className="text-[10.5px] font-semibold text-slate-400 tracking-wider shrink-0 font-montserrat not-italic">
                {activeMobileIndex + 1}/{todosLosModelos.length}
              </span>
            </div>

            {/* Contenedor acordeón de tarjetas con snap y peeking */}
            <div 
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-7 pb-4 -mx-4 px-0 no-scrollbar items-center"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
            >
              {/* Espaciador inicial para centrar la primera tarjeta */}
              <div 
                className="shrink-0 pointer-events-none" 
                style={{ width: "calc(50vw - 149px)" }} 
                aria-hidden="true" 
              />

              {todosLosModelos.map((modelo, idx) => {
                const isActive = activeMobileIndex === idx;
                return (
                  <div 
                    key={modelo.id} 
                    className={`modelo-card-item snap-center shrink-0 w-[270px] transition-all duration-300 ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.96] opacity-85"
                    }`}
                  >
                    <TarjetaModelo
                      modelo={modelo}
                      navigate={navigate}
                      isSelected={selected.includes(modelo.id)}
                      onToggleSelect={toggleSelect}
                      isCompact={true}
                    />
                  </div>
                );
              })}

              {/* Espaciador final para centrar la última tarjeta */}
              <div 
                className="shrink-0 pointer-events-none" 
                style={{ width: "calc(50vw - 149px)" }} 
                aria-hidden="true" 
              />
            </div>

            {/* Indicadores de posición */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {todosLosModelos.map((m, idx) => {
                const isActive = activeMobileIndex === idx;
                const isBundle = BUNDLE_IDS.has(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    aria-label={`Ver modelo ${m.nombre}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? isBundle
                          ? "w-6 h-2 bg-[#168387]"
                          : "w-6 h-2 bg-slate-800"
                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* ========================================================
              VISTA ESCRITORIO / TABLET: 2 GRUPOS EN GRID CLÁSICO
             ======================================================== */}
          <div className="hidden sm:block">
            {/* GRUPO 1: INICIO */}
            <div className="mb-12 sm:mb-20">
              <motion.div
                {...slideInRight(0.08)}
                className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
              >
                <div className="shrink-0">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-montserrat not-italic">Nivel 01</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-montserrat not-italic">Individuales</h3>
                </div>
                <div className="h-px w-full bg-slate-200" />
              </motion.div>

              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {modelosData
                  .filter((m) => !BUNDLE_IDS.has(m.id))
                  .map((modelo) => (
                    <TarjetaModelo
                      key={modelo.id}
                      modelo={modelo}
                      navigate={navigate}
                      isSelected={selected.includes(modelo.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
              </motion.div>
            </div>

            {/* GRUPO 2: ESCALA */}
            <div className="mb-16 sm:mb-24">
              <motion.div
                {...slideInRight(0.08)}
                className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
              >
                <div className="shrink-0">
                  <span className="text-xs font-bold text-[#168387] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-montserrat not-italic">Nivel 02</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-montserrat not-italic">Paquetes de Negocio</h3>
                </div>
                <div className="h-px w-full bg-[#168387]/20" />
              </motion.div>

              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {modelosData
                  .filter((m) => BUNDLE_IDS.has(m.id))
                  .map((modelo) => (
                    <TarjetaModelo
                      key={modelo.id}
                      modelo={modelo}
                      navigate={navigate}
                      isSelected={selected.includes(modelo.id)}
                      onToggleSelect={toggleSelect}
                    />
                  ))}
              </motion.div>
            </div>
          </div>

          {/* BARRA DE BENEFICIOS Y VALOR INCLUIDO */}
          <motion.div
            {...slideInLeft(0.06)}
            className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 rounded-xl sm:rounded-2xl bg-[#e9f5fb] border border-[#cde5f1] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-sm shadow-slate-900/5 backdrop-blur-md not-italic"
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-6 lg:flex lg:items-center lg:justify-between lg:gap-2">
              
              {/* Instalación incluida */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <Cog6ToothIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Instalación incluida
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-[#c5dfed] rounded-full" />

              {/* Capacitación y soporte */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <UserGroupIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Capacitación y soporte
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-[#c5dfed] rounded-full" />

              {/* Equipos de alta calidad */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <ShieldCheckIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Equipos de alta calidad
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-[#c5dfed] rounded-full" />

              {/* Acompañamiento en tu crecimiento */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <ChartBarIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Acompañamiento en tu crecimiento
                </span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Difuminado inferior suave */}
        <div 
          className="absolute -bottom-px inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/70 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />
      </section>

      {/* SECCIÓN 3D: ANATOMÍA DEL ÉXITO */}
      <motion.section
        id="experiencia-3d"
        {...fadeUp(0)}
        className="relative pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-14 md:pb-16 overflow-hidden z-30 bg-[#f8fafc] font-montserrat not-italic"
      >
        {/* IMAGEN DE FONDO */}
        <div className="absolute inset-0 z-0">
          <img 
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_3_l5khnn.png", 1920)} 
            alt="Fondo Purificación Inteligente" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Difuminado superior suave */}
        <div 
          className="absolute -top-px inset-x-0 h-10 sm:h-16 bg-gradient-to-b from-[#f8fafc] via-[#f8fafc]/70 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-6 xl:gap-8 items-center">
            
            {/* COLUMNA IZQUIERDA: TÍTULO, SUBTÍTULO Y 3 COLUMNAS (50%) */}
            <motion.div 
              {...slideInLeft(0.02, "Purificación Inteligente")}
              className="w-full relative z-10 lg:pr-2 flex flex-col justify-center"
            >
              {/* TITULO Y SUBTITULO */}
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left mb-9 sm:mb-9 lg:mb-8">
                <span className="text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-sm uppercase mb-2.5 sm:mb-2 block font-montserrat not-italic text-center sm:text-left">
                  ÚNICOS EN EL MERCADO
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-bold tracking-tight leading-[1.14] mb-4.5 sm:mb-4 font-montserrat not-italic text-center sm:text-left overflow-visible">
                  <span className="block text-[#031638]">
                    Invierte en una
                  </span>
                  <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent block whitespace-nowrap pb-1 pt-0.5">
                    Máquina Premium
                  </span>
                  <span className="block text-[#031638]">
                    y sé diferente al resto
                  </span>
                </h2>
                <p className="text-slate-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl text-center sm:text-left font-montserrat not-italic">
                  Conoce los beneficios e innovación detrás de cada máquina. Darmax Agua fabrica sus propios gabinetes y ensambla sus propias tarjetas.
                </p>
              </div>

              {/* 3 COLUMNAS DE CARACTERISTICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-3.5 xl:gap-5 px-4 sm:px-0 max-w-[340px] sm:max-w-none mx-auto">
                {[
                  { 
                    t: "Diseño Industrial", 
                    d: "Fabricacion completa en acero inoxidable 304 cortado a laser y pulido.",
                    icon: Droplet 
                  },
                  { 
                    t: "Cerebro Inteligente", 
                    d: "Nuestra tarjeta cuenta con animaciones, instrucciones de llenado y bocina que guia al cliente en su proceso de compra.",
                    icon: CpuChipIcon 
                  },
                  { 
                    t: "Interfaz de Usuario", 
                    d: "Diseñado para ser facil de operar, cuenta con contador de ingresos, conteo de garrafones y diagnostico de fallas.",
                    icon: UserIcon 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    {...slideInLeft(0.04 * (i + 1), `3D: ${item.t}`)}
                    className="flex flex-row items-start sm:flex-col sm:items-start gap-3.5 sm:gap-0 group w-full"
                  >
                    <div className="w-12 h-12 sm:w-[50px] sm:h-[50px] xl:w-14 xl:h-14 shrink-0 rounded-full bg-white border border-[#c4eef5] text-[#1c79a6] flex items-center justify-center group-hover:bg-[#1c79a6] group-hover:border-[#1c79a6] group-hover:text-white transition-all duration-300 mb-0 sm:mb-2.5 xl:mb-3 shadow-sm group-hover:shadow-md group-hover:scale-105 mt-0.5 sm:mt-0">
                      <item.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 xl:w-7 xl:h-7 stroke-[1.8]" />
                    </div>
                    <div className="w-full text-left">
                      <h4 className="font-bold text-[#031638] group-hover:text-[#1c79a6] text-xs sm:text-[13.5px] xl:text-[14.5px] font-montserrat not-italic transition-colors leading-tight mb-1 sm:mb-1.5 tracking-tight">
                        {item.t}
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-[12.5px] leading-relaxed font-normal font-montserrat not-italic">
                        {item.d}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* COLUMNA DERECHA: MODELO 3D (50%) */}
            <motion.div 
              {...slideInRight(0.04, "Módulo 3D Interactivo")}
              className="w-full relative overflow-visible flex justify-center lg:justify-end"
            >
              <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#F0FCFF] border border-[#c4eef5] p-3.5 sm:p-4 shadow-xl shadow-cyan-950/5 backdrop-blur-md group w-full max-w-[580px] xl:max-w-[620px]">
                
                {/* Lado izquierdo: Frase en 3 líneas */}
                <div className="absolute top-3.5 sm:top-4 left-5 sm:left-7 z-20">
                  <div className="text-[7.5px] sm:text-[8px] font-semibold text-slate-600 uppercase tracking-widest font-montserrat not-italic leading-[1.35] text-left">
                    <span className="block">TECNOLOGÍA</span>
                    <span className="block">QUE GENERA</span>
                    <span className="block">OPORTUNIDADES</span>
                  </div>
                </div>

                {/* Badge 360° Interactiva */}
                <div className="absolute top-3.5 sm:top-4 right-5 sm:right-7 z-20">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 bg-[#b5e0ef] rounded-full border border-[#94cbde] backdrop-blur-md shadow-sm">
                    <CubeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1c79a6] stroke-[2]" />
                    <span className="text-[8.5px] sm:text-[9px] font-semibold text-slate-800 uppercase tracking-widest font-montserrat not-italic">360° Interactiva</span>
                  </div>
                </div>

                <div className="h-[300px] sm:h-[360px] md:h-[400px] lg:h-[430px] xl:h-[450px] flex items-center justify-center overflow-visible">
                  <VendingPrecise3D showCallouts={showVendingSpecs} />
                </div>

                {/* Parte inferior: Boton de especificaciones y texto de interaccion */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none">
                  {/* Boton para alternar especificaciones (solo en tablet y escritorio) */}
                  <button
                    type="button"
                    onClick={() => setShowVendingSpecs((v) => !v)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/95 hover:bg-[#1c79a6] text-slate-700 hover:text-white rounded-full border border-slate-200/90 hover:border-[#1c79a6] backdrop-blur-md shadow-sm hover:shadow transition-all text-[10px] font-semibold uppercase tracking-widest font-montserrat not-italic cursor-pointer pointer-events-auto"
                  >
                    <span>{showVendingSpecs ? "Ocultar detalles" : "Ver detalles"}</span>
                  </button>

                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap font-montserrat not-italic">
                    Arrastra para rotar e interactuar
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Difuminado inferior suave hacia la siguiente sección */}
        <div 
          className="absolute -bottom-px inset-x-0 h-14 sm:h-20 bg-gradient-to-b from-transparent via-white/70 to-white pointer-events-none z-10" 
          aria-hidden="true"
        />
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
