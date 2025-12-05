import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Promociones.css";


const getCategory = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('dúo emprendedor')) return 'Dúo Emprendedor';
    if (lowerTitle.includes('vending')) return 'Vending';
    if (lowerTitle.includes('limpieza')) return 'Limpieza';
    if (lowerTitle.includes('mostrador')) return 'Mostradores';
    return 'General';
};

const promocionesData = [
  {
    id: 1,
    titulo: "Dúo Emprendedor Vending Tradicional Atlantis 300 + Limpieza 8 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-limpieza-8-productos.pdf",
    color: "from-blue-600 to-blue-900"
  },
  {
    id: 2,
    titulo: "Dúo Emprendedor Vending Tradicional Atlantis 300 + Limpieza 5 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-limpieza-5-productos.pdf",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 3,
    titulo: "Dúo Emprendedor Atlantis 300 Max + Limpieza 5 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-max-limpieza-5-productos.pdf",
    color: "from-purple-600 to-indigo-900"
  },
  {
    id: 4,
    titulo: "Dúo Emprendedor Atlantis 300 + Limpieza 5 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-limpieza-5-productos.pdf",
    color: "from-pink-500 to-rose-800"
  },
  {
    id: 5,
    titulo: "Vending Tradicional Atlantis 300 Max Con Ósmosis",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-max-con-osmosis.pdf",
    color: "from-blue-600 to-blue-900"
  },
  {
    id: 6,
    titulo: "Dúo Emprendedor Atlantis 300 Max + Limpieza 8 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-touch-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-max-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 7,
    titulo: "Vending Touch Atlantis 300 Max Con Ósmosis",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/purificadoras/MOSTRADOR POSEIDON/poseidon-pro.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-max-con-osmosis.pdf",
    color: "from-purple-600 to-indigo-900"
  },
  {
    id: 8,
    titulo: "Vending Tradicional Atlantis 300",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300.pdf",
    color: "from-pink-500 to-rose-800"
  },
  {
    id: 9,
    titulo: "Vending Tradicional Atlantis 300 con Mostrador",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-con-mostrador.pdf",
    color: "from-blue-600 to-blue-900"
  },
  {
    id: 10,
    titulo: "Dúo Emprendedor Vending Tradicional Atlantis 300 Max + Limpieza 8 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-max-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 11,
    titulo: "Dúo Emprendedor Vending Tradicional Atlantis 300 Max + Limpieza 5 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-vending-tradicional-atlantis-300-max-limpieza-5-productos.pdf",
    color: "from-purple-600 to-indigo-900"
  },
  {
    id: 12,
    titulo: "Vending 8 Productos de limpieza",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-8-productos-de-limpieza.pdf",
    color: "from-pink-500 to-rose-800"
  },
  {
    id: 13,
    titulo: "Ficha Mostrador",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-touch-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/ficha-mostrador.pdf",
    color: "from-blue-600 to-blue-900"
  },
  {
    id: 14,
    titulo: "Vending Touch Atlantis 300",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/purificadoras/MOSTRADOR POSEIDON/poseidon-pro.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300.pdf",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 15,
    titulo: "Vending Touch Atlantis 300 Max con Mostrador",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-max-con-mostrador.pdf",
    color: "from-purple-600 to-indigo-900"
  },
  {
    id: 16,
    titulo: "Vending 5 Productos de Limpieza",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION2.png",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-5-productos-de-limpieza.pdf",
    color: "from-pink-500 to-rose-800"
  },
  {
    id: 17,
    titulo: "Vending Touch Atlantis 300 con Mostrador",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION3.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-touch-atlantis-300-con-mostrador.pdf",
    color: "from-blue-600 to-blue-900"
  },
  {
    id: 18,
    titulo: "Dúo Emprendedor Atlantis 300 + Limpieza 8 productos",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/PROMOCIONES/PROMOCION0.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/duo-emprendedor-atlantis-300-limpieza-8-productos.pdf",
    color: "from-emerald-600 to-teal-900"
  },
  {
    id: 19,
    titulo: "Vending Tradicional Atlantis 300 Max Con Ósmosis con Mostrador",
    descripcion: "Descarga la ficha técnica para conocer todos los detalles de esta promoción.",
    detalle: "Ideal para iniciar o expandir tu negocio de agua purificada.",
    imagen: "/img/vending/vending-tradicional-con-mostrador.jpg",
    etiqueta: "Promoción",
    pdf: "/PDF/vending-tradicional-atlantis-300-max-con-osmosis-con-mostrador.pdf",
    color: "from-purple-600 to-indigo-900"
  }
].map(promo => ({ ...promo, category: getCategory(promo.titulo) }));


const topSellers = [
  { titulo: "Purificadora Pro Max", imagen: "/img/top/pro-max.jpg" },
  { titulo: "Vending Touch 8", imagen: "/img/top/vending-touch.jpg" },
  { titulo: "Vending Limpieza 8", imagen: "/img/top/vending-limpieza.jpg" },
];

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

// --- COMPONENTES DE ICONOS (SVG) ---
const IconPDF = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
);

