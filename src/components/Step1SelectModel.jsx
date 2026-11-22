import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  InformationCircleIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  SparklesIcon, 
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import PpmNoticeModal from "./PpmNoticeModal";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

// Obtiene la imagen adecuada para el modelo
function getModelImage(item) {
  if (item?.images && item.images.length > 0) {
    const secondaryImg = item.images.find((img) => img.isSecondary && img.url);
    if (secondaryImg) return optimizeCloudinaryUrl(secondaryImg.url, 700);

    const carouselImg = item.images.find((img) => img.context === "CAROUSEL" && img.url);
    if (carouselImg) return optimizeCloudinaryUrl(carouselImg.url, 700);

    const baseImg = item.images.find((img) => img.url);
    if (baseImg) return optimizeCloudinaryUrl(baseImg.url, 700);
  }

  const slug = (item?.slug || "").toLowerCase();
  const name = (item?.name || "").toLowerCase();
  if (slug.includes("touch") || name.includes("touch")) {
    return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png", 700);
  }
  if (slug.includes("atlantis") || name.includes("atlantis")) {
    return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_hbnrfy.png", 700);
  }
  if (slug.includes("neptuno") || slug.includes("purificadora")) {
    return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/neptuno_placeholder.png", 700);
  }
  return optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png", 700);
}

