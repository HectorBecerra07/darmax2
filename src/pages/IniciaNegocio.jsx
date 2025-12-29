import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

/* =========================
   CONSTANTES Y CONFIGURACIÓN
========================= */
const BRAND_COLOR = "#24d4da"; // Tu color cyan
const WHATSAPP_PHONE = "525519655369";
const BUNDLE_IDS = new Set(["Duo-Emprendedor", "Tridente", "Megalodon"]);

const buildWaUrl = ({ modeloId, modeloNombre }) => {
  const text = `Hola, me interesa el modelo premium ${modeloNombre || "Darmax"} (ID: ${modeloId || "-"}) visto en su web.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

const formatMXN = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

const modelos = [
    {
    id: "Vending",
    nombre: "Vending Touch ",
    etiqueta: "Máquina Vending",
    imagen: "/img/vending/TOUCHAGUA.png",
    precio: 54950,
    descripcion: "Automatización total 24/7. Genera ingresos pasivos con tecnología de despacho automático y cero personal.",
    rutaInfo: "/vending-info",
    badge: "Más popular",
  },
  {
    id: "Purificadora",
    nombre: "Mostrador Darmax",
    etiqueta: "Purificadora",
    imagen: "/img/vending/mostrador.jpg",
    precio: 52950,
    descripcion: "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
    badge: "Más rentable",
  },
  {
    id: "Vending-Limpieza",
    nombre: "Vending Limpieza",
    etiqueta: "Vending Limpieza",
    imagen: "/img/vending/9productos.jpeg",
    precio: 34950,
    descripcion: "Diversifica tu portafolio. Despacho automático de productos de limpieza a granel de alta demanda.",
    rutaInfo: "/vending-limpieza-info",
    badge: "economía inteligente",
  },
  {
    id: "Duo-Emprendedor",
    nombre: "Dúo Emprendedor 2 en 1",
    etiqueta: "Vending y Limpieza",
    imagen: "/img/vending/duo-emprendedor.png", // Placeholder, replace with actual image
    precio: 84950,
    descripcion: "Combina la venta de agua purificada con productos de limpieza a granel, maximizando tu oferta y rentabilidad en un solo espacio.",
    rutaInfo: "/duo-emprendedor-info",
    badge: "Doble Ganancia",
  },
  {
    id: "Tridente",
    nombre: "Tridente",
    etiqueta: "Triple Modelo de Negocio",
    imagen: "/img/vending/tridente.png", // Placeholder, replace with actual image
    precio: 109950,
    descripcion: "Una solución completa que integra agua purificada, productos de limpieza y otros artículos esenciales, ofreciendo una experiencia integral a tus clientes.",
    rutaInfo: "/tridente-info",
    badge: "Versatilidad Extrema",
  },
  {
    id: "Megalodon",
    nombre: "Megalodon",
    etiqueta: "Mega Vending",
    imagen: "/img/vending/megalodon.png", // Placeholder, replace with actual image
    precio: 150000,
    descripcion: "La estación de vending más avanzada y de mayor capacidad. Ideal para ubicaciones de alto tráfico, ofreciendo múltiples productos y servicios.",
    rutaInfo: "/megalodon-info",
    badge: "Líder del Mercado",
  },
];

/* =========================
   COMPONENTES UI PREMIUM
========================= */

const SectionTitle = ({ subtitle, title, align = "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="text-[] font-bold tracking-widest text-xs uppercase mb-3 block">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
      {title}
    </h2>
  </div>
);

const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);

  const isBundle = BUNDLE_IDS.has(modelo.id);
  const configurePath = isBundle
    ? `/configurar-paquete/${modelo.id}`
    : `/configurar-maquina/${modelo.id}`;

  return (
    <article
      className={[
        "border border-slate-200 group relative flex flex-col h-full overflow-hidden rounded-3xl bg-white",
        "transition-all duration-300",
        "hover:-translate-y-2 hover:shadow-[0_28px_70px_-30px_rgba(15,23,42,0.35)]",
        "focus-within:-translate-y-2 focus-within:shadow-[0_28px_70px_-30px_rgba(15,23,42,0.35)]",
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* Borde degradado premium (no rompe el layout) */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-[#24d4da]/35 via-transparent to-slate-200/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-white" />

      {/* Glow suave */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#24d4da]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="relative p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {modelo.badge && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-slate-100 text-slate-700">
                <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
                {modelo.badge}
              </span>
            )}

            <h3 className="mt-3 text-xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              {modelo.nombre}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {modelo.etiqueta}
            </p>
          </div>

          {/* Comparar pill (con micro-interacción) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(modelo.id);
            }}
            className={[
              "shrink-0 inline-flex items-center gap-2",
              "px-3 py-2 rounded-full border text-xs font-extrabold",
              "transition-all duration-300",
              "active:scale-[0.98]",
              isSelected
                ? "border-[#24d4da] bg-[#24d4da]/10 text-[#24d4da] shadow-[0_10px_25px_-15px_rgba(36,212,218,0.65)]"
                : "border-slate-200 text-slate-600 hover:border-[#24d4da] hover:text-[#24d4da] hover:bg-[#24d4da]/5",
            ].join(" ")}
            title="Comparar"
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full transition-colors duration-300",
                isSelected ? "bg-[#24d4da]" : "bg-slate-300 group-hover:bg-[#24d4da]",
              ].join(" ")}
            />
            {isSelected ? "Comparando" : "Comparar"}
          </button>
        </div>

        {/* Imagen premium */}
        <div className="relative mt-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white h-56 flex items-center justify-center overflow-hidden">
          {/* shimmer suave */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute -inset-x-10 top-0 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent rotate-12 translate-x-[-30%] group-hover:translate-x-[40%] transition-transform duration-[1200ms]" />
          </div>

          {!errorImagen ? (
            <img
              src={modelo.imagen}
              alt={modelo.nombre}
              loading="lazy"
              className="
                relative z-10 max-h-[82%] w-auto object-contain
                transition-transform duration-500 ease-out
                group-hover:scale-[1.06]
              "
              onError={() => setErrorImagen(true)}
            />
          ) : (
            <div className="text-slate-400 text-sm font-semibold">
              Imagen no disponible
            </div>
          )}

          {/* sombra inferior sutil */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/5 to-transparent" />
        </div>

        {/* Precio + texto */}
        <div className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <span className="text-2xl font-black text-slate-900">
              {formatMXN(modelo.precio)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">+ IVA</span>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {modelo.descripcion}
          </p>

          {/* mini divider */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      </div>

      {/* Footer acciones */}
      <div className="relative mt-auto p-7 pt-0">
        <div className="flex gap-3">
          {/* Configurar */}
          <button
            onClick={() => navigate(configurePath)}
            className="
              flex-1 py-3.5 rounded-2xl font-extrabold text-white
              transition-all duration-300
              hover:shadow-[0_18px_35px_-18px_rgba(36,212,218,0.75)]
              active:scale-[0.99]
              relative overflow-hidden
            "
            style={{ backgroundColor: BRAND_COLOR }}
          >
            {/* glow sweep */}
            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="absolute -inset-x-10 top-0 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent rotate-12 translate-x-[-40%] group-hover:translate-x-[45%] transition-transform duration-[1200ms]" />
            </span>
            <span className="relative">Configurar</span>
          </button>

          {/* Conoce más */}
          <button
            onClick={() => navigate(modelo.rutaInfo)}
            className="
              flex-1 py-3.5 rounded-2xl font-extrabold text-slate-700
              border border-slate-200
              hover:text-[#24d4da] hover:border-[#24d4da]
              hover:bg-[#24d4da]/5
              transition-all duration-300
              active:scale-[0.99]
            "
          >
            Conoce más
          </button>
        </div>

        {/* hint en hover (muy discreto) */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            Tip: compara 2+ modelos
          </span>
          {isSelected && (
            <span className="text-[#24d4da] font-bold">
              Seleccionado ✓
            </span>
          )}
        </div>
      </div>
    </article>
  );
};


/* =========================
   SECCIÓN VENTAJAS (Nuevo Diseño)
========================= */
 function VentajasSection() {
  const ventajas = [
    {
      img: "/img/Iniciatunegocio/1.png",
      title: "Acompañamiento 360°",
      desc: "Te guiamos en cada paso, desde la instalación hasta la optimización de tu equipo.",
    },
    {
      img: "/img/Iniciatunegocio/2.png",
      title: "Calidad Premium",
      desc: "Componentes de grado industrial y los más altos estándares de purificación para un producto final insuperable.",
    },
    {
      img: "/img/Iniciatunegocio/3.png",
      title: "Dominio Total del Negocio",
      desc: "Recibe capacitación completa y acceso a nuestra base de conocimiento. Conviértete en un experto del agua.",
    },
    {
      img: "/img/Iniciatunegocio/4.png",
      title: "Modelo de Negocio Escalable",
      desc: "Inicia con una inversión inteligente y expande tu operación a medida que tus ganancias aumentan. El límite lo pones tú.",
    },
    {
      img: "/img/Iniciatunegocio/5.png",
      title: "Operación Simplificada",
      desc: "Nuestros sistemas son tan intuitivos que podrás gestionarlos sin necesidad de personal técnico especializado.",
    },
    {
      img: "/img/Iniciatunegocio/6.png",
      title: "Rápida Puesta en Marcha",
      desc: "Implementamos tu planta en tiempo récord para que empieces a generar ingresos lo antes posible.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 selection:bg-[#24d4da] selection:text-white">
      {/* Glow Effects Background (igual al HERO) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#24d4da] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
      </div>

      {/* Gradiente suave para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-xs font-extrabold tracking-[0.35em] uppercase text-[#24d4da]">
            Tu Éxito, Nuestra Misión
          </h2>
          <p className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitas para emprender.
          </p>
          <p className="mt-6 text-lg leading-8 text-white/75">
            Hemos perfeccionado cada aspecto del negocio para que tu única preocupación sea ver crecer tus ganancias.
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ventajas.map((v) => (
              <div
                key={v.title}
                className="
                  group relative overflow-hidden rounded-[28px]
                  bg-white/5 backdrop-blur-xl
                  border border-white/10
                  shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:bg-white/10
                "
              >
                {/* Glow interno al hover */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#24d4da]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-blue-600/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Shimmer suave */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute -inset-x-24 top-0 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 translate-x-[-40%] group-hover:translate-x-[45%] transition-transform duration-[1200ms]" />
                </div>

                <div className="relative px-5 py-8 text-center">
                  {/* Icono */}
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white border border-white/10">
                    <img
                      src={v.img}
                      alt={v.title}
                      className="h-12 w-12 object-contain drop-shadow"
                      loading="lazy"
                    />
                  </div>

                  {/* Título */}
                  <dt className="text-[16px] font-extrabold text-white">
                    {v.title}
                  </dt>

                  {/* Descripción */}
                  <dd className="mt-3 text-[13px] leading-relaxed text-white/75">
                    {v.desc}
                  </dd>

                  {/* Mini acento */}
                  <div className="mt-6 flex justify-center">
                    <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#24d4da] to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Ring glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-0 ring-[#24d4da]/25 transition group-hover:ring-2" />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
/* =========================
   PÁGINA PRINCIPAL
========================= */
const IniciaNegocio = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efecto para navbar glassmorphism si fuera necesario
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const selectedModels = modelos.filter((m) => selected.includes(m.id));

  return (
    <>
      <>

        {/* SECCIÓN DE MODELOS */}
        <section id="catalogo" className="py-24 bg-[#Fbfbfd]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-200 pb-8">
              <div>
                  <h2 className="text-3xl font-bold text-slate-900">Elige tu modelo de negocio</h2>
                  <p className="text-slate-500 mt-2">Emprende a tus posibilidades con darmax.</p>
              </div>
              {selected.length > 0 && (
                  <div className="mt-4 md:mt-0 px-4 py-2 bg-[#24d4da]/10 text-[#24d4da] rounded-lg font-medium text-sm animate-fade-in">
                      {selected.length} equipos seleccionados para comparar
                  </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" >
              {modelos.map((modelo) => (
                <TarjetaModelo
                  key={modelo.id}
                  modelo={modelo}
                  navigate={navigate}
                  selected={selected}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          </div>
        </section>

        {/* VENTAJAS */}
        <VentajasSection />

        {/* CTA FINAL (Clean) */}
        <section className="py-20 px-4 bg-white">
             <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-100 rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden">
                {/* Decoración */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#24d4da] opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">¿Necesitas una cotización a medida?</h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto text-lg">
                    Nuestro equipo pueden ayudarte a configurar la planta ideal según tu local y presupuesto.
                </p>
                <a
                   href={buildWaUrl({})}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-block px-10 py-4 rounded-full text-white font-bold text-lg transition-all hover:shadow-xl hover:shadow-[#24d4da]/30 hover:-translate-y-1"
                   style={{ background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, #0ea5e9 100%)` }}
                >
                   Solicitar Consultoría Gratuita
                </a>
             </div>
        </section>

        {/* BARRA COMPARATIVA FLOTANTE (Glassmorphism Puro) */}
        <div className={`fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none transition-all duration-500 ${selected.length > 0 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"}`}>
           <div className="pointer-events-auto flex items-center gap-6 px-8 py-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50 text-white">
              <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Comparando</span>
                  <span className="font-bold text-lg leading-none">{selected.length} <span className="text-slate-500 text-sm font-normal">Modelos</span></span>
              </div>

              <div className="h-8 w-px bg-white/20" />

              <button
                onClick={() => setCompareOpen(true)}
                className="px-6 py-2 rounded-full font-bold text-slate-900 transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: BRAND_COLOR }}
                disabled={selected.length < 2}
              >
                 Ver Tabla
              </button>
              
              <button
                onClick={() => setSelected([])}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors text-slate-400"
              >
                ✕
              </button>
           </div>
        </div>

        {/* MODAL COMPARAR */}
        <CompareModal
          open={compareOpen}
          onClose={() => setCompareOpen(false)}
          models={selectedModels}
          navigate={navigate}
        />

      </>
    </>
  );
};

