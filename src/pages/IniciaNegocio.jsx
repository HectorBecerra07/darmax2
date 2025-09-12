import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

/* =========================
   WhatsApp (MX)
========================= */
const WHATSAPP_PHONE = "525519655369";
const buildWaUrl = ({ modeloId, modeloNombre }) => {
  const text = `Hola, quiero cotizar el modelo ${modeloNombre || "Darmax"} (ID: ${modeloId || "-"}) desde "Inicia tu Negocio".`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

const modelos = [
  {
    id: "Purificadora",
    nombre: "PURIFICADORAS",
    imagen: "/img/vending/mostrador.jpg",
    precio: 52950,
    descripcion: "Ideal para emprendedores. Capacidad 600 garrafones/mes.",
    rutaInfo: "/purificadora-info",
    badge: "Emprende hoy",
  },
  {
    id: "Vending",
    nombre: "MÁQUINAS VENDING",
    imagen: "/img/vending/TOUCHAGUA.png",
    precio: 54950,
    descripcion: "Para negocio en crecimiento. 1200 garrafones/mes.",
    rutaInfo: "/vending-info",
    badge: "Alta demanda",
  },
  {
  id: "Vending-Limpieza",
  nombre: "VENDING DE LIMPIEZA",
  imagen: "/img/vending/9productos.jpeg", 
  precio: 34950,
  descripcion: "Automatizada para venta de productos de limpieza.",
  rutaInfo: "/vending-limpieza-info",
  badge: "Nuevo",
}
];

const formatMXN = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  });

