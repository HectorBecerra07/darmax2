import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

export default function CarouselImages({ images = [], modelName = "", isCleaning = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasMultiple = images.length > 1;

  // Cambio automático cada 5 segundos solo cuando hay múltiples vistas
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [hasMultiple, images.length]);

  const handlePrev = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (images && images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);

  const accentBadgeClasses = isCleaning
    ? "text-[#3a9608] border-[#d9f4c4] bg-[#f4fceb]"
    : "text-[#00949f] border-[#ccf7fd] bg-[#effdff]";
  const accentDotClass = isCleaning ? "bg-[#53c406]" : "bg-[#00949f]";

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col gap-2 max-w-xl mx-auto lg:max-w-none">
        <div className="border-2 border-slate-200/90 rounded-[36px] shadow-sm overflow-hidden bg-gradient-to-b from-white via-white to-[#f1f5f9] pt-1.5 px-1.5 pb-4">
          <div className="w-full min-h-[260px] sm:min-h-[320px] rounded-[28px] bg-slate-100/70 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-xl mx-auto lg:max-w-none">
      {/* Chip/Badge superior consistente con el Paso 3 */}
      <div className="flex items-center text-left">
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border shadow-2xs ${accentBadgeClasses}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${accentDotClass}`} />
          Vista del modelo
        </span>
      </div>

      {/* Tarjeta única unificada (mismo estilo de marco que Paso 3 / Adicional) */}
      <div className="border-2 border-slate-200/90 rounded-[36px] shadow-sm overflow-hidden flex flex-col bg-gradient-to-b from-white via-white to-[#f1f5f9] pt-1.5 px-1.5">
        <div className="relative w-full overflow-hidden rounded-[28px] flex items-center justify-center bg-white/70 group">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[currentIndex] || currentIndex}
              src={optimizeCloudinaryUrl(images[currentIndex], 900)}
              alt={modelName ? `${modelName} - Vista ${currentIndex + 1}` : `Imagen ${currentIndex + 1}`}
              loading="eager"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain block"
            />
          </AnimatePresence>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Imagen anterior"
                className="absolute top-1/2 left-3 -translate-y-1/2 z-20 bg-white/85 backdrop-blur-md hover:bg-white text-slate-700 p-2 rounded-full border border-slate-200/70 shadow-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Siguiente imagen"
                className="absolute top-1/2 right-3 -translate-y-1/2 z-20 bg-white/85 backdrop-blur-md hover:bg-white text-slate-700 p-2 rounded-full border border-slate-200/70 shadow-sm transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-2xs">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentIndex
                        ? `${accentDotClass} w-5`
                        : "bg-slate-300 w-1.5 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pie dentro del mismo contenedor unificado */}
        {modelName && (
          <div className="flex items-center gap-3 pt-3.5 pb-4 sm:pt-4 sm:pb-5 px-4 sm:px-5">
            <span className={`w-0.5 h-9 rounded-full shrink-0 ${accentDotClass}`} />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium leading-none">
                Modelo seleccionado
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate mt-1 leading-tight">
                {modelName}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
