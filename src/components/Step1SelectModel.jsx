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
    const prefix = isTouch ? "Vending touch" : "Vending tradicional";
    const highlight = isMax ? "Atlantis 300 Max" : "Atlantis 300";

    if (isCardFront) {
      return (
        <>
          <span className="block text-slate-900 font-bold text-xl sm:text-2xl">{prefix}</span>
          <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent font-bold text-xl sm:text-2xl inline-block pb-0.5">
            {highlight}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-bold text-slate-900">{prefix} </span>
        <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent font-bold">
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
          <span className="block text-slate-900 font-bold text-xl sm:text-2xl">
            Darmax Clean
          </span>
          <span className="bg-gradient-to-r from-[#2f8507] via-[#53c406] to-[#7cd413] bg-clip-text text-transparent font-bold text-xl sm:text-2xl inline-block pb-0.5">
            {suffix}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-bold text-slate-900">Darmax Clean </span>
        <span className="bg-gradient-to-r from-[#2f8507] via-[#53c406] to-[#7cd413] bg-clip-text text-transparent font-bold">
          {suffix}
        </span>
      </>
    );
  }

  // Caso Purificadora de Mostrador
  if (
    raw.includes("mostrador") ||
    raw.includes("neptuno") ||
    raw.includes("poseidon") ||
    raw.includes("purificadora")
  ) {
    const isOsmosis =
      raw.includes("osmosis") ||
      raw.includes("ósmosis") ||
      raw.includes("aplus") ||
      raw.includes("oi");
    const highlight = isOsmosis ? "Ósmosis inversa" : "Tradicional";

    if (isCardFront) {
      return (
        <>
          <span className="block text-slate-900 font-bold text-xl sm:text-2xl">
            Mostrador
          </span>
          <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent font-bold text-xl sm:text-2xl inline-block pb-0.5">
            {highlight}
          </span>
        </>
      );
    }
    return (
      <>
        <span className="font-bold text-slate-900">Mostrador </span>
        <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent font-bold">
          {highlight}
        </span>
      </>
    );
  }

  // Otros modelos
  return <span className="font-bold text-slate-900">{name}</span>;
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
  const hasOsmosisDetected =
    hasOsmosis ||
    rawText.includes("osmosis") ||
    rawText.includes("ósmosis") ||
    rawText.includes("max") ||
    rawText.includes("aplus");


  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-full h-full"
    >
      {/* FRENTE DE LA TARJETA */}
      <div
        className={`absolute inset-0 w-full h-full bg-white border border-slate-200/80 rounded-[2rem] p-4 sm:p-5 lg:p-6 shadow-sm hover:border-[#199ea5]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
          isFlipped ? "pointer-events-none" : "pointer-events-auto"
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* Badge superior de procesos */}
        <div className="shrink-0 relative flex items-center justify-center w-full mb-2 sm:mb-2.5">
          {isCleaning ? (
            <span
              className="inline-flex items-center justify-center px-4 sm:px-4.5 py-1 sm:py-1.5 rounded-full text-xs font-bold text-white shadow-xs"
              style={{ background: "linear-gradient(180deg, #63d110 0%, #53c406 50%, #3da104 100%)" }}
            >
              {item?.name?.includes("8") || item?.slug?.includes("8") ? "8 Productos" : "5 Productos"}
            </span>
          ) : hasOsmosisDetected ? (
            <span 
              className="inline-flex items-center justify-center px-4 sm:px-4.5 py-1 sm:py-1.5 rounded-full text-xs font-bold shadow-xs"
              style={{ background: "linear-gradient(180deg, #1eb2bb 0%, #1eb2bb 45%, #2398bb 100%)" }}
            >
              <span className="text-[#fef0a6] font-extrabold">
                7 procesos
              </span>
              <span className="text-white font-bold">
                {" "}• Ósmosis inversa
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center justify-center px-4 sm:px-4.5 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-[#0e7490] text-white shadow-xs">
              6 procesos de purificación
            </span>
          )}

          {item?.isNew && (
            <span className="absolute right-0 bg-[#007481] text-white text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest shrink-0">
              Nuevo
            </span>
          )}
        </div>

        {/* Imagen principal del modelo */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center w-full py-1">
          <div 
            className={`relative w-full h-40 sm:h-44 lg:h-48 flex items-center justify-center group/img ${isCleaning ? "" : "cursor-pointer"}`}
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
              className="tracking-tight leading-snug line-clamp-2 px-1"
              title={item?.name}
            >
              {renderModelTitle(item, vendingType, isCleaning, true)}
            </h3>
            <p className="text-xs text-slate-700 font-medium mt-1 px-2 leading-relaxed min-h-[2.25rem] sm:min-h-[2.5rem] flex flex-col justify-center whitespace-pre-line">
              {item?.description || "Agua premium con ósmosis inversa con pantalla táctil"}
            </p>

            {/* Inversión alineada */}
            <div className="w-full border-y border-slate-100 py-2 sm:py-2.5 mt-2 sm:mt-2.5 flex items-center justify-between px-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                {priceLabel || "INVERSIÓN"}
              </span>
              <p className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 tracking-tight">
                ${(item?.basePrice || 0).toLocaleString()}
                <span className="text-[10px] sm:text-xs ml-1 text-slate-500 font-bold uppercase">MXN</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bloque de Acción en el frente */}
        <div className="shrink-0 flex flex-col items-center w-full pt-1 sm:pt-2 gap-2">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={`w-full py-3 sm:py-3.5 px-5 rounded-full hover:brightness-110 active:scale-98 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer ${
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
              className="inline-flex items-center justify-center gap-1.5 py-0.5 text-slate-500 hover:text-[#007481] text-xs font-medium transition-colors cursor-pointer group/details"
              title="Haz clic para ver más detalles y ficha técnica"
            >
              <InformationCircleIcon className="w-4 h-4 text-[#007481] transition-colors shrink-0" />
              <span className="transition-colors">
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
      <div
        className={`w-full p-4 bg-[#fffdf5] border border-amber-200/90 rounded-2xl shadow-xs text-left transition-all duration-200 ${
          isPpmOpen
            ? "ring-1 ring-amber-300"
            : "hover:border-amber-300"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsPpmOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-3 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <InformationCircleIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-extrabold text-amber-800 uppercase tracking-wider text-[10px] bg-amber-100/80 px-2 py-0.5 rounded-md shrink-0">
                IMPORTANTE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-900 shrink-0">
            <span>{isPpmOpen ? "Ocultar" : "Ver detalle"}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-200 ${
                isPpmOpen ? "rotate-180 text-amber-700" : "text-amber-600"
              }`}
            />
          </div>
        </button>

        <div className="mt-2 text-left">
          <p className="text-xs sm:text-[13px] font-bold text-slate-800">
            Consulta la dureza en ppm de tu estado
          </p>
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
              <div className="pt-2 mt-2 border-t border-amber-200/60 text-left">
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Consulta la dureza en ppm (partes por millón) de tu estado para identificar tu modelo ideal. Si el agua supera los <strong className="text-slate-900 font-semibold">500 ppm</strong> la <strong className="text-amber-900 font-bold">COFEPRIS solicita tener ósmosis inversa</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
      className="group block p-4 rounded-2xl bg-[#eefbfb] border border-cyan-200/70 hover:border-[#007481] hover:shadow-md transition-all duration-300 cursor-pointer max-w-md mx-auto lg:mx-0 text-left"
    >
      <div className="flex items-start gap-2.5">
        <InformationCircleIcon className="w-5 h-5 text-[#007481] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#007481] transition-colors">
            ¿Quieres conocer más sobre ósmosis inversa?
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007481] hover:bg-[#00606b] text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
              DA CLICK AQUÍ
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </span>
            <div className="p-1 rounded-lg text-slate-400 group-hover:text-[#007481] transition-colors">
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-normal mt-2 leading-tight">
            Descubre por qué es el estándar de oro según la normativa.
          </p>
        </div>
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

  // Ordenar para garantizar que el modelo Max (Atlantis 300 Max) aparezca primero (a la izquierda) en vending de agua
  const sortedModelos = useMemo(() => {
    if (!Array.isArray(modelos) || modelos.length === 0) return [];
    return [...modelos].sort((a, b) => {
      const isMaxA = (a?.slug || "").toLowerCase().includes("max") || (a?.name || "").toLowerCase().includes("max");
      const isMaxB = (b?.slug || "").toLowerCase().includes("max") || (b?.name || "").toLowerCase().includes("max");
      if (isMaxA && !isMaxB) return -1;
      if (!isMaxA && isMaxB) return 1;
      return (b?.basePrice || 0) - (a?.basePrice || 0);
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
        <div className="w-full lg:w-[38%] xl:w-[35%] text-center lg:text-left space-y-3.5 lg:sticky lg:top-40">
          <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-1.5">
            <span className={`font-montserrat not-italic font-bold tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-[13px] uppercase ${
              isCleaningCategory ? "text-[#53c406]" : "text-[#007481]"
            }`}>
              {subtitleOverride || (isCleaningCategory ? "Limpieza 24/7" : "Configuración Inicial")}
            </span>
            <span className={`w-8 sm:w-10 h-0.5 rounded-full shrink-0 ${
              isCleaningCategory ? "bg-[#53c406]" : "bg-[#007481]"
            }`} />
          </div>
          <h2 className="font-montserrat not-italic text-3xl sm:text-4xl lg:text-[45px] xl:text-[52px] font-extrabold tracking-tight leading-tight text-slate-900">
            {titleOverride ? (
              titleOverride
            ) : isCleaningCategory ? (
              <>
                <span className="block">Elige tu modelo</span>
                <span className="block mt-0.5">
                  <span className="text-slate-900">de Darmax </span>
                  <span className="bg-gradient-to-r from-[#2f8507] via-[#53c406] to-[#7cd413] bg-clip-text text-transparent inline-block">
                    Clean
                  </span>
                </span>
              </>
            ) : (vendingType === VendingTypeEnum.TOUCH || vendingType === VendingTypeEnum.TRADICIONAL) ? (
              <>
                <span className="block">Elige tu</span>
                <span className="block mt-0.5">
                  <span className="text-slate-900">modelo </span>
                  <span className="text-[#199ea5] lowercase inline-block">
                    {vendingType === VendingTypeEnum.TOUCH ? "touch" : "tradicional"}
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="block">Elige tu modelo</span>
                <span className="text-[#199ea5] block mt-0.5">
                  {categoryId || "Purificadora"}
                </span>
              </>
            )}
          </h2>
          <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
            {descriptionOverride || (
              isCleaningCategory
                ? "Automatiza la venta de productos de limpieza a granel con nuestra tecnología Vending Clean."
                : "Selecciona la base tecnológica que impulsará tu negocio. Cada modelo está diseñado para máxima eficiencia y rentabilidad."
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
          <div className="hidden lg:flex items-center gap-2 pt-4">
            <div className="h-1.5 w-6 bg-slate-200 rounded-full" />
            <div className={`h-1.5 w-14 rounded-full ${isCleaningCategory ? "bg-[#53c406]" : "bg-[#007481]"}`} />
            <div className="h-1.5 w-6 bg-slate-200 rounded-full" />
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
