import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Promociones.css";

const getCategory = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("dúo emprendedor")) return "Dúo Emprendedor";
  if (lowerTitle.includes("vending")) return "Vending";
  if (lowerTitle.includes("limpieza")) return "Limpieza";
  if (lowerTitle.includes("mostrador")) return "Mostradores";
  return "General";
};

const promocionesData = [
  {
    id: 1,
    titulo:
      "Dúo Emprendedor Vending Tradicional Atlantis 300 + Limpieza 8 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-limpieza-8-productos.pdf",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 2,
    titulo:
      "Dúo Emprendedor Vending Tradicional Atlantis 300 + Limpieza 5 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-limpieza-5-productos.pdf",
    color: "from-emerald-600 to-teal-900",
  },
  {
    id: 3,
    titulo: "Dúo Emprendedor Atlantis 300 Max + Limpieza 5 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-max-limpieza-5-productos.pdf",
    color: "from-purple-600 to-indigo-900",
  },
  {
    id: 4,
    titulo: "Dúo Emprendedor Atlantis 300 + Limpieza 5 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-limpieza-5-productos.pdf",
    color: "from-pink-500 to-rose-800",
  },
  {
    id: 5,
    titulo: "Vending Tradicional Atlantis 300 Max Con Ósmosis",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-max-con-osmosis.pdf",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 6,
    titulo: "Dúo Emprendedor Atlantis 300 Max + Limpieza 8 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-touch-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-max-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900",
  },
  {
    id: 7,
    titulo: "Vending Touch Atlantis 300 Max Con Ósmosis",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/purificadoras/MOSTRADOR POSEIDON/poseidon-pro.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-max-con-osmosis.pdf",
    color: "from-purple-600 to-indigo-900",
  },
  {
    id: 8,
    titulo: "Vending Tradicional Atlantis 300",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300.pdf",
    color: "from-pink-500 to-rose-800",
  },
  {
    id: 9,
    titulo: "Vending Tradicional Atlantis 300 con Mostrador",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-con-mostrador.pdf",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 10,
    titulo:
      "Dúo Emprendedor Vending Tradicional Atlantis 300 Max + Limpieza 8 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-max-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900",
  },
  {
    id: 11,
    titulo:
      "Dúo Emprendedor Vending Tradicional Atlantis 300 Max + Limpieza 5 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-max-limpieza-5-productos.pdf",
    color: "from-purple-600 to-indigo-900",
  },
  {
    id: 12,
    titulo: "Vending 8 Productos de limpieza",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-8-productos-de-limpieza.pdf",
    color: "from-pink-500 to-rose-800",
  },
  {
    id: 13,
    titulo: "Ficha Mostrador",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-touch-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/ficha-mostrador.pdf",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 14,
    titulo: "Vending Touch Atlantis 300",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/purificadoras/MOSTRADOR POSEIDON/poseidon-pro.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300.pdf",
    color: "from-emerald-600 to-teal-900",
  },
  {
    id: 15,
    titulo: "Vending Touch Atlantis 300 Max con Mostrador",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-max-con-mostrador.pdf",
    color: "from-purple-600 to-indigo-900",
  },
  {
    id: 16,
    titulo: "Vending 5 Productos de Limpieza",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-5-productos-de-limpieza.pdf",
    color: "from-pink-500 to-rose-800",
  },
  {
    id: 17,
    titulo: "Vending Touch Atlantis 300 con Mostrador",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-con-mostrador.pdf",
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 18,
    titulo: "Dúo Emprendedor Atlantis 300 + Limpieza 8 productos",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900",
  },
  {
    id: 19,
    titulo: "Vending Tradicional Atlantis 300 Max Con Ósmosis con Mostrador",
    descripcion:
      "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-max-con-osmosis-con-mostrador.pdf",
    color: "from-purple-600 to-indigo-900",
  },
].map((promo) => ({ ...promo, category: getCategory(promo.titulo) }));

const combos2en1 = [
  {
    titulo: "Puri + Vending Touch",
    imagen: "/img/combos/2en1-touch.jpg",
    desc: "Alta tecnología y automatización.",
  },
  {
    titulo: "Puri + Vending Tradicional",
    imagen: "/img/combos/2en1-tradicional.jpg",
    desc: "La opción clásica y confiable.",
  },
  {
    titulo: "Puri + Vending Limpieza",
    imagen: "/img/combos/2en1-limpieza.jpg",
    desc: "Servicio completo de higiene.",
  },
];

