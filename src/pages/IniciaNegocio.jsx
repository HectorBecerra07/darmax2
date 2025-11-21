import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

/* =========================
   CONSTANTES Y CONFIGURACIÓN
========================= */
const BRAND_COLOR = "#24d4da"; // Tu color cyan
const WHATSAPP_PHONE = "525519655369";

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
    id: "Purificadora",
    nombre: "Mostrador Darmax",
    etiqueta: "Purificadora",
    imagen: "/img/vending/mostrador.jpg",
    precio: 52950,
    descripcion: "El punto de entrada perfecto. Capacidad industrial de 600 garrafones, diseño compacto para locales comerciales.",
    rutaInfo: "/purificadora-info",
    badge: "Más Popular",
  },
  {
    id: "Vending",
    nombre: "Vending Touch ",
    etiqueta: "Máquina Vending",
    imagen: "/img/vending/TOUCHAGUA.png",
    precio: 54950,
    descripcion: "Automatización total 24/7. Genera ingresos pasivos con tecnología de despacho automático y cero personal.",
    rutaInfo: "/vending-info",
    badge: "Tecnología 24/7",
  },
  {
    id: "Vending-Limpieza",
    nombre: "Vending Limpieza",
    etiqueta: "Vending Limpieza",
    imagen: "/img/vending/9productos.jpeg",
    precio: 34950,
    descripcion: "Diversifica tu portafolio. Despacho automático de productos de limpieza a granel de alta demanda.",
    rutaInfo: "/vending-limpieza-info",
    badge: "Nuevo",
  },
];

/* =========================
   COMPONENTES UI PREMIUM
========================= */

const SectionTitle = ({ subtitle, title, align = "center" }) => (
  <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
      {title}
    </h2>
  </div>
);

/* =========================
   TARJETA DE MODELO (Diseño Apple Card)
========================= */
const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);

  return (
    <article 
      className={`relative group flex flex-col h-full bg-white rounded-[2rem] transition-all duration-500 overflow-hidden
      ${isSelected ? "shadow-[0_0_0_2px_#24d4da] shadow-cyan-500/20" : "hover:shadow-2xl hover:shadow-slate-200/50 border border-slate-100"}`}
    >
      {/* Header Tarjeta */}
      <div className="p-8 pb-0 relative z-10">
        {modelo.badge && (
          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-4">
            {modelo.badge}
          </span>
        )}
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{modelo.nombre}</h3>
        <p className="text-sm text-slate-500 font-medium">{modelo.etiqueta}</p>
      </div>

      {/* Imagen Flotante */}
      <div className="relative h-64 w-full flex items-center justify-center my-4 perspective-1000">
        {/* Círculo decorativo fondo */}
        <div className="absolute w-48 h-48 bg-gradient-to-tr from-[#24d4da]/20 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {!errorImagen ? (
          <img
            src={modelo.imagen}
            alt={modelo.nombre}
            loading="lazy"
            className="relative z-10 max-h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2"
            onError={() => setErrorImagen(true)}
          />
        ) : (
          <div className="bg-slate-50 w-full h-full flex flex-col items-center justify-center text-slate-400">
            <span className="text-4xl mb-2">🖼️</span>
          </div>
        )}
      </div>

      {/* Contenido Inferior */}
      <div className="mt-auto p-8 pt-0">
        <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{formatMXN(modelo.precio)}</span>
            <span className="text-xs text-slate-400 font-medium">+ IVA</span>
        </div>
        
        <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
            {modelo.descripcion}
        </p>

        <div className="grid grid-cols-4 gap-3">
           {/* Botón Principal */}
            <button
                onClick={() => navigate(`/configurar-maquina/${modelo.id}`)}
                className="col-span-3 py-3.5 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-95 hover:shadow-lg hover:shadow-[#24d4da]/40"
                style={{ backgroundColor: BRAND_COLOR }}
            >
                Configurar
            </button>

            {/* Botón Comparar */}
            <button
                onClick={(e) => { e.stopPropagation(); onToggleSelect(modelo.id); }}
                className={`col-span-1 flex items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                    isSelected 
                    ? "border-[#24d4da] bg-[#24d4da]/10 text-[#24d4da]" 
                    : "border-slate-100 text-slate-400 hover:border-[#24d4da] hover:text-[#24d4da]"
                }`}
                title="Comparar"
            >
                {isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                )}
            </button>
        </div>
        
        <button 
            onClick={() => navigate(modelo.rutaInfo)}
            className="w-full mt-4 text-xs font-semibold text-slate-400 hover:text-[#24d4da] transition-colors flex items-center justify-center gap-1"
        >
            Ver especificaciones técnicas <span className="text-lg leading-none">›</span>
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
      img: "/img/Iniciatunegocio/ACOMP.png",
      title: "Acompañamiento 360°",
      desc: "Te guiamos en cada paso, desde la instalación hasta la optimización de tu marketing para que solo te dediques a crecer."
    },
    {
      img: "/img/Iniciatunegocio/CALID.png",
      title: "Calidad Premium",
      desc: "Componentes de grado industrial y los más altos estándares de purificación para un producto final insuperable."
    },
    {
      img: "/img/Iniciatunegocio/DEMCON.png",
      title: "Dominio Total del Negocio",
      desc: "Recibe capacitación completa y acceso a nuestra base de conocimiento. Conviértete en un experto del agua."
    },
    {
      img: "/img/Iniciatunegocio/NEGESC.png",
      title: "Modelo de Negocio Escalable",
      desc: "Inicia con una inversión inteligente y expande tu operación a medida que tus ganancias aumentan. El límite lo pones tú."
    },
    {
      img: "/img/Iniciatunegocio/OPSIMP.png",
      title: "Operación Simplificada",
      desc: "Nuestros sistemas son tan intuitivos que podrás gestionarlos sin necesidad de personal técnico especializado."
    },
    {
      img: "/img/Iniciatunegocio/RAP.png",
      title: "Rápida Puesta en Marcha",
      desc: "Implementamos tu planta en tiempo récord para que empieces a generar ingresos lo antes posible."
    },
    
  ];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[#24d4da]">Tu Éxito, Nuestra Misión</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Todo lo que necesitas para dominar el mercado del agua
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Hemos perfeccionado cada aspecto del negocio para que tu única preocupación sea ver crecer tus ganancias.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {ventajas.map((ventaja) => (
              <div key={ventaja.title} className="flex flex-col p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/80 transition-shadow duration-500">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                  <img src={ventaja.img} alt={ventaja.title} className="h-12 w-12 object-contain" />
                  {ventaja.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">{ventaja.desc}</p>
                </dd>
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
                <h2 className="text-3xl font-bold text-slate-900">Elige tu Ecosistema</h2>
                <p className="text-slate-500 mt-2">Hardware de alto rendimiento para cada necesidad.</p>
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
                    Nuestros ingenieros pueden ayudarte a configurar la planta ideal según tu local y presupuesto.
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