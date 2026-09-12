import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, InformationCircleIcon, CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function PpmNoticeModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Tarjeta del modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white border border-amber-200/80 rounded-3xl shadow-2xl shadow-slate-950/20 overflow-hidden z-10 p-6 sm:p-8 text-left"
          >
            {/* Luces sutiles de fondo en ámbar */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-100/70 rounded-full blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-50/70 rounded-full blur-[60px] pointer-events-none" />

            {/* Botón de cierre */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>

            <div className="relative z-10 space-y-4 sm:space-y-5">
              {/* Encabezado con icono y badge */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <InformationCircleIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-md">
                    Aviso Importante
                  </span>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                    Normativa Oficial de Salud
                  </p>
                </div>
              </div>

              {/* Titulo */}
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                ¿Conoces la dureza del agua en tu estado?
              </h3>

              {/* Mensaje principal */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                Consulta la dureza en <strong className="text-slate-900 font-semibold">ppm (partes por millón)</strong> de tu estado para identificar tu modelo ideal, si el agua supera los <strong className="text-slate-900 font-semibold">500 ppm</strong> la <strong className="text-amber-800 font-bold">COFEPRIS solicita tener ósmosis inversa</strong>.
              </div>

              {/* Comparativa visual rapida */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-slate-700 font-bold text-xs mb-1">
                    <CheckCircleIcon className="w-4 h-4 text-[#168387] shrink-0" />
                    <span>≤ 500 ppm</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Suficiente con <strong className="text-slate-700">6 procesos</strong> de purificación estándar.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200/80 flex flex-col justify-between">
                  <div className="flex items-center gap-1 text-[#168387] font-bold text-xs mb-1">
                    <SparklesIcon className="w-4 h-4 text-[#168387]" />
                    <span>&gt; 500 ppm</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Requiere <strong className="text-[#168387]">Ósmosis Inversa</strong> (7.° proceso Premium).
                  </p>
                </div>
              </div>

              {/* Botón de acción */}
              <button
                type="button"
                onClick={onClose}
                className="w-full mt-2 py-3 px-5 rounded-xl bg-[#168387] hover:bg-[#11676a] text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-950/15 transition-all cursor-pointer text-center"
              >
                Entendido, ver modelos
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
