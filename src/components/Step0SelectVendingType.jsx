import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  InformationCircleIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

const VENDING_DETAILS = {
  [VendingTypeEnum.TOUCH]: {
    name: "Touch",
    subtitle: "(Pantalla 8 pulgadas)",
    recommendationTitle: "Ideal Para:",
    recommendation:
      "Emprendedores que buscan un negocio más innovador, vistoso y único en el mercado.\n\nCalidad que hace la diferencia desde su fabricación a láser con animaciones en pantalla TOUCH e indicaciones por voz, donde paso a paso guiamos al cliente para realizar un llenado adecuado.\n\nResalta toda la noche con el logo iluminado en acrílico y luz LED en la puerta de llenado con forma de garrafón.\n\nEl diferenciador que estabas buscando con beneficios exclusivos como:",
    features: [
      "Gabinete en acero inoxidable calidad 304 (Grado alimenticio)",
      "Pantalla inicial touch de 8” con animaciones (antirrobo)",
      "Auto diagnóstico de fallas y registro de ventas sin Wi-fi",
      "Contador de garrafones",
      "Puerta en forma de garrafón en acero inoxidable con luz LED",
      "Dispensador de tapas con luz LED",
      "Logotipo 3D en acrílico y luz LED",
      "Monedero antirrobo",
      "Da cambio",
      "Llenado de 1, 4, 10 y 20 lts. (opciónal 4 modos de llenado adicionales para agua alcalina con costo extra).",
      "Vinil contra luz UV en DTF",
    ],
  },
  [VendingTypeEnum.TRADICIONAL]: {
    name: "Tradicional",
    subtitle: "(con botones)",
    recommendationTitle: "Ideal Para:",
    recommendation:
      "Emprendedores que buscan iniciar con pasos seguros o en lugares con altos indices de vandalismo.\n\nSe mantiene la calidad del modelo de alta gama TOUCH, sin embargo, la configuración de la vending y la selección del tipo de agua es de forma tradicional (con botones en acero inoxidable y luz LED).\n\nLa pantalla LED de 5” antirrobo conserva las animaciones a color e indicaciones por voz donde paso a paso guiamos al cliente para realizar un llenado adecuado.\n\nConoce los beneficios exclusivos como:",
    features: [
      "Gabinete en acero inoxidable calidad 304 (Grado alimenticio)",
      "Botones en acero inoxidable con luz LED",
      "Pantalla LED de 5” a color antirrobo",
      "Contador de ventas y contador de garrafones sin necesidad de Wi-fi",
      "Puerta en forma de garrafón en acero inoxidable con luz LED",
      "Bocina con indicaciones de llenado",
      "Dispensador de tapas con luz LED",
      "Logotipo 3D en acrílico y luz LED",
      "Monedero antirrobo",
      "Da cambio",
      "Llenado de 1, 4, 10 y 20 lts. (opcional 4 modos de llenado adicionales para agua alcalina con costo extra).",
      "Vinil contra luz UV",
    ],
  },
};

