import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, ChevronDownIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import PpmNoticeModal from "./PpmNoticeModal";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function Step1SelectModel({ modelos, vendingType, categoryId, onSelect, onNext }) {
  const [hoveredSlug, setHoveredSlug] = useState(null);
  const [expandedMobileSlug, setExpandedMobileSlug] = useState(null);
  const [showPpmModal, setShowPpmModal] = useState(false);
  const [isPpmHovered, setIsPpmHovered] = useState(false);
  const [isPpmClicked, setIsPpmClicked] = useState(false);
  const isPpmExpanded = isPpmHovered || isPpmClicked;

  const isVending = categoryId === "Vending" || vendingType === VendingTypeEnum.TOUCH || vendingType === VendingTypeEnum.TRADICIONAL;

  useEffect(() => {
    if (isVending) {
      try {
        const seen = localStorage.getItem("darmax_ppm_modal_seen");
        if (!seen) {
          setShowPpmModal(true);
        }
      } catch (e) {
        console.error("Error al leer localStorage:", e);
      }
    }
  }, [isVending]);

  const handleClosePpmModal = () => {
    try {
      localStorage.setItem("darmax_ppm_modal_seen", "true");
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
    setShowPpmModal(false);
  };

  const handleClick = (modelo) => {
    onSelect(modelo);
    onNext();
  };

  const toggleMobileOsmosis = (e, slug) => {
    e.stopPropagation();
    setExpandedMobileSlug((prev) => (prev === slug ? null : slug));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight px-2">
          Elige tu modelo <br className="sm:hidden" />
          <span className="text-[#168387]">
            {vendingType === VendingTypeEnum.TOUCH ? "Touch" : 
             vendingType === VendingTypeEnum.TRADICIONAL ? "Tradicional" : 
             "Especializado"}
          </span>
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-md mx-auto px-4">
          Selecciona la base tecnológica que impulsará tu negocio. Cada modelo está diseñado para máxima eficiencia.
        </p>
      </div>

      {/* MODAL EMERGENTE DE PRIMERA VISITA SOBRE DUREZA EN PPM */}
      {isVending && (
        <PpmNoticeModal
          isOpen={showPpmModal}
          onClose={handleClosePpmModal}
        />
      )}

      {/* NOTA IMPORTANTE PARA VENDING: DUREZA EN PPM (EXPANDIBLE EN HOVER O CLIC) */}
      {isVending && (
        <motion.div
          layout
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-2xl mx-auto px-2 sm:px-0"
        >
          <div
            onClick={() => setIsPpmClicked((prev) => !prev)}
            onMouseEnter={() => setIsPpmHovered(true)}
            onMouseLeave={() => setIsPpmHovered(false)}
            className={`p-3 sm:p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl shadow-xs text-left cursor-pointer transition-all duration-300 ${
              isPpmExpanded
                ? "ring-2 ring-amber-400/40 bg-amber-50 shadow-md"
                : "hover:border-amber-300 hover:bg-amber-100/50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                  <InformationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="font-black text-amber-800 uppercase tracking-wider text-[10px] sm:text-[11px] bg-amber-500/15 px-2 py-0.5 rounded-md shrink-0">
                    Importante
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-700 truncate">
                    {isPpmExpanded
                      ? "Normativa COFEPRIS & Dureza en ppm"
                      : "Consulta la dureza en ppm de tu estado para tu modelo ideal"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 shrink-0">
                <span className="hidden sm:inline">{isPpmExpanded ? "Ocultar" : "Ver detalle"}</span>
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isPpmExpanded ? "rotate-180 text-amber-700" : "text-amber-600"
                  }`}
                />
              </div>
            </div>

            {/* Contenido expandible al hacer hover o clic */}
            <AnimatePresence initial={false}>
              {isPpmExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-2.5 border-t border-amber-200/70">
                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                      Consulta la dureza en <strong className="text-slate-900 font-semibold">ppm (partes por millón)</strong> de tu estado para identificar tu modelo ideal, si el agua supera los <strong className="text-slate-900 font-semibold">500 ppm</strong> la <strong className="text-amber-800 font-bold">COFEPRIS solicita tener ósmosis inversa</strong>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 max-w-2xl mx-auto px-2 sm:px-0"
      >
        {modelos.map((item) => {
          const rawText = `${item?.name || ""} ${item?.description || ""} ${item?.slug || ""}`
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          const isLimpieza =
            categoryId === "Vending-Limpieza" ||
            rawText.includes("limpieza") ||
            rawText.includes("vending5") ||
            rawText.includes("vending8");
          const hasOsmosis = !isLimpieza && rawText.includes("osmosis");
          const hasSixProcesses = !isLimpieza && !hasOsmosis;
          const hasDynamicText = hasOsmosis || hasSixProcesses;

          const isHovered = hoveredSlug === item.slug;
          const isMobileExpanded = expandedMobileSlug === item.slug;
          const isExpanded = hasDynamicText && (isHovered || isMobileExpanded);

          return (
            <motion.div
              key={item.slug}
              layout
              transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.99 }}
              onMouseEnter={() => setHoveredSlug(item.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className={`group relative bg-white border rounded-xl p-4 sm:p-5 transition-colors duration-300 cursor-pointer overflow-hidden ${
                isExpanded
                  ? "border-[#168387] shadow-xl shadow-cyan-900/10 ring-1 ring-[#168387]/25"
                  : "border-slate-100 hover:border-[#24d4da] hover:shadow-xl hover:shadow-cyan-900/5"
              }`}
              onClick={() => handleClick(item)}
            >
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight group-hover:text-[#168387] transition-colors">
                      {item.name}
                    </h3>
                    {item.isNew && (
                      <span className="bg-cyan-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest shrink-0">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Reemplazo dinamico de descripcion en hover o toque movil */}
                  <div className="w-full relative">
                    <AnimatePresence initial={false} mode="popLayout">
                      {isExpanded ? (
                        <motion.div
                          key={hasOsmosis ? "osmosis" : "six-processes"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="w-full text-left"
                        >
                          {hasOsmosis ? (
                            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal pr-2 sm:pr-4">
                              Este modelo cuenta con <strong className="text-[#168387] font-bold">ósmosis inversa</strong> como séptimo proceso de purificación el cual se encarga de brindar un agua Premium compitiendo en calidad con marcas de prestigio mediante una membrana que quita metales pesados y exceso de sales.
                            </p>
                          ) : (
                            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal pr-2 sm:pr-4">
                              Consta de <strong className="text-[#168387] font-bold">6 procesos de purificación</strong> los cuales pueden ser suficientes para un agua de calidad dependiendo el estado de la república.
                            </p>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="desc"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="w-full text-left"
                        >
                          <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed pr-2 sm:pr-4">
                            {item.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Boton tactil exclusivo para movil en modelos con informacion de purificacion */}
                  {hasDynamicText && (
                    <div className="mt-2.5 sm:hidden">
                      <button
                        type="button"
                        onClick={(e) => toggleMobileOsmosis(e, item.slug)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95 ${
                          isMobileExpanded
                            ? "bg-[#168387] text-white shadow-sm"
                            : "bg-[#168387]/10 text-[#168387] border border-[#168387]/20"
                        }`}
                      >
                        <InformationCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {hasOsmosis
                            ? (isMobileExpanded ? "Ocultar detalle de ósmosis" : "¿Qué incluye la ósmosis?")
                            : (isMobileExpanded ? "Ocultar procesos" : "¿Cuántos procesos incluye?")}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 sm:pl-6 sm:border-l border-slate-100 shrink-0 self-center">
                  <div className="text-left sm:text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">
                      Inversión
                    </span>
                    <p className="text-base sm:text-xl font-black text-slate-900 tracking-tighter">
                      ${item.basePrice.toLocaleString()}
                      <span className="text-[10px] ml-1 text-slate-400 font-bold uppercase">MXN</span>
                    </p>
                  </div>
                  <div className="bg-slate-50 group-hover:bg-[#24d4da] group-hover:text-white p-2 rounded-lg transition-all duration-300">
                    <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
