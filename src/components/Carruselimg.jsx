import React, { useMemo } from "react";

const imagenes = [
  "/img/trabajos/trabajos1.jpg",
  "/img/trabajos/trabajos2.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos4.jpg",
];

export default function GaleriaGridPro() {
  // Puedes personalizar títulos/descripciones por imagen (opcional)
  const items = useMemo(
    () =>
      imagenes.map((src, idx) => ({
        src,
        title: `Proyecto #${idx + 1}`,
        desc: "Instalación profesional • Calidad Darmax • Resultado premium",
        tag: idx % 2 === 0 ? "Residencial" : "Comercial",
      })),
    []
  );

  return (
    <section className="w-full bg-[#Fbfbfd] py-20 px-4 overflow-hidden selection:bg-[#24d4da] selection:text-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-visible">
          <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-[#24d4da]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center mb-14 relative z-10">
          <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
            Galería de Proyectos
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nuestros Trabajos Recientes
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Una muestra de instalaciones y proyectos reales. Pasa el cursor para ver detalles.
          </p>
        </div>

        {/* GRID */}
        <div className="relative z-10">
          <div
            className="
              grid gap-6
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              auto-rows-[220px] sm:auto-rows-[240px] lg:auto-rows-[260px]
            "
          >
            {items.map((it, idx) => {
              const big =
                idx === 0 || idx === 5; // tiles grandes (ajusta si quieres)
              return (
                <figure
                  key={it.src}
                  className={`
                    group relative overflow-hidden rounded-[2rem]
                    border border-slate-100 bg-white
                    shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]
                    transition-all duration-500
                    hover:-translate-y-2 hover:shadow-[0_25px_60px_-20px_rgba(36,212,218,0.25)]
                    ${big ? "sm:col-span-2 lg:col-span-2" : ""}
                  `}
                >
                  {/* Imagen */}
                  <img
                    src={it.src}
                    alt={it.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/1200x800/f1f5f9/94a3b8?text=Imagen+No+Disponible";
                    }}
                    className="
                      absolute inset-0 h-full w-full object-cover
                      transition-all duration-700
                      group-hover:scale-110
                      group-hover:blur-[2px]
                      group-hover:brightness-[0.70]
                    "
                  />

                  {/* Degradado base para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Contenido hover */}
                  <figcaption
                    className="
                      absolute inset-0 p-6 sm:p-7
                      flex flex-col justify-end
                      text-white
                      opacity-0 translate-y-4
                      transition-all duration-500
                      group-hover:opacity-100 group-hover:translate-y-0
                    "
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase">
                        <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
                        {it.tag}
                      </span>
                      <span className="text-xs font-bold text-white/80">
                        Darmax
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight">
                      {it.title}
                    </h3>

                    <p className="mt-2 text-sm sm:text-[15px] text-white/85 leading-relaxed max-w-[40ch]">
                      {it.desc}
                    </p>

                    {/* CTA mini */}
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-white">
                      Ver detalles
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </figcaption>

                  {/* Badge fijo (sin hover) */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm border border-white/60">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Ring hover suave */}
                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-0 ring-[#24d4da]/30 transition group-hover:ring-2" />
                </figure>
              );
            })}
          </div>

          {/* Nota UX móvil */}
          <p className="mt-8 text-center text-xs text-slate-500">
            Tip: en móvil, mantén presionada la imagen para apreciar el texto (hover no siempre aplica).
          </p>
        </div>
      </div>
    </section>
  );
}
