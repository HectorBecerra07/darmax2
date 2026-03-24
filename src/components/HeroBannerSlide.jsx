import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Parallax from 'parallax-js';
import { useSettings } from '../context/SettingsContext';
import { 
  ClockIcon, 
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function HeroBannerSlide() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const { brandingMode: mode, setBrandingMode } = useSettings();
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Alternar modo cada 8 segundos SOLO si no se ha hecho scroll
  useEffect(() => {
    if (isScrolled) return;

    const interval = setInterval(() => {
      setBrandingMode(prev => prev === 'agua' ? 'clean' : 'agua');
    }, 8000);

    return () => clearInterval(interval);
  }, [isScrolled, setBrandingMode]);

  // Animaciones de Scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const videoScaleBase = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const boxesOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const boxesScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const handleCTA = () => {
    setIsExiting(true);
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setIsExiting(false), 1000);
    }, 700);
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
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-white"
    >
      
      {/* FONDO DINÁMICO (Video para Agua / Gradiente para Clean) */}
      <AnimatePresence mode="wait">
        {mode === 'agua' ? (
          <motion.div 
            key="bg-agua"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ y: videoY, scale: isExiting ? 2.5 : videoScaleBase }}
            className="absolute inset-0 z-0 bg-[#f8fafc] flex items-center justify-center will-change-transform"
          >
            <video autoPlay loop muted playsInline className="w-full h-full object-cover">
              <source src="https://res.cloudinary.com/defkuaytw/video/upload/q_auto:best,f_auto/v1774072458/Agua_fluyendo_efecto_202603202353_ioypg7.mp4" type="video/mp4" />
            </video>
          </motion.div>
        ) : (
          <motion.div 
            key="bg-clean"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ y: videoY, scale: isExiting ? 2.5 : 1.1 }}
            className="absolute inset-0 z-0 bg-white flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 animate-clean-bg blur-[100px] opacity-60 scale-150" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ESCENA DE PARALLAX (Mouse Move) */}
      <div ref={sceneRef} className="absolute inset-0 z-10 pointer-events-auto">
        
        {/* Capas Decorativas */}
        <div data-depth="0.2" className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-[10%] -left-[10%] w-[120%] h-[80%] blur-[120px] transition-colors duration-1000 ${mode === 'agua' ? 'bg-[#168387]/10 animate-water-flow' : 'bg-yellow-400/20'}`} />
        </div>
        
        <div data-depth="0.4" className="absolute inset-0 pointer-events-none">
          <div className={`absolute -bottom-[20%] -right-[10%] w-[100%] h-[60%] rounded-[40%_60%_70%_30%/40%_50%_60%_40%] blur-[100px] transition-colors duration-1000 ${mode === 'agua' ? 'bg-[#168387]/10 animate-water-drift' : 'bg-pink-400/20'}`} />
        </div>

        {/* LOGO Y TEXTO */}
        <div data-depth="0.1" className="absolute inset-0 pointer-events-none">
           <motion.div 
              animate={{ 
                opacity: isExiting ? 0 : 1,
                scale: isExiting ? 0 : 1,
                rotate: isExiting ? 720 : 0,
                filter: isExiting ? "blur(10px)" : "blur(0px)"
              }}
              transition={{ duration: 0.7, ease: [0.45, 0, 0.55, 1] }}
              className="w-full h-full max-w-7xl mx-auto px-6 sm:px-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 sm:gap-14 pb-[5vh] transform-gpu"
           >
              {/* Columna Logo */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className={`transition-all duration-700 ease-in-out ${isScrolled ? 'opacity-0 scale-50 -translate-y-20' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={mode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8 }}
                      src={mode === 'agua' ? "/img/darmaxfoto.png" : "/img/LogoClean.png"} 
                      alt={mode === 'agua' ? "Darmax Agua" : "Darmax Clean"}
                      className="w-[130px] sm:w-[160px] md:w-[220px] lg:w-[380px] h-auto object-contain drop-shadow-2xl" 
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Columna Texto */}
              <div className="w-full lg:w-1/2 pointer-events-auto">
                <motion.div style={{ y: textY, opacity: textOpacity }} className="text-center lg:text-left flex flex-col items-center lg:items-start">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h1 className="max-w-[260px] sm:max-w-none text-[32px] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-4 sm:mb-6 text-slate-900 drop-shadow-sm">
                        {mode === 'agua' ? (
                          <>Emprende Tu<br /><span style={{ color: '#168387' }}>Negocio</span></>
                        ) : (
                          <>Emprende Con<br /><span className="text-pink-500"> Productos De Limpieza</span></>
                        )}
                      </h1>
                      <p className="max-w-[240px] sm:max-w-sm md:max-w-md text-slate-800 text-[14px] sm:text-base md:text-lg font-bold mb-8 sm:mb-12">
                        {mode === 'agua' 
                          ? "Inicia tu emprendimiento con purificadoras, máquinas vending de agua y productos de limpieza."
                          : "Automatiza la venta de productos de limpieza con nuestra tecnología Vending Clean."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  <button
                    onClick={handleCTA}
                    className="relative z-30 inline-flex items-center justify-center text-white font-extrabold py-4 px-10 sm:py-4 sm:px-14 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-[13px] sm:text-base uppercase tracking-widest shadow-xl animate-btn-pulse"
                    style={{ 
                      backgroundColor: mode === 'agua' ? '#168387' : '#e11d48', 
                      boxShadow: mode === 'agua' ? '0 10px 25px rgba(22, 131, 135, 0.4)' : '0 10px 25px rgba(225, 29, 72, 0.4)'
                    }}
                  >
                    <span>CONFIGURA TU {mode === 'agua' ? 'NEGOCIO' : 'NEGOCIO'}</span>
                    <svg className="ml-3 w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </motion.div>
              </div>
           </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-white/5 z-10 pointer-events-none" />

      <style>{`
        @keyframes water-flow { 0% { transform: translateX(-5%) skewX(0deg); } 50% { transform: translateX(5%) skewX(2deg); } 100% { transform: translateX(-5%) skewX(0deg); } }
        @keyframes water-drift { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(3%, 3%) rotate(1deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes custom-pulse { 0% { transform: scale(1); } 70% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes clean-bg {
          0% { background: radial-gradient(circle at 20% 20%, #fef08a, #f472b6, #7dd3fc, #3b82f6); }
          33% { background: radial-gradient(circle at 80% 40%, #7dd3fc, #fef08a, #3b82f6, #f472b6); }
          66% { background: radial-gradient(circle at 40% 80%, #f472b6, #3b82f6, #fef08a, #7dd3fc); }
          100% { background: radial-gradient(circle at 20% 20%, #fef08a, #f472b6, #7dd3fc, #3b82f6); }
        }
        .animate-water-flow { animation: water-flow 15s ease-in-out infinite; }
        .animate-water-drift { animation: water-drift 20s ease-in-out infinite; }
        .animate-btn-pulse { animation: custom-pulse 2s infinite; }
        .animate-clean-bg { animation: clean-bg 12s linear infinite; width: 200%; height: 200%; left: -50%; top: -50%; }
      `}</style>

      {/* CUADROS INFERIORES */}
      <motion.div style={{ opacity: boxesOpacity, scale: boxesScale }} className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white overflow-hidden grid grid-cols-3 divide-x divide-slate-100">
          <div className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <ClockIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-pink-500'}`} />
            <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase">Beneficios 24/7</p>
          </div>
          <button onClick={() => document.getElementById('agenda-llamada')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <CalendarDaysIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-pink-500'}`} />
            <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase">Agenda Llamada</p>
          </button>
          <a href="https://wa.me/525519655369" target="_blank" rel="noopener noreferrer" className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-pink-500'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase">WhatsApp</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
