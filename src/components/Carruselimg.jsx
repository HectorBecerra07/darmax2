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

  // Recalcular número de páginas según el ancho disponible
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

  // Actualizar página al hacer scroll manual
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const view = el.clientWidth;
    setPage(Math.round(el.scrollLeft / view));
  };

  // Navegación
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

  // Autoplay (pausa al pasar el mouse o al interactuar)
  useEffect(() => {
    if (hover) return;
    const id = setInterval(() => {
      goTo((page + 1) % pages);
    }, 3500);
    return () => clearInterval(id);
  }, [page, pages, hover]);

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="w-full bg-gradient-to-b from-white-50 to-white py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-8">
          Nuestros trabajos
        </h2>

        <div
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* Gradientes de máscara laterales */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Botones mejorados */}
<button
  onClick={prev}
  aria-label="Anterior"
  className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300 rounded-full w-11 h-11 shadow-lg border border-gray-300 backdrop-blur-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-gray-700"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
</button>

<button
  onClick={next}
  aria-label="Siguiente"
  className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white hover:scale-110 transition-all duration-300 rounded-full w-11 h-11 shadow-lg border border-gray-300 backdrop-blur-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6 text-gray-700"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
</button>


          {/* Track */}
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="
              flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 py-2
              [-ms-overflow-style:none] [scrollbar-width:none]
            "
            style={{
              // Ocultar scrollbar en WebKit
              scrollbarWidth: "none",
            }}
          >
            {/* Para WebKit ocultar scrollbar (inline style global no aplica; se ve mínimo) */}
            {imagenes.map((src, idx) => (
              <article
                key={idx}
                className="
                  snap-start flex-shrink-0
                  basis-[85%] sm:basis-[55%] md:basis-[40%] lg:basis-[30%]
                  rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition
                "
              >
                <div className="aspect-[4/3] w-full">
                  <img
                    src={src}
                    alt={`Trabajo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onLoad={recalc}
                  />
                </div>
                {/* Pie opcional (título/categoría) */}
                {/* <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-800">Proyecto {idx + 1}</h3>
                  <p className="text-xs text-slate-500">Descripción breve</p>
                </div> */}
              </article>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  page === i ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
