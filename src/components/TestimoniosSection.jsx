import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  StarIcon 
} from "@heroicons/react/24/solid";
import {
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

const revealUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: {
    duration: 0.45,
    delay,
    ease: [0.22, 1, 0.36, 1],
  },
});

const slideInRight = (d = 0) => revealUp(d);

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

function TestimonioCard({ testimonio, isMobile = false, isActive = false }) {
  const IconComponent = testimonio.Icon;
  return (
    <div
      className={`group relative overflow-hidden h-full p-5 sm:p-6 rounded-2xl sm:rounded-[1.5rem] bg-white flex flex-col justify-between transition-all duration-300 cursor-default min-h-[235px] sm:min-h-[235px] ${
        isMobile
          ? isActive
            ? "border border-[#288EB9]/50 shadow-[0_10px_25px_rgba(40,142,185,0.18)]"
            : "border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
          : "border-[0.5px] border-slate-200/80 group-hover:border-transparent hover:shadow-[0_10px_30px_rgba(40,142,185,0.18)] hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
      }`}
    >
      {/* Marca de agua de comillas */}
      <svg 
        className={`absolute top-4 right-4 sm:right-5 w-12 h-12 sm:w-14 sm:h-14 transition-colors duration-500 pointer-events-none select-none z-0 ${
          isMobile && isActive ? "text-[#288EB9]/10" : "text-slate-100/90 group-hover:text-white/10"
        }`} 
        fill="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19.4167 6.67891C20.4469 7.77257 21.0001 9 21.0001 10.9897C21.0001 14.4891 18.5436 17.6263 14.9695 19.1768L14.0768 17.7992C17.4121 15.9946 18.0639 13.6539 18.3245 12.178C17.7875 12.4557 17.0845 12.5533 16.3954 12.4895C14.591 12.3222 13.1689 10.8409 13.1689 9C13.1689 7.067 14.7359 5.5 16.6689 5.5C17.742 5.5 18.7681 5.99045 19.4167 6.67891ZM9.41669 6.67891C10.4469 7.77257 11.0001 9 11.0001 10.9897C11.0001 14.4891 8.54359 17.6263 4.96951 19.1768L4.07682 17.7992C7.41206 15.9946 8.06392 13.6539 8.32447 12.178C7.78747 12.4557 7.08452 12.5533 6.39539 12.4895C4.59102 12.3222 3.16895 10.8409 3.16895 9C3.16895 7.067 4.73595 5.5 6.66895 5.5C7.742 5.5 8.76814 5.99045 9.41669 6.67891Z" />
      </svg>

      {/* Capa de fondo para hover en escritorio */}
      {!isMobile && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px] transition-opacity duration-500 pointer-events-none z-0" />
        </>
      )}

      <div className="relative z-10 flex flex-col flex-grow">
        <div className="mb-3 sm:mb-3.5 pr-10 sm:pr-12">
          <h4 className={`font-bold text-base sm:text-[17px] leading-snug transition-colors duration-500 font-montserrat not-italic truncate ${
            isMobile ? "text-slate-900" : "text-slate-900 group-hover:text-white"
          }`}>
            {testimonio.name}
          </h4>
          <div className="flex gap-0.5 my-1 sm:my-1.5">
            {[...Array(5)].map((_, idx) => (
              <StarIcon key={idx} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] transition-all" />
            ))}
          </div>
          <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider opacity-90 transition-colors duration-500 font-montserrat not-italic truncate ${
            isMobile ? "text-[#288EB9]" : "text-[#288EB9] group-hover:text-cyan-100"
          }`}>
            {testimonio.role}
          </p>
        </div>

        <p className={`font-montserrat italic text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed mb-4 opacity-95 relative z-10 transition-colors duration-500 line-clamp-4 ${
          isMobile ? "text-slate-600" : "text-slate-600 group-hover:text-white/95"
        }`}>
          {testimonio.text}
        </p>
      </div>

      <div className={`mt-auto pt-3.5 sm:pt-4 border-t-2 relative z-10 transition-colors duration-500 ${
        isMobile
          ? isActive ? "border-[#288EB9]/25" : "border-slate-100"
          : "border-slate-200 group-hover:border-white/30"
      }`}>
        <div className="flex items-center gap-2 sm:gap-2.5">
          <IconComponent className={`w-4 h-4 transition-colors duration-500 shrink-0 stroke-[1.8] ${
            isMobile ? "text-[#288EB9]" : "text-[#288EB9] group-hover:text-cyan-200"
          }`} />
          <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors duration-500 font-montserrat not-italic truncate ${
            isMobile ? "text-slate-500" : "text-slate-500 group-hover:text-cyan-100"
          }`}>
            {testimonio.badge}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TestimoniosCarousel() {
  // Estado para vista escritorio
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Estado para vista móvil con snap táctil
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileCarouselRef = useRef(null);

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

  // Detección de tarjeta centrada al hacer scroll en móvil
  const handleMobileScroll = useCallback(() => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const cardNodes = container.querySelectorAll(".testimonio-card-mobile");
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

  // Navegación fluida por dots en móvil
  const scrollToCard = useCallback((index) => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const cardNodes = container.querySelectorAll(".testimonio-card-mobile");
    const targetCard = cardNodes[index];
    if (targetCard) {
      const cardCenter = targetCard.offsetLeft + targetCard.offsetWidth / 2;
      const targetScroll = cardCenter - container.offsetWidth / 2;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (mobileCarouselRef.current) {
      mobileCarouselRef.current.scrollLeft = 0;
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* ========================================================
          VISTA MÓVIL: FORMATO ACORDEÓN HORIZONTAL CON SNAP Y PEAKING
         ======================================================== */}
      <div className="block sm:hidden">
        {/* Header dinámico con badge y contador */}
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          <div className="shrink-0 transition-all duration-300">
            <span className="text-xs font-bold uppercase tracking-[0.2em] font-montserrat not-italic text-[#168387] block">
              {TESTIMONIOS_DATA[activeMobileIndex]?.badge || "Experiencia"}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight font-montserrat not-italic transition-all duration-300 truncate max-w-[200px]">
              {TESTIMONIOS_DATA[activeMobileIndex]?.name}
            </h3>
          </div>
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10.5px] font-semibold text-slate-400 tracking-wider shrink-0 font-montserrat not-italic">
            {activeMobileIndex + 1}/{TESTIMONIOS_DATA.length}
          </span>
        </div>

        {/* Contenedor carrusel móvil */}
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scroll-smooth pt-4 pb-4 -mx-4 px-0 no-scrollbar items-center"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Espaciador inicial para centrar la primera tarjeta */}
          <div
            className="shrink-0 pointer-events-none"
            style={{ width: "calc(50vw - 149px)" }}
            aria-hidden="true"
          />

          {TESTIMONIOS_DATA.map((testimonio, idx) => {
            const isActive = activeMobileIndex === idx;
            return (
              <div
                key={testimonio.id}
                className={`testimonio-card-mobile snap-center shrink-0 w-[270px] transition-all duration-300 ${
                  isActive ? "scale-100 opacity-100" : "scale-[0.96] opacity-85"
                }`}
              >
                <TestimonioCard
                  testimonio={testimonio}
                  isMobile={true}
                  isActive={isActive}
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

        {/* Dots interactivos para móvil */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {TESTIMONIOS_DATA.map((t, idx) => {
            const isActive = activeMobileIndex === idx;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                aria-label={`Ver testimonio de ${t.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-2 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA]"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ========================================================
          VISTA ESCRITORIO / TABLET: CARRUSEL MULTICOLUMNA CON FLECHAS
         ======================================================== */}
      <div className="hidden sm:block relative px-10 lg:px-12">
        {/* Boton Anterior a la izquierda */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute -left-2 lg:-left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center justify-center transition-all duration-300 ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed bg-slate-50/50 text-slate-300"
              : "text-slate-700 hover:text-[#288EB9] hover:border-[#288EB9] hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-white"
          }`}
          aria-label="Testimonios anteriores"
        >
          <ChevronLeftIcon className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Contenedor del Carrusel en Escritorio */}
        <div className="overflow-hidden w-full py-6 -my-6 px-1 -mx-1">
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
                <TestimonioCard
                  testimonio={testimonio}
                  isMobile={false}
                  isActive={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Boton Siguiente a la derecha */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          className={`absolute -right-2 lg:-right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center justify-center transition-all duration-300 ${
            currentIndex === maxIndex
              ? "opacity-30 cursor-not-allowed bg-slate-50/50 text-slate-300"
              : "text-slate-700 hover:text-[#288EB9] hover:border-[#288EB9] hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-white"
          }`}
          aria-label="Siguientes testimonios"
        >
          <ChevronRightIcon className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Indicadores / Dots de Escritorio */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-7">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "w-7 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA]"
                  : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Ir al testimonio ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Frase entre líneas horizontales cortas */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 mt-6 sm:mt-8 select-none px-4">
        <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
        <p className="text-slate-500 font-montserrat not-italic text-[11px] sm:text-xs md:text-[13px] font-medium tracking-wider uppercase leading-relaxed text-center">
          MÁS QUE EQUIPOS, ALIANZAS PARA CRECER.
        </p>
        <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function TestimoniosSection() {
  return (
    <section id="testimonios" className="relative pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 overflow-hidden bg-white font-montserrat not-italic scroll-mt-16">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img 
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_4_bvpiur.png", 1920)} 
          alt="Fondo Darmax Historias de Éxito" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Difuminado superior que conecta con la calculadora de arriba (#fbfbfd) */}
      <div 
        className="absolute -top-px inset-x-0 h-12 sm:h-16 bg-gradient-to-b from-[#fbfbfd] via-[#fbfbfd]/70 to-transparent pointer-events-none z-10" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <motion.div
          {...slideInRight(0, "Únete a la familia Darmax")}
          className="flex flex-col items-center text-center mb-8 sm:mb-10 max-w-5xl mx-auto"
        >
          <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
            Resultados Reales
          </span>
          <h2 className="font-montserrat not-italic text-2xl sm:text-4xl md:text-5xl lg:text-[44px] font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-center">
            <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent block pb-1">
              Únete a la familia Darmax
            </span>
            <span className="block text-[#031638] mt-1">
              y forma parte de nuestras historias de éxito
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
  );
}
