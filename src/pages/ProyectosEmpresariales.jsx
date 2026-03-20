import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

/* ========= Configuración de destino ========= */
const GMAIL_TO = "darmaxagua@gmail.com";
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

/* ========= Datos ========= */
const HERO_BG =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=2400&q=80";

const proyectos = [
  {
    id: 1,
    titulo: "Franquicias DarmaxAgua",
    descripcion:
      "Conoce nuestras propuestas de franquicias DarmaxAgua. Asesoría personalizada en toda tu adquisición.",
    imagen: "/img/proyectosEmpresariales/franquisias.jpg",
    industria: "Franquicias",
  },
  {
    id: 2,
    titulo: "Vending personalizado para hoteles",
    descripcion:
      "Vending machines con branding del hotel, operando 24/7 sin personal.",
    imagen: "/img/proyectosEmpresariales/Hoteles.png",
    industria: "Hoteles",
  },
  {
    id: 3,
    titulo: "Planta purificadora para centros comerciales",
    descripcion:
      "Proyecto llave en mano (+10,000 L/día). Incluye consultoría y capacitación.",
    imagen: "/img/proyectosEmpresariales/centros.png",
    industria: "Centros comerciales",
  },
  {
    id: 4,
    titulo: "Equipos de calentamiento de agua",
    descripcion:
      "Soluciones de calentamiento eficientes para aplicaciones residenciales, comerciales e industriales.",
    imagen: "/img/proyectosEmpresariales/equipos.png",
    industria: "Calentamiento de agua",
  },
  {
    id: 5,
    titulo: "Equipos y accesorios para piscina y spa",
    descripcion:
      "Filtración, circulación y accesorios para mantener tu piscina y spa en óptimas condiciones.",
    imagen: "/img/proyectosEmpresariales/piscinas.png",
    industria: "Piscinas y Spa",
  },
  {
    id: 6,
    titulo: "Presurizadoras individuales y múltiples",
    descripcion:
      "Sistemas tradicionales y de presión constante para caudal estable en todo momento.",
    imagen: "/img/proyectosEmpresariales/Presurizadoras.jpg",
    industria: "Presurización",
  },
  {
    id: 7,
    titulo: "Bombas de superficie",
    descripcion:
      "Bombas para aplicaciones residenciales, comerciales e industriales con alta confiabilidad.",
    imagen: "/img/proyectosEmpresariales/bombaagua.jpg",
    industria: "Bombas de superficie",
  },
  {
    id: 8,
    titulo: "Equipos para aguas residuales",
    descripcion:
      "Manejo de efluentes y tratamiento de aguas residuales con equipos robustos y eficientes.",
    imagen: "/img/proyectosEmpresariales/residuales.jpg",
    industria: "Aguas residuales",
  },
  {
    id: 9,
    titulo: "Equipos y accesorios sumergibles",
    descripcion:
      "Bombas y accesorios sumergibles para pozos, drenaje y aplicaciones exigentes.",
    imagen: "/img/proyectosEmpresariales/sumergible.webp",
    industria: "Sumergibles",
  },
];