/* =========================
   Tarjeta de modelo (imagen más chica + contenido visible)
========================= */
const TarjetaModelo = ({ modelo, navigate, selected, onToggleSelect, variant = "grid" }) => {
  const [errorImagen, setErrorImagen] = useState(false);
  const isSelected = selected.includes(modelo.id);

  const ImageBlock = (
    <div className="relative h-52 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full bg-white flex items-center justify-center p-4">
      {!errorImagen ? (
        <img
          src={modelo.imagen}
          alt={modelo.nombre}
          loading="lazy"
          className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
          onError={() => setErrorImagen(true)}
          style={{ backfaceVisibility: "hidden", transform: "translateZ(0)" }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-2xl border border-dashed text-gray-400 text-sm">
          Imagen no disponible
        </div>
      )}

      {modelo.badge && (
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black text-white text-[11px] font-semibold px-3 py-1 shadow">
          {modelo.badge}
        </span>
      )}

      {/* Selector de comparativa */}
      <button
        type="button"
        onClick={() => onToggleSelect(modelo.id)}
        className={`absolute right-3 top-3 text-xs font-semibold rounded-full px-3 py-1 border transition ${
          isSelected
            ? "bg-[#ccff00] border-[#ccff00] text-black"
            : "bg-white/90 border-gray-300 text-slate-800 hover:bg-white"
        }`}
        aria-pressed={isSelected}
        title={isSelected ? "Quitar de comparar" : "Agregar a comparar"}
      >
        {isSelected ? "Comparando" : "Comparar"}
      </button>
    </div>
  );

  // Contenido con altura mínima y clamp de 2 líneas para la descripción
  const ContentBlock = (
    <div className="flex flex-col gap-2 p-5">
      <div className="min-h-[110px] sm:min-h-[120px]">
        <h3 className="text-base md:text-lg font-extrabold text-gray-900 tracking-tight">
          {modelo.nombre}
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg md:text-xl font-bold text-gray-900">
            {formatMXN(modelo.precio)}
          </span>
          <span className="text-xs text-gray-500">desde</span>
        </div>

        <p
          className="mt-2 text-sm text-gray-700 leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,           // 2 líneas para que no empuje los botones
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {modelo.descripcion}
        </p>
      </div>

      <div className="mt-1 grid grid-cols-1 gap-2">
        <button
          onClick={() => navigate(`/configurar-maquina/${modelo.id}`)}
          className="w-full py-2.5 rounded-xl font-semibold hover:brightness-95 transition shadow-sm"
          style={{ backgroundColor: "#ccff00", color: "black" }}
          aria-label={`Configurar ${modelo.nombre}`}
        >
          Configurar esta opción
        </button>

        <button
          onClick={() => navigate(modelo.rutaInfo)}
          className="w-full py-2.5 rounded-xl font-semibold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
          aria-label={`Conocer más sobre ${modelo.nombre}`}
        >
          Conoce más
        </button>
      </div>
    </div>
  );

  const selectedRing = isSelected ? "ring-2 ring-[#ccff00]" : "";

  if (variant === "list") {
    return (
      <article className={`group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden ${selectedRing}`}>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">{ImageBlock}</div>
          <div className="md:col-span-2">{ContentBlock}</div>
        </div>
      </article>
    );
  }

  return (
    <article className={`group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden ${selectedRing} flex flex-col`}>
      {ImageBlock}
      {ContentBlock}
    </article>
  );
};

/* =========================
   Modal de comparación
========================= */
function CompareModal({ open, onClose, models = [], navigate }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold">Comparación de modelos</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>

        <div className="p-4 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-3 font-semibold text-slate-600">Característica</th>
                {models.map((m) => (
                  <th key={m.id} className="text-left p-3 font-semibold text-slate-800">
                    {m.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="p-3 text-slate-600">Imagen</td>
                {models.map((m) => (
                  <td key={m.id} className="p-3">
                    <img
                      src={m.imagen}
                      alt={m.nombre}
                      className="h-20 w-auto object-contain"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Precio desde</td>
                {models.map((m) => (
                  <td key={m.id} className="p-3 font-semibold">
                    {formatMXN(m.precio)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Descripción</td>
                {models.map((m) => (
                  <td key={m.id} className="p-3 text-slate-700">
                    {m.descripcion}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Acciones</td>
                {models.map((m) => (
                  <td key={m.id} className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/configurar-maquina/${m.id}`)}
                        className="px-4 py-2 rounded-lg font-semibold hover:brightness-95 transition shadow-sm"
                        style={{ backgroundColor: "#ccff00", color: "black" }}
                      >
                        Configurar
                      </button>
                      <button
                        onClick={() => navigate(m.rutaInfo)}
                        className="px-4 py-2 rounded-lg font-semibold border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                      >
                        Conocer más
                      </button>
                      {/* El modal mantiene WhatsApp; dímelo si también lo quitamos */}
                      <a
                        href={buildWaUrl({ modeloId: m.id, modeloNombre: m.nombre })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg font-semibold text-black hover:brightness-95 transition shadow-sm"
                        style={{ backgroundColor: "#d7ff4f" }}
                      >
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
/* =========================
   Beneficios de invertir (con colores sólidos)
========================= */
function Beneficios() {
  const items = [
    { icon: "/img/Iniciatunegocio/RAP.png", title: "ROI RÁPIDO", desc: "RECUPERA TU INVERSIÓN EN MESES CON FLUJOS CONSTANTES." },
    { icon: "/img/Iniciatunegocio/OPSIMP.png", title: "OPERACIÓN SIMPLE", desc: "AUTOMATIZACIÓN Y CONSUMIBLES DISPONIBLES." },
    { icon: "/img/Iniciatunegocio/NEGESC.png", title: "NEGOCIO ESCALABLE", desc: "EMPIEZA CON 1 EQUIPO Y CRECE POR MÓDULOS." },
    { icon: "/img/Iniciatunegocio/ACOMP.png", title: "ACOMPAÑAMIENTO", desc: "INSTALACIÓN, CAPACITACIÓN Y SOPORTE DARMAX." },
    { icon: "/img/Iniciatunegocio/CALID.png", title: "CALIDAD Y GARANTÍA", desc: "EQUIPOS ROBUSTOS, RESPALDO Y REFACCIONES." },
    { icon: "/img/Iniciatunegocio/DEMCON.png", title: "DEMANDA CONSTANTE", desc: "AGUA Y LIMPIEZA: CONSUMO DIARIO ASEGURADO." },
  ];

  const colors = ["#5188C9", "#03A4A4"]; // alternar entre estos

  const img = (src) => (
    <img
      src={src}
      alt="Beneficio Darmax"
      className="w-full h-40 md:h-52 object-cover rounded-2xl"
      loading="lazy"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );

  return (
    <section className="w-full max-w-7xl mt-12">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Cards de beneficios */}
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 shadow-sm hover:shadow-lg transition text-white"
              style={{
                backgroundColor: colors[i % colors.length],
              }}
            >
              <div className="flex items-start gap-3">
                <img src={b.icon} alt={b.title} className="w-10 h-10 object-contain" />
                <div>
                  <h4 className="font-bold text-lg">{b.title}</h4>
                  <p className="text-xs mt-1">{b.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Collage con CTA */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">{img("/img/inicia/benefit-1.jpg")}</div>
          <div>{img("/img/inicia/benefit-2.jpg")}</div>
          <div>{img("/img/inicia/benefit-3.jpg")}</div>

          <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900">¿LISTO PARA INVERTIR?</h3>
            <p className="text-sm text-slate-600 mt-1">
              TE AYUDAMOS A ESTIMAR EL PUNTO DE EQUILIBRIO Y EL POTENCIAL DE TU ZONA.
            </p>
            <a
              href={buildWaUrl({})}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-4 px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
              style={{ backgroundColor: "#ccff00" }}
            >
              COTIZAR POR WHATSAPP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================
   Página IniciaNegocio
========================= */
const IniciaNegocio = ({ inicioRef }) => {
  const navigate = useNavigate();

  const [view, setView] = useState("grid"); // "grid" | "list"
  const [selected, setSelected] = useState([]); // ids seleccionados
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
        <title>
          Inicia tu Negocio con Purificadoras y Máquinas Vending | Darmax
        </title>
        <meta
          name="description"
          content="Arranca tu emprendimiento con purificadoras y máquinas vending. Instala, opera y escala con el respaldo de Darmax."
        />
      </Helmet>

      <main
        ref={inicioRef}
        className="min-h-screen bg-white pt-24 pb-16 px-6 flex flex-col items-center"
      >
       {/* Hero */}
<header className="w-full max-w-7xl">
  <div
    className="relative overflow-hidden rounded-3xl text-white"
    style={{
      backgroundImage: "url('/img/Iniciatunegocio/Manodeagua.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Overlay oscuro */}
    <div className="absolute inset-0 bg-black/40" />

    <div className="relative p-8 md:p-12 z-10">
      <span className="inline-block text-[11px] tracking-widest uppercase bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur">
        Emprende con respaldo Darmax
      </span>

      <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight uppercase">
        Inicia tu negocio con Darmax
      </h1>

      <p className="mt-3 md:mt-4 text-white/80 max-w-2xl">
        Equipos confiables, instalación y asesoría para que arranques rápido y
        seguro. Elige tu modelo, configúralo y escala cuando lo necesites.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        <Pill>Instalación y capacitación</Pill>
        <Pill>Soporte técnico</Pill>
        <Pill>Refacciones disponibles</Pill>
        <Pill>ROI competitivo</Pill>
      </ul>

      {/* CTA Hero */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={buildWaUrl({})}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
          style={{ backgroundColor: "#ccff00" }}
        >
          Cotizar por WhatsApp
        </a>
        <button
          onClick={() => {
            const el = document.getElementById("modelos");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-6 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/15 backdrop-blur transition"
        >
          Ver modelos
        </button>
      </div>
    </div>
  </div>
</header>


        {/* Beneficios de invertir */}
        <Beneficios />

        {/* Controles superiores */}
        <section className="w-full max-w-7xl mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Vista:</span>
            <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm font-medium ${
                  view === "grid" ? "bg-[#ccff00] text-black" : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
              >
                Grid
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium border-l border-gray-200 ${
                  view === "list" ? "bg-[#ccff00] text-black" : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
              >
                Lista
              </button>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Seleccionados: <span className="font-semibold">{selected.length}</span>
          </div>
        </section>

        {/* Grid / Lista de modelos */}
        <section id="modelos" className="w-full max-w-7xl mt-6">
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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

        {/* CTA inferior */}
        <section className="w-full max-w-7xl mt-14">
          <div className="rounded-3xl border border-gray-100 shadow-sm bg-white p-6 md:p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              ¿Listo para comenzar?
            </h2>
            <p className="text-slate-600 mt-2">
              Escríbenos y armamos tu cotización en minutos.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <a
                href={buildWaUrl({})}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#ccff00" }}
              >
                Cotizar por WhatsApp
              </a>
              
            </div>
          </div>
        </section>

        {/* Barra de comparación (flotante) */}
        {selected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-3 rounded-full bg-white border border-gray-200 shadow-lg px-3 py-2">
              <span className="text-sm text-slate-700">
                {selected.length} seleccionado{selected.length > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setCompareOpen(true)}
                disabled={!canCompare}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                  canCompare
                    ? "text-black hover:brightness-95"
                    : "text-slate-400 cursor-not-allowed"
                }`}
                style={canCompare ? { backgroundColor: "#ccff00" } : {}}
                title={canCompare ? "Comparar modelos" : "Selecciona al menos 2"}
              >
                Comparar
              </button>
              <button
                onClick={clearSelection}
                className="px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-slate-800 transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Modal de comparación */}
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
   Subcomponentes UI
========================= */
function Pill({ children }) {
  return (
    <li className="inline-flex items-center rounded-full bg-white/10 text-white text-xs font-semibold px-3 py-1 border border-white/20 backdrop-blur">
      {children}
    </li>
  );
}
