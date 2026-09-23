import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { 
  ClockIcon, 
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

export default function HeroBannerSlide({ onOpenTouchModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { brandingMode: mode, setBrandingMode } = useSettings();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [timerKey, setTimerKey] = useState(0);

  const resetTimer = useCallback(() => {
    setTimerKey(prev => prev + 1);
  }, []);

  const handleSetMode = useCallback((newMode) => {
    setBrandingMode(newMode);
    resetTimer();
  }, [setBrandingMode, resetTimer]);

  const toggleMode = useCallback(() => {
    setBrandingMode(prev => prev === 'agua' ? 'clean' : 'agua');
    resetTimer();
  }, [setBrandingMode, resetTimer]);

  // Alternar modo automaticamente cada 9 segundos solo si no hay scroll y no esta pausado
  // Se reinicia el intervalo si el usuario cambia el modo manualmente (timerKey)
  useEffect(() => {
    if (isScrolled || isPaused) return;

    const interval = setInterval(() => {
      setBrandingMode(prev => prev === 'agua' ? 'clean' : 'agua');
    }, 9000);

    return () => clearInterval(interval);
  }, [isScrolled, isPaused, timerKey, setBrandingMode]);

  // Animaciones de Scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const videoScaleBase = useTransform(scrollYProgress, [0, 1], [1.1, 1.3]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const boxesOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const boxesScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);

  const handleCTA = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTimeout(() => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[100svh] lg:h-[100svh] flex flex-col items-center justify-start lg:justify-center overflow-hidden bg-white select-none"
    >
      
      {/* FONDO DINAMICO (Imagen bannerwater para Agua / Gradiente para Clean) */}
      <AnimatePresence mode="wait">
        {mode === 'agua' ? (
          <motion.div 
            key="bg-agua"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ y: videoY, scale: videoScaleBase }}
            className="absolute inset-0 z-0 bg-[#f8fafc] flex items-center justify-center will-change-transform overflow-hidden"
          >
            <img 
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_1_h1gpyz.png", 1920)} 
              alt="Fondo Negocio de Agua" 
              className="w-full h-full object-cover object-left sm:object-center"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="bg-clean"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ y: videoY, scale: videoScaleBase }}
            className="absolute inset-0 z-0 bg-[#f8fafc] flex items-center justify-center will-change-transform overflow-hidden"
          >
            <img 
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529491/fondo_1_1_lqepd7.png", 1920)} 
              alt="Fondo Darmax Clean" 
              className="w-full h-full object-cover object-right sm:object-center"
            />
          </motion.div>
        )}
      </AnimatePresence>



      {/* CONTENIDO PRINCIPAL ESTÁTICO (Sin movimiento parallax en las imágenes ni texto) */}
      <div className="relative z-20 w-full h-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-2.5 min-[380px]:px-4 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-start lg:justify-between gap-5 [@media(min-height:750px)]:gap-7 [@media(min-height:850px)]:gap-9 sm:gap-8 lg:gap-8 pt-[92px] [@media(min-height:750px)]:pt-[98px] [@media(min-height:850px)]:pt-[106px] sm:pt-28 lg:pt-0 pb-28 sm:pb-28 lg:pb-[6vh] pointer-events-none">
        {/* COLUMNA IZQUIERDA: TEXTOS Y CTA */}
        <div className="w-full lg:w-1/2 pointer-events-auto lg:pl-6 xl:pl-8 2xl:pl-10">
          <motion.div style={{ y: textY, opacity: textOpacity }} className="text-center lg:text-left flex flex-col items-center lg:items-start">
            
            {/* CONTROL DE CARRUSEL: SWITCH DE MODO */}
            <div className="flex items-center gap-1 min-[380px]:gap-1.5 sm:gap-2 bg-slate-900/5 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-slate-200/90 mb-3.5 sm:mb-4 shadow-sm font-montserrat not-italic max-w-full">
              <button
                type="button"
                onClick={() => handleSetMode('agua')}
                className={`flex items-center gap-1 min-[380px]:gap-1.5 px-2.5 min-[380px]:px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[11px] min-[380px]:text-xs sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  mode === 'agua'
                    ? 'bg-[#168387] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 min-[380px]:w-2 min-[380px]:h-2 rounded-full ${mode === 'agua' ? 'bg-cyan-300' : 'bg-slate-300'}`} />
                <span>Agua Purificada</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetMode('clean')}
                className={`flex items-center gap-1 min-[380px]:gap-1.5 px-2.5 min-[380px]:px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-[11px] min-[380px]:text-xs sm:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  mode === 'clean'
                    ? 'bg-[#e7b341] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 min-[380px]:w-2 min-[380px]:h-2 rounded-full ${mode === 'clean' ? 'bg-amber-200' : 'bg-slate-300'}`} />
                <span>Productos Limpieza</span>
              </button>

              <button
                type="button"
                onClick={toggleMode}
                className="p-1 min-[380px]:p-1.5 text-slate-400 hover:text-slate-700 transition-colors ml-0.5 cursor-pointer shrink-0"
                title="Cambiar modelo"
                aria-label="Cambiar modelo"
              >
                <ChevronRightIcon className="w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
              >
                {/* Pre-título superior */}
                <p className={`font-montserrat not-italic text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase mb-3.5 sm:mb-2 ${
                  mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'
                }`}>
                  {mode === 'agua' 
                    ? "Agua Pura, Grandes oportunidades"
                    : "Limpieza Disponible 24/7"}
                </p>

                <h1 className="font-montserrat not-italic max-w-[360px] sm:max-w-none text-[24px] min-[380px]:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] xl:text-[54px] font-bold tracking-normal uppercase mb-2 sm:mb-4 text-slate-900 leading-[1.1]">
                  {mode === 'agua' ? (
                    <>
                      Inicia Tu Propio <br />
                      <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                        Negocio de Agua
                      </span>
                    </>
                  ) : (
                    <>
                      Emprende Con <br />
                      <span className="bg-gradient-to-r from-[#7FB32A] to-[#F3AD13] bg-clip-text text-transparent inline-block">
                        Darmax Clean
                      </span>
                    </>
                  )}
                </h1>
                <p className="font-montserrat not-italic max-w-[275px] min-[380px]:max-w-[300px] sm:max-w-md md:max-w-lg text-slate-600 text-[13px] min-[380px]:text-sm sm:text-base md:text-lg font-normal tracking-[0.035em] mb-4 min-[380px]:mb-5 [@media(min-height:750px)]:mb-6 sm:mb-8 leading-relaxed">
                  {mode === 'agua' 
                    ? "Invierte en tu futuro y genera ingresos 24/7 los 365 días del año."
                    : "Automatiza la venta de productos de limpieza con nuestra tecnología Vending Clean."}
                </p>
              </motion.div>
            </AnimatePresence>
            
            {/* BOTON CTA CON MICROINTERACCION MODERNA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCTA}
              className={`relative z-30 inline-flex items-center justify-center text-white font-bold py-2.5 min-[380px]:py-3 sm:py-3.5 px-6 min-[380px]:px-8 sm:px-12 rounded-full transition-all duration-300 text-[11px] min-[380px]:text-xs sm:text-sm uppercase tracking-widest group overflow-hidden font-montserrat not-italic ${
                mode === 'agua'
                  ? 'bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] shadow-[0_10px_25px_rgba(40,142,185,0.35)] hover:shadow-[0_14px_28px_rgba(40,142,185,0.45)]'
                  : 'bg-gradient-to-r from-[#7FB32A] to-[#F3AD13] shadow-[0_10px_25px_rgba(243,173,19,0.35)] hover:shadow-[0_14px_28px_rgba(243,173,19,0.45)]'
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
              <span>CONFIGURA TU NEGOCIO</span>
              <svg className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA: RENDERS DE MAQUINAS */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end translate-y-1 sm:translate-y-4 lg:translate-y-12 xl:translate-y-14 pointer-events-auto">
          <div className={`w-full flex justify-center lg:justify-end transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 scale-75 -translate-y-6' : 'opacity-100 scale-100 translate-y-0'}`}>
            <AnimatePresence mode="wait">
              {mode === 'agua' ? (
                <motion.div 
                  key="vending-agua-single"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4 sm:gap-6 relative"
                >
                  {/* Imagen de Vending de Agua Unica Estatica */}
                  <div className="relative flex items-center justify-center">
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529494/vending_agua_f5hj2l.png", 2000)} 
                      alt="Máquina Vending de Agua Darmax"
                      className="w-[330px] min-[380px]:w-[345px] [@media(min-height:750px)]:w-[380px] [@media(min-height:840px)]:w-[410px] max-w-[92vw] sm:w-[380px] md:w-[420px] lg:w-[490px] xl:w-[560px] 2xl:w-[620px] h-auto max-h-[56vh] min-[380px]:max-h-[62vh] [@media(min-height:750px)]:max-h-[66vh] [@media(min-height:840px)]:max-h-[70vh] sm:max-h-[66vh] lg:max-h-[68vh] xl:max-h-[72vh] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.28)] z-10" 
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="vending-clean-single"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4 sm:gap-6 relative"
                >
                  {/* Imagen de Vending de Limpieza Unica Estatica */}
                  <div className="relative flex items-center justify-center">
                    <motion.img 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                      src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789529494/vending_limpieza_z5u2sj.png", 2000)} 
                      alt="Máquina Vending de Productos de Limpieza Darmax Clean"
                      className="w-[330px] min-[380px]:w-[345px] [@media(min-height:750px)]:w-[380px] [@media(min-height:840px)]:w-[410px] max-w-[92vw] sm:w-[380px] md:w-[420px] lg:w-[490px] xl:w-[560px] 2xl:w-[620px] h-auto max-h-[56vh] min-[380px]:max-h-[62vh] [@media(min-height:750px)]:max-h-[66vh] [@media(min-height:840px)]:max-h-[70vh] sm:max-h-[66vh] lg:max-h-[68vh] xl:max-h-[72vh] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.28)] z-10" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FLECHAS LATERALES DE NAVEGACION DE CARRUSEL (Separación balanceada sin encimarse en texto o imagen) */}
      <button 
        type="button"
        onClick={toggleMode}
        className="hidden md:flex absolute left-3 sm:left-5 lg:left-7 xl:left-10 2xl:left-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-lg items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer group"
        aria-label="Modelo anterior"
      >
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button 
        type="button"
        onClick={toggleMode}
        className="hidden md:flex absolute right-3 sm:right-5 lg:right-7 xl:right-10 2xl:right-12 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-lg items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-110 active:scale-95 pointer-events-auto cursor-pointer group"
        aria-label="Siguiente modelo"
      >
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* CUADROS INFERIORES: DISPONIBLES EN ESCRITORIO Y MOVIL */}
      <motion.div 
        style={{ opacity: boxesOpacity, scale: boxesScale }} 
        className="absolute bottom-6 min-[380px]:bottom-10 [@media(min-height:750px)]:bottom-12 [@media(min-height:850px)]:bottom-14 sm:bottom-6 left-0 right-0 z-30 flex justify-center px-2 min-[380px]:px-3 sm:px-4 pointer-events-auto"
      >
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white/90 sm:bg-white/95 backdrop-blur-md shadow-lg sm:shadow-2xl rounded-2xl border border-white/80 overflow-hidden grid grid-cols-3 divide-x divide-slate-200/80">
          <motion.button 
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-1 min-[380px]:px-1.5 py-2 min-[380px]:py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <ClockIcon className={`w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-[8px] min-[380px]:text-[9px] sm:text-xs uppercase tracking-normal min-[380px]:tracking-wider text-center font-montserrat not-italic whitespace-nowrap">Beneficios 24/7</p>
          </motion.button>
          <motion.button 
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const agendaEl = document.getElementById('agenda-llamada');
              if (agendaEl) {
                agendaEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.open("https://wa.me/525519655369?text=Hola,%20me%20gustaria%20agendar%20una%20llamada", "_blank");
              }
            }} 
            className="px-1 min-[380px]:px-1.5 py-2 min-[380px]:py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <CalendarDaysIcon className={`w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-[8px] min-[380px]:text-[9px] sm:text-xs uppercase tracking-normal min-[380px]:tracking-wider text-center font-montserrat not-italic whitespace-nowrap">Agenda Llamada</p>
          </motion.button>
          <motion.a 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/525519655369" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-1 min-[380px]:px-1.5 py-2 min-[380px]:py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <svg className={`w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="font-black text-slate-900 text-[8px] min-[380px]:text-[9px] sm:text-xs uppercase tracking-normal min-[380px]:tracking-wider text-center font-montserrat not-italic whitespace-nowrap">WhatsApp</p>
          </motion.a>
        </div>
      </motion.div>

      {/* BOTON INFERIOR DERECHO: DESLIZA PARA EXPLORAR (MOUSE SIN RELLENO + FLECHA + TEXTO) */}
      <motion.button
        type="button"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        whileHover={{ y: 2 }}
        whileTap={{ scale: 0.96 }}
        className="hidden lg:flex absolute bottom-4 sm:bottom-6 right-4 sm:right-6 lg:right-8 xl:right-10 z-30 items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/65 hover:bg-white/95 backdrop-blur-md border border-white/80 shadow-sm hover:shadow transition-all duration-300 pointer-events-auto cursor-pointer group select-none"
        title="Desliza para explorar"
        aria-label="Desliza para explorar"
      >
        <div className="flex flex-col items-center">
          {/* Icono de mouse sin relleno (outline) */}
          <div className={`w-[18px] h-7 rounded-full border-[1.5px] transition-colors duration-300 flex justify-center pt-1 bg-transparent ${
            mode === 'agua'
              ? 'border-slate-400 group-hover:border-[#168387]'
              : 'border-slate-400 group-hover:border-[#e7b341]'
          }`}>
            {/* Ruedita animada de scroll */}
            <motion.span
              animate={{ y: [0, 5, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className={`w-[2px] h-1.5 rounded-full transition-colors duration-300 ${
                mode === 'agua'
                  ? 'bg-slate-500 group-hover:bg-[#168387]'
                  : 'bg-slate-500 group-hover:bg-[#e7b341]'
              }`}
            />
          </div>
          {/* Flechita hacia abajo */}
          <motion.svg
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.15 }}
            className={`w-3 h-3 -mt-0.5 transition-colors duration-300 ${
              mode === 'agua'
                ? 'text-slate-400 group-hover:text-[#168387]'
                : 'text-slate-400 group-hover:text-[#e7b341]'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>

        <span className="font-montserrat text-xs tracking-wider text-slate-600 group-hover:text-slate-900 font-medium whitespace-nowrap">
          Desliza para explorar
        </span>
      </motion.button>
    </div>
  );
}
