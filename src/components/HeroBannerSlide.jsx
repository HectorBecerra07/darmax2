import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CalendarDaysIcon
} from "@heroicons/react/24/outline";

export default function HeroBannerSlide() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-white"
      style={{
        // Fondo: Azul Agua -> Blanco -> Gris Piedra
        background: 'linear-gradient(135deg, #7dd3fc 0%, #bae6fd 30%, #f8fafc 50%, #e2e8f0 75%, #cbd5e1 100%)',
      }}
    >
      <style>{`
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal {
          animation: revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          opacity: 0;
        }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.6s; }
      `}</style>

      {/* Capa de luz orgánica */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[140px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-300 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-16 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 sm:gap-14 pb-[15svh] lg:pb-0">
        
        {/* Columna Logo */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start animate-reveal">
          <div className={`transition-all duration-700 ease-in-out ${isScrolled ? 'opacity-0 scale-50 -translate-y-20 blur-md' : 'opacity-100 scale-100 translate-y-0'}`}>
            <img
              src="/img/darmaxfoto.png"
              alt="Logo Darmax"
              className="w-[130px] sm:w-[160px] md:w-[220px] lg:w-[380px] h-auto object-contain drop-shadow-sm pointer-events-none"
            />
          </div>
        </div>

        {/* Columna Texto */}
        <div className="w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start animate-reveal delay-1">
          <h1 className="max-w-[260px] sm:max-w-none text-[32px] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-4 sm:mb-6 text-slate-900">
            Emprende Tu
            <br />
            <span style={{ color: '#168387' }}>
              Negocio
            </span>
          </h1>
          
          <p className="max-w-[240px] sm:max-w-sm md:max-w-md text-slate-700 text-[14px] sm:text-base md:text-lg font-medium leading-snug sm:leading-relaxed mb-8 sm:mb-12">
            Inicia tu emprendimiento con purificadoras, 
            máquinas vending y productos de limpieza.
          </p>

          <button
            onClick={() => document.getElementById('calculadora-negocio')?.scrollIntoView({ behavior: 'smooth' })}
            className="
              relative z-30
              inline-flex items-center justify-center
              text-white font-extrabold
              py-4 px-10 sm:py-4 sm:px-14
              rounded-full
              transition-all duration-300
              hover:scale-105
              active:scale-95
              text-[13px] sm:text-base
              uppercase tracking-widest
              shadow-lg
            "
            style={{ 
              backgroundColor: '#168387',
              boxShadow: '0 10px 25px rgba(22, 131, 135, 0.25)'
            }}
          >
            <span>CALCULA TUS GANANCIAS</span>
            <svg 
              className="ml-3 w-5 h-5 sm:w-6 sm:h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- CUADROS INFERIORES: Restaurado Icono de WhatsApp --- */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center px-4 animate-reveal delay-3">
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white overflow-hidden grid grid-cols-3 divide-x divide-slate-100">
          
          <div className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50">
            <div className="p-2 bg-[#168387]/5 rounded-xl">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#168387]" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase tracking-tighter sm:tracking-wider leading-tight">Beneficios<br className="sm:hidden"/> 24/7</p>
              <p className="hidden sm:block text-slate-500 text-[9px] font-bold uppercase opacity-70 mt-1">Ingresos siempre</p>
            </div>
          </div>

          <button 
            onClick={() => document.getElementById('agenda-llamada')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50"
          >
            <div className="p-2 bg-[#168387]/5 rounded-xl">
              <CalendarDaysIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#168387]" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase tracking-tighter sm:tracking-wider leading-tight">Agenda<br className="sm:hidden"/> Llamada</p>
              <p className="hidden sm:block text-slate-500 text-[9px] font-bold uppercase opacity-70 mt-1">Asesoría gratis</p>
            </div>
          </button>

          <a 
            href="https://wa.me/525519655369" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-2 py-4 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-colors hover:bg-slate-50/50 group"
          >
            <div className="p-2 bg-[#168387]/5 rounded-xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#168387]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-black text-slate-900 text-[9px] sm:text-[11px] uppercase tracking-tighter sm:tracking-wider leading-tight">WhatsApp</p>
              <p className="hidden sm:block text-slate-500 text-[9px] font-bold uppercase opacity-70 mt-1">Dudas ahora</p>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
