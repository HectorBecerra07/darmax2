import React from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function Step1SelectModel({ modelos, vendingType, categoryId, onSelect, onNext }) {
  const isVending = categoryId === "Vending" || vendingType === VendingTypeEnum.TOUCH || vendingType === VendingTypeEnum.TRADICIONAL;

  const handleClick = (modelo) => {
    onSelect(modelo);
    onNext();
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

      {/* NOTA IMPORTANTE PARA VENDING: DUREZA EN PPM */}
      {isVending && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto p-3.5 sm:p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl flex items-start sm:items-center gap-3 shadow-sm text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <InformationCircleIcon className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong className="font-black text-amber-700 uppercase tracking-wider text-[11px] sm:text-xs mr-1">
              Importante:
            </strong>
            Consulta la dureza en ppm (partes por millón) de tu estado para identificar tu modelo ideal.
          </p>
        </motion.div>
      )}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 max-w-2xl mx-auto px-2 sm:px-0"
      >
        {modelos.map((item) => (
          <motion.div
            key={item.slug}
            variants={itemVariants}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.99 }}
            className="group relative bg-white border border-slate-100 rounded-xl p-4 sm:p-5 hover:border-[#24d4da] hover:shadow-xl hover:shadow-cyan-900/5 transition-all cursor-pointer overflow-hidden"
            onClick={() => handleClick(item)}
          >
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight group-hover:text-[#168387] transition-colors truncate">
                    {item.name}
                  </h3>
                  {item.isNew && (
                    <span className="bg-cyan-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                      Nuevo
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed line-clamp-1 pr-10">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:pl-6 sm:border-l border-slate-100">
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
        ))}
      </motion.div>
    </div>
  );
}
