import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

/* =========================
   CONSTANTES Y UTILIDADES
========================= */
const WHATSAPP_PHONE = "525519655369";
const buildWaUrl = ({ modeloId, modeloNombre }) => {
  const text = `Hola, quiero cotizar el modelo ${modeloNombre || "Darmax"} (ID: ${modeloId || "-"}) desde "Inicia tu Negocio".`;
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
    nombre: "PURIFICADORAS",
    imagen: "/img/vending/mostrador.jpg",
    precio: 52950,
    descripcion: "Ideal para emprendedores. Capacidad 600 garrafones/mes. El punto de partida perfecto.",
    rutaInfo: "/purificadora-info",
    badge: "Emprende hoy",
  },
  {
    id: "Vending",
    nombre: "MÁQUINAS VENDING",
    imagen: "/img/vending/TOUCHAGUA.png",
    precio: 54950,
    descripcion: "Para negocio en crecimiento. 1200 garrafones/mes. Automatización total 24/7.",
    rutaInfo: "/vending-info",
    badge: "Best Seller",
  },
  {
    id: "Vending-Limpieza",
    nombre: "VENDING DE LIMPIEZA",
    imagen: "/img/vending/9productos.jpeg",
    precio: 34950,
    descripcion: "Automatizada para venta de productos de limpieza a granel. Diversifica tus ingresos.",
    rutaInfo: "/vending-limpieza-info",
    badge: "Nuevo Lanzamiento",
  },
];

/* =========================
   COMPONENTES UI (Estética Mejorada)
========================= */