const combo3en1 = {
  titulo: "Combo 3 en 1: Puri + Vending + Limpieza",
  descripcion: "La solución maestra para dominar tu zona de venta.",
  imagen: "/img/combos/3en1.jpg",
  pdf: "/documentos/ficha-combo-3en1.pdf",
};

const WA_NUMBER = "525519655369";
const waLink = (texto) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;

// ICONOS
const IconPDF = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18v-6" />
    <path d="m9 15 3 3 3-3" />
  </svg>
);

const IconDownload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export default function Promociones() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = useMemo(() => {
    const allCategories = promocionesData.map((p) => p.category);
    return ["All", ...new Set(allCategories)];
  }, []);

  const filteredPromos = useMemo(() => {
    if (activeCategory === "All") return promocionesData;
    return promocionesData.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const promosToShow =
    activeCategory === "All"
      ? filteredPromos.slice(0, visibleCount)
      : filteredPromos;

  const canLoadMore =
    activeCategory === "All" && visibleCount < filteredPromos.length;

  useEffect(() => {
    if (activeCategory === "All") setVisibleCount(6);
  }, [activeCategory]);

  return (
    <>
      <Helmet>
        <title>Promociones y Combos | Darmax</title>
        <meta
          name="description"
          content="Descubre promociones y descarga fichas técnicas de nuestros equipos."
        />
        <style>{`
          .swiper-pagination-bullet-active { background-color: #bef264 !important; }
        `}</style>
      </Helmet>

      <main className="bg-white text-slate-900 overflow-hidden">
        {/* HERO CON CARRUSEL */}
        <section className="w-full bg-slate-900">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true }}
            className="w-full aspect-[2/1] sm:aspect-[2.5/1] md:aspect-[3.5/1]"
          >
            {promocionesData.slice(0, 5).map((promo) => (
              <SwiperSlide key={promo.id}>
                <div className="relative w-full h-full">
                  <img
                    src={promo.imagen}
                    alt={promo.titulo}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent flex items-center px-6 md:px-20">
                    <div className="max-w-2xl text-white space-y-3 sm:space-y-4">
                      <span className="bg-lime-400 text-black font-bold px-3 py-1 text-xs uppercase tracking-widest rounded-md">
                        {promo.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
                        {promo.titulo}
                      </h2>
                      <p className="text-slate-100 text-sm sm:text-lg max-w-lg">
                        {promo.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* LISTADO PRINCIPAL */}
        <section className="py-16 sm:py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
              Oportunidades del mes
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Promociones{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                vigentes
              </span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-lg">
              Equipos listos para instalar. Filtra por categoría y descarga la
              ficha técnica para ver qué incluye cada paquete.
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-10">
            <div
              className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:justify-center sm:mx-0 sm:px-0"
              id="category-filters"
            >
              <div className="flex-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      activeCategory === category
                        ? "bg-slate-900 text-white shadow-lg"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {category === "All"
                      ? "Todas las promociones"
                      : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GRID DE PROMOS */}
          {promosToShow.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {promosToShow.map((promo, index) => (
                  <article
                    key={promo.id}
                    className="group relative rounded-2xl lg:rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
                  >
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-15 mix-blend-multiply`}
                      />
                      <img
                        src={promo.imagen}
                        alt={promo.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/70 text-white uppercase tracking-widest">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-slate-900 font-semibold uppercase tracking-widest shadow">
                          {promo.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2 leading-tight line-clamp-2">
                        {promo.titulo}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {promo.descripcion}
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        {promo.detalle}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                        <a
                          href={waLink(
                            `Me interesa la promo "${promo.titulo}".`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-center inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-xs sm:text-sm"
                        >
                          Solicitar por WhatsApp
                        </a>

                        {promo.pdf ? (
                          <a
                            href={encodeURI(promo.pdf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors text-xs sm:text-sm"
                            title="Ver qué incluye (PDF)"
                          >
                            <IconPDF />
                            <span>Ficha técnica</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 flex items-center px-2">
                            (PDF próximamente)
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {canLoadMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-slate-800 transition shadow-lg"
                  >
                    Ver más promociones
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl sm:text-2xl font-bold text-slate-400">
                No se encontraron promociones
              </p>
              <p className="text-slate-500 mt-2">
                Intenta seleccionar otra categoría.
              </p>
            </div>
          )}
        </section>
        
        {/* CTA CATÁLOGO GENERAL */}
        <section className="py-16 sm:py-20 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              ¿Necesitas todos los detalles técnicos?
            </h2>
            <p className="text-slate-600 mb-8">
              Descarga nuestro catálogo general 2025 con especificaciones de
              bombas, filtros, membranas y capacidades de producción.
            </p>
            <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <IconDownload />
              Descargar Catálogo General
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
