import React from "react";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const promociones = [
  { id: 1, titulo: "purificadoras!", descripcion: "Compra una purificadora y llévate otra gratis.", imagen: "/img/PROMOCIONES/PROMOCION3.jpg" },
  { id: 2, titulo: "primer pedido", descripcion: "Para nuevos emprendedores. Aplica en modelos seleccionados.", imagen: "/img/PROMOCIONES/PROMOCION1.png" },
];

const topSellers = [
  { titulo: "Purificadora Pro Max", imagen: "/img/top/pro-max.jpg" },
  { titulo: "Vending Touch 8", imagen: "/img/top/vending-touch.jpg" },
  { titulo: "Vending Limpieza 8", imagen: "/img/top/vending-limpieza.jpg" },
];

const combos2en1 = [
  { titulo: "Purificadora + Vending Touch", imagen: "/img/combos/2en1-touch.jpg" },
  { titulo: "Purificadora + Vending Tradicional", imagen: "/img/combos/2en1-tradicional.jpg" },
  { titulo: "Purificadora + Vending Limpieza", imagen: "/img/combos/2en1-limpieza.jpg" },
];

const combo3en1 = {
  titulo: "Combo 3 en 1: Puri + Vending Touch + Limpieza",
  descripcion: "La solución completa para tu emprendimiento",
  imagen: "/img/combos/3en1.jpg",
};

const WA_NUMBER = "525519655369";
const waLink = (texto) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;

const tiktokVideos = [
  "https://www.tiktok.com/embed/7570139547300875576",
  "https://www.tiktok.com/embed/7570112791164587275",
  "https://www.tiktok.com/embed/7568617902530645259",
  "https://www.tiktok.com/embed/7567129702515690808",
];