export default function ProyectosEmpresariales() {
  const [filtro, setFiltro] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevancia"); // "relevancia" | "az" | "industria"

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
    const base =
      filtro === "Todos"
        ? proyectos
        : proyectos.filter((p) => p.industria === filtro);

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
    return base; // relevancia
  }, [filtro, sortBy]);

  /* ======= Form ======= */
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

  const handleGmailSubmit = (e) => {
    e.preventDefault();
    const subject = `Cotización - ${form.proyecto || "Proyecto empresarial"}`;
    const body = [
      `Nombre: ${form.nombre}`,
      `Email: ${form.email}`,
      `Teléfono: ${form.telefono || "-"}`,
      `Industria: ${form.industria || filtro || "-"}`,
      `Proyecto: ${form.proyecto || "-"}`,
      "",
      "Mensaje:",
      form.detalles || "-",
    ].join("\n");

    const gmailUrl = buildGmailUrl({ to: GMAIL_TO, subject, body });
    const win = window.open(gmailUrl, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = buildMailto({ to: GMAIL_TO, subject, body });
  };

  return (
    <>
      <Helmet>
        <title>Proyectos Empresariales - Darmax</title>
        <meta
          name="description"
          content="Soluciones empresariales a la medida. Proyectos llave en mano, desde la ingeniería hasta la puesta en marcha y soporte continuo."
        />
      </Helmet>

      <div className="bg-white">
        {/* HERO (rediseño para combinar: limpio, corporativo, azul/cyan) */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HERO_BG}
              alt="Proyectos Empresariales"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-white" />

            {/* halos sobrios (sin lime) */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 h-80 w-[46rem] rounded-full bg-sky-400/15 blur-3xl" />
            <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative px-4 md:px-10 pt-24 sm:pt-32 pb-12 max-w-screen-2xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Llave en mano • Ingeniería • Instalación • Soporte
              </span>

              <h2 className="mt-6 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                Proyectos Empresariales
              </h2>
              <p className="mt-4 text-white/80 text-lg md:text-xl">
                Soluciones a la medida: desde la planeación hasta la puesta en
                marcha.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("catalogo-proyectos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-sky-400 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-300"
                >
                  Ver industrias
                  <ArrowRight />
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("formulario-proyectos")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3 font-semibold text-white backdrop-blur transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5"
                >
                  Cotizar ahora
                  <MailIcon />
                </button>
              </div>
            </div>

            {/* Banda tipo filtro (más limpia, “site-like”) */}
            <div className="mt-12">
              <div className="mx-auto max-w-7xl rounded-3xl border border-white/15 bg-white/10 p-4 md:p-6 backdrop-blur">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="text-white font-extrabold text-xl md:text-2xl">
                      Industrias que atendemos
                    </h3>
                    <p className="text-white/70 text-sm md:text-base">
                      Filtra por industria y cotiza en 1 clic.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Pill>24/7</Pill>
                    <Pill>Llave en mano</Pill>
                    <Pill>Capacitación</Pill>
                    <Pill>Soporte</Pill>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Todos", ...industrias].map((cat) => {
                    const activo = filtro === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFiltro(cat)}
                        className={[
                          "px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border",
                          activo
                            ? "bg-white text-slate-950 border-white shadow-sm"
                            : "bg-white/10 text-white/85 border-white/15 hover:bg-white/15",
                        ].join(" ")}
                        aria-pressed={activo}
                      >
                        {cat}{" "}
                        <span className="opacity-70 font-normal">
                          ({conteo[cat] ?? 0})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATÁLOGO (cards más “corporativas”, fondo blanco, borde gris suave) */}
        <section
          id="catalogo-proyectos"
          className="px-4 md:px-10 pt-10 pb-16 max-w-screen-2xl mx-auto"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Catálogo de Soluciones
                </h3>
                <p className="text-slate-600 mt-1">
                  Selecciona una tarjeta para iniciar tu cotización.
                </p>
              </div>

              {/* Ordenar (neutral, acorde a sitio) */}
              <label className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 font-medium">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border-slate-200 bg-white px-3 py-2 text-slate-700 font-semibold shadow-sm outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="az">A-Z</option>
                  <option value="industria">Industria</option>
                </select>
              </label>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {proyectosFiltrados.map((p, idx) => (
                <MotionCard key={p.id} delay={idx * 0.05}>
                  <ProjectCard proyecto={p} setForm={setForm} />
                </MotionCard>
              ))}
            </div>

            <div className="mt-16 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        </section>

        {/* FORM SECTION (más “brand-corporate”, sin neón, dark elegante) */}
        <section className="relative py-20 overflow-hidden">
          {/* Fondo sobrio */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80"
                className="w-full h-full object-cover"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* acentos suaves */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-400/10 blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />

            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div
            id="formulario-proyectos"
            className="relative z-10 px-4 md:px-10 max-w-5xl mx-auto scroll-mt-20"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)] p-8 md:p-12 text-white">
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-sky-200 text-xs font-bold uppercase tracking-wider mb-4">
                  Contacto Directo
                </span>
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                  ¿Listo para cotizar tu proyecto?
                </h3>
                <p className="mt-4 text-slate-300 text-lg max-w-2xl mx-auto">
                  Completa el formulario y se abrirá tu correo con un borrador
                  listo para enviar a{" "}
                  <span className="text-sky-200 font-semibold">
                    darmaxagua@gmail.com
                  </span>
                  .
                </p>
              </div>

              <form onSubmit={handleGmailSubmit} className="grid gap-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    required
                    label="Nombre completo"
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    placeholder="Escribe tu nombre"
                  />
                  <FormInput
                    required
                    type="email"
                    label="Correo electrónico"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="tucorreo@dominio.com"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormInput
                    label="Teléfono / WhatsApp"
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    placeholder="Ej. 55 1234 5678"
                  />
                  <FormSelect
                    label="Industria de Interés"
                    name="industria"
                    value={form.industria}
                    onChange={onChange}
                    options={industrias}
                  />
                  <FormInput
                    label="Proyecto específico"
                    name="proyecto"
                    value={form.proyecto}
                    onChange={onChange}
                    placeholder="Ej. Vending personalizado"
                  />
                </div>

                <FormTextarea
                  required
                  label="Mensaje / Detalles del proyecto"
                  name="detalles"
                  rows={5}
                  value={form.detalles}
                  onChange={onChange}
                  placeholder="Describe tu proyecto: ubicación, capacidad requerida, presupuesto estimado, etc."
                />

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-sky-400 px-10 py-4 font-black text-slate-950 shadow-xl shadow-sky-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-300 hover:shadow-sky-500/30"
                  >
                    Abrir Gmail y Enviar
                    <ArrowRight />
                  </button>

                  <a
                    href={buildMailto({
                      to: GMAIL_TO,
                      subject: "Consulta desde Proyectos Empresariales",
                      body: "",
                    })}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-10 py-4 font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                  >
                    Usar otro cliente
                    <ExternalIcon />
                  </a>
                </div>

                <p className="text-center text-sm text-slate-400">
                  *Este proceso no es automático. Se generará un borrador
                  profesional para que lo revises antes de enviar.
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/* ========= Animación contenedor ========= */
function MotionCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

/* ========= Cards (rediseño visual, MISMA lógica) ========= */
function ProjectCard({ proyecto, setForm }) {
  const imgSrc = proyecto.imagen?.trim()
    ? proyecto.imagen
    : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <button
      type="button"
      onClick={() => {
        setForm((prev) => ({
          ...prev,
          proyecto: proyecto.titulo,
          industria: proyecto.industria,
        }));
        document
          .getElementById("formulario-proyectos")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
      className="
        group relative overflow-hidden rounded-3xl
        border border-slate-200 bg-white
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10
        focus:outline-none focus:ring-2 focus:ring-sky-300
        w-full h-full min-h-[320px] text-left
      "
    >
      {/* Imagen */}
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt={proyecto.titulo}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
      </div>

      {/* Halo sutil en hover */}
      <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 h-44 w-80 rounded-full bg-sky-400/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Contenido */}
      <div className="relative p-6 h-full flex flex-col justify-end z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-slate-950 uppercase tracking-widest">
            {proyecto.industria}
          </span>
          <span className="text-white/90 text-xs font-bold bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/15">
            Cotizar →
          </span>
        </div>

        <h3 className="text-xl font-black text-white leading-tight mb-2 drop-shadow-md">
          {proyecto.titulo}
        </h3>

        <p className="text-white/80 text-sm line-clamp-2 leading-relaxed opacity-0 transform translate-y-3 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {proyecto.descripcion}
        </p>
      </div>

      {/* Footer CTA sutil */}
      <div className="absolute bottom-4 left-6 right-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-3" />
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="font-semibold">Abrir formulario</span>
          <span className="inline-flex items-center gap-1 font-bold">
            Continuar <ArrowRightSmall />
          </span>
        </div>
      </div>
    </button>
  );
}

/* ========= Form helpers (Dark / Glass version, rediseño de colores) ========= */
function FormInput({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold text-white/90 uppercase tracking-wide drop-shadow-sm">
          {label}
          {props.required && <span className="text-sky-300 ml-1">*</span>}
        </span>
      )}
      <input
        {...props}
        className="block w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/45 shadow-inner transition-all focus:border-sky-300 focus:bg-white/15 focus:ring-2 focus:ring-sky-300/25 outline-none backdrop-blur-md"
      />
    </label>
  );
}

