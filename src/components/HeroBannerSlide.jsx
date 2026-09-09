import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Parallax from 'parallax-js';
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
  const sceneRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const toggleMode = useCallback(() => {
    setBrandingMode(prev => prev === 'agua' ? 'clean' : 'agua');
  }, [setBrandingMode]);

  // Alternar modo automaticamente cada 9 segundos solo si no hay scroll y no esta pausado
  useEffect(() => {
    if (isScrolled || isPaused) return;

    const interval = setInterval(() => {
      toggleMode();
    }, 9000);

    return () => clearInterval(interval);
  }, [isScrolled, isPaused, toggleMode]);

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

    let parallaxInstance = null;
    if (sceneRef.current) {
      parallaxInstance = new Parallax(sceneRef.current, {
        relativeInput: true,
        hoverOnly: true,
        frictionX: 0.1,
        frictionY: 0.1,
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (parallaxInstance) parallaxInstance.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[100svh] lg:h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-white select-none"
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
            className="absolute inset-0 z-0 bg-[#f8fafc] flex items-center justify-center will-change-transform"
          >
            <img 
              src="/img/bannerwater.png" 
              alt="Background Water" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div 
            key="bg-clean"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ y: videoY, scale: 1.1 }}
            className="absolute inset-0 z-0 bg-white flex items-center justify-center overflow-hidden"
          >
            <img 
              src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1776407496/fondo_gotas_jrtijk.png", 1600)} 
              alt="Fondo Gotas" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 animate-clean-bg blur-[80px] opacity-40 scale-150 mix-blend-multiply" />
            <div className="absolute inset-0 animate-clean-bg blur-[120px] opacity-30 scale-125" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESCENA DE PARALLAX (Mouse Move) */}
      <div ref={sceneRef} className="absolute inset-0 z-10 pointer-events-auto">
        <div data-depth="0.2" className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-[10%] -left-[10%] w-[120%] h-[80%] blur-[120px] transition-colors duration-1000 ${mode === 'agua' ? 'bg-[#168387]/10 animate-water-flow' : 'bg-yellow-400/20'}`} />
        </div>
        <div data-depth="0.4" className="absolute inset-0 pointer-events-none">
          <div className={`absolute -bottom-[20%] -right-[10%] w-[100%] h-[60%] rounded-[40%_60%_70%_30%/40%_50%_60%_40%] blur-[100px] transition-colors duration-1000 ${mode === 'agua' ? 'bg-[#168387]/10 animate-water-drift' : 'bg-pink-400/20'}`} />
        </div>

        <div data-depth="0.1" className="absolute inset-0 pointer-events-none">
           <div 
              className="w-full h-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 sm:gap-10 lg:gap-14 pt-16 sm:pt-20 lg:pt-0 pb-28 sm:pb-32 lg:pb-[6vh] transform-gpu"
           >
              {/* COLUMNA IZQUIERDA: RENDERS DE MAQUINAS */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className={`transition-all duration-500 ease-in-out ${isScrolled ? 'opacity-0 scale-75 -translate-y-6' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <AnimatePresence mode="wait">
                    {mode === 'agua' ? (
                      <motion.div 
                        key="vending-montage"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-4 sm:gap-8 relative"
                      >
                        {/* Glow de Fondo (Agua) */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.05, 1] }}
                          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -z-10"
                        >
                          <div className="w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] bg-gradient-to-tr from-[#5188C9] to-[#93C5FD] rounded-full blur-[70px] sm:blur-[90px] mix-blend-multiply opacity-70" />
                        </motion.div>

                        {/* Imagenes de Vendings Inclinadas (Efecto 3D con levitacion suave continua) */}
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                          className="relative flex items-center justify-center -space-x-10 sm:-space-x-16 md:-space-x-20 lg:-space-x-24 perspective-[1000px]"
                        >
                          <motion.img 
                            initial={{ rotateY: -35, x: -30, opacity: 0 }}
                            animate={{ rotateY: -20, x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                            src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/tradicional_atlantis_max_umqitz.png", 800)} 
                            alt="Atlantis Tradicional Max"
                            className="w-[110px] sm:w-[160px] md:w-[210px] lg:w-[275px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] z-10" 
                          />
                          <motion.img 
                            initial={{ rotateY: 35, x: 30, opacity: 0 }}
                            animate={{ rotateY: 20, x: 0, opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                            src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/touch_atlantis_max_a2hi0p.png", 1000)} 
                            alt="Atlantis Touch Max"
                            className="w-[135px] sm:w-[200px] md:w-[260px] lg:w-[340px] h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.32)] z-20 relative" 
                          />
                        </motion.div>

                        {/* Logo Darmax debajo (Solo en Escritorio) */}
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          src="/img/logos/logonegro.png" 
                          alt="Darmax Logo"
                          className="hidden lg:block w-[120px] sm:w-[150px] md:w-[190px] h-auto object-contain brightness-110" 
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="vending-clean-montage"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-2 sm:gap-0 lg:translate-x-6"
                      >
                        {/* Imagenes de Vendings de Limpieza (con levitacion suave continua) */}
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          className="flex items-center justify-center -space-x-12 sm:-space-x-20 md:-space-x-24 perspective-[1000px] -translate-y-2 sm:-translate-y-6"
                        >
                          <motion.img 
                            initial={{ rotateY: -35, x: -30, opacity: 0 }}
                            animate={{ rotateY: -20, x: 0, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
                            src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1779936687/8_productos_ayggvi.png", 800)} 
                            alt="Vending Clean 8"
                            className="w-[115px] sm:w-[170px] md:w-[220px] lg:w-[250px] h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)] z-10" 
                          />
                          <motion.img 
                            initial={{ rotateY: 35, x: 30, opacity: 0 }}
                            animate={{ rotateY: 20, x: 0, opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                            src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1779936686/5_productos_qjhieo.png", 800)} 
                            alt="Vending Clean 5"
                            className="w-[100px] sm:w-[155px] md:w-[195px] lg:w-[220px] h-auto object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)] z-20" 
                          />
                        </motion.div>

                        {/* Logo Clean debajo (Solo en Escritorio) */}
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          src="/img/LogoClean.png" 
                          alt="Darmax Clean Logo"
                          className="hidden lg:block w-[100px] sm:w-[120px] md:w-[160px] h-auto object-contain brightness-110 -mt-6 sm:-mt-10" 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* COLUMNA DERECHA: TEXTOS Y CTA */}
              <div className="w-full lg:w-1/2 pointer-events-auto">
                <motion.div style={{ y: textY, opacity: textOpacity }} className="text-center lg:text-left flex flex-col items-center lg:items-start">
                  
                  {/* CONTROL DE CARRUSEL: SWITCH DE MODO */}
                  <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/5 backdrop-blur-md p-1 rounded-full border border-slate-200/90 mb-3 sm:mb-5 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setBrandingMode('agua')}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black transition-all ${
                        mode === 'agua'
                          ? 'bg-[#168387] text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${mode === 'agua' ? 'bg-cyan-300' : 'bg-slate-300'}`} />
                      <span>Agua Purificada</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBrandingMode('clean')}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-black transition-all ${
                        mode === 'clean'
                          ? 'bg-[#e7b341] text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${mode === 'clean' ? 'bg-amber-200' : 'bg-slate-300'}`} />
                      <span>Productos Limpieza</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleMode}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors ml-0.5"
                      title="Cambiar modelo"
                      aria-label="Cambiar modelo"
                    >
                      <ChevronRightIcon className="w-3.5 h-3.5" />
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
                      <h1 className="max-w-[340px] sm:max-w-none text-[30px] sm:text-[40px] md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-2 sm:mb-4 text-slate-900 drop-shadow-sm leading-[1.08]">
                        {mode === 'agua' ? (
                          <>
                            Emprende Tu <br />
                            <span className="text-[#168387]">Negocio de Agua</span>
                          </>
                        ) : (
                          <>
                            Emprende Con <br />
                            <span className="text-[#e7b341]">Productos De Limpieza</span>
                          </>
                        )}
                      </h1>
                      <p className="max-w-[300px] sm:max-w-md md:max-w-lg text-slate-700 text-sm sm:text-base md:text-lg font-bold mb-5 sm:mb-8 leading-relaxed">
                        {mode === 'agua' 
                          ? "Inicia tu negocio rentable con purificadoras comerciales, máquinas vending de agua y ósmosis inversa."
                          : "Automatiza la venta de productos de limpieza con nuestra tecnología Vending Clean de alto margen."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* BOTON CTA CON MICROINTERACCION MODERNA */}
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleCTA}
                    className="relative z-30 inline-flex items-center justify-center text-white font-extrabold py-3 sm:py-3.5 px-8 sm:px-12 rounded-full transition-all duration-300 text-xs sm:text-sm uppercase tracking-widest shadow-xl group overflow-hidden"
                    style={{ 
                      backgroundColor: mode === 'agua' ? '#168387' : '#e7b341', 
                      boxShadow: mode === 'agua' ? '0 10px 25px rgba(22, 131, 135, 0.35)' : '0 10px 25px rgba(231, 179, 65, 0.35)'
                    }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                    <span>CONFIGURA TU NEGOCIO</span>
                    <svg className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
           </div>
        </div>
      </div>

      {/* FLECHAS LATERALES DE NAVEGACION DE CARRUSEL (Escritorio y Tablet) */}
      <button 
        type="button"
        onClick={toggleMode}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
        aria-label="Modelo anterior"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <button 
        type="button"
        onClick={toggleMode}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-slate-200 shadow-md items-center justify-center text-slate-700 hover:text-slate-900 transition-all hover:scale-110 active:scale-95 pointer-events-auto"
        aria-label="Siguiente modelo"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      <div className="absolute inset-0 bg-white/5 z-10 pointer-events-none" />

      {/* CUADROS INFERIORES: DISPONIBLES EN ESCRITORIO Y MOVIL */}
      <motion.div 
        style={{ opacity: boxesOpacity, scale: boxesScale }} 
        className="absolute bottom-3 sm:bottom-6 left-0 right-0 z-30 flex justify-center px-3 sm:px-4 pointer-events-auto"
      >
        <div className="w-full max-w-4xl bg-white/90 sm:bg-white/95 backdrop-blur-md shadow-lg sm:shadow-2xl rounded-2xl border border-white/80 overflow-hidden grid grid-cols-3 divide-x divide-slate-200/80">
          <motion.button 
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} 
            className="px-1.5 py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <ClockIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-[9px] sm:text-xs uppercase tracking-wider text-center">Beneficios 24/7</p>
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
            className="px-1.5 py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <CalendarDaysIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-[9px] sm:text-xs uppercase tracking-wider text-center">Agenda Llamada</p>
          </motion.button>
          <motion.a 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            href="https://wa.me/525519655369" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-1.5 py-2.5 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 transition-colors hover:bg-slate-50/70"
          >
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-500 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="font-black text-slate-900 text-[9px] sm:text-xs uppercase tracking-wider text-center">WhatsApp</p>
          </motion.a>
        </div>
      </motion.div>

      <style>{`
        @keyframes water-flow { 0% { transform: translateX(-5%) skewX(0deg); } 50% { transform: translateX(5%) skewX(2deg); } 100% { transform: translateX(-5%) skewX(0deg); } }
        @keyframes water-drift { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(3%, 3%) rotate(1deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes clean-bg {
          0% { background: radial-gradient(circle at 20% 20%, #fef08a, #f472b6, #7dd3fc, #3b82f6); }
          33% { background: radial-gradient(circle at 80% 40%, #7dd3fc, #fef08a, #3b82f6, #f472b6); }
          66% { background: radial-gradient(circle at 40% 80%, #f472b6, #3b82f6, #fef08a, #7dd3fc); }
          100% { background: radial-gradient(circle at 20% 20%, #fef08a, #f472b6, #7dd3fc, #3b82f6); }
        }
        .animate-water-flow { animation: water-flow 15s ease-in-out infinite; }
        .animate-water-drift { animation: water-drift 20s ease-in-out infinite; }
        .animate-clean-bg { animation: clean-bg 12s linear infinite; width: 200%; height: 200%; left: -50%; top: -50%; }
      `}</style>
    </div>
  );
}