// Badge pequeño para textos destacados
const BadgeSmall = ({ text, color = "bg-lime-400" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 ${color}`}>
    {text}
  </span>
);

/* =========================
   TARJETA DE MODELO (Rediseñada)
========================= */
const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect, variant = "grid" }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);

  // Bloque de imagen con fondo sutil y hover
  const ImageBlock = (
    <div className="relative h-64 w-full bg-gray-50 flex items-center justify-center p-6 overflow-hidden group-hover:bg-lime-50/30 transition-colors duration-500">
      {!errorImagen ? (
        <img
          src={modelo.imagen}
          alt={modelo.nombre}
          loading="lazy"
          className="max-h-full w-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1"
          onError={() => setErrorImagen(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
          <span className="text-2xl mb-2">📷</span>
          Imagen no disponible
        </div>
      )}

      {/* Badge Flotante */}
      {modelo.badge && (
        <div className="absolute top-4 left-4">
           <BadgeSmall text={modelo.badge} color="bg-slate-900 text-white" />
        </div>
      )}

      {/* Botón Comparar (Más discreto pero accesible) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(modelo.id);
        }}
        className={`absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 z-10 ${
          isSelected
            ? "bg-blue-400 border-lime-400 text-slate-900 scale-110 shadow-lg"
            : "bg-white border-gray-200 text-gray-400 hover:border-lime-400 hover:text-lime-600"
        }`}
        title="Comparar"
      >
        {isSelected ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        )}
      </button>
    </div>
  );

  const ContentBlock = (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
          {modelo.nombre}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-slate-500 font-medium">Desde</span>
            <span className="text-2xl font-bold text-slate-900">{formatMXN(modelo.precio)}</span>
        </div>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {modelo.descripcion}
        </p>
      </div>

      <div className="mt-auto space-y-3">
        <button
          onClick={() => navigate(`/configurar-maquina/${modelo.id}`)}
          className="w-full py-3 rounded-xl font-bold text-slate-900 transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ backgroundColor: "#ccff00" }}
        >
          <span></span> Configurar tu Modelo
        </button>
        
        <button
          onClick={() => navigate(modelo.rutaInfo)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          Conocer Más Información
        </button>
      </div>
    </div>
  );

  if (variant === "list") {
    return (
      <article className={`group bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl ${isSelected ? "ring-2 ring-lime-400 ring-offset-2" : ""}`}>
        <div className="grid md:grid-cols-3 h-full">
          <div className="md:col-span-1 h-full">{ImageBlock}</div>
          <div className="md:col-span-2">{ContentBlock}</div>
        </div>
      </article>
    );
  }

  // Grid variant
  return (
    <article className={`group bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full ${isSelected ? "ring-2 ring-lime-400 ring-offset-4" : ""}`}>
      {ImageBlock}
      {ContentBlock}
    </article>
  );
};

/* =========================
   SECCIÓN BENEFICIOS (Estilo Dark Tech)
========================= */
function Beneficios() {
  const items = [
    { icon: "💰", title: "Retorno Rápido", desc: "Recupera tu inversión en 12 a 15 meses aprox." },
    { icon: "🤖", title: "Ventas 24/7", desc: "Ingresos automáticos. Olvídate de contratar personal." },
    { icon: "📈", title: "Escalable", desc: "Crece tu red añadiendo más módulos fácilmente." },
    { icon: "🤝", title: "Acompañamiento", desc: "Incluimos instalación, capacitación y soporte." },
    { icon: "🛡️", title: "Garantía Premium", desc: "Materiales certificados y respaldo total Darmax." },
    { icon: "💧", title: "Alta Demanda", desc: "Producto de primera necesidad con venta segura." },
  ];

  return (
    <section className="w-full max-w-7xl mt-16 mb-8">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        
        {/* Columna Texto e Items */}
        <div>
            <span className="text-lime-500 font-bold tracking-widest text-xs uppercase mb-2 block">Por qué invertir</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                Negocio rentable,<br /> 
                <span className="text-slate-400">operación sencilla.</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
                {items.map((b, i) => (
                <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl hover:border-lime-300 hover:shadow-lg transition-all group">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform origin-left">{b.icon}</div>
                    <h4 className="font-bold text-slate-900 text-sm uppercase">{b.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
                </div>
                ))}
            </div>
        </div>

        {/* Columna Imagen / Collage */}
        <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-tr from-lime-300 to-emerald-200 rounded-[2.5rem] opacity-20 blur-2xl -z-10" />
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Fondo decorativo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                
                <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-bold leading-snug">
                        "Configura tu éxito.<br/> <span className="text-lime-400">Invierte seguro."</span>
                    </h3>
                    <p className="text-slate-300 text-sm">
                        Personaliza tu equipo de acuerdo a tu presupuesto. 
                        Únete a la familia de emprendedores que ya están facturando.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <img src="/img/inicia/benefit-1.jpg" alt="Instalación" className="rounded-xl h-32 w-full object-cover opacity-80 hover:opacity-100 transition" onError={(e) => e.target.style.display='none'}/>
                        <img src="/img/inicia/benefit-2.jpg" alt="Vending" className="rounded-xl h-32 w-full object-cover opacity-80 hover:opacity-100 transition" onError={(e) => e.target.style.display='none'}/>
                    </div>

                    <a
                        href={buildWaUrl({})}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-lime-400 text-slate-900 font-bold py-4 rounded-xl hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.4)]"
                    >
                        HABLAR CON UN ASESOR
                    </a>
                </div>
             </div>
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
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const clearSelection = () => setSelected([]);
  const selectedModels = modelos.filter((m) => selected.includes(m.id));
  const canCompare = selectedModels.length >= 2;

  return (
    <>
      <Helmet>
        <title>Inicia tu Negocio | Darmax</title>
        <meta name="description" content="Configura tu purificadora o vending machine." />
      </Helmet>

      <main ref={inicioRef} className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-8 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <header className="w-full max-w-7xl mb-8">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white shadow-2xl min-h-[500px] flex flex-col justify-center">
             {/* Background Image */}
             <div 
                className="absolute inset-0 opacity-60 transition-transform duration-[20s] hover:scale-105"
                style={{
                    backgroundImage: "url('/img/Iniciatunegocio/Manodeagua.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
             
             {/* Contenido Hero */}
             <div className="relative z-10 p-8 md:p-16 max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest uppercase">Tecnología para Emprender</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black uppercase leading-none mb-6">
                    Inicia tu negocio <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-blue-400">Con Darmax</span>
                </h1>
                
                <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                    Aprovecha nuestro posicionamiento de marca. Respuesta rápida de instalación (15 días hábiles).
                    Únete a la red de purificación más moderna de México.
                </p>

                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => {
                            const el = document.getElementById("modelos");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="bg-lime-400 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-lime-300 transition shadow-lg hover:shadow-lime-400/20"
                    >
                        Ver Modelos Disponibles
                    </button>
                    <a 
                        href={buildWaUrl({})}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 backdrop-blur transition"
                    >
                        Cotizar Personalizada
                    </a>
                </div>
             </div>
          </div>
        </header>

        {/* BENEFICIOS */}
        <Beneficios />

        {/* CONTROLES DE VISTA */}
        <section className="w-full max-w-7xl mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
           <div>
              <h3 className="text-2xl font-bold text-slate-900">Elige tu Equipo</h3>
              <p className="text-slate-500 text-sm">Selecciona un modelo para configurarlo a tu medida.</p>
           </div>

           <div className="flex items-center gap-4">
              {selected.length > 0 && (
                  <span className="text-sm font-medium text-lime-600 bg-lime-50 px-3 py-1 rounded-full">
                      {selected.length} para comparar
                  </span>
              )}
              
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                 <button 
                    onClick={() => setView("grid")}
                    className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white shadow text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    title="Vista Cuadrícula"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                 </button>
                 <button 
                    onClick={() => setView("list")}
                    className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white shadow text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    title="Vista Lista"
                 >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                 </button>
              </div>
           </div>
        </section>

        {/* GRID DE MODELOS */}
        <section id="modelos" className="w-full max-w-7xl mt-8">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {modelos.map((modelo) => (
                <TarjetaModelo
                  key={modelo.id}
                  modelo={modelo}
                  navigate={navigate}
                  selected={selected}
                  onToggleSelect={toggleSelect}
                  variant="grid"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {modelos.map((modelo) => (
                <TarjetaModelo
                  key={modelo.id}
                  modelo={modelo}
                  navigate={navigate}
                  selected={selected}
                  onToggleSelect={toggleSelect}
                  variant="list"
                />
              ))}
            </div>
          )}
        </section>

        {/* CTA FINAL */}
        <section className="w-full max-w-4xl mt-20">
           <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lime-300 via-emerald-400 to-cyan-400" />
               <h2 className="text-3xl font-black text-slate-900 mb-4">¿No sabes cuál elegir?</h2>
               <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                   Nuestros expertos pueden ayudarte a analizar tu ubicación y presupuesto para recomendarte la mejor opción.
               </p>
               <a
                  href={buildWaUrl({})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition shadow-xl"
               >
                  <span>💬</span> Recibir Asesoría Gratuita
               </a>
           </div>
        </section>

        {/* BARRA FLOTANTE COMPARAR (Glassmorphism) */}
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${selected.length > 0 ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
           <div className="flex items-center gap-4 pl-6 pr-2 py-2 rounded-full bg-slate-900/90 backdrop-blur-md shadow-2xl border border-slate-700 text-white">
              <span className="text-sm font-medium">
                 <span className="text-lime-400 font-bold">{selected.length}</span> Equipos
              </span>
              
              <div className="h-4 w-px bg-slate-700 mx-1"></div>

              <button
                onClick={() => setCompareOpen(true)}
                disabled={!canCompare}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                   canCompare 
                   ? "bg-blue-400 text-slate-900 hover:bg-lime-300 hover:scale-105" 
                   : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                 Comparar
              </button>
              
              <button
                onClick={clearSelection}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 transition"
                title="Limpiar selección"
              >
                 ✕
              </button>
           </div>
        </div>

        {/* MODAL COMPARAR (Sin cambios lógicos, solo estilos básicos) */}
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

export default IniciaNegocio;

/* =========================
   MODAL (Solo actualización de estilos visuales, lógica intacta)
========================= */
function CompareModal({ open, onClose, models = [], navigate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
          <div>
              <h3 className="text-xl font-black text-slate-900">Comparativa de Modelos</h3>
              <p className="text-sm text-slate-500">Analiza las características lado a lado</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider w-1/4">Característica</th>
                    {models.map((m) => (
                      <th key={m.id} className="p-4 font-black text-slate-900 text-lg min-w-[200px]">
                        {m.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  <tr>
                    <td className="p-4 font-medium">Vista Previa</td>
                    {models.map((m) => (
                      <td key={m.id} className="p-4">
                        <img src={m.imagen} alt={m.nombre} className="h-24 w-auto object-contain mx-auto" onError={(e)=>e.target.style.display='none'} />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Precio Base</td>
                    {models.map((m) => (
                      <td key={m.id} className="p-4 font-bold text-slate-900 text-lg">
                        {formatMXN(m.precio)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Descripción</td>
                    {models.map((m) => (
                      <td key={m.id} className="p-4 leading-relaxed">
                        {m.descripcion}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium bg-slate-50">Acciones</td>
                    {models.map((m) => (
                      <td key={m.id} className="p-4 bg-slate-50">
                        <button
                          onClick={() => navigate(`/configurar-maquina/${m.id}`)}
                          className="w-full py-2 rounded-lg font-bold text-slate-900 mb-2 hover:brightness-95 transition"
                          style={{ backgroundColor: "#ccff00" }}
                        >
                          Configurar
                        </button>
                        <a
                           href={buildWaUrl({ modeloId: m.id, modeloNombre: m.nombre })}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block w-full text-center py-2 rounded-lg font-semibold border border-slate-200 hover:bg-white transition text-xs"
                        >
                           Cotizar WhatsApp
                        </a>
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