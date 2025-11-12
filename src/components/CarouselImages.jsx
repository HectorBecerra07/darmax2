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
    <div className="relative w-full max-w-5xl h-[300px] sm:h-[400px] md:h-[550px] overflow-hidden rounded-3xl shadow-2xl border mx-auto group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Botón Izquierda */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-lg transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Botón Derecha */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black p-2 rounded-full shadow-lg transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots con barra de progreso */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentIndex ? "bg-[#24d4da]" : "bg-gray-300"
            }`}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-[#24d4da]/40 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