function VendingTypeCard({
  type,
  isFlipped,
  onToggleFlip,
  onSelect,
  getVendingTypeImage,
  displayNames,
  details
}) {
  return (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-full h-full"
    >
      {/* FRENTE DE LA TARJETA */}
      <div
        className={`absolute inset-0 w-full h-full bg-white border border-slate-200/90 rounded-[2rem] p-5 sm:p-6 shadow-sm hover:border-[#24d4da] hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden ${
          isFlipped ? "pointer-events-none" : "pointer-events-auto"
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {/* Imagen y Titulo centrados verticalmente en el cuerpo de la tarjeta */}
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full min-h-0 py-1 sm:py-2">
          <div 
            className="relative w-full h-[235px] sm:h-60 flex items-center justify-center cursor-pointer group/img"
            onClick={(e) => onToggleFlip(type, e)}
            title="Haz clic para ver especificaciones"
          >
            <img 
              src={getVendingTypeImage(type)} 
              alt={displayNames[type]} 
              loading="eager"
              decoding="async"
              className="max-h-full w-auto object-contain drop-shadow-xl group-hover/img:scale-105 transition-transform duration-500 scale-[1.04] sm:scale-100" 
            />
          </div>

          <div className="mt-2.5 sm:mt-4">
            <h3 className="text-2xl sm:text-[26px] lg:text-3xl font-semibold text-slate-900 tracking-tight">
              {displayNames[type]}
            </h3>
            <p className="text-sm sm:text-xs text-slate-500 font-semibold mt-0.5">
              {details.subtitle ? details.subtitle.replace(/[()]/g, "").trim() : ""}
            </p>
          </div>
        </div>

        {/* Botones de accion */}
        <div className="space-y-2 w-full pt-3 shrink-0">
          <button
            type="button"
            onClick={(e) => onToggleFlip(type, e)}
            className="w-full py-2.5 px-4 rounded-full bg-slate-50 hover:bg-cyan-50/70 hover:text-[#168387] text-slate-700 text-xs font-bold border border-slate-200/80 hover:border-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-[#168387]" />
            <span>Ver especificaciones completas</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(type)}
            className="w-full py-3 sm:py-3.5 px-5 rounded-full bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#022447]/20 hover:shadow-lg hover:shadow-[#01949f]/30 active:scale-98 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <span>Configurar vending</span>
            <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* REVERSO DE LA TARJETA */}
      <div
        className={`absolute inset-0 w-full h-full bg-white border border-slate-200/90 rounded-[2rem] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden ${
          isFlipped ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        {/* Barra superior de la ficha tecnica */}
        <div className="flex items-center justify-between w-full pb-2 border-b border-slate-100 gap-2 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#168387] block">
                Ficha Técnica
              </span>
              <span className="w-3.5 h-0.5 rounded-full shrink-0 bg-[#168387]" />
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight whitespace-nowrap truncate">
              Modelo {displayNames[type]}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-tight mt-0.5">
              {details.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => onToggleFlip(type, e)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Ver foto del modelo"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>Ver foto</span>
          </button>
        </div>

        {/* Contenido scrolleable: Resumen de uso / Perfil recomendado + lista de especificaciones */}
        <div className="flex-1 overflow-y-auto pr-1.5 sm:pr-2 my-2 space-y-2.5 text-left min-h-0 scrollbar-vending-ficha">
          {/* Resumen de uso / Perfil recomendado */}
          <div className={`p-2.5 sm:p-3 rounded-xl border text-left ${
            type === VendingTypeEnum.TOUCH
              ? "bg-cyan-50/70 border-cyan-200/70"
              : "bg-amber-50/80 border-amber-200/80"
          }`}>
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-1 ${
              type === VendingTypeEnum.TOUCH ? "text-[#168387]" : "text-amber-800"
            }`}>
              {details.recommendationTitle}
            </span>
            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
              {details.recommendation}
            </p>
          </div>

          {/* Lista de especificaciones tecnicas */}
          <div className="space-y-1.5 pt-0.5">
            {details.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-700 leading-snug">
                <CheckCircleIcon className="w-4 h-4 text-[#168387] shrink-0 mt-0.5" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boton de configurar vending: siempre visible en la parte inferior */}
        <div className="pt-2 w-full shrink-0">
          <button
            type="button"
            onClick={() => onSelect(type)}
            className="w-full py-3 sm:py-3.5 px-5 rounded-full bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#022447]/20 hover:shadow-lg hover:shadow-[#01949f]/30 active:scale-98 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <span>Configurar vending</span>
            <ChevronRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Step0SelectVendingType({ onSelect, availableVendingTypes, getVendingTypeImage }) {
  const [flippedCards, setFlippedCards] = useState({});
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileCarouselRef = useRef(null);

  const displayNames = {
    [VendingTypeEnum.TOUCH]: "Touch",
    [VendingTypeEnum.TRADICIONAL]: "Tradicional",
  };

  const toggleFlip = (type, e) => {
    if (e) e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleMobileScroll = useCallback(() => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const cardNodes = container.querySelectorAll(".vending-card-item");
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
    const cardNodes = container.querySelectorAll(".vending-card-item");
    if (cardNodes[index]) {
      const card = cardNodes[index];
      const targetScroll = card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
      setActiveMobileIndex(index);
    }
  }, []);

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
    <div id="step0-vending-container" className="flex items-start min-h-0 sm:min-h-[calc(100vh-350px)] w-full pt-1 sm:pt-4 pb-2 sm:pb-6 lg:pb-4 font-montserrat not-italic">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 xl:gap-16 px-4 sm:px-8">
        
        {/* Titulo a la Izquierda */}
        <div className="w-full lg:w-[38%] xl:w-[35%] text-center lg:text-left space-y-3 lg:sticky lg:top-40">
          <h2 className="font-montserrat not-italic text-3xl sm:text-4xl lg:text-[45px] xl:text-[52px] 2xl:text-[57px] font-bold tracking-tight leading-tight text-[#031638]">
            <span className="block sm:whitespace-nowrap">Selecciona tu</span>
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent block pt-1 pb-1.5 leading-tight">
              vending
            </span>
          </h2>
          <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
            Cada tecnología está diseñada para objetivos de negocio diferentes. Elige la que mejor se adapte a tu visión.
          </p>

          <div className="p-3.5 sm:p-4 bg-cyan-50/80 border border-cyan-200/80 rounded-2xl flex items-start gap-3 shadow-xs text-left max-w-md mx-auto lg:mx-0">
            <div className="w-7 h-7 rounded-xl bg-[#168387]/15 text-[#168387] flex items-center justify-center shrink-0 mt-0.5">
              <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              Ambos modelos cuentan con una producción de <strong className="text-[#168387] font-bold">300 garrafones diarios</strong>.
            </p>
          </div>
          
          {/* Indicador de progreso visual sutil */}
          <div className="hidden lg:flex items-center gap-4 pt-6">
            <div className="h-1 w-20 bg-[#168387] rounded-full" />
            <div className="h-1 w-10 bg-slate-100 rounded-full" />
            <div className="h-1 w-10 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* CONTENEDOR DERECHO: VISTA MOVIL CON CARRUSEL + VISTA ESCRITORIO CON GRID */}
        <div className="w-full lg:w-[62%] xl:w-[65%]">

          {/* VISTA MOVIL (Carrusel táctil con snap e indicador de 2 opciones) */}
          <div className="block sm:hidden w-full">
            {/* Cabecera del carrusel en móvil */}
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Modelos disponibles
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#168387] bg-cyan-50 border border-cyan-200/80 px-2 py-0.5 rounded-full">
                  2 opciones
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100/90 px-2.5 py-0.5 rounded-full">
                <span className="text-[#168387] font-black">{activeMobileIndex + 1}</span>
                <span className="text-slate-300">/</span>
                <span>{availableVendingTypes.length}</span>
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
              {availableVendingTypes.map((type, idx) => {
                const isFlipped = !!flippedCards[type];
                const details = VENDING_DETAILS[type] || VENDING_DETAILS[VendingTypeEnum.TRADICIONAL];
                const isActive = activeMobileIndex === idx;

                return (
                  <div
                    key={type}
                    className={`vending-card-item snap-center shrink-0 w-[85vw] max-w-[325px] h-[510px] transition-all duration-300 ${
                      isActive ? "scale-100 opacity-100" : "scale-[0.97] opacity-85"
                    }`}
                    style={{ perspective: 1200 }}
                  >
                    <VendingTypeCard
                      type={type}
                      isFlipped={isFlipped}
                      onToggleFlip={toggleFlip}
                      onSelect={onSelect}
                      getVendingTypeImage={getVendingTypeImage}
                      displayNames={displayNames}
                      details={details}
                    />
                  </div>
                );
              })}
            </div>

            {/* Indicadores de bolitas inferiores */}
            <div className="flex flex-col items-center justify-center gap-1.5 mt-2">
              <div className="flex items-center gap-2">
                {availableVendingTypes.map((type, idx) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    aria-label={`Ver opción ${displayNames[type]}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeMobileIndex === idx
                        ? "w-7 h-2 bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] shadow-xs shadow-[#01949f]/30"
                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider">
                Desliza para ver la siguiente opción
              </span>
            </div>
          </div>

          {/* VISTA ESCRITORIO / TABLET (Grid clásico original de 2 columnas) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden sm:grid grid-cols-2 gap-5 sm:gap-8 w-full"
          >
            {availableVendingTypes.map((type) => {
              const isFlipped = !!flippedCards[type];
              const details = VENDING_DETAILS[type] || VENDING_DETAILS[VendingTypeEnum.TRADICIONAL];

              return (
                <motion.div
                  key={type}
                  variants={itemVariants}
                  className="relative w-full h-[510px] sm:h-[540px]"
                  style={{ perspective: 1200 }}
                >
                  <VendingTypeCard
                    type={type}
                    isFlipped={isFlipped}
                    onToggleFlip={toggleFlip}
                    onSelect={onSelect}
                    getVendingTypeImage={getVendingTypeImage}
                    displayNames={displayNames}
                    details={details}
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