const IconDownload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export default function Promociones() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const allCategories = promocionesData.map(p => p.category);
    return ['All', ...new Set(allCategories)];
  }, []);

  const filteredPromos = useMemo(() => {
    if (activeCategory === 'All') {
      return promocionesData;
    }
    return promocionesData.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <Helmet>
        <title>Promociones y Combos | Darmax</title>
        <meta name="description" content="Descubre promociones y descarga fichas técnicas de nuestros equipos." />
        <style>{`
          .swiper-pagination-bullet-active { background-color: #bef264 !important; }
        `}</style>
      </Helmet>

      <main className="bg-slate-50 overflow-hidden">
        
        {/* ========= HERO SLIDER (Mantenido simple) ========= */}
        <section className="w-full bg-black">
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
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent flex items-center px-6 md:px-20">
                    <div className="max-w-2xl text-white space-y-3 sm:space-y-4">
                      <span className="bg-lime-400 text-black font-bold px-3 py-1 text-xs uppercase tracking-widest rounded-md">
                        {promo.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight">
                        {promo.titulo}
                      </h2>
                      <p className="text-slate-200 text-sm sm:text-lg max-w-lg">
                        {promo.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* ========= SECCIÓN DE PROMOCIONES ACTIVAS (REDISEÑADA) ========= */}
        <section className="py-16 sm:py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
              Oportunidades del Mes
            </h2>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Promociones <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Vigentes</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
              Equipos listos para instalar. Filtra por categoría y descarga la ficha técnica para ver qué incluye cada paquete.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:justify-center sm:mx-0 sm:px-0" id="category-filters">
              <div className="flex-none flex items-center justify-start sm:justify-center gap-2 sm:gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {filteredPromos.map((promo) => (
              <article 
                key={promo.id} 
                className="group relative rounded-2xl lg:rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
              >
                <div className="relative h-52 sm:h-60 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-10 mix-blend-multiply`} />
                  <img 
                    src={promo.imagen} 
                    alt={promo.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-900 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider shadow-sm">
                    {promo.category}
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-grow relative">
                   <div className="relative z-10 flex flex-col h-full">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 leading-tight flex-grow">
                        {promo.titulo}
                      </h3>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                        <a
                          href={waLink(`Me interesa la promo "${promo.titulo}".`)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full text-center inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors text-sm"
                        >
                          Solicitar
                        </a>

                        {promo.pdf ? (
                          <a
                            href={encodeURI(promo.pdf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors text-sm"
                            title="Ver qué incluye (PDF)"
                          >
                            <IconPDF />
                            <span>Ficha</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center px-2">
                            (PDF Próximamente)
                          </span>
                        )}
                      </div>
                   </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPromos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl sm:text-2xl font-bold text-slate-400">No se encontraron promociones</p>
              <p className="text-slate-500 mt-2">Intenta seleccionar otra categoría.</p>
            </div>
          )}
        </section>

        {/* ========= SECCIÓN COMBOS (VISUALIZACIÓN RÁPIDA) ========= */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Combos 2 en 1</h3>
                <p className="text-slate-500 mt-2">Maximiza tu local con doble funcionalidad.</p>
              </div>
              <a 
                href={encodeURI("/documentos/catalogo-combos-completo.pdf")} 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                <IconDownload /> Descargar Catálogo Completo
              </a>
            </div>

            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              {combos2en1.map((combo, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group border border-slate-200 rounded-2xl p-4 hover:border-blue-300 transition-colors">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4 bg-slate-100">
                      <img 
                        src={combo.imagen} 
                        alt={combo.titulo}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-lg text-slate-900">{combo.titulo}</h4>
                    <p className="text-sm text-slate-500 mt-1">{combo.desc}</p>
                    <div className="mt-4 flex gap-2">
                      <a 
                        href={waLink(`Cotizar combo ${combo.titulo}`)}
                        className="text-xs font-bold bg-lime-400 text-slate-900 px-3 py-2 rounded-lg flex-1 text-center hover:bg-lime-300"
                      >
                        Cotizar
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* ========= FEATURED COMBO 3 EN 1 (CON DESCARGA) ========= */}
        <section className="py-16 px-4 md:px-8 bg-slate-900 text-white relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-lime-500/10 blur-[100px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-xs font-bold uppercase tracking-widest">
                  ⭐ El más completo
               </div>
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                 Combo Estrella <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                   3 en 1 Integral
                 </span>
               </h2>
               <p className="text-slate-300 text-base sm:text-lg">
                 {combo3en1.descripcion}. La mejor relación costo-beneficio del mercado. Incluye todo lo necesario para operar desde el día 1.
               </p>
               
               <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
                 <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">¿Qué incluye el PDF?</h4>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-400">
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Diagrama de instalación</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Lista de componentes</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Requisitos del local</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Proyección de ganancias</li>
                 </ul>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a
                    href={waLink("Información Combo 3 en 1")}
                    className="px-7 py-3 rounded-xl bg-lime-400 text-slate-900 font-bold hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    Cotizar Ahora
                  </a>
                  <a
                    href={encodeURI(combo3en1.pdf || "#")}
                    className="px-7 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition flex items-center gap-2 justify-center"
                  >
                    <IconPDF /> Descargar Ficha
                  </a>
               </div>
            </div>

            <div className="order-1 md:order-2 relative">
               <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                 <img 
                   src={combo3en1.imagen} 
                   alt="Combo 3 en 1" 
                   className="w-full object-cover transform hover:scale-105 transition duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                 
                 <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-xl">
                      <p className="text-white text-xs sm:text-sm font-medium text-center">
                        "La opción favorita de nuestros 50 nuevos emprendedores este mes."
                      </p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-slate-50 text-center">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">¿Necesitas todos los detalles técnicos?</h2>
              <p className="text-slate-600 mb-8">
                Descarga nuestro catálogo general 2025 con especificaciones de bombas, filtros, membranas y capacidades de producción.
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