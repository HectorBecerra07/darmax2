import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
    id: "Purificadora",
    nombre: "Mostrador",
    imagen: optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/2mostrador_iajzgl.png", 700),
    precio: 52950,
    descripcion:
      "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
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
  UserIcon
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

const TarjetaModelo = React.memo(({ modelo, navigate, isSelected, onToggleSelect }) => {
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
        "group relative flex flex-col h-full rounded-[2rem] sm:rounded-[2.25rem] bg-white p-4 sm:p-5",
        "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)]",
        "w-full max-w-[320px] sm:max-w-[340px] md:max-w-[350px] lg:max-w-[360px] mx-auto",
        levelConfig.borderClass,
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* BADGE DE NIVEL */}
      {levelConfig.label && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 sm:px-4 sm:py-1.5 ${levelConfig.badgeBg} text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] rounded-full shadow-md whitespace-nowrap font-montserrat not-italic`}>
          {levelConfig.label}
        </div>
      )}

      {/* IMAGEN Y CONTROL */}
      <div 
        onClick={() => navigate(configurePath)}
        className="relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-slate-50/80 isolate cursor-pointer group/img mb-3 sm:mb-4 transition-all duration-500 hover:shadow-inner flex items-center justify-center p-1.5 sm:p-2"
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
            "absolute top-2 sm:top-2.5 right-2 sm:right-2.5 h-7.5 w-7.5 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 backdrop-blur-xl border z-30",
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
        <div className="mb-1.5 sm:mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#168387] transition-colors duration-500 uppercase font-montserrat not-italic">
            {modelo.nombre}
          </h3>
        </div>

        {/* BUSINESS SPECS CON SEPARADORES | */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 max-w-[285px] sm:max-w-[305px] mx-auto w-full mb-1 py-1">
          {specs.map((spec, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="h-6 sm:h-7 w-[1.5px] bg-slate-200 shrink-0 rounded-full self-center" />}
              <div className="flex-1 flex flex-col items-center text-center min-w-0 group/spec cursor-default px-0.5">
                <spec.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover/spec:text-[#168387] transition-colors duration-300 mb-1 shrink-0 stroke-[1.6]" />
                <span className="text-[9.5px] sm:text-[10.5px] font-semibold text-slate-400 group-hover/spec:text-slate-600 transition-colors duration-300 uppercase tracking-wider truncate w-full font-montserrat not-italic leading-tight">
                  {spec.label}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 group-hover/spec:text-[#168387] transition-colors duration-300 truncate w-full font-montserrat not-italic mt-0.5 leading-tight">
                  {spec.val}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* SEPARADOR HORIZONTAL QUE DIVIDE ESPECIFICACIONES DE INVERSIÓN */}
        <div className="w-full h-px bg-slate-200/80 my-3 sm:my-3.5" />

        {/* FOOTER DE CONVERSIÓN */}
        <div className="mt-auto">
          <div className="relative group/price mb-3 sm:mb-4">
            <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5 font-montserrat not-italic">Inversión desde</span>
            <span className="text-2xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight group-hover/price:text-[#168387] transition-colors font-montserrat not-italic">
              {formatMXN(modelo.precio)}
            </span>
          </div>

          <div className="flex flex-col gap-2.5 w-full items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(configurePath)}
              className="w-full h-10 px-5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-[#168387] shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-[#168387]/20 transition-all duration-300 font-montserrat not-italic"
            >
              Configurar
            </motion.button>

            <button
              type="button"
              onClick={() => navigate(modelo.rutaInfo)}
              className="inline-flex items-center justify-center gap-1.5 py-1 text-slate-600 hover:text-[#168387] text-xs sm:text-sm font-semibold tracking-wider uppercase underline underline-offset-4 decoration-slate-300 hover:decoration-[#168387] transition-all group/link font-montserrat not-italic"
            >
              <span>Conoce más</span>
              <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8] group-hover/link:translate-x-1 transition-transform" />
            </button>
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
      d: "Desde la capacitación hasta la puesta en marcha. Nunca caminas solo.",
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
    <section className="relative overflow-hidden bg-[#f8fafc] pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20 font-montserrat not-italic">
      {/* IMAGEN DE FONDO */}
      <div className="absolute inset-0 z-0">
        <img 
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_4_bvpiur.png", 1920)} 
          alt="Fondo El Ecosistema Darmax" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Difuminado superior suave desde la sección de testimonios */}
      <div 
        className="absolute -top-px inset-x-0 h-12 sm:h-20 bg-gradient-to-b from-white via-white/70 to-transparent pointer-events-none z-10" 
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...slideInLeft(0, "Todo lo que necesitas para que tu éxito sea inevitable.")} className="max-w-5xl lg:max-w-6xl mb-10 sm:mb-14 flex flex-col items-center text-center mx-auto w-full">
          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block text-center">
            El Ecosistema Darmax
          </span>
          <h2 className="font-montserrat not-italic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-5 text-center">
            <span className="block text-[#031638]">
              Todo lo que necesitas
            </span>
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block sm:whitespace-nowrap">
              para que tu éxito sea inevitable.
            </span>
          </h2>
          <div className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center space-y-0.5 sm:space-y-1 max-w-3xl">
            <p>Soluciones integrales, tecnología confiable y acompañamiento real</p>
            <p>en cada etapa de tu negocio.</p>
          </div>
        </motion.div>

        <div className="max-w-4xl lg:max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pilares.map((p, i) => (
            <motion.div
              key={i}
              {...slideInLeft(0.04 * (i + 1))}
              className="group relative p-5 sm:p-6 rounded-2xl sm:rounded-[1.75rem] bg-white border-[0.5px] border-slate-200/80 hover:border-slate-300 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:shadow-cyan-950/10 hover:-translate-y-1.5 flex flex-col justify-between font-montserrat not-italic"
            >
              <div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-5 bg-[#E0F8F9] text-[#288EB9] group-hover:scale-105 transition-transform duration-300 shadow-xs shrink-0 font-montserrat not-italic">
                  <p.icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#031638] mb-1.5 sm:mb-2 tracking-tight font-montserrat not-italic group-hover:text-[#288EB9] transition-colors duration-300">
                  {p.t}
                </h3>
                <p className="text-slate-600 text-xs sm:text-[13.5px] leading-relaxed font-normal font-montserrat not-italic">
                  {p.d}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-5 flex items-center gap-2 font-montserrat not-italic">
                <div className="h-px w-6 sm:w-8 bg-[#288EB9]/40 group-hover:w-10 transition-all duration-300" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#288EB9] font-montserrat not-italic">Pilar 0{i+1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Frase entre lineas horizontales cortas */}
        <div className="flex items-center justify-center gap-3 sm:gap-4.5 mt-8 sm:mt-12 select-none px-4">
          <div className="h-[1.5px] w-8 sm:w-12 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
          <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center">
            Más que equipos, oportunidades reales.
          </p>
          <div className="h-[1.5px] w-8 sm:w-12 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
        </div>
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
   SECCIÓN: TESTIMONIOS (CARRUSEL)
========================= */
const TESTIMONIOS_DATA = [
  { 
    id: 1,
    name: "Gerardo Adrian Chávez", 
    role: "Emprendedor Darmax", 
    text: "\"Un aliado fundamental para dar el primer paso. Su tecnología me dio la confianza necesaria para iniciar mi propio camino en el negocio del agua.\"",
    badge: "Negocio en Operación",
    Icon: CheckBadgeIcon,
  },
  { 
    id: 2,
    name: "Salvador Guerrero", 
    role: "Inversionista Escalable", 
    text: "\"Empecé con una sola Vending, pero los resultados fueron tan claros que pronto escalamos a un modelo híbrido con mostrador. La mejor decisión de inversión.\"",
    badge: "Crecimiento Multi-Unidad",
    Icon: ArrowTrendingUpIcon,
  },
  { 
    id: 3,
    name: "Purificadora Maitreya", 
    role: "Proyecto Especial", 
    text: "\"Necesitábamos una solución única y personalizada para nuestra marca. Darmax diseñó una Vending especial que se adapta perfectamente a nuestra identidad.\"",
    badge: "Diseño a la Medida",
    Icon: WrenchScrewdriverIcon,
  },
  { 
    id: 4,
    name: "Mariana Morales", 
    role: "Vending Agua & Limpieza", 
    text: "\"Excelente modelo de negocio. La combinación de agua purificada y productos de limpieza a granel ha tenido una demanda constante en nuestra zona.\"",
    badge: "Punto Comercial Activo",
    Icon: BuildingStorefrontIcon,
  },
  { 
    id: 5,
    name: "Carlos Mendoza", 
    role: "Emprendedor Regional", 
    text: "\"El acompañamiento y la capacitación técnica nos dieron la certeza que necesitábamos para operar nuestro punto sin depender de personal continuo.\"",
    badge: "Operación Autónoma",
    Icon: ShieldCheckIcon,
  },
  { 
    id: 6,
    name: "Roberto Elizondo", 
    role: "Inversión Patrimonial", 
    text: "\"La calidad de los componentes de grado alimenticio y la robustez del equipo garantizan una operación continua 24/7 con mínimo mantenimiento.\"",
    badge: "Alta Rentabilidad",
    Icon: ChartBarIcon,
  },
];

const TestimoniosCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, TESTIMONIOS_DATA.length - itemsPerPage);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div className="relative w-full px-2 sm:px-10 lg:px-12">
      {/* Boton Anterior a la izquierda */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-0 sm:-left-2 lg:-left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center justify-center transition-all duration-300 ${
          currentIndex === 0
            ? "opacity-30 cursor-not-allowed bg-slate-50/50 text-slate-300"
            : "text-slate-700 hover:text-[#288EB9] hover:border-[#288EB9] hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-white"
        }`}
        aria-label="Testimonios anteriores"
      >
        <ChevronLeftIcon className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* Contenedor del Carrusel */}
      <div 
        className="overflow-hidden w-full py-6 -my-6 px-1 -mx-1"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {TESTIMONIOS_DATA.map((testimonio) => (
            <div
              key={testimonio.id}
              className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5 sm:px-3.5"
            >
              <div className="group relative overflow-hidden h-full p-5 sm:p-6 rounded-2xl sm:rounded-[1.5rem] bg-white border-[0.5px] border-slate-200/80 group-hover:border-transparent flex flex-col justify-between transition-all duration-500 hover:shadow-[0_10px_30px_rgba(40,142,185,0.18)] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-default min-h-[220px] sm:min-h-[235px]">
                
                {/* Marca de agua de comillas de cierre redondas de diseñadora */}
                <svg 
                  className="absolute top-4 right-4 sm:right-5 w-12 h-12 sm:w-14 sm:h-14 text-slate-100/90 group-hover:text-white/10 transition-colors duration-500 pointer-events-none select-none z-0" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19.4167 6.67891C20.4469 7.77257 21.0001 9 21.0001 10.9897C21.0001 14.4891 18.5436 17.6263 14.9695 19.1768L14.0768 17.7992C17.4121 15.9946 18.0639 13.6539 18.3245 12.178C17.7875 12.4557 17.0845 12.5533 16.3954 12.4895C14.591 12.3222 13.1689 10.8409 13.1689 9C13.1689 7.067 14.7359 5.5 16.6689 5.5C17.742 5.5 18.7681 5.99045 19.4167 6.67891ZM9.41669 6.67891C10.4469 7.77257 11.0001 9 11.0001 10.9897C11.0001 14.4891 8.54359 17.6263 4.96951 19.1768L4.07682 17.7992C7.41206 15.9946 8.06392 13.6539 8.32447 12.178C7.78747 12.4557 7.08452 12.5533 6.39539 12.4895C4.59102 12.3222 3.16895 10.8409 3.16895 9C3.16895 7.067 4.73595 5.5 6.66895 5.5C7.742 5.5 8.76814 5.99045 9.41669 6.67891Z" />
                </svg>

                {/* Capa de fondo para el hover (Gradiente de Historias de Éxito) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                
                {/* Textura sutil en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px] transition-opacity duration-500 pointer-events-none z-0" />

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Header de la tarjeta: Nombre, estrellas y subtítulo/rol (not-italic) */}
                  <div className="mb-3 sm:mb-3.5 pr-10 sm:pr-12">
                    <h4 className="font-bold text-slate-900 group-hover:text-white text-base sm:text-[17px] leading-snug transition-colors duration-500 font-montserrat not-italic truncate">
                      {testimonio.name}
                    </h4>
                    <div className="flex gap-0.5 my-1 sm:my-1.5">
                      {[...Array(5)].map((_, idx) => (
                        <StarIcon key={idx} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-all" />
                      ))}
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-[#288EB9] group-hover:text-cyan-100 uppercase tracking-wider opacity-90 transition-colors duration-500 font-montserrat not-italic truncate">
                      {testimonio.role}
                    </p>
                  </div>

                  {/* Texto del testimonio: EN CURSIVA (italic) como solicito el usuario */}
                  <p className="font-montserrat italic text-slate-600 group-hover:text-white/95 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed mb-4 opacity-95 relative z-10 transition-colors duration-500 line-clamp-4">
                    {testimonio.text}
                  </p>
                </div>

                {/* Linea horizontal divisoria mas marcada y badge inferior (not-italic) */}
                <div className="mt-auto pt-3.5 sm:pt-4 border-t-2 border-slate-200 group-hover:border-white/30 relative z-10 transition-colors duration-500">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <testimonio.Icon className="w-4 h-4 text-[#288EB9] group-hover:text-cyan-200 transition-colors duration-500 shrink-0 stroke-[1.8]" />
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 group-hover:text-cyan-100 uppercase tracking-wider transition-colors duration-500 font-montserrat not-italic truncate">
                      {testimonio.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Boton Siguiente a la derecha */}
      <button
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
        className={`absolute right-0 sm:-right-2 lg:-right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center justify-center transition-all duration-300 ${
          currentIndex === maxIndex
            ? "opacity-30 cursor-not-allowed bg-slate-50/50 text-slate-300"
            : "text-slate-700 hover:text-[#288EB9] hover:border-[#288EB9] hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-white"
        }`}
        aria-label="Siguientes testimonios"
      >
        <ChevronRightIcon className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* Indicadores / Dots con degradado */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-7">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === idx
                ? "w-7 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA]"
                : "w-2 bg-slate-200 hover:bg-slate-300"
            }`}
            aria-label={`Ir al grupo ${idx + 1}`}
          />
        ))}
      </div>

      {/* Frase entre líneas horizontales cortas con el estilo del subtítulo */}
      <div className="flex items-center justify-center gap-3 sm:gap-4.5 mt-6 sm:mt-8 select-none px-4">
        <div className="h-[1.5px] w-8 sm:w-12 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
        <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center">
          Más que equipos, alianzas para crecer.
        </p>
        <div className="h-[1.5px] w-8 sm:w-12 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

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
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            {...slideInLeft(0, "Una historia de libertad financiera")}
            className="text-center mb-8 sm:mb-12"
          >
            <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
              Tu camino al éxito
            </span>
            <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              <span className="block text-[#031638]">
                Una historia de
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
                className="relative pt-9 pb-3.5 px-2 sm:pt-11 sm:pb-4 sm:px-2.5 max-w-[270px] w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-between not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LightBulbIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-1 sm:mb-1.5 tracking-tight">
                    Visión
                  </h3>
                  <div className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed text-center space-y-0.5 font-montserrat not-italic">
                    <p>Transformas tu capital inicial</p>
                    <p>en un activo inteligente</p>
                    <p>que no descansa.</p>
                  </div>
                </div>
              </motion.div>

              {/* TARJETA 2: OPERACIÓN */}
              <motion.div
                {...slideInLeft(0.04)}
                className="relative pt-9 pb-3.5 px-2 sm:pt-11 sm:pb-4 sm:px-2.5 max-w-[270px] w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-between not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cog6ToothIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-1 sm:mb-1.5 tracking-tight">
                    Operación
                  </h3>
                  <div className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed text-center space-y-0.5 font-montserrat not-italic">
                    <p>Tecnología 24/7 trabajando</p>
                    <p>para ti mientras disfrutas</p>
                    <p>de lo que importa.</p>
                  </div>
                </div>
              </motion.div>

              {/* TARJETA 3: RESULTADO */}
              <motion.div
                {...slideInLeft(0.06)}
                className="relative pt-9 pb-3.5 px-2 sm:pt-11 sm:pb-4 sm:px-2.5 max-w-[270px] w-full mx-auto rounded-[2rem] bg-white/80 border border-slate-200/90 backdrop-blur-md group hover:bg-white/95 hover:border-slate-300 transition-all text-center shadow-lg shadow-slate-900/5 flex flex-col items-center justify-between not-italic"
              >
                {/* Circulo flotante sin borde blanco */}
                <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-lg shadow-[#1DB3BA]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[1.8]" />
                </div>

                {/* Contenido centrado con Montserrat */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#031638] font-montserrat not-italic mb-1 sm:mb-1.5 tracking-tight">
                    Resultado
                  </h3>
                  <div className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed text-center space-y-0.5 font-montserrat not-italic">
                    <p>Recuperas tu inversión</p>
                    <p>y escalas tu negocio</p>
                    <p>a nuevos niveles.</p>
                  </div>
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
                Diseña tu futuro
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4 sm:mb-6 text-center">
                <span className="block text-[#031638]">
                  Elige la escala de tu
                </span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                  próximo éxito
                </span>
              </h2>
              <div className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center space-y-1 mb-4 sm:mb-6">
                <p>Desde una solución hasta un modelo premium.</p>
                <p>Todo diseñado para crecer contigo.</p>
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

          {/* BARRA DE BENEFICIOS Y VALOR INCLUIDO */}
          <motion.div
            {...slideInLeft(0.06)}
            className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 rounded-2xl sm:rounded-3xl lg:rounded-full bg-white/95 border border-slate-200/90 py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-lg shadow-slate-900/5 backdrop-blur-md not-italic"
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-6 lg:flex lg:items-center lg:justify-between lg:gap-2">
              
              {/* Instalación incluida */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <Cog6ToothIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Instalación incluida
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-slate-200 rounded-full" />

              {/* Capacitación y soporte */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <UserGroupIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Capacitación y soporte
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-slate-200 rounded-full" />

              {/* Equipos de alta calidad */}
              <div className="flex items-center gap-2 sm:gap-2.5 group justify-start sm:justify-center lg:justify-center">
                <ShieldCheckIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-[#168387] shrink-0 stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-800 font-montserrat not-italic tracking-tight leading-tight group-hover:text-[#168387] transition-colors duration-300">
                  Equipos de alta calidad
                </span>
              </div>

              <div className="hidden lg:block h-6 w-[1.5px] bg-slate-200 rounded-full" />

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
            className="w-full h-full object-cover"
          />
        </div>

        {/* Difuminado superior suave desde la sección de catálogo */}
        <div 
          className="absolute -top-px inset-x-0 h-10 sm:h-16 bg-gradient-to-b from-[#fbfbfd] via-[#fbfbfd]/70 to-transparent pointer-events-none z-10" 
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          {/* TÍTULO CENTRADO ARRIBA */}
          <motion.div
            {...slideInLeft(0, "La nueva generación de purificación inteligente")}
            className="flex flex-col items-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto"
          >
            <span className="text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block font-montserrat not-italic">
              Ingeniería de Precisión
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-center font-montserrat not-italic">
              <span className="block text-[#031638]">
                La nueva generación de
              </span>
              <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                purificación inteligente
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl text-center font-montserrat not-italic">
              Cada detalle pensado para impulsar un negocio que nunca se detiene.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            
            {/* COLUMNA 1: APARTADOS EN FORMA DE COLUMNAS (IZQUIERDA) */}
            <div className="lg:col-span-6 relative z-10 lg:pr-2 xl:pr-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 md:gap-5">
                {[
                  { 
                    t: "Diseño Industrial", 
                    d: "Acero inoxidable y componentes de grado alimenticio para una durabilidad de años.",
                    icon: Droplet 
                  },
                  { 
                    t: "Cerebro Inteligente", 
                    d: "Sistema de gestión que monitorea ventas y niveles en tiempo real.",
                    icon: CpuChipIcon 
                  },
                  { 
                    t: "Interfaz de Usuario", 
                    d: "Experiencia táctil intuitiva que garantiza la recompra de tus clientes.",
                    icon: UserIcon 
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    {...slideInLeft(0.03 * (i + 1), `3D: ${item.t}`)}
                    className="flex flex-col items-start group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-[#F0FCFF] border border-[#c4eef5] text-[#168387] flex items-center justify-center group-hover:bg-[#168387] group-hover:text-white transition-all duration-300 mb-3 sm:mb-4 shadow-sm group-hover:shadow-md group-hover:scale-105">
                      <item.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#031638] group-hover:text-[#168387] text-sm sm:text-base font-montserrat not-italic transition-colors leading-tight mb-1.5">
                        {item.t}
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal font-montserrat not-italic">
                        {item.d}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* COLUMNA 2: MODELO 3D (DERECHA) */}
            <motion.div 
              {...slideInRight(0.04, "Módulo 3D Interactivo")}
              className="lg:col-span-6 relative w-full overflow-visible flex justify-center"
            >
              <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#F0FCFF] border border-[#c4eef5] p-3 sm:p-5 shadow-xl shadow-cyan-950/5 backdrop-blur-md group w-full max-w-[540px] sm:max-w-[580px]">
                
                {/* Botón para alternar especificaciones */}
                <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-5 z-20">
                  <button
                    type="button"
                    onClick={() => setShowVendingSpecs((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white/90 hover:bg-[#168387] text-slate-700 hover:text-white rounded-lg sm:rounded-xl border border-slate-200/80 hover:border-[#168387] backdrop-blur-md shadow-sm transition-all text-[10px] font-semibold uppercase tracking-widest font-montserrat not-italic cursor-pointer"
                  >
                    <span>{showVendingSpecs ? "Ocultar detalles" : "Ver detalles"}</span>
                  </button>
                </div>

                {/* Badge 360° Interactiva */}
                <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-5 z-20">
                  <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1 bg-white/90 rounded-lg sm:rounded-xl border border-slate-200/80 backdrop-blur-md shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#168387] animate-pulse" />
                    <span className="text-[10px] font-semibold text-slate-800 uppercase tracking-widest font-montserrat not-italic">360° Interactiva</span>
                  </div>
                </div>

                <div className="h-[280px] sm:h-[380px] md:h-[450px] flex items-center justify-center overflow-visible">
                  <VendingPrecise3D showCallouts={showVendingSpecs} />
                </div>

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] whitespace-nowrap font-montserrat not-italic pointer-events-none">
                  Arrastra para rotar e interactuar
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

      {/* HISTORIAS DE ÉXITO (TESTIMONIOS) */}
      <section id="testimonios" className="relative pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 overflow-hidden bg-white font-montserrat not-italic scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <motion.div
            {...slideInRight(0, "Más que clientes, historias de éxito")}
            className="flex flex-col items-center text-center mb-8 sm:mb-10 max-w-4xl mx-auto"
          >
            <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
              Resultados Reales
            </span>
            <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-center">
              <span className="block text-[#031638]">
                Más que clientes,
              </span>
              <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                historias de éxito
              </span>
            </h2>
            <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center max-w-2xl">
              Historias de emprendedores y de familias que ya confían en Darmax Agua.
            </p>
          </motion.div>

          {/* Carrusel interactivo de testimonios */}
          <TestimoniosCarousel />
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
