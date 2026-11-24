import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MODEL_SPECS } from "../utils/modelSpecs";

const VendingTypeEnum = {
  TRADICIONAL: "TRADICIONAL",
  TOUCH: "TOUCH",
  NONE: "NONE",
};

export default function Step2ModelDetails({ modelo, vendingType, onNext, onBack }) {
  const [openSection, setOpenSection] = useState(0);

  const precioBase = Number(modelo?.basePrice ?? 0);
  const modelData = MODEL_SPECS[modelo?.slug];
  const caracteristicas = modelData ? modelData.specs : (modelo?.features || []);

  const rawText = `${modelo?.slug || ""} ${modelo?.name || ""} ${modelo?.description || ""}`.toLowerCase();
  const isCleaning =
    rawText.includes("clean") ||
    rawText.includes("limpieza") ||
    rawText.includes("vending5") ||
    rawText.includes("vending8");

  const groupSize = Math.ceil(caracteristicas.length / 2);
  const groups = [
    { title: "Especificaciones Técnicas", items: caracteristicas.slice(0, groupSize) },
    { title: "Sistemas Incluidos", items: caracteristicas.slice(groupSize) },
  ].filter((g) => g.items.length > 0);

  const badgeLabel = isCleaning
    ? rawText.includes("8")
      ? "8 Productos"
      : "5 Productos"
    : vendingType && vendingType !== VendingTypeEnum.NONE
    ? vendingType
    : rawText.includes("osmosis") || rawText.includes("ósmosis") || rawText.includes("aplus")
    ? "Ósmosis Inversa"
    : "Purificación";

  const renderHeadingTitle = () => {
    if (isCleaning) {
      const suffix = rawText.includes("8") ? "Vending 8 Productos" : "Vending 5 Productos";
      return (
        <>
          <span className="text-[#031638]">Darmax Clean </span>
          <span className="bg-gradient-to-r from-[#2f8507] via-[#53c406] to-[#7cd413] bg-clip-text text-transparent inline-block">
            {suffix}
          </span>
        </>
      );
    }
    return <span className="text-[#031638]">{modelo?.name ?? "—"}</span>;
  };

  return (
    <section className="w-full pb-24 font-montserrat not-italic text-left">
      <div className="space-y-5">
        {/* Encabezado del paso consistente con Step 3 */}
        <header className="space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span
              className={`font-bold tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-sm uppercase ${
                isCleaning ? "text-[#53c406]" : "text-[#00949f]"
              }`}
            >
              DETALLES DEL MODELO
            </span>
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isCleaning
                  ? "bg-[#f4fceb] text-[#3a9608] border border-[#d9f4c4]"
                  : "bg-[#effdff] text-[#007481] border border-[#ccf7fd]"
              }`}
            >
              {badgeLabel}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            {renderHeadingTitle()}
          </h2>

          {modelo?.description && (
            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
              {modelo.description}
            </p>
          )}
        </header>

        {/* Acordeones limpios en tarjetas redondeadas */}
        {groups.length > 0 && (
          <div className="space-y-3">
            {groups.map((group, idx) => {
              const isOpen = openSection === idx;
              const activeCardClass = isCleaning
                ? "bg-[#f4fceb]/60 border-[#53c406]/50 ring-1 ring-[#53c406]/15 shadow-xs"
                : "bg-[#effdff]/70 border-[#00949f]/60 ring-1 ring-[#00949f]/15 shadow-xs";

              return (
                <div
                  key={group.title}
                  className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isOpen
                      ? activeCardClass
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isCleaning ? "bg-[#53c406]" : "bg-[#00949f]"
                        }`}
                      />
                      <span className="font-bold text-[#031638] text-sm sm:text-[15px] leading-snug">
                        {group.title}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? `rotate-180 ${isCleaning ? "text-[#3a9608]" : "text-[#007481]"}`
                          : "text-slate-400"
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`group-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="px-4 pb-4 sm:px-5 sm:pb-4.5 pt-2 border-t border-slate-200/60 space-y-2">
                          {group.items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-600 leading-relaxed font-normal"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                                  isCleaning ? "bg-[#53c406]" : "bg-[#00949f]"
                                }`}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Tarjeta de Inversión Inicial */}
        <div className="rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-2xs flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
              Inversión Inicial
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Equipo base listo para configurar extras
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-[#0b4e5f] tracking-tight whitespace-nowrap">
            ${precioBase.toLocaleString()}
            <span className="text-xs ml-1 text-slate-500 font-bold uppercase">MXN</span>
          </p>
        </div>
      </div>

      {/* Barra de Acciones Fija Inferior consistente con el Step 3 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2.5 min-w-0 flex-1 pr-4">
            <span
              className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${
                isCleaning ? "bg-[#53c406]" : "bg-[#00949f]"
              }`}
            />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block leading-none mb-0.5">
                Tu configuración en curso:
              </span>
              <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                {modelo?.name ?? "—"} • ${precioBase.toLocaleString()} MXN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 sm:flex-none sm:min-w-[120px] px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition cursor-pointer text-center"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={onNext}
              className={`flex-[2] sm:flex-none sm:min-w-[220px] px-6 py-3 rounded-xl text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer text-center ${
                isCleaning
                  ? "bg-gradient-to-r from-[#133909] via-[#53c406] to-[#90e119] hover:opacity-95"
                  : "bg-gradient-to-r from-[#022447] via-[#02274b] to-[#01949f] hover:opacity-95"
              }`}
            >
              <span className="sm:hidden">Continuar</span>
              <span className="hidden sm:inline">Configurar extras</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
