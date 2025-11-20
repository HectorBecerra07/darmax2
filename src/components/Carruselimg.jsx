import React, { useEffect, useRef, useState } from "react";

const imagenes = [
  "/img/trabajos/trabajos1.jpg",
  "/img/trabajos/trabajos2.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos4.jpg",
  "/img/trabajos/trabajos5.jpg",
  "/img/trabajos/trabajos6.jpg",
  "/img/trabajos/trabajos7.jpg",
];

export default function CarruselResponsive() {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [hover, setHover] = useState(false);

  // =========================
  // LÓGICA DEL CARRUSEL (Mantenida y Optimizada)
  // =========================
  const recalc = () => {
    const el = trackRef.current;
    if (!el) return;
    const total = el.scrollWidth;
    const view = el.clientWidth;
    const p = Math.max(1, Math.ceil(total / view));
    setPages(p);
    const newPage = Math.round(el.scrollLeft / view);
    setPage(Math.min(p - 1, Math.max(0, newPage)));
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("resize", recalc);
      ro.disconnect();
    };
  }, []);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const view = el.clientWidth;
    setPage(Math.round(el.scrollLeft / view));
  };

  const goTo = (n) => {
    const el = trackRef.current;
    if (!el) return;
    const view = el.clientWidth;
    const next = Math.min(pages - 1, Math.max(0, n));
    el.scrollTo({ left: next * view, behavior: "smooth" });
    setPage(next);
  };

  const prev = () => goTo(page - 1);
  const next = () => goTo(page + 1);

  // Autoplay inteligente
  useEffect(() => {
    if (hover) return;
    const id = setInterval(() => {
      goTo((page + 1) % pages);
    }, 4000); // Un poco más lento para apreciar las imágenes
    return () => clearInterval(id);
  }, [page, pages, hover]);

  // Soporte Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (hover) { // Solo activar si el usuario está interactuando cerca o viendo
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="w-full bg-[#Fbfbfd] py-20 px-4 overflow-hidden selection:bg-[#24d4da] selection:text-white">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-visible">
             <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#24d4da]/5 rounded-full blur-3xl" />
             <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        {/* Header de Sección */}
        <div className="text-center mb-14 relative z-10">
           <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
              Galería de Proyectos
           </span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Nuestros Trabajos
           </h2>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Gradientes laterales para indicar scroll (fade out) */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#Fbfbfd] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#Fbfbfd] to-transparent z-10" />

          {/* BOTONES DE NAVEGACIÓN MEJORADOS */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="hidden md:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-[#24d4da] hover:text-white hover:border-transparent hover:shadow-[#24d4da]/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 ml-[-2px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Siguiente"
            className="hidden md:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 text-slate-400 transition-all duration-300 hover:scale-110 hover:bg-[#24d4da] hover:text-white hover:border-transparent hover:shadow-[#24d4da]/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 mr-[-2px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* TRACK DEL CARRUSEL */}
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="
              flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth py-8 px-4
              [-ms-overflow-style:none] [scrollbar-width:none]
            "
            style={{ scrollbarWidth: "none" }}
          >
            {/* Spacer inicial para centrado visual en móviles */}
            <div className="w-[1px] flex-shrink-0" /> 
            
            {imagenes.map((src, idx) => (
              <article
                key={idx}
                className="
                  relative snap-center flex-shrink-0
                  basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[32%]
                  rounded-[2rem] overflow-hidden bg-white 
                  shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] 
                  border border-slate-100
                  transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(36,212,218,0.15)]
                  group/card cursor-grab active:cursor-grabbing
                "
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  {/* Overlay sutil en hover */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover/card:bg-slate-900/10 transition-colors duration-500 z-10" />
                  
                  <img
                    src={src}
                    alt={`Trabajo Darmax ${idx + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                    onLoad={recalc}
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=Imagen+No+Disponible";
                    }}
                  />
                  
                  {/* Badge flotante opcional */}
                  <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500">
                     <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        Proyecto #{idx + 1}
                     </span>
                  </div>
                </div>
              </article>
            ))}
            
             {/* Spacer final */}
             <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* DOTS DE NAVEGACIÓN */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  page === i 
                    ? "w-8 bg-[#24d4da] shadow-[0_0_10px_#24d4da]" 
                    : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}