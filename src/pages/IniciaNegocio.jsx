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

/* =========================
   TARJETA DE MODELO (Ultra Premium)
========================= */
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
        "group relative flex flex-col h-full overflow-hidden",
        "rounded-3xl bg-white",
        "border border-slate-200/70",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]",
        isSelected ? "ring-2 ring-[#24d4da]" : "",
      ].join(" ")}
    >
      {/* Header */}
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            {modelo.badge && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-slate-100 text-slate-700">
                {modelo.badge}
              </span>
            )}
            <h3 className="mt-3 text-xl font-extrabold text-slate-900 tracking-tight">
              {modelo.nombre}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {modelo.etiqueta}
            </p>
          </div>

          {/* Comparar pill (limpio) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(modelo.id);
            }}
            className={[
              "shrink-0 inline-flex items-center gap-2",
              "px-3 py-2 rounded-full border text-xs font-bold",
              "transition-colors",
              isSelected
                ? "border-[#24d4da] bg-[#24d4da]/10 text-[#24d4da]"
                : "border-slate-200 text-slate-600 hover:border-[#24d4da] hover:text-[#24d4da]",
            ].join(" ")}
            title="Comparar"
          >
            {isSelected ? (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-[#24d4da]" />
                Comparando
              </>
            ) : (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-slate-300 group-hover:bg-[#24d4da]" />
                Comparar
              </>
            )}
          </button>
        </div>

        {/* Imagen (muy limpia) */}
        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 h-56 flex items-center justify-center">
          {!errorImagen ? (
            <img
              src={modelo.imagen}
              alt={modelo.nombre}
              loading="lazy"
              className="max-h-[80%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              onError={() => setErrorImagen(true)}
            />
          ) : (
            <div className="text-slate-400 text-sm font-medium">Imagen no disponible</div>
          )}
        </div>

        {/* Precio + texto */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {formatMXN(modelo.precio)}
            </span>
            <span className="text-xs text-slate-400 font-semibold">+ IVA</span>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
            {modelo.descripcion}
          </p>
        </div>
      </div>

      {/* Footer acciones (simple) */}
      <div className="mt-auto p-7 pt-0">
        <button
          onClick={() => navigate(configurePath)}
          className="w-full py-3.5 rounded-2xl font-extrabold text-white transition-transform active:scale-[0.99]"
          style={{ backgroundColor: BRAND_COLOR }}
        >
          Configurar
        </button>

        <button
          onClick={() => navigate(modelo.rutaInfo)}
          className="w-full mt-3 text-xs font-bold text-slate-400 hover:text-[#24d4da] transition-colors"
        >
          Conoce más ›
        </button>
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
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#24d4da]">Tu Éxito, Nuestra Misión</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Todo lo que necesitas para emprender.
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Hemos perfeccionado cada aspecto del negocio para que tu única preocupación sea ver crecer tus ganancias.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ventajas.map((v) => (
              <div
                key={v.title}
                className="
                  group rounded-[28px] bg-white
                  border border-slate-200/70
                  shadow-[0_18px_35px_rgba(15,23,42,0.08)]
                  transition-all duration-300
                  hover:-translate-y-2 hover:bg-[#1e25331a]
                  overflow-hidden
                "
              >
                <div className="px-4 py-7 text-center">
                  {/* Icono */}
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center">
                    <img
                      src={v.img}
                      alt={v.title}
                      className="h-14 w-12 object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Título */}
                  <dt className="text-[17px] font-extrabold italic text-slate-900">
                    {v.title}
                  </dt>

                  {/* Descripción */}
                  <dd className="mt-3 text-[13px] leading-relaxed text-slate-700 italic">
                    {v.desc}
                  </dd>
                </div>
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
const IniciaNegocio = ({ inicioRef }) => {
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
      <Helmet>
        <title>Modelos & Precios | Darmax Agua</title>
        <meta name="description" content="Catálogo de purificadoras y vending machines con diseño premium." />
      </Helmet>

      <main ref={inicioRef} className="min-h-screen bg-[#Fbfbfd] selection:bg-[#24d4da] selection:text-white">
        
        {/* HERO SECTION (Estilo Dark Tech) */}
        <header className="relative bg-slate-900 pt-32 pb-32 overflow-hidden">
            {/* Glow Effects Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#24d4da] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#24d4da] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#24d4da]"></span>
                    </span>
                    <span className="text-xs font-bold text-white tracking-widest uppercase">Nueva Generación 2025</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-6">
                    Tu Futuro <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24d4da] to-cyan-200">
                        Comienza Aquí.
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                    Tecnología de purificación avanzada con diseño industrial de vanguardia. 
                    Elige la herramienta que transformará tu inversión.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" })}
                        className="px-8 py-4 rounded-full font-bold text-slate-900 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(36,212,218,0.4)]"
                        style={{ backgroundColor: BRAND_COLOR }}
                    >
                        Ver Modelos
                    </button>
                    <a 
                        href={buildWaUrl({})}
                        target="_blank" rel="noreferrer"
                        className="px-8 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-colors"
                    >
                        Hablar con Asesor
                    </a>
                </div>
            </div>
        </header>

        {/* SECCIÓN DE MODELOS */}
        <section id="catalogo" className="py-24 px-4 max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      </main>
    </>
  );
};

/* =========================
   MODAL (Estilo Specs Sheet)
========================= */
function CompareModal({ open, onClose, models = [], navigate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900">Comparativa Técnica</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-[#f5f5f7]">
            <div className="min-w-[800px]">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-6 w-1/4 bg-white sticky left-0 z-10 border-b border-r border-slate-100"></th>
                    {models.map((m) => (
                      <th key={m.id} className="p-6 bg-white border-b border-slate-100 align-top">
                         <img src={m.imagen} className="h-32 w-auto object-contain mx-auto mb-4" alt="" onError={(e)=>e.target.style.display='none'}/>
                         <h4 className="text-xl font-black text-center text-slate-900">{m.nombre}</h4>
                         <p className="text-center text-[#24d4da] font-bold text-lg mt-1">{formatMXN(m.precio)}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                  {[
                      { label: "Tipo de Negocio", val: "etiqueta" },
                      { label: "Descripción", val: "descripcion" },
                  ].map((row, idx) => (
                     <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                        <td className="p-6 font-bold text-slate-900 uppercase text-xs tracking-wider border-r border-slate-100 sticky left-0 z-10 bg-inherit">
                            {row.label}
                        </td>
                        {models.map((m) => (
                            <td key={m.id} className="p-6 text-center leading-relaxed border-slate-100 border-l-0">
                                {m[row.val]}
                            </td>
                        ))}
                     </tr>
                  ))}
                  
                  {/* Fila de Acciones */}
                  <tr className="bg-white">
                      <td className="p-6 border-r border-slate-100 sticky left-0 bg-white"></td>
                      {models.map((m) => (
                          <td key={m.id} className="p-6">
                              <button
                                onClick={() => navigate(`/configurar-maquina/${m.id}`)}
                                className="w-full py-3 rounded-xl font-bold text-white shadow-lg shadow-[#24d4da]/20 hover:shadow-[#24d4da]/40 transition-all"
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
    </div>
  );
}

export default IniciaNegocio;