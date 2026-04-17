import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function Step2ModelDetails({ modelo, vendingType, onNext, onBack }) {
  const [openSection, setOpenSection] = useState(0);

  const precioBase = Number(modelo?.basePrice ?? 0);
  const caracteristicas = modelo?.features || [];

  const groupSize = Math.ceil(caracteristicas.length / 2);
  const groups = [
    { title: "Especificaciones Técnicas", items: caracteristicas.slice(0, groupSize) },
    { title: "Sistemas Incluidos", items: caracteristicas.slice(groupSize) }
  ];

  return (
    <section className="w-full pb-20 sm:pb-0">
      <div className="bg-white border border-slate-100 rounded-xl shadow-2xl shadow-slate-200/50 p-5 sm:p-8 space-y-6">
        
        <header className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">
              {modelo?.name ?? "—"}
            </h3>
            <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
              {vendingType}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
            {modelo?.description}
          </p>
        </header>
        {/* Acordeones Micro-Atomic */}
        <div className="space-y-0 border-t border-slate-100">
          {groups.map((group, idx) => (
            <div key={idx} className="border-b border-slate-50">
              <button
                onClick={() => setOpenSection(openSection === idx ? null : idx)}
                className="w-full flex justify-between items-center py-1 group hover:bg-slate-50/20 transition-colors px-0.5"
              >
                <span className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-slate-600 transition-colors">
                  {group.title}
                </span>
                <ChevronDownIcon 
                  className={`w-2 h-2 text-slate-300 transition-transform duration-300 ${openSection === idx ? 'rotate-180 text-[#168387]' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openSection === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-1 pt-0 px-0.5 grid grid-cols-1 gap-0.5">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-1 text-slate-400">
                          <div className="w-0.5 h-0.5 rounded-full bg-slate-300 shrink-0" />
                          <span className="text-[8px] sm:text-[10px] font-medium leading-none truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Inversión Inicial
            </span>
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter leading-none">
              ${precioBase.toLocaleString()}
              <span className="text-xs sm:text-sm ml-1 text-slate-400 font-bold uppercase tracking-normal">MXN</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition"
          >
            Atrás
          </button>
          <button
            onClick={onNext}
            className="flex-[2] px-4 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#24d4da] transition-all shadow-lg shadow-slate-900/10"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}
