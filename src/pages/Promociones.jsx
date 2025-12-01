import React from "react";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// --- DATOS DE EJEMPLO (AQUÍ AGREGAS TU RUTA DEL PDF) ---
const promociones = [
  {
    id: 1,
    titulo: "¡Doble Purificadora!",
    descripcion: "Compra una purificadora seleccionada y llévate otra sin costo de equipo.",
    detalle: "Ideal para abrir dos sucursales simultáneas.",
    imagen: "",
    etiqueta: "Oferta 2x1",
    // AQUÍ PONES LA RUTA DE TU PDF
    pdf: "/documentos/ficha-promocion-2x1.pdf", 
    color: "from-blue-600 to-blue-900",
  },
  {
    id: 2,
    titulo: "Pack Emprendedor",
    descripcion: "Descuento especial + Kit de refacciones inicial en tu primer pedido.",
    detalle: "Válido solo para nuevos clientes este mes.",
    imagen: "/img/PROMOCIONES/PROMOCION1.png",
    etiqueta: "Primer Negocio",
    pdf: "/documentos/ficha-emprendedor.pdf",
    color: "from-emerald-600 to-teal-900",
  },
];

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
            className="w-full aspect-[2.5/1] md:aspect-[3.5/1]"
          >
            {promociones.map((promo) => (
              <SwiperSlide key={promo.id}>
                <div className="relative w-full h-full">
                  <img
                    src={promo.imagen}
                    alt={promo.titulo}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent flex items-center px-6 md:px-20">
                    <div className="max-w-2xl text-white space-y-4">
                      <span className="bg-lime-400 text-black font-bold px-3 py-1 text-xs uppercase tracking-widest rounded-md">
                        {promo.etiqueta}
                      </span>
                      <h2 className="text-3xl md:text-5xl font-black leading-tight">
                        {promo.titulo}
                      </h2>
                      <p className="text-slate-200 md:text-lg max-w-lg">
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
        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
              Oportunidades del Mes
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Promociones <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Vigentes</span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Equipos listos para instalar. Revisa los detalles y descarga la ficha técnica para ver exactamente qué incluye cada paquete.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {promociones.map((promo) => (
              <article 
                key={promo.id} 
                className="group relative rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
              >
                {/* Imagen Superior */}
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-10 mix-blend-multiply`} />
                  <img 
                    src={promo.imagen} 
                    alt={promo.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-900 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-sm">
                    {promo.etiqueta}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-8 flex flex-col flex-grow relative">
                   {/* Decoración de fondo */}
                   <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-50 rounded-full z-0 group-hover:bg-lime-50 transition-colors duration-500" />
                   
                   <div className="relative z-10 flex flex-col h-full">
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                        {promo.titulo}
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {promo.descripcion}
                      </p>
                      
                      {promo.detalle && (
                        <div className="inline-block bg-slate-100 rounded-lg px-3 py-2 text-xs text-slate-500 font-medium mb-6 self-start">
                          💡 {promo.detalle}
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                        {/* BOTÓN PRINCIPAL WHATSAPP */}
                        <a
                          href={waLink(`Me interesa la promo "${promo.titulo}".`)}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Solicitar Promo
                        </a>

                        {/* BOTÓN DESCARGAR PDF */}
                        {promo.pdf ? (
                          <a
                            href={promo.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors"
                            title="Ver qué incluye (PDF)"
                          >
                            <IconPDF />
                            <span className="text-sm">Ficha Técnica</span>
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
        </section>

        {/* ========= SECCIÓN COMBOS (VISUALIZACIÓN RÁPIDA) ========= */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-slate-900">Combos 2 en 1</h3>
                <p className="text-slate-500 mt-2">Maximiza tu local con doble funcionalidad.</p>
              </div>
              <a 
                href="/documentos/catalogo-combos-completo.pdf" 
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                <IconDownload /> Descargar Catálogo Completo
              </a>
            </div>

            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
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

          <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-xs font-bold uppercase tracking-widest">
                  ⭐ El más completo
               </div>
               <h2 className="text-4xl md:text-5xl font-black leading-tight">
                 Combo Estrella <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-400">
                   3 en 1 Integral
                 </span>
               </h2>
               <p className="text-slate-300 text-lg">
                 {combo3en1.descripcion}. La mejor relación costo-beneficio del mercado. Incluye todo lo necesario para operar desde el día 1.
               </p>
               
               <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-5">
                 <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-wider">¿Qué incluye el PDF?</h4>
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-400">
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Diagrama de instalación</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Lista de componentes</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Requisitos del local</li>
                   <li className="flex items-center gap-2"><span className="text-lime-400">✓</span> Proyección de ganancias</li>
                 </ul>
               </div>

               <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href={waLink("Información Combo 3 en 1")}
                    className="px-7 py-3.5 rounded-xl bg-lime-400 text-slate-900 font-bold hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    Cotizar Ahora
                  </a>
                  <a
                    href={combo3en1.pdf || "#"}
                    className="px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition flex items-center gap-2"
                  >
                    <IconPDF /> Descargar Ficha
                  </a>
               </div>
            </div>

            <div className="order-1 md:order-2 relative">
               <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                 <img 
                   src={combo3en1.imagen} 
                   alt="Combo 3 en 1" 
                   className="w-full object-cover transform hover:scale-105 transition duration-700"
                 />
                 {/* Overlay sutil */}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                 
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                      <p className="text-white text-sm font-medium text-center">
                        "La opción favorita de nuestros 50 nuevos emprendedores este mes."
                      </p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* ========= CTA FINAL ========= */}
        <section className="py-20 bg-slate-50 text-center">
            <div className="max-w-2xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">¿Necesitas todos los detalles técnicos?</h2>
              <p className="text-slate-600 mb-8">
                Descarga nuestro catálogo general 2025 con especificaciones de bombas, filtros, membranas y capacidades de producción.
              </p>
              <button className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <IconDownload />
                Descargar Catálogo General
              </button>
            </div>
        </section>

      </main>
    </>
  );
}