/* =========================
   MODAL COMPARAR (Premium + Mobile Friendly)
   - Mobile: cards verticales con specs
   - Desktop: tabla scrollable (sticky headers + primera columna)
========================= */
function CompareModal({ open, onClose, models = [], navigate }) {
  if (!open) return null;

  const rows = [
    { label: "Tipo de negocio", key: "etiqueta" },
    { label: "Descripción", key: "descripcion" },
    { label: "Precio", key: "__precio" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-7xl max-h-[92vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] font-extrabold text-[#24d4da]">
              Comparativa
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Comparativa Técnica
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Desliza horizontalmente para ver más modelos.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#f5f5f7] overflow-auto max-h-[calc(92vh-84px)]">
          {/* ===== MOBILE (cards) ===== */}
          <div className="block lg:hidden p-4 sm:p-6">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="snap-center shrink-0 w-[86%] sm:w-[70%]"
                >
                  <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.35)] overflow-hidden">
                    {/* Top */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                            {m.nombre}
                          </h4>
                          <p className="text-sm font-semibold text-slate-500 mt-1">
                            {m.etiqueta}
                          </p>
                        </div>

                        <span className="text-[#24d4da] font-extrabold text-sm">
                          {formatMXN(m.precio)}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 h-44 grid place-items-center overflow-hidden">
                        <img
                          src={m.imagen}
                          alt={m.nombre}
                          className="h-36 w-auto object-contain"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>

                      {/* Specs */}
                      <div className="mt-5 space-y-3">
                        <Spec label="Tipo de negocio" value={m.etiqueta} />
                        <Spec label="Descripción" value={m.descripcion} />
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => navigate(`/configurar-maquina/${m.id}`)}
                        className="w-full py-3.5 rounded-2xl font-extrabold text-white shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition-all active:scale-[0.99]"
                        style={{ backgroundColor: BRAND_COLOR }}
                      >
                        Seleccionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              Tip: desliza para comparar modelos → 
            </p>
          </div>

          {/* ===== DESKTOP (table) ===== */}
          <div className="hidden lg:block">
            <div className="min-w-[980px]">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-6 w-72 bg-white sticky left-0 z-20 border-b border-r border-slate-100">
                      <span className="text-xs font-extrabold tracking-widest uppercase text-slate-500">
                        Características
                      </span>
                    </th>

                    {models.map((m) => (
                      <th
                        key={m.id}
                        className="p-6 bg-white border-b border-slate-100 align-top"
                      >
                        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
                          <img
                            src={m.imagen}
                            className="h-28 w-auto object-contain mx-auto"
                            alt={m.nombre}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                          <h4 className="mt-3 text-lg font-extrabold text-center text-slate-900 leading-tight">
                            {m.nombre}
                          </h4>
                          <p className="text-center text-slate-500 font-semibold text-sm mt-1">
                            {m.etiqueta}
                          </p>
                          <p className="text-center text-[#24d4da] font-extrabold text-xl mt-2">
                            {formatMXN(m.precio)}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm text-slate-700">
                  {rows.map((row, idx) => (
                    <tr key={row.label} className={idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                      <td className="p-6 font-extrabold text-slate-900 uppercase text-xs tracking-wider border-r border-slate-100 sticky left-0 z-10 bg-inherit">
                        {row.label}
                      </td>

                      {models.map((m) => (
                        <td key={m.id + row.key} className="p-6 align-top">
                          {row.key === "__precio"
                            ? formatMXN(m.precio)
                            : m[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Row actions */}
                  <tr className="bg-white">
                    <td className="p-6 border-r border-slate-100 sticky left-0 bg-white" />
                    {models.map((m) => (
                      <td key={m.id} className="p-6">
                        <button
                          onClick={() => navigate(`/configurar-maquina/${m.id}`)}
                          className="w-full py-3 rounded-2xl font-extrabold text-white shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition-all active:scale-[0.99]"
                          style={{ backgroundColor: BRAND_COLOR }}
                        >
                          Seleccionar
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer (mobile close) */}
        <div className="lg:hidden px-4 sm:px-6 py-4 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-extrabold text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            Cerrar comparación
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <p className="text-[11px] uppercase tracking-widest font-extrabold text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}


export default IniciaNegocio;