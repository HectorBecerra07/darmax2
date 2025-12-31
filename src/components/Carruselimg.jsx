import React, { useMemo } from "react";

const imagenes = [
  "/img/trabajos/trabajos1.jpeg",
  "/img/trabajos/trabajos2.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos5.jpeg",
];

export default function GaleriaMosaicoPremium() {
  const items = useMemo(
    () =>
      imagenes.map((src, idx) => ({
        src,
        title: `Proyecto ${idx + 1}`,
        desc:
          idx === 0
            ? "Instalación completa lista para operar."
            : idx === 1
            ? "Acabado limpio y montaje profesional."
            : idx === 2
            ? "Optimización de espacio y flujo."
            : "Detalles que elevan la experiencia.",
      })),
    []
  );

  return (
    <section className="relative w-full bg-slate-900 py-24 px-4 overflow-hidden selection:bg-[#24d4da] selection:text-white">
      {/* ===== Glow Effects Background (igual al HERO) ===== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#24d4da] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
      </div>

      {/* Layer extra para profundidad (opcional, se ve más pro) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="text-[#24d4da] font-extrabold tracking-[0.28em] text-xs uppercase block">
              Galería de proyectos
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.05]">
              Trabajos recientes con materiales de primera calidad
            </h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Descubre cómo transformamos espacios con instalaciones que combinan 
            </p>
          </div>

          {/* Mini CTA / contador (glass) */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#24d4da]" />
              <span className="text-sm font-semibold text-white/85">
                {items.length} proyectos destacados
              </span>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
          {/* Columna izquierda */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MediaCard
              src={items[0].src}
              title={items[0].title}
              desc={items[0].desc}
              badge="Destacado"
              className="h-[280px] sm:h-[360px] lg:h-[360px]"
            />
            <MediaCard
              src={items[1].src}
              title={items[1].title}
              desc={items[1].desc}
              className="h-[260px] sm:h-[320px] lg:h-[320px]"
            />
          </div>

          {/* Centro */}
          <div className="lg:col-span-5">
            <MediaCard
              src={items[2].src}
              title={items[2].title}
              desc={items[2].desc}
              hero
              className="h-[360px] sm:h-[460px] lg:h-[700px]"
            />
          </div>

          {/* Derecha */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Bloque texto (glass dark) */}
            <div className="rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.35)] p-7 lg:p-8">
              <p className="text-white/75 text-sm leading-relaxed">
                Cada instalación está pensada para que el negocio se vea{" "}
                <span className="font-extrabold text-white">premium</span>, sea{" "}
                <span className="font-extrabold text-white">fácil de operar</span> y{" "}
                <span className="font-extrabold text-white">rentable</span>.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-white">
                Ver más trabajos <span className="text-[#24d4da]">→</span>
              </div>
            </div>

            <MediaCard
              src={items[3].src}
              title={items[3].title}
              desc={items[3].desc}
              className="h-[260px] sm:h-[320px] lg:h-[320px]"
            />
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-white/55">
          Tip: en móvil, toca la imagen para ver el texto (hover no siempre aplica).
        </p>
      </div>
    </section>
  );
}

function MediaCard({ src, title, desc, className = "", badge, hero = false }) {
  return (
    <figure
      className={[
        "group relative overflow-hidden rounded-[2.5rem]",
        "bg-white/5 backdrop-blur-xl border border-white/10",
        "shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
        "transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-[0_30px_90px_-45px_rgba(36,212,218,0.35)]",
        className,
      ].join(" ")}
    >
      {/* Glow interno hover */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#24d4da]/18 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-600/12 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Imagen */}
      <img
        src={src}
        alt={title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://placehold.co/1200x800/0f172a/94a3b8?text=Imagen+No+Disponible";
        }}
        className="
          absolute inset-0 h-full w-full object-cover
          transition-all duration-700
          group-hover:scale-110
          group-hover:blur-[2px]
          group-hover:brightness-[0.70]
        "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Shimmer suave */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-x-24 top-0 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 translate-x-[-40%] group-hover:translate-x-[45%] transition-transform duration-[1200ms]" />
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-extrabold px-3 py-1.5 rounded-full">
            {badge}
          </span>
        </div>
      )}

      {/* Contenido */}
      <figcaption
        className={[
          "absolute inset-0 p-7 sm:p-8",
          "flex flex-col justify-end text-white",
          "opacity-0 translate-y-5 transition-all duration-500",
          "group-hover:opacity-100 group-hover:translate-y-0",
        ].join(" ")}
      >
        <h3 className={hero ? "text-3xl font-extrabold tracking-tight" : "text-2xl font-extrabold tracking-tight"}>
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/85 leading-relaxed max-w-[46ch]">
          {desc}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
        </div>
      </figcaption>

      {/* Ring glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-0 ring-[#24d4da]/25 transition group-hover:ring-2" />
    </figure>
  );
}
