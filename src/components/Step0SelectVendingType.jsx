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
    subtitle: "Pantalla interactiva TOUCH de 8”",
    recommendationTitle: "Recomendación de uso",
    recommendation:
      "Nuevo modelo innovador y único en el mercado, ideal para plazas, locales comerciales y zonas de alto flujo donde se requiere ser más vistoso y moderno, con beneficios exclusivos como:",
    features: [
      "Acero inoxidable de calidad 304",
      "Vending Gabinete de Acero Quirúrgico",
      "Pantalla inicial “TOUCH” de 8”",
      "Marco de puerta en acero inoxidable",
      "Dispensador de tapas",
      "1 Monedero antirrobo",
      "Grado alimenticio 304",
      "Bocina",
      "Vinil laminado contra luz UV",
      "3 Sensor de flujo (sensado de litros)",
      "Solenoides (2)",
      "Precios de llenado: 1, 4, 10 y 20 litros",
      "1 Tiempo de enjuague (enjuague de garrafón)",
      "Da cambio",
      "1 Sistema de verificación de fallas",
    ],
  },
  [VendingTypeEnum.TRADICIONAL]: {
    name: "Tradicional",
    subtitle: "Botones LED y pantalla de 5”",
    recommendationTitle: "Recomendación de uso",
    recommendation:
      "Se mantiene la calidad del modelo de alta gama touch, sin embargo, la configuración de la vending y la selección del tipo de agua es de forma tradicional con botones de acero inoxidable con luz LED. La pantalla es LED de 5”, ideal para colonias con altos índices de vandalismo.",
    features: [
      "Acero inoxidable de calidad 304",
      "Vending Gabinete de Acero Quirúrgico",
      "Botones en acero inoxidable y luz LED",
      "Pantalla inicial “LCD” (pantalla LED de 5”)",
      "Marco de puerta en acero inoxidable",
      "Dispensador de tapas",
      "1 Monedero antirrobo",
      "Grado alimenticio 304",
      "Bocina",
      "Vinil laminado contra luz UV",
      "3 Sensor de flujo (sensado de litros)",
      "Solenoides (2)",
      "Precios de llenado: 1, 4, 10 y 20 litros",
      "1 Tiempo de enjuague (enjuague de garrafón)",
      "Da cambio",
      "1 Luz LED interior",
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
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full min-h-0 py-2">
          <div 
            className="relative w-full h-52 sm:h-60 flex items-center justify-center cursor-pointer group/img"
            onClick={(e) => onToggleFlip(type, e)}
            title="Haz clic para ver especificaciones"
          >
            <img 
              src={getVendingTypeImage(type)} 
              alt={displayNames[type]} 
              loading="eager"
              decoding="async"
              className="max-h-full w-auto object-contain drop-shadow-xl group-hover/img:scale-105 transition-transform duration-500" 
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {displayNames[type]}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {details.subtitle}
            </p>
          </div>
        </div>

        {/* Botones de accion */}
        <div className="space-y-2 w-full pt-3">
          <button
            type="button"
            onClick={(e) => onToggleFlip(type, e)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-cyan-50/70 hover:text-[#168387] text-slate-700 text-xs font-bold border border-slate-200/80 hover:border-cyan-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-[#168387]" />
            <span>Ver especificaciones completas</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(type)}
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-[#168387] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-900/20 active:scale-98 flex items-center justify-center gap-2 group/btn cursor-pointer"
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
        <div className="flex items-center justify-between w-full pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#168387]">
              Ficha Técnica
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Modelo {displayNames[type]}
            </h3>
          </div>

          <button
            type="button"
            onClick={(e) => onToggleFlip(type, e)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            title="Volver a ver la imagen"
          >
            <ArrowPathIcon className="w-3.5 h-3.5 text-slate-600" />
            <span>Volver a foto</span>
          </button>
        </div>

        {/* Resumen de uso / Perfil recomendado */}
        <div className={`p-2.5 sm:p-3 rounded-xl border text-left my-2 ${
          type === VendingTypeEnum.TOUCH
            ? "bg-cyan-50/70 border-cyan-200/70"
            : "bg-amber-50/80 border-amber-200/80"
        }`}>
          <span className={`text-[10px] font-black uppercase tracking-wider block mb-0.5 ${
            type === VendingTypeEnum.TOUCH ? "text-[#168387]" : "text-amber-800"
          }`}>
            {details.recommendationTitle}
          </span>
          <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-medium">
            {details.recommendation}
          </p>
        </div>

        {/* Lista de especificaciones tecnicas con scroll elegante */}
        <div 
          className="flex-1 overflow-y-auto pr-1 sm:pr-2 my-1 space-y-1.5 text-left min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#24d4da transparent" }}
        >
          {details.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs text-slate-700 leading-snug">
              <CheckCircleIcon className="w-4 h-4 text-[#168387] shrink-0 mt-0.5" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Boton de configurar vending: siempre visible en la parte inferior */}
        <div className="pt-2 w-full">
          <button
            type="button"
            onClick={() => onSelect(type)}
            className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-[#168387] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-900/20 active:scale-98 flex items-center justify-center gap-2 group/btn cursor-pointer"
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
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16 px-4 sm:px-8">
        
        {/* Titulo a la Izquierda */}
        <div className="w-full lg:w-[35%] text-center lg:text-left space-y-3 lg:sticky lg:top-40">
          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 block">
            Tecnología de Despacho
          </span>
          <h2 className="font-montserrat not-italic text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#031638]">
            Selecciona tu <br />
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block pb-2 pt-0.5 overflow-visible">
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
        <div className="w-full lg:w-[65%]">

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
                        ? "w-7 h-2 bg-[#168387]"
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