export default function Promociones() {
  return (
    <>
      <Helmet>
        <title>Promociones | Darmax</title>
        <meta name="description" content="Descubre nuestras promociones exclusivas para emprender con Darmax." />
        <link rel="canonical" href="https://tudominio.com/promociones" />
        <style>{`
          /* Evita que los slides no activos capten clics en efecto fade */
          .swiper.swiper-fade .swiper-slide { opacity: 0; pointer-events: none; }
          .swiper.swiper-fade .swiper-slide-active { opacity: 1; pointer-events: auto; }
          /* Ajuste de bullets */
          .swiper-pagination-bullets { bottom: 12px !important; }
          .swiper-pagination-bullet { width: 8px; height: 8px; opacity: .6; }
          .swiper-pagination-bullet-active { opacity: 1; }
        `}</style>
      </Helmet>

      {/* Si tu navbar es fixed, controla el espacio aquí */}
      <main className="pt-10 md:pt-10">
        {/* HERO PROMOCIONES — pegado al header y altura exacta de banner */}
{/* HERO PROMOCIONES — pegado al header y altura exacta de banner */}
<section className="w-full m-0 p-0">
  <Swiper
    modules={[Autoplay, Pagination/*, EffectFade (opcional) */]}
    // effect="fade" // si el banner ya tiene texto, mejor sin fade
    autoplay={{ delay: 4000, disableOnInteraction: false }}
    loop
    pagination={{ clickable: true }}
    speed={700}
    // Alturas pensadas para 1920x300 (6.4:1)
    className="w-full h-[170px] sm:h-[200px] md:h-[260px] lg:h-[300px]"
  >
    {promociones.map((promo) => (
      <SwiperSlide key={promo.id}>
        <div className="relative w-full h-full bg-[#0b0b0b]">
          <img
            src={promo.imagen}
            alt={promo.titulo}
            loading="lazy"
            decoding="async"
            draggable="false"
            // NO recorta: se ve completa y centrada
            className="absolute inset-0 w-full h-full object-contain object-center select-none"
          />
          {/* Si tu imagen ya tiene texto, no uses gradiente encima */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /> */}
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</section>



        {/* VIDEOS TIKTOK */}
        <section className="py-16 px-4 md:px-8 bg-white text-black">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <span className="inline-block text-[11px] tracking-widest uppercase bg-white text-black px-3 py-1 rounded-full">
              Contenido real
            </span>
            <h2 className="mt-3 text-3xl font-bold">Mira nuestros videos en TikTok</h2>
            <p className="mt-2 text-gray-500">
              Tips, instalaciones reales y promociones exclusivas en{" "}
              <a href="https://www.tiktok.com/@darmax_agua" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                @darmax_agua
              </a>
            </p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            loop
            breakpoints={{
              320: { slidesPerView: 1.02, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="max-w-6xl mx-auto"
          >
            {tiktokVideos.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={src}
                    width="100%"
                    height="520"
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[420px] sm:h-[480px] md:h-[520px]"
                    loading="lazy"
                    title={`Video TikTok ${i + 1}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-10">
            <a
              href="https://www.tiktok.com/@darmax_agua"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-sky-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-sky-300 transition shadow-lg"
            >
              Ver más en TikTok
            </a>
          </div>
        </section>

        {/* TOP SELLERS */}
        <section className="py-12 px-4 md:px-8 bg-gray-50">
          <Header title="Top Sellers" subtitle="Los favoritos por rendimiento y retorno de inversión." kicker="Selección de clientes" />
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop
            breakpoints={{
              320: { slidesPerView: 1.1, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="max-w-6xl mx-auto"
          >
            {topSellers.map((item, i) => (
              <SwiperSlide key={i}>
                <Card>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <Badge className="absolute left-4 top-4">Más vendido</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900 text-center">{item.titulo}</h3>
                    <div className="mt-4 flex justify-center">
                      <a
                        href={waLink(`Hola, me interesa "${item.titulo}". ¿Me cotizas?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-xl font-semibold text-black hover:brightness-90 transition"
                        style={{ backgroundColor: "#ccff00" }}
                      >
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* COMBOS 2 EN 1 */}
        <section className="py-12 px-4 md:px-8">
          <Header title="Combos 2 en 1" subtitle="Combinaciones optimizadas para iniciar con el pie derecho." kicker="Arma tu negocio" />
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3800, disableOnInteraction: false }}
            loop
            breakpoints={{
              320: { slidesPerView: 1.1, spaceBetween: 12 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            className="max-w-6xl mx-auto"
          >
            {combos2en1.map((combo, idx) => (
              <SwiperSlide key={idx}>
                <Card>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={combo.imagen}
                      alt={combo.titulo}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <Badge className="absolute left-4 top-4">2 en 1</Badge>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-semibold text-slate-900">{combo.titulo}</h3>
                    <div className="mt-4 flex justify-center">
                      <a
                        href={waLink(`Hola, quiero cotizar el combo "${combo.titulo}".`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-xl font-semibold text-black hover:brightness-90 transition"
                        style={{ backgroundColor: "#ccff00" }}
                      >
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* COMBO 3 EN 1 DESTACADO */}
        <section className="py-12 px-4 md:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={combo3en1.imagen}
                alt={combo3en1.titulo}
                className="h-72 w-full object-cover md:h-[22rem] transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-1">
              <span className="inline-block text-xs tracking-widest uppercase bg-black text-white px-3 py-1 rounded-full">Combo estrella</span>
              <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">{combo3en1.titulo}</h2>
              <p className="mt-2 text-slate-600">{combo3en1.descripcion}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><span className="mt-0.5">✔</span> Mayor capacidad y flujo para alta demanda.</li>
                <li className="flex items-start gap-2"><span className="mt-0.5">✔</span> Instalación y puesta en marcha incluidas.</li>
                <li className="flex items-start gap-2"><span className="mt-0.5">✔</span> Garantía extendida y soporte técnico.</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={waLink(`Hola, me interesa el "${combo3en1.titulo}". ¿Me compartes cotización?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-90 transition shadow-lg"
                  style={{ backgroundColor: "#ccff00" }}
                >
                  Cotizar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ===== Subcomponentes UI ===== */

function Header({ title, subtitle, kicker }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      {kicker && <span className="inline-block text-[11px] tracking-widest uppercase bg-black text-white px-3 py-1 rounded-full">{kicker}</span>}
      <h2 className="mt-3 text-3xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {children}
    </div>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 shadow ${className}`}>
      {children}
    </span>
  );
}
