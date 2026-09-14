import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  BeakerIcon,
  CircleStackIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";

/* Configuracion de destino y URLs */
const GMAIL_TO = "darmaxagua@gmail.com";
const WHATSAPP_PHONE = "525519655369";

const buildGmailUrl = ({ to, subject, body, cc, bcc }) => {
  const base = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = [
    `to=${encodeURIComponent(to)}`,
    subject ? `su=${encodeURIComponent(subject)}` : "",
    body ? `body=${encodeURIComponent(body)}` : "",
    cc ? `cc=${encodeURIComponent(cc)}` : "",
    bcc ? `bcc=${encodeURIComponent(bcc)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  return `${base}&${params}`;
};

const buildMailto = ({ to, subject, body, cc, bcc }) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  if (cc) params.set("cc", cc);
  if (bcc) params.set("bcc", bcc);
  const qs = params.toString();
  return `mailto:${encodeURIComponent(to)}${qs ? `?${qs}` : ""}`;
};

const buildWhatsAppUrl = (tituloProyecto = "") => {
  const text = `Hola equipo Darmax, me interesa cotizar una solucion empresarial${
    tituloProyecto ? ` para: ${tituloProyecto}` : ""
  }. ¿Podrian brindarme asesoria personalizada?`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
};

/* Catalogo de Proyectos */
const proyectos = [
  {
    id: 1,
    titulo: "Franquicias DarmaxAgua",
    descripcion:
      "Conoce nuestras propuestas de franquicias DarmaxAgua. Asesoria y acompanamiento integral en toda tu adquisicion e implementacion.",
    imagen: "/img/proyectosEmpresariales/franquisias.jpg",
    industria: "Franquicias",
    specs: { alcance: "Llave en mano", tiempo: "15 a 30 dias", operacion: "24/7 Autonoma" }
  },
  {
    id: 2,
    titulo: "Vending personalizado para hoteles",
    descripcion:
      "Vending machines de agua purificada con la identidad visual de tu hotel, operando 24/7 de forma 100% automatizada sin necesidad de personal.",
    imagen: "/img/proyectosEmpresariales/Hoteles.png",
    industria: "Hoteles",
    specs: { alcance: "Personalizado", tiempo: "7 a 14 dias", operacion: "Zero Personal" }
  },
  {
    id: 3,
    titulo: "Planta purificadora para centros comerciales",
    descripcion:
      "Ingenieria de alto volumen (+10,000 L/dia) para centros comerciales y plazas. Incluye analisis hidraulico, instalacion y certificacion.",
    imagen: "/img/proyectosEmpresariales/centros.png",
    industria: "Centros comerciales",
    specs: { alcance: "+10,000 L/dia", tiempo: "Proyecto Llave", operacion: "Flujo Continuo" }
  },
  {
    id: 4,
    titulo: "Equipos de calentamiento de agua",
    descripcion:
      "Soluciones de calentamiento de alta eficiencia termica para aplicaciones residenciales, comerciales e industriales de gran escala.",
    imagen: "/img/proyectosEmpresariales/equipos.png",
    industria: "Calentamiento de agua",
    specs: { alcance: "Industrial", tiempo: "Alta Eficiencia", operacion: "Ahorro Energia" }
  },
  {
    id: 5,
    titulo: "Equipos y accesorios para piscina y spa",
    descripcion:
      "Sistemas de filtracion cuarzo/cristal, recirculacion y dosificacion automatizada para mantener albercas y spas en optimas condiciones sanitarias.",
    imagen: "/img/proyectosEmpresariales/piscinas.png",
    industria: "Piscinas y Spa",
    specs: { alcance: "Climatizado", tiempo: "Automatizado", operacion: "Norma Sanitaria" }
  },
  {
    id: 6,
    titulo: "Presurizadoras individuales y multiples",
    descripcion:
      "Sistemas hidroneumaticos de velocidad variable y presion constante para un suministro continuo sin caidas de caudal.",
    imagen: "/img/proyectosEmpresariales/Presurizadoras.jpg",
    industria: "Presurizacion",
    specs: { alcance: "Inverter", tiempo: "Presion Const.", operacion: "Bajo Consumo" }
  },
  {
    id: 7,
    titulo: "Bombas de superficie",
    descripcion:
      "Bombas centrifugas y multietapas en acero inoxidable para aplicaciones industriales con alta demanda y funcionamiento continuo.",
    imagen: "/img/proyectosEmpresariales/bombaagua.jpg",
    industria: "Bombas de superficie",
    specs: { alcance: "Inox 304/316", tiempo: "Alto Caudal", operacion: "Uso Rudo" }
  },
  {
    id: 8,
    titulo: "Equipos para aguas residuales",
    descripcion:
      "Tratamiento de efluentes, filtracion biologica y reutilizacion de aguas grises con tecnologia orientada al cumplimiento normativo ambiental.",
    imagen: "/img/proyectosEmpresariales/residuales.jpg",
    industria: "Aguas residuales",
    specs: { alcance: "Efluentes", tiempo: "Ecologico", operacion: "Reutilizacion" }
  },
  {
    id: 9,
    titulo: "Equipos y accesorios sumergibles",
    descripcion:
      "Bombas sumergibles de pozo profundo, desague y aplicaciones exigentes con motores de alto torque y proteccion termica integrada.",
    imagen: "/img/proyectosEmpresariales/sumergible.webp",
    industria: "Sumergibles",
    specs: { alcance: "Pozo Profundo", tiempo: "Hermetico", operacion: "Alto Rendimiento" }
  },
];

/* Animaciones Framer Motion */
const ease = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, delay, ease }
});

export default function ProyectosEmpresariales() {
  const [filtro, setFiltro] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevancia");
  const [busqueda, setBusqueda] = useState("");

  const industrias = useMemo(
    () => Array.from(new Set(proyectos.map((p) => p.industria))),
    []
  );

  const conteo = useMemo(() => {
    const counts = proyectos.reduce((acc, p) => {
      acc[p.industria] = (acc[p.industria] || 0) + 1;
      return acc;
    }, {});
    return { Todos: proyectos.length, ...counts };
  }, []);

  const proyectosFiltrados = useMemo(() => {
    let base =
      filtro === "Todos"
        ? proyectos
        : proyectos.filter((p) => p.industria === filtro);

    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase().trim();
      base = base.filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.industria.toLowerCase().includes(q)
      );
    }

    if (sortBy === "az") {
      return [...base].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    }
    if (sortBy === "industria") {
      return [...base].sort(
        (a, b) =>
          a.industria.localeCompare(b.industria, "es") ||
          a.titulo.localeCompare(b.titulo, "es")
      );
    }
    return base;
  }, [filtro, sortBy, busqueda]);

  /* Formulario de Cotizacion */
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    industria: "",
    proyecto: "",
    detalles: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const seleccionarProyecto = (p) => {
    setForm((prev) => ({
      ...prev,
      proyecto: p.titulo,
      industria: p.industria,
    }));
    document
      .getElementById("formulario-proyectos")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGmailSubmit = (e) => {
    e.preventDefault();
    const subject = `Cotizacion Empresarial - ${form.proyecto || "Darmax Agua"}`;
    const body = [
      `SOLICITUD DE PROYECTO EMPRESARIAL`,
      `=================================`,
      `Nombre: ${form.nombre}`,
      `Email: ${form.email}`,
      `Telefono: ${form.telefono || "No especificado"}`,
      `Industria: ${form.industria || filtro || "General"}`,
      `Proyecto / Solucion: ${form.proyecto || "Asesoria a la medida"}`,
      ``,
      `Detalles y Especificaciones del Proyecto:`,
      `${form.detalles || "Sin detalles adicionales"}`,
      ``,
      `Enviado desde darmaxagua.com.mx/proyectos-empresariales`,
    ].join("\n");

    const gmailUrl = buildGmailUrl({ to: GMAIL_TO, subject, body });
    const win = window.open(gmailUrl, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = buildMailto({ to: GMAIL_TO, subject, body });
  };

  return (
    <>
      <Helmet>
        <title>Proyectos Empresariales | Ingenieria y Soluciones Darmax Agua</title>
        <meta
          name="description"
          content="Soluciones de ingenieria hidraulica y purificacion a gran escala. Proyectos llave en mano para hoteles, franquicias, centros comerciales e industrias."
        />
        <meta
          name="keywords"
          content="proyectos empresariales, plantas purificadoras, vending corporativo, bombas sumergibles, presurizadoras, darmax agua"
        />
      </Helmet>

      <main className="min-h-screen bg-white selection:bg-[#24d4da] selection:text-white text-slate-900 overflow-x-hidden font-sans">
        
        {/* =========================================================
            SECCION 1: HERO LUMINOSO DARMAX (BLANCO & TURQUESA)
        ========================================================= */}
        <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-white text-slate-900">
          
          {/* Fondo hídrico con gotas luminosas idéntico a Nosotros */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/defkuaytw/image/upload/v1776407496/fondo_gotas_jrtijk.png" 
              alt="Fondo Gotas Darmax" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-[#24d4da]/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white" />
            
            {/* Halo turquesa suave */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-100/60 rounded-full blur-[120px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10">
            <motion.div {...fadeUp(0)} className="text-center max-w-4xl mx-auto">
              
              {/* Badge Eyebrow en tonos turquesa/teal */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-50 border border-cyan-200/80 text-[#168387] text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] mb-6 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#24d4da] animate-ping" />
                Ingenieria Hidraulica • Proyectos Llave en Mano • Soporte 24/7
              </div>

              {/* Titulo con jerarquia font-black y gradiente oficial */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tighter leading-[1.08]">
                Soluciones Empresariales <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#168387] via-[#24d4da] to-[#168387]">
                  Disenadas para Trascender.
                </span>
              </h1>

              {/* Parrafo descriptivo */}
              <p className="mt-6 text-base sm:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                Desarrollamos infraestructura hidraulica, tratamiento de agua y automatizacion comercial con los mas altos estandares de eficiencia, sustentabilidad y rentabilidad.
              </p>

              {/* Botones de accion luminosos */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    document
                      .getElementById("catalogo-proyectos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#24d4da] to-[#168387] text-white font-black rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center gap-3"
                >
                  Explorar Soluciones
                  <ArrowRightIcon className="w-4 h-4 stroke-[3]" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    document
                      .getElementById("formulario-proyectos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 sm:px-10 py-4 sm:py-5 bg-white border-2 border-[#24d4da] text-[#168387] font-black rounded-2xl shadow-xl shadow-cyan-500/10 hover:bg-cyan-50 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center gap-3"
                >
                  Cotizar Proyecto
                  <EnvelopeIcon className="w-4 h-4 stroke-[2.5]" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 sm:py-5 text-[#168387] hover:text-[#0d5a5e] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Asesor via WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================
            SECCION 2: METRICAS DE AUTORIDAD (ESTILO NOSOTROS)
        ========================================================= */}
        <section className="py-14 sm:py-16 bg-teal-50/50 border-y border-teal-100/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              <motion.div
                {...fadeUp(0)}
                className="relative p-7 rounded-[2.5rem] bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#168387] text-white flex items-center justify-center mb-5 shadow-lg shadow-teal-600/20 group-hover:rotate-12 transition-transform">
                    <BuildingOffice2Icon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-teal-950 tracking-tighter mb-1.5">
                    120+
                  </div>
                  <p className="text-[#168387] font-bold uppercase tracking-widest text-xs">
                    Instalaciones Industriales
                  </p>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp(0.1)}
                className="relative p-7 rounded-[2.5rem] bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#168387] text-white flex items-center justify-center mb-5 shadow-lg shadow-teal-600/20 group-hover:rotate-12 transition-transform">
                    <BeakerIcon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-teal-950 tracking-tighter mb-1.5">
                    500k+ L
                  </div>
                  <p className="text-[#168387] font-bold uppercase tracking-widest text-xs">
                    Capacidad Procesada / Dia
                  </p>
                </div>
              </motion.div>

              <motion.div
                {...fadeUp(0.2)}
                className="relative p-7 rounded-[2.5rem] bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#168387] text-white flex items-center justify-center mb-5 shadow-lg shadow-teal-600/20 group-hover:rotate-12 transition-transform">
                    <ShieldCheckIcon className="w-7 h-7" />
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-teal-950 tracking-tighter mb-1.5">
                    100%
                  </div>
                  <p className="text-[#168387] font-bold uppercase tracking-widest text-xs">
                    Garantia y Soporte Tecnico
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* =========================================================
            SECCION 3: CATALOGO DE SOLUCIONES Y FILTRADO
        ========================================================= */}
        <section id="catalogo-proyectos" className="py-20 sm:py-28 bg-white scroll-mt-10">
          <div className="max-w-7xl mx-auto px-5 sm:px-10">
            
            {/* Header del catalogo */}
            <motion.div {...fadeUp(0)} className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[#24d4da] font-black tracking-[0.25em] text-xs uppercase mb-3 block">
                Soluciones Integrales
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tighter leading-tight">
                Catalogo de Especialidades <br className="hidden sm:inline" />
                <span className="underline decoration-[#24d4da]/40 underline-offset-[8px] decoration-2">
                  Industriales y Comerciales
                </span>
              </h2>
              <p className="mt-4 text-slate-500 text-base sm:text-lg font-medium leading-relaxed">
                Selecciona la categoria o proyecto de tu interes para solicitar una cotizacion tecnica detallada.
              </p>
            </motion.div>

            {/* Barra de Filtros y Control */}
            <motion.div
              {...fadeUp(0.1)}
              className="mb-12 p-6 sm:p-8 rounded-[2.5rem] bg-slate-50 border border-slate-200/80 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
                
                <div className="flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-[#168387]" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-800">
                    Filtrar por Industria ({proyectos.length} disponibles)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar solucion o equipo..."
                    className="w-full sm:w-64 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#24d4da] transition-all"
                  />

                  <div className="relative w-full sm:w-auto">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full sm:w-44 px-4 py-2.5 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#24d4da] cursor-pointer transition-all appearance-none"
                    >
                      <option value="relevancia">Relevancia</option>
                      <option value="az">A - Z</option>
                      <option value="industria">Por Industria</option>
                    </select>
                    <ChevronDownIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Pills de categorias */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Todos", ...industrias].map((cat) => {
                  const activo = filtro === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFiltro(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                        activo
                          ? "bg-[#168387] text-white shadow-md shadow-teal-900/20 scale-105"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-[#168387] hover:text-[#168387]"
                      }`}
                    >
                      {cat}{" "}
                      <span className={`ml-1 text-[10px] ${activo ? "text-cyan-200" : "text-slate-400"}`}>
                        ({conteo[cat] ?? 0})
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Grid de Tarjetas de Proyectos */}
            {proyectosFiltrados.length === 0 ? (
              <div className="text-center py-20 px-6 rounded-[2.5rem] bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-bold text-lg">No encontramos soluciones que coincidan con tu busqueda.</p>
                <button
                  onClick={() => {
                    setFiltro("Todos");
                    setBusqueda("");
                  }}
                  className="mt-4 px-6 py-2.5 bg-[#168387] text-white rounded-xl font-black text-xs uppercase tracking-wider"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {proyectosFiltrados.map((p, idx) => (
                  <motion.article
                    key={p.id}
                    {...fadeUp(idx * 0.04)}
                    whileHover={{ y: -8 }}
                    className="group relative flex flex-col h-full rounded-[2.5rem] bg-white p-5 border-2 border-slate-100 hover:border-[#24d4da] transition-all duration-500 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-cyan-900/15 overflow-hidden"
                  >
                    {/* Badge superior de categoria en estilo claro */}
                    <div className="absolute top-8 left-8 z-20 px-3.5 py-1 bg-white/95 backdrop-blur-md text-[#168387] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-teal-100 shadow-md">
                      {p.industria}
                    </div>

                    {/* Contenedor de Imagen con Zoom en Hover */}
                    <div className="relative aspect-[16/11] overflow-hidden rounded-[1.8rem] bg-slate-100 mb-5">
                      <img
                        src={p.imagen}
                        alt={p.titulo}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/600x450/e2e8f0/475569?text=Darmax+Ingenieria";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Contenido descriptivo */}
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-slate-950 tracking-tight leading-tight group-hover:text-[#168387] transition-colors mb-2.5">
                        {p.titulo}
                      </h3>

                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-5">
                        {p.descripcion}
                      </p>

                      {/* Mini-specs de 3 columnas */}
                      <div className="grid grid-cols-3 gap-2 py-3 px-2 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
                        <div className="flex flex-col items-center text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Alcance</span>
                          <span className="text-[11px] font-bold text-slate-800 truncate w-full">{p.specs?.alcance || "Llave en mano"}</span>
                        </div>
                        <div className="flex flex-col items-center text-center border-x border-slate-200/60">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Despliegue</span>
                          <span className="text-[11px] font-bold text-slate-800 truncate w-full">{p.specs?.tiempo || "Optimo"}</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Operacion</span>
                          <span className="text-[11px] font-bold text-slate-800 truncate w-full">{p.specs?.operacion || "24/7"}</span>
                        </div>
                      </div>

                      {/* Botones de accion para cotizacion */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => seleccionarProyecto(p)}
                          className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-[#24d4da] to-[#168387] text-white text-xs font-black uppercase tracking-widest shadow-md shadow-cyan-600/15 hover:shadow-cyan-600/30 hover:brightness-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>Cotizar Ahora</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                        </motion.button>

                        <motion.a
                          whileTap={{ scale: 0.98 }}
                          href={buildWhatsAppUrl(p.titulo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Consultar por WhatsApp"
                          className="h-11 px-4 rounded-xl border-2 border-slate-200 text-[#168387] text-xs font-black uppercase tracking-widest hover:border-[#168387] hover:bg-cyan-50/50 transition-all duration-300 flex items-center justify-center shrink-0"
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        </motion.a>
                      </div>

                    </div>
                  </motion.article>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* =========================================================
            SECCION 4: FORMULARIO DE COTIZACION (BRAND GRADIENT OFICIAL)
        ========================================================= */}
        <section id="formulario-proyectos" className="relative py-24 sm:py-32 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white overflow-hidden scroll-mt-10 shadow-[inset_0_20px_50px_rgba(0,0,0,0.1)]">
          
          {/* Textura de puntos hídricos */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-10">
            
            {/* Contenedor Glassmorphism Blanco sobre el gradiente oficial de Darmax */}
            <motion.div
              {...fadeUp(0)}
              className="rounded-[3rem] sm:rounded-[3.5rem] bg-white/15 border border-white/30 backdrop-blur-2xl p-8 sm:p-12 md:p-16 shadow-[0_30px_100px_rgba(13,90,94,0.35)]"
            >
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] mb-4 backdrop-blur-md">
                  Atencion Directa de Ingenieria
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter">
                  ¿Listo para Iniciar tu Proyecto?
                </h3>
                <p className="mt-4 text-cyan-50 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                  Completa los datos de tu requerimiento. Generaremos un resumen tecnico para iniciar la revision inmediata con nuestro equipo.
                </p>
              </div>

              <form onSubmit={handleGmailSubmit} className="space-y-6 sm:space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                      Nombre Completo <span className="text-white">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={onChange}
                      placeholder="Ej. Ing. Carlos Mendoza"
                      className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white placeholder-white/60 font-bold text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                      Correo Electronico <span className="text-white">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="correo@empresa.com"
                      className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white placeholder-white/60 font-bold text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                      Telefono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={onChange}
                      placeholder="Ej. 55 1234 5678"
                      className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white placeholder-white/60 font-bold text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                      Industria de Interes
                    </label>
                    <select
                      name="industria"
                      value={form.industria}
                      onChange={onChange}
                      className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white font-bold text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all cursor-pointer"
                    >
                      <option value="" className="bg-teal-900 text-cyan-100">Seleccionar industria...</option>
                      {industrias.map((ind) => (
                        <option key={ind} value={ind} className="bg-teal-900 text-white">
                          {ind}
                        </option>
                      ))}
                      <option value="Otra" className="bg-teal-900 text-white">Otra / Solucion Mixta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                      Proyecto Especifico
                    </label>
                    <input
                      type="text"
                      name="proyecto"
                      value={form.proyecto}
                      onChange={onChange}
                      placeholder="Ej. Vending personalizado"
                      className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white placeholder-white/60 font-bold text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-100 mb-2">
                    Detalles Tecnicos o Especificaciones <span className="text-white">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    name="detalles"
                    value={form.detalles}
                    onChange={onChange}
                    placeholder="Describe los requerimientos: ubicacion del proyecto, caudal deseado, caracteristicas del agua cruda o fecha estimada de instalacion..."
                    className="w-full bg-white/20 border border-white/30 rounded-2xl py-3.5 px-4 text-white placeholder-white/60 font-medium text-sm focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/40 outline-none backdrop-blur-md transition-all resize-none"
                  />
                </div>

                {/* Botones de envio */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white text-[#168387] font-black rounded-2xl shadow-2xl hover:bg-cyan-50 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <span>Abrir Gmail y Enviar</span>
                    <ArrowRightIcon className="w-4 h-4 stroke-[3]" />
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={buildMailto({
                      to: GMAIL_TO,
                      subject: `Consulta Proyecto: ${form.proyecto || "Empresarial"}`,
                      body: form.detalles || "Solicitud de cotizacion",
                    })}
                    className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-white/10 backdrop-blur-xl border border-white/30 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <span>Otro Cliente de Correo</span>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  </motion.a>
                </div>

                <p className="text-center text-xs text-cyan-100/80 font-medium">
                  Atencion corporativa directa:{" "}
                  <a href={`mailto:${GMAIL_TO}`} className="text-white underline font-bold">
                    {GMAIL_TO}
                  </a>{" "}
                  • Nezahualcoyotl, Edo. de Mexico.
                </p>

              </form>
            </motion.div>

          </div>
        </section>

        {/* =========================================================
            SECCION 5: GRAND CTA FINAL (BRAND SIGNATURE)
        ========================================================= */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-10">
            <motion.div
              {...fadeUp(0)}
              className="bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] rounded-[3.5rem] sm:rounded-[4rem] p-10 sm:p-16 md:p-20 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(22,131,135,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-black/10 pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] mb-6 backdrop-blur-md">
                  Ingenieria que Fluye
                </span>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
                  Construyamos Juntos tu Proxima Infraestructura Hídrica.
                </h2>
                <p className="text-lg sm:text-2xl text-cyan-50 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                  Respaldamos tu inversion con tecnologia confiable, componentes certificados y el acompanamiento tecnico especializado de Darmax.
                </p>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    href={buildWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 sm:px-10 py-4 sm:py-5 bg-slate-950 text-white font-black rounded-2xl shadow-2xl text-xs sm:text-sm uppercase tracking-widest transition-all border border-slate-800 flex items-center gap-3"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#24d4da]" />
                    Hablar con un Ingeniero
                  </motion.a>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() =>
                      document
                        .getElementById("formulario-proyectos")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="px-8 sm:px-10 py-4 sm:py-5 bg-white/15 backdrop-blur-xl border border-white/30 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-widest transition-all hover:bg-white/25"
                  >
                    Solicitar Propuesta Tecnica
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
}
