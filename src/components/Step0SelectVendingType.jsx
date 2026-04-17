import React from "react";
import { motion } from "framer-motion";

const VendingTypeEnum = {
  TRADICIONAL: 'TRADICIONAL',
  TOUCH: 'TOUCH',
  NONE: 'NONE',
};

export default function Step0SelectVendingType({ onSelect, availableVendingTypes, getVendingTypeImage }) {
  const displayNames = {
    [VendingTypeEnum.TOUCH]: "Touch",
    [VendingTypeEnum.TRADICIONAL]: "Tradicional",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex items-start min-h-[calc(100vh-250px)] sm:min-h-[calc(100vh-350px)] w-full pt-1 sm:pt-4 pb-12">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-20 px-4 sm:px-10">
        
        {/* Título a la Izquierda */}
        <div className="w-full lg:w-[35%] text-center lg:text-left space-y-4 lg:sticky lg:top-40">
          <h2 className="text-3xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] sm:leading-tight">
            Selecciona tu <br />
            <span className="text-[#168387]">vending</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-md mx-auto lg:mx-0">
            Cada tecnología está diseñada para objetivos de negocio diferentes. Elige la que mejor se adapte a tu visión.
          </p>
          
          {/* Indicador de progreso visual sutil */}
          <div className="hidden lg:flex items-center gap-4 pt-6">
            <div className="h-1 w-20 bg-[#168387] rounded-full" />
            <div className="h-1 w-10 bg-slate-100 rounded-full" />
            <div className="h-1 w-10 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* Tarjetas a la Derecha */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full lg:w-[65%] grid grid-cols-2 gap-3 sm:gap-8"
        >
          {availableVendingTypes.map((type) => (
            <motion.div
              key={type}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.97 }}
              className="group relative bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 hover:border-[#24d4da] hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col items-center overflow-hidden"
              onClick={() => onSelect(type)}
            >
              <div className="relative z-10 w-full flex flex-col items-center space-y-4 sm:space-y-6">
                {/* Imagen ajustada */}
                <div className="relative h-32 sm:h-72 w-full flex items-center justify-center">
                  <img 
                    src={getVendingTypeImage(type)} 
                    alt={displayNames[type]} 
                    className="max-h-full w-auto object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="text-xs sm:text-2xl font-black text-slate-800 tracking-tighter group-hover:text-[#168387] transition-colors uppercase sm:normal-case">
                    {displayNames[type]}
                  </h3>
                  <div className="h-0.5 w-6 sm:w-12 bg-slate-100 mx-auto rounded-full group-hover:bg-[#24d4da] group-hover:w-full transition-all duration-500" />
                </div>

                {/* Botón Compacto */}
                <div className="hidden sm:block pt-2">
                  <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-[#24d4da] transition-colors">
                    Configurar vending
                  </span>
                </div>
                
                {/* Indicador móvil */}
                <span className="sm:hidden text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Seleccionar
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