function FormSelect({ label, options = [], ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold text-white/90 uppercase tracking-wide drop-shadow-sm">
          {label}
          {props.required && <span className="text-sky-300 ml-1">*</span>}
        </span>
      )}
      <select
        {...props}
        className="block w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-white shadow-inner transition-all focus:border-sky-300 focus:bg-white/15 focus:ring-2 focus:ring-sky-300/25 outline-none appearance-none cursor-pointer backdrop-blur-md"
      >
        <option value="" className="bg-slate-900 text-slate-300">
          Selecciona industria…
        </option>
        {options.map((i) => (
          <option key={i} value={i} className="bg-slate-900 text-white">
            {i}
          </option>
        ))}
        <option value="Otra" className="bg-slate-900 text-white">
          Otra
        </option>
      </select>
    </label>
  );
}

function FormTextarea({ label, rows = 4, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold text-white/90 uppercase tracking-wide drop-shadow-sm">
          {label}
          {props.required && <span className="text-sky-300 ml-1">*</span>}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className="block w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/45 shadow-inner transition-all focus:border-sky-300 focus:bg-white/15 focus:ring-2 focus:ring-sky-300/25 outline-none resize-none backdrop-blur-md"
      />
    </label>
  );
}

/* ========= UI Bits ========= */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}

/* ========= Icons ========= */
function ArrowRight() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowRightSmall() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
      <path d="M5 5h6v2H7v10h10v-4h2v6H5V5z" />
    </svg>
  );
}
