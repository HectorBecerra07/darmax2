import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const phoneNumber = "525519655369";
  const questions = [
    "Quiero Iniciar mi negocio.",
    "Quisiera saber más sobre sus productos.",
    "¿Cuáles son los métodos de pago aceptados?",
    "¿Realizan envíos a domicilio y cuál es el costo?",
    "Necesito ayuda con un pedido existente."
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (isHome) {
        setIsVisible(window.scrollY > 300);
      } else {
        setIsVisible(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <div 
      className={`fixed bottom-8 right-6 z-[60] transition-all duration-700 ease-in-out ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-50 translate-y-10 pointer-events-none'
      }`}
    >
      <style>{`
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        .animate-whatsapp-pulse {
          animation: pulse-green 2s infinite;
        }
      `}</style>

      {/* MENÚ DE PREGUNTAS */}
      {isOpen && (
        <div className="absolute bottom-full right-0 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 mb-6 w-72 border border-slate-50 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <p className="font-bold text-slate-900 tracking-tight">¿En qué podemos ayudarte?</p>
          </div>
          <ul className="space-y-2.5">
            {questions.map((question, index) => {
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(question)}`;
              return (
                <li key={index}>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-slate-600 hover:text-[#128C7E] font-semibold block p-3 rounded-xl bg-slate-50 hover:bg-green-50 transition-all border border-transparent hover:border-green-100"
                  >
                    {question}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-50" />
        </div>
      )}
      
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contactar por WhatsApp"
        className="group relative w-16 h-16 sm:w-18 sm:h-18 transition-all duration-300 active:scale-90"
      >
        {/* Anillo de Pulso */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-whatsapp-pulse opacity-50" />
        
        {/* Cuerpo del Botón con Degradado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-lg group-hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
        </div>
        
        {/* ICONO SVG (Mismo que el Hero) en Blanco */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-300">
          <svg 
            className="w-full h-full text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.57-.074 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.87 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </button>
    </div>
  );
}
