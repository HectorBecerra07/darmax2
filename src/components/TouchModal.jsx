import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

export default function TouchModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleVerCatalogo = () => {
    onClose();
    navigate("/configurar-maquina/Vending?tipo=touch");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fondo oscuro con desenfoque suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Tarjeta del modal en blanco puro para resaltar el equipo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-white border border-cyan-100 rounded-[2.5rem] shadow-2xl shadow-cyan-950/20 overflow-hidden z-10 p-6 sm:p-10"
          >
            {/* Luces sutiles de fondo */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-100/60 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-50/70 rounded-full blur-[80px] pointer-events-none" />

            {/* Boton de cierre */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Cerrar ventana"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
              {/* Columna visual: Imagen estatica y de gran tamano */}
              <div className="md:col-span-6 flex flex-col items-center justify-center relative py-2 sm:py-4">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-100/70 to-teal-50/50 absolute -z-10 blur-xl" />
                
                <img
                  src={optimizeCloudinaryUrl("https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/touch_atlantis_max_a2hi0p.png", 1000)}
                  alt="Modelo Atlantis Touch Max"
                  className="w-60 sm:w-72 md:w-80 lg:w-88 h-auto max-h-[400px] sm:max-h-[460px] object-contain drop-shadow-[0_20px_35px_rgba(22,131,135,0.22)]"
                />

                <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#168387] text-[10px] font-black uppercase tracking-widest shadow-sm">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#168387]" /> Edición 2026
                </span>
              </div>

              {/* Columna de contenido */}
              <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#168387] text-[10px] font-black uppercase tracking-widest mb-3 shadow-xs">
                  Tecnología Exclusiva
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                  Conoce nuestro nuevo <span className="text-[#168387]">modelo Touch</span>
                </h3>

                <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-6 sm:mb-8">
                  Nuevo modelo innovador y único en el mercado con beneficios exclusivos.
                </p>

                {/* Boton de accion unico que dirige a configurar Vending */}
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleVerCatalogo}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-full bg-[#168387] hover:bg-[#11696c] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Ver en Catálogo</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
