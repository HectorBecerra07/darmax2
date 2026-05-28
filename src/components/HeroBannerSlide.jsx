import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Parallax from 'parallax-js';
import { useSettings } from '../context/SettingsContext';
import { 
  ClockIcon, 
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

const Typewriter = ({ text, delay = 0.03, className }) => {
  return (
    <motion.span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: index * delay,
            ease: "easeIn"
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

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
      
      {/* FONDO DINÁMICO (Imagen bannerwater para Agua / Gradiente para Clean) */}
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
            transition={{ duration: 1.5 }}
            style={{ y: videoY, scale: isExiting ? 2.5 : 1.1 }}
            className="absolute inset-0 z-0 bg-white flex items-center justify-center overflow-hidden"
          >
            <img 
              src="https://res.cloudinary.com/defkuaytw/image/upload/v1776407496/fondo_gotas_jrtijk.png" 
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
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start pt-16 sm:pt-0">
                <div className={`transition-all duration-700 ease-in-out ${isScrolled ? 'opacity-0 scale-50 -translate-y-10' : 'opacity-100 scale-100 translate-y-0'}`}>
                  <AnimatePresence mode="wait">
                    {mode === 'agua' ? (
                      <motion.div 
                        key="vending-montage"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-6 sm:gap-10 relative"
                      >
                        {/* Glow de Fondo (Agua) */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                          className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center -z-10"
                        >
                          <div className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] bg-gradient-to-tr from-[#5188C9] to-[#93C5FD] rounded-full blur-[80px] sm:blur-[100px] mix-blend-multiply opacity-70 animate-pulse" />
                        </motion.div>

                        {/* Imágenes de Vendings Inclinadas (Efecto 3D / Perspectiva) */}
                        <div className="relative flex items-center justify-center -space-x-16 sm:-space-x-24 perspective-[1000px]">
                          <motion.img 
                            initial={{ rotateY: -45, x: -50, opacity: 0 }}
                            animate={{ rotateY: -25, x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                            src="https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/tradicional_atlantis_max_umqitz.png" 
                            alt="Atlantis Tradicional Max"
                            className="w-[140px] sm:w-[200px] md:w-[260px] lg:w-[320px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10" 
                          />
                          <motion.img 
                            initial={{ rotateY: 45, x: 50, opacity: 0 }}
                            animate={{ rotateY: 25, x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            src="https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/touch_atlantis_max_a2hi0p.png" 
                            alt="Atlantis Touch Max"
                            className="w-[120px] sm:w-[180px] md:w-[230px] lg:w-[290px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20" 
                          />
                        </div>
                        {/* Logo original de la Navbar debajo (Solo en Escritorio) */}
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          src="/img/logos/logonegro.png" 
                          alt="Darmax Logo"
                          className="hidden lg:block w-[120px] sm:w-[160px] md:w-[220px] h-auto object-contain brightness-110" 
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="vending-clean-montage"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 40 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center gap-2 sm:gap-0 lg:translate-x-8"
                      >
                        {/* Imágenes de Vendings de Limpieza */}
                        <div className="flex items-center justify-center -space-x-16 sm:-space-x-24 perspective-[1000px] -translate-y-6 sm:-translate-y-8">
                          <motion.img 
                            initial={{ rotateY: -45, x: -50, opacity: 0 }}
                            animate={{ rotateY: -25, x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                            src="https://res.cloudinary.com/defkuaytw/image/upload/v1779936687/8_productos_ayggvi.png" 
                            alt="Vending Clean 8"
                            className="w-[140px] sm:w-[200px] md:w-[260px] lg:w-[260px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10" 
                          />
                          <motion.img 
                            initial={{ rotateY: 45, x: 50, opacity: 0 }}
                            animate={{ rotateY: 25, x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                            src="https://res.cloudinary.com/defkuaytw/image/upload/v1779936686/5_productos_qjhieo.png" 
                            alt="Vending Clean 5"
                            className="w-[120px] sm:w-[180px] md:w-[230px] lg:w-[230px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20" 
                          />
                        </div>
                        {/* Logo Clean debajo (Solo en Escritorio) */}
                        <motion.img 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          src="/img/LogoClean.png" 
                          alt="Darmax Clean Logo"
                          className="hidden lg:block w-[100px] sm:w-[130px] md:w-[180px] h-auto object-contain brightness-110 -mt-8 sm:-mt-12" 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

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
                      <h1 className="max-w-[320px] sm:max-w-none text-[34px] sm:text-[42px] leading-[1.1] md:text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-3 sm:mb-6 text-slate-900 drop-shadow-sm">
                        {mode === 'agua' ? (
                          <>
                            <Typewriter text="Emprende Tu" /><br />
                            <Typewriter text="Negocio" className="text-[#168387]" />
                          </>
                        ) : (
                          <>
                            <Typewriter text="Emprende Con" /><br />
                            <Typewriter text="Productos De Limpieza" className="text-[#e7b341]" />
                          </>
                        )}
                      </h1>
                      <p className="max-w-[280px] sm:max-w-sm md:max-w-md text-slate-800 text-[16px] sm:text-lg md:text-xl font-bold mb-6 sm:mb-12 leading-relaxed">
                        {mode === 'agua' 
                          ? <Typewriter text="Inicia tu emprendimiento con purificadoras, máquinas vending de agua y productos de limpieza." />
                          : <Typewriter text="Automatiza la venta de productos de limpieza con nuestra tecnología Vending Clean." />}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  <button
                    onClick={handleCTA}
                    className="relative z-30 inline-flex items-center justify-center text-white font-extrabold py-3.5 px-8 sm:py-4 sm:px-14 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 text-[12px] sm:text-base uppercase tracking-widest shadow-xl animate-btn-pulse"
                    style={{ 
                      backgroundColor: mode === 'agua' ? '#168387' : '#e7b341', 
                      boxShadow: mode === 'agua' ? '0 10px 25px rgba(22, 131, 135, 0.4)' : '0 10px 25px rgba(231, 179, 65, 0.4)'
                    }}
                  >
                    <span>CONFIGURA TU {mode === 'agua' ? 'NEGOCIO' : 'NEGOCIO'}</span>
                    <svg className="ml-2 sm:ml-3 w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* CUADROS INFERIORES (Ocultos en móvil, visibles en escritorio) */}
      <motion.div style={{ opacity: boxesOpacity, scale: boxesScale }} className="hidden lg:flex absolute bottom-6 left-0 right-0 z-30 justify-center px-4">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white overflow-hidden grid grid-cols-3 divide-x divide-slate-200">
          <div className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <ClockIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-xs uppercase">Beneficios 24/7</p>
          </div>
          <button onClick={() => document.getElementById('agenda-llamada')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <CalendarDaysIcon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} />
            <p className="font-black text-slate-900 text-xs uppercase">Agenda Llamada</p>
          </button>
          <a href="https://wa.me/525519655369" target="_blank" rel="noopener noreferrer" className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <svg className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-1000 ${mode === 'agua' ? 'text-[#168387]' : 'text-[#e7b341]'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <p className="font-black text-slate-900 text-xs uppercase">WhatsApp</p>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
