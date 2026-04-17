import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselImages({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full max-w-3xl h-[220px] sm:h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-2xl border-2 border-[#24d4da]/20 mx-auto group bg-white">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full h-full object-contain bg-slate-50/30"
        />
      </AnimatePresence>

      {/* Botón Izquierda Translúcido */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-cyan-500/10 backdrop-blur-md hover:bg-cyan-500 text-cyan-600 hover:text-white p-2 rounded-xl border border-cyan-500/20 shadow-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Botón Derecha Translúcido */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-cyan-500/10 backdrop-blur-md hover:bg-cyan-500 text-cyan-600 hover:text-white p-2 rounded-xl border border-cyan-500/20 shadow-lg transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots con estilo branding */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2.5">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full cursor-pointer transition-all duration-500 ${
              index === currentIndex ? "bg-cyan-500 w-6 shadow-[0_0_10px_rgba(36,212,218,0.5)]" : "bg-slate-200 w-1.5 hover:bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