// Formatea el titulo del modelo aplicando degradado al modelo especifico (como en Selecciona tu vending)
function renderModelTitle(item, vendingType, isCleaning, isCardFront = true) {
  const name = item?.name || "";
  const slug = item?.slug || "";
  const raw = `${name} ${slug}`.toLowerCase();
  const vType = item?.vendingType || vendingType;

  // Caso Vending Atlantis (Agua)
  if (raw.includes("atlantis")) {
    const isMax = raw.includes("max");
    const isTouch = vType === VendingTypeEnum.TOUCH || raw.includes("touch");
    const prefix = isTouch ? "Vending Touch" : "Vending Tradicional";
    const highlight = isMax ? "Atlantis 300 Max" : "Atlantis 300";

    if (isCardFront) {
      return (
        <>
          <span className="block text-slate-900 font-semibold">{prefix}</span>
          <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-0.5 font-semibold">
            {highlight}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-semibold">{prefix} </span>
        <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent font-semibold">
          {highlight}
        </span>
      </>
    );
  }

  // Caso Vending Limpieza (Darmax Clean)
  if (isCleaning || raw.includes("clean") || raw.includes("vending5") || raw.includes("vending8")) {
    const is8 = raw.includes("8");
    const suffix = is8 ? "Vending 8 Productos" : "Vending 5 Productos";

    if (isCardFront) {
      return (
        <>
          <span className="block text-slate-900 font-semibold">
            Darmax{" "}
            <span className="bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] bg-clip-text text-transparent inline-block pb-0.5 font-semibold">
              Clean
            </span>
          </span>
          <span className="block text-slate-600 text-xs sm:text-sm font-semibold mt-0.5">
            {suffix}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-semibold">Darmax </span>
        <span className="bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] bg-clip-text text-transparent font-semibold">
          Clean
        </span>
        <span className="text-slate-700 ml-1.5 font-semibold">({suffix})</span>
      </>
    );
  }

  // Otros modelos (Purificadora mostrador, etc.)
  return <span className="font-semibold">{name}</span>;
}

// Componente de Tarjeta individual con giro 3D (Front/Back)
function ModelCard({
  item,
  isFlipped,
  onToggleFlip,
  onSelect,
  hasOsmosis,
  image,
  vendingType,
  categoryId,
  isLimpieza = false,
  ctaText = "Configurar modelo",
  priceLabel = "Inversión"
}) {
  const rawCat = (categoryId || "").toLowerCase();
  const rawText = `${item?.name || ""} ${item?.description || ""} ${item?.slug || ""}`.toLowerCase();
  const isCleaning = isLimpieza || rawCat.includes("limpieza") || rawText.includes("limpieza") || rawText.includes("vending5") || rawText.includes("vending8");
  const isWaterVending = rawCat === "vending" || rawCat.includes("agua") || rawText.includes("atlantis") || rawText.includes("vending agua");
  const isMostrador = rawCat.includes("purificadora") || rawCat.includes("mostrador") || rawText.includes("mostrador") || rawText.includes("neptuno") || rawText.includes("poseidon");
  const hasOsmosisDetected = hasOsmosis || rawText.includes("osmosis") || rawText.includes("ósmosis") || rawText.includes("max");
  const useTouchColorBadge = isWaterVending || isMostrador || hasOsmosisDetected;

  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-full h-full"
    >
      {/* FRENTE DE LA TARJETA */}
      <div
        className={`absolute inset-0 w-full h-full bg-white border border-slate-200/90 rounded-[2rem] p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden ${
          isCleaning ? "hover:border-[#53c406]" : "hover:border-[#24d4da]"
        } ${isFlipped ? "pointer-events-none" : "pointer-events-auto"}`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* Badge superior de procesos */}
        <div className="shrink-0 relative flex items-center justify-center w-full">
          {isCleaning ? (
            <span className="inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] text-white shadow-xs">
              {item?.name?.includes("8") || item?.slug?.includes("8") ? "8 Productos" : "5 Productos"}
            </span>
          ) : hasOsmosis ? (
            <span className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-xs ${
              useTouchColorBadge
                ? "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white"
                : "bg-slate-800 text-white"
            }`}>
              7 Procesos • Ósmosis Inversa
            </span>
          ) : (
            <span className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-xs ${
              useTouchColorBadge
                ? "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white"
                : "bg-slate-800 text-white"
            }`}>
              6 Procesos de Purificación
            </span>
          )}

          {item?.isNew && (
            <span className="absolute right-0 bg-cyan-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">
              Nuevo
            </span>
          )}
        </div>

        {/* Imagen del modelo y titulo centrados con espacio optimizado */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center w-full py-0.5">
          <div 
            className={`relative w-full h-40 sm:h-44 lg:h-48 flex items-center justify-center ${isCleaning ? "" : "cursor-pointer group/img"}`}
            onClick={(e) => !isCleaning && onToggleFlip(item?.slug, e)}
            title={isCleaning ? item?.name : "Haz clic para ver más detalles"}
          >
            <img 
              src={image} 
              alt={item?.name} 
              loading="eager"
              decoding="async"
              className="max-h-full w-auto object-contain drop-shadow-xl group-hover/img:scale-105 transition-transform duration-500" 
            />
          </div>

          <div className="mt-1.5 sm:mt-2 text-center w-full">
            <h3 
              className="text-base sm:text-lg lg:text-2xl font-semibold text-slate-900 tracking-tight leading-snug line-clamp-2 px-1"
              title={item?.name}
            >
              {renderModelTitle(item, vendingType, isCleaning, true)}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 line-clamp-2 px-2 leading-tight">
              {item?.description || "Tecnología de purificación avanzada de alta demanda"}
            </p>

            {/* Inversion entre lineas, inmediatamente despues del subtitulo */}
            <div className="w-full border-y border-slate-200/80 py-2 sm:py-2.5 mt-2 sm:mt-2.5 flex items-center justify-between px-1">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                {priceLabel || "Inversión"}
              </span>
              <p className="text-base sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                ${(item?.basePrice || 0).toLocaleString()}
                <span className="text-[10px] sm:text-xs ml-1 text-slate-400 font-bold uppercase">MXN</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bloque de Accion en el frente */}
        <div className="shrink-0 flex flex-col items-center w-full pt-1 sm:pt-2 gap-1.5">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full py-2.5 sm:py-3.5 px-5 rounded-full hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 group/btn cursor-pointer ${
              isCleaning
                ? "bg-gradient-to-r from-[#133909] via-[#53c406] to-[#90e119] shadow-md shadow-[#133909]/30 hover:shadow-lg hover:shadow-[#90e119]/35"
                : "bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] shadow-md shadow-[#022447]/20 hover:shadow-lg hover:shadow-[#01949f]/30"
            }`}
          >
            <span>{ctaText}</span>
            <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          {!isCleaning && (
            <button
              type="button"
              onClick={(e) => onToggleFlip(item?.slug, e)}
              className="inline-flex items-center justify-center gap-1.5 py-1 text-slate-500 hover:text-[#168387] text-xs font-medium transition-colors cursor-pointer group/details"
              title="Haz clic para ver más detalles y ficha técnica"
            >
              <ExclamationCircleIcon className="w-4 h-4 text-slate-400 group-hover:text-[#168387] transition-colors shrink-0" />
              <span className="underline underline-offset-4 decoration-slate-300 group-hover:decoration-[#168387] transition-colors">
                Ver más detalles
              </span>
            </button>
          )}
        </div>
      </div>

      {/* REVERSO DE LA TARJETA */}
      <div
        className={`absolute inset-0 w-full h-full bg-white border border-slate-200/90 rounded-[2rem] p-3.5 sm:p-5 lg:p-6 shadow-2xl flex flex-col justify-between overflow-hidden ${
          isFlipped ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        {/* Barra superior de la ficha tecnica */}
        <div className="shrink-0 w-full pb-2 border-b border-slate-100 text-left">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[10px] font-black uppercase tracking-widest block ${isCleaning ? "text-[#53c406]" : "text-[#168387]"}`}>
              {isCleaning ? "Ficha de Vending Clean" : "Ficha de Purificación"}
            </span>
            <span className={`w-3.5 h-0.5 rounded-full shrink-0 ${isCleaning ? "bg-[#53c406]" : "bg-[#168387]"}`} />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight truncate" title={item?.name}>
            {renderModelTitle(item, vendingType, isCleaning, false)}
          </h3>
        </div>

        {/* Informacion de procesos de purificacion */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-2 space-y-2.5 text-left">
          {hasOsmosis ? (
            <div className="p-3 sm:p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-[#168387]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#168387]">
                  7º Proceso • Ósmosis Inversa
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                Este modelo cuenta con <strong className="text-[#168387] font-bold">ósmosis inversa</strong> como séptimo proceso de purificación el cual se encarga de brindar un agua Premium compitiendo en calidad con marcas de prestigio mediante una membrana que quita metales pesados y exceso de sales.
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  6 Procesos de Purificación
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                Consta de <strong className="text-slate-900 font-bold">6 procesos de purificación</strong> los cuales pueden ser suficientes para un agua de calidad dependiendo el estado de la república.
              </p>
            </div>
          )}

          {/* Resumen de inversion */}
          <div className="py-1.5 sm:py-2 px-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Inversión del equipo</span>
            <span className="font-black text-slate-900 text-sm">
              ${(item?.basePrice || 0).toLocaleString()} MXN
            </span>
          </div>
        </div>

        {/* Botones inferiores del reverso: garantizados con shrink-0 */}
        <div className="shrink-0 pt-2 w-full space-y-1.5 sm:space-y-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full py-2.5 sm:py-3.5 px-5 rounded-full hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
              isCleaning
                ? "bg-gradient-to-r from-[#133909] via-[#53c406] to-[#90e119] shadow-md shadow-[#133909]/30 hover:shadow-lg hover:shadow-[#90e119]/35"
                : "bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] shadow-md shadow-[#022447]/20 hover:shadow-lg hover:shadow-[#01949f]/30"
            }`}
          >
            <span>{ctaText}</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => onToggleFlip(item?.slug, e)}
            className="w-full py-1.5 sm:py-2 px-4 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 text-xs font-bold border border-slate-200/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Volver a foto del modelo</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Acordeon informativo de dureza en PPM para Vending
function PpmAccordion({ isVending, isPpmOpen, setIsPpmOpen }) {
  if (!isVending) return null;
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0">
      <button
        type="button"
        onClick={() => setIsPpmOpen((prev) => !prev)}
        className={`w-full p-3 sm:p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl shadow-xs text-left cursor-pointer transition-colors duration-200 ${
          isPpmOpen
            ? "ring-2 ring-amber-400/40 bg-amber-50 shadow-md border-amber-300"
            : "hover:border-amber-300 hover:bg-amber-100/50"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-black text-amber-800 uppercase tracking-wider text-[10px] bg-amber-500/15 px-2 py-0.5 rounded-md shrink-0">
                Importante
              </span>
              <span className="text-xs font-semibold text-slate-700 truncate">
                Consulta la dureza en ppm de tu estado
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 shrink-0">
            <span className="hidden sm:inline">{isPpmOpen ? "Ocultar" : "Ver detalle"}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-200 ${
                isPpmOpen ? "rotate-180 text-amber-700" : "text-amber-600"
              }`}
            />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isPpmOpen && (
            <motion.div
              key="ppm-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-2.5 mt-2.5 border-t border-amber-200/70 text-left">
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Consulta la dureza en <strong className="text-slate-900 font-semibold">ppm (partes por millón)</strong> de tu estado para identificar tu modelo ideal. Si el agua supera los <strong className="text-slate-900 font-semibold">500 ppm</strong> la <strong className="text-amber-800 font-bold">COFEPRIS solicita tener ósmosis inversa</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

// Banner educativo de osmosis inversa con enlace al blog
function OsmosisBanner({ hasOsmosisInCatalog }) {
  if (!hasOsmosisInCatalog) return null;
  return (
    <Link
      to="/blog/osmosis-inversa-vs-agua-alcalina"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-cyan-50/50 to-white border border-[#168387]/25 hover:border-[#168387] hover:shadow-md transition-all duration-300 cursor-pointer max-w-md mx-auto lg:mx-0 text-left"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#168387] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
          <SparklesIcon className="w-4 h-4" />
        </div>
        <div className="text-left min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#168387] transition-colors">
              ¿Quieres conocer más sobre ósmosis inversa?
            </p>
            <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#168387] text-white shadow-xs">
              <span className="hidden sm:inline">Da clic aquí</span>
              <span className="sm:hidden">Pulsa aquí</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
            Descubre por qué es el estándar de oro según la normativa
          </span>
        </div>
      </div>
      <div className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-[#168387] shrink-0 transition-all">
        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
      </div>
    </Link>
  );
}

export default function Step1SelectModel({ 
  modelos, 
  vendingType, 
  categoryId, 
  onSelect, 
  onNext,
  catalogHasOsmosis,
  titleOverride,
  subtitleOverride,
  descriptionOverride,
  ctaTextOverride,
  priceLabelOverride,
  hidePpmNotice = false,
  hideOsmosisBanner = false,
}) {
  const [flippedCards, setFlippedCards] = useState({});
  const [showPpmModal, setShowPpmModal] = useState(false);
  const [isPpmOpen, setIsPpmOpen] = useState(false);

  // Ordenar para garantizar que el modelo base aparezca primero y el Max despues
  const sortedModelos = useMemo(() => {
    if (!Array.isArray(modelos) || modelos.length === 0) return [];
    return [...modelos].sort((a, b) => {
      const isMaxA = (a?.slug || "").toLowerCase().includes("max") || (a?.name || "").toLowerCase().includes("max");
      const isMaxB = (b?.slug || "").toLowerCase().includes("max") || (b?.name || "").toLowerCase().includes("max");
      if (!isMaxA && isMaxB) return -1;
      if (isMaxA && !isMaxB) return 1;
      return (a?.basePrice || 0) - (b?.basePrice || 0);
    });
  }, [modelos]);

  // Estado para el carrusel horizontal en vista movil
  const mobileCarouselRef = useRef(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const rawCat = (categoryId || "").toLowerCase();
  const isCleaningCategory = rawCat.includes("limpieza") || rawCat.includes("clean");
  const isVending = (categoryId === "Vending" || vendingType === VendingTypeEnum.TOUCH || vendingType === VendingTypeEnum.TRADICIONAL) && !isCleaningCategory;

  useEffect(() => {
    if (isVending) {
      try {
        const seen = localStorage.getItem("darmax_ppm_modal_seen");
        if (!seen) {
          setShowPpmModal(true);
        }
      } catch (e) {
        console.error("Error al leer localStorage:", e);
      }
    }
  }, [isVending]);

  const handleClosePpmModal = () => {
    try {
      localStorage.setItem("darmax_ppm_modal_seen", "true");
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
    setShowPpmModal(false);
  };

  const toggleFlip = useCallback((slug, e) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }, []);

  const handleClick = (modelo) => {
    onSelect(modelo);
    onNext();
  };

  // Manejador de scroll para sincronizar indicador en movil
  const handleMobileScroll = useCallback(() => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const cardNodes = container.querySelectorAll(".model-card-item");
    let closestIdx = 0;
    let minDiff = Infinity;
    cardNodes.forEach((node, idx) => {
      const cardCenter = node.offsetLeft + node.offsetWidth / 2;
      const diff = Math.abs(center - cardCenter);
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
    const cardNodes = container.querySelectorAll(".model-card-item");
    if (cardNodes[index]) {
      const card = cardNodes[index];
      const targetScroll = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
      setActiveMobileIndex(index);
    }
  }, []);

  const hasOsmosisInCatalog = catalogHasOsmosis || (Array.isArray(modelos) ? modelos : []).some((m) => {
    const raw = `${m?.name || ""} ${m?.description || ""} ${m?.slug || ""}`.toLowerCase();
    return raw.includes("osmosis");
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div id="step1-model-container" className="flex items-start min-h-0 sm:min-h-[calc(100vh-350px)] w-full pt-1 sm:pt-4 pb-2 sm:pb-6 lg:pb-4 font-montserrat not-italic">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 xl:gap-16 px-4 sm:px-8">
        
        {/* COLUMNA IZQUIERDA: Titulo, aviso de PPM y banner de osmosis */}
        <div className="w-full lg:w-[38%] xl:w-[35%] text-center lg:text-left space-y-3 lg:sticky lg:top-40">
          <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-2">
            <span className={`font-montserrat not-italic font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase ${
              isCleaningCategory ? "text-[#53c406]" : "text-[#168387]"
            }`}>
              {subtitleOverride || (isCleaningCategory ? "Limpieza 24/7" : "Configuración Inicial")}
            </span>
            <span className={`w-8 sm:w-10 h-0.5 rounded-full shrink-0 ${
              isCleaningCategory ? "bg-[#53c406]" : "bg-[#168387]"
            }`} />
          </div>
          <h2 className="font-montserrat not-italic text-3xl sm:text-4xl lg:text-[45px] xl:text-[52px] 2xl:text-[57px] font-bold tracking-tight leading-tight text-[#031638]">
            {titleOverride ? (
              titleOverride
            ) : isCleaningCategory ? (
              <>
                <span className="block sm:whitespace-nowrap">Elige tu modelo</span>
                <span className="block pt-1 pb-1.5 leading-tight">
                  <span className="text-[#031638]">de Darmax </span>
                  <span className="bg-gradient-to-r from-[#53c406] via-[#5bc809] to-[#90e119] bg-clip-text text-transparent inline-block">
                    Clean
                  </span>
                </span>
              </>
            ) : (vendingType === VendingTypeEnum.TOUCH || vendingType === VendingTypeEnum.TRADICIONAL) ? (
              <>
                <span className="block sm:whitespace-nowrap">Elige tu</span>
                <span className="block pt-1 pb-1.5 leading-tight">
                  <span className="text-[#031638]">modelo </span>
                  <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                    {vendingType === VendingTypeEnum.TOUCH ? "Touch" : "Tradicional"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="block sm:whitespace-nowrap">Elige tu modelo</span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent block pt-1 pb-1.5 leading-tight">
                  {categoryId || "Purificadora"}
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
            {descriptionOverride || (
              isCleaningCategory
                ? "Automatiza la venta de productos de limpieza a granel con nuestra tecnología Vending Clean."
                : "Selecciona la base tecnológica que impulsará tu negocio. Cada modelo está diseñado para máxima eficiencia."
            )}
          </p>

          {/* MODAL EMERGENTE DE PRIMERA VISITA SOBRE DUREZA EN PPM */}
          {isVending && !hidePpmNotice && (
            <PpmNoticeModal
              isOpen={showPpmModal}
              onClose={handleClosePpmModal}
            />
          )}

          {/* EN ESCRITORIO / TABLET: Mostrar en la columna lateral */}
          <div className="hidden sm:block space-y-3 pt-1">
            {!hidePpmNotice && isVending && (
              <PpmAccordion
                isVending={isVending}
                isPpmOpen={isPpmOpen}
                setIsPpmOpen={setIsPpmOpen}
              />
            )}
            {!hideOsmosisBanner && hasOsmosisInCatalog && (
              <OsmosisBanner
                hasOsmosisInCatalog={hasOsmosisInCatalog}
              />
            )}
          </div>

          {/* Indicador de progreso visual sutil (Paso 2 activo) */}
          <div className="hidden lg:flex items-center gap-4 pt-4">
            <div className="h-1 w-10 bg-slate-200 rounded-full" />
            <div className={`h-1 w-20 rounded-full ${isCleaningCategory ? "bg-gradient-to-r from-[#53c406] to-[#90e119]" : "bg-[#168387]"}`} />
            <div className="h-1 w-10 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* COLUMNA DERECHA: VISTA MOVIL CON CARRUSEL + VISTA ESCRITORIO CON GRID */}
        <div className="w-full lg:w-[62%] xl:w-[65%]">

          {/* VISTA MOVIL (Carrusel táctil con snap e indicador) */}
          <div className="block sm:hidden w-full">
            {/* Cabecera del carrusel en móvil */}
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Modelos disponibles
                </span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isCleaningCategory
                    ? "text-[#53c406] bg-lime-50 border border-lime-200/80"
                    : "text-[#168387] bg-cyan-50 border border-cyan-200/80"
                }`}>
                  {modelos.length} opciones
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                <span className={isCleaningCategory ? "text-[#53c406] font-black" : "text-[#168387] font-black"}>{activeMobileIndex + 1}</span>
                <span className="text-slate-300">/</span>
                <span>{modelos.length}</span>
              </div>
            </div>

            {/* Carrusel horizontal con snap */}
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pt-1 pb-4 -mx-4 px-4 items-center"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
            >
              {sortedModelos.map((item, idx) => {
                const rawText = `${item?.name || ""} ${item?.description || ""} ${item?.slug || ""}`.toLowerCase();
                const isLimpieza = categoryId === "Vending-Limpieza" || rawText.includes("limpieza") || rawText.includes("vending5") || rawText.includes("vending8");
                const hasOsmosis = !isLimpieza && rawText.includes("osmosis");
                const image = getModelImage(item);
                const isFlipped = Boolean(flippedCards[item.slug]);
                const isActive = activeMobileIndex === idx;

                return (
                  <div
                    key={item.slug}
                    className={`model-card-item snap-center shrink-0 w-[85vw] max-w-[330px] h-[465px] transition-all duration-300 ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.97] opacity-85"
                    }`}
                    style={{ perspective: 1200 }}
                  >
                    <ModelCard
                      item={item}
                      isFlipped={isFlipped}
                      onToggleFlip={toggleFlip}
                      onSelect={handleClick}
                      hasOsmosis={hasOsmosis}
                      image={image}
                      vendingType={vendingType}
                      categoryId={categoryId}
                      isLimpieza={isLimpieza}
                      ctaText={ctaTextOverride}
                      priceLabel={priceLabelOverride}
                    />
                  </div>
                );
              })}
            </div>

            {/* Indicadores de bolitas inferiores */}
            <div className="flex flex-col items-center justify-center gap-1.5 mt-2">
              <div className="flex items-center gap-2">
                {sortedModelos.map((item, idx) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    aria-label={`Ver modelo ${item.name}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeMobileIndex === idx
                        ? isCleaningCategory
                          ? "w-7 h-2 bg-gradient-to-r from-[#133909] via-[#53c406] to-[#90e119] shadow-xs shadow-[#53c406]/30"
                          : "w-7 h-2 bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] shadow-xs shadow-[#01949f]/30"
                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                Desliza para ver la siguiente opción
              </span>
            </div>

            {/* EN MOVIL: Acordeon de importante y banner de osmosis ubicados debajo de las tarjetas */}
            <div className="mt-6 space-y-3 w-full">
              <PpmAccordion
                isVending={isVending}
                isPpmOpen={isPpmOpen}
                setIsPpmOpen={setIsPpmOpen}
              />
              <OsmosisBanner
                hasOsmosisInCatalog={hasOsmosisInCatalog}
              />
            </div>
          </div>

          {/* VISTA ESCRITORIO / TABLET (Grid de 2 columnas consistente con Paso 0) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden sm:grid grid-cols-2 gap-5 sm:gap-8 w-full"
          >
            {sortedModelos.map((item) => {
              const rawText = `${item?.name || ""} ${item?.description || ""} ${item?.slug || ""}`.toLowerCase();
              const isLimpieza = categoryId === "Vending-Limpieza" || rawText.includes("limpieza") || rawText.includes("vending5") || rawText.includes("vending8");
              const hasOsmosis = !isLimpieza && rawText.includes("osmosis");
              const image = getModelImage(item);
              const isFlipped = Boolean(flippedCards[item.slug]);

              return (
                <motion.div
                  key={item.slug}
                  variants={itemVariants}
                  className="relative w-full h-[550px] sm:h-[575px] lg:h-[590px]"
                  style={{ perspective: 1200 }}
                >
                  <ModelCard
                    item={item}
                    isFlipped={isFlipped}
                    onToggleFlip={toggleFlip}
                    onSelect={handleClick}
                    hasOsmosis={hasOsmosis}
                    image={image}
                    vendingType={vendingType}
                    categoryId={categoryId}
                    isLimpieza={isLimpieza}
                    ctaText={ctaTextOverride}
                    priceLabel={priceLabelOverride}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
