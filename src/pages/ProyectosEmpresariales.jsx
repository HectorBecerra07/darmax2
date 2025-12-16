import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion"; // animaciones

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
const proyectos = [
  { id: 1, titulo: "Franquicias DarmaxAgua", descripcion: "Conoce nuestras propuestas de franquicias DarmaxAgua. Asesoría personalizada en toda tu adquisición.", imagen: "/img/proyectosEmpresariales/franquisias.jpg", industria: "Franquicias" },
  { id: 2, titulo: "Vending personalizado para hoteles", descripcion: "Vending machines con branding del hotel, operando 24/7 sin personal.", imagen: "https://placehold.co/600x450/1e40af/white?text=Hoteles", industria: "Hoteles" },
  { id: 3, titulo: "Planta purificadora para centros comerciales", descripcion: "Proyecto llave en mano (+10,000 L/día). Incluye consultoría y capacitación.", imagen: "https://placehold.co/600x450/3f3f46/white?text=Centros+Comerciales", industria: "Centros comerciales" },
  { id: 4, titulo: "Equipos de calentamiento de agua", descripcion: "Soluciones de calentamiento eficientes para aplicaciones residenciales, comerciales e industriales.", imagen: "https://placehold.co/600x450/ef4444/white?text=Agua+Caliente", industria: "Calentamiento de agua" },
  { id: 5, titulo: "Equipos y accesorios para piscina y spa", descripcion: "Filtración, circulación y accesorios para mantener tu piscina y spa en óptimas condiciones.", imagen: "https://placehold.co/600x450/0ea5e9/white?text=Piscinas", industria: "Piscinas y Spa" },
  { id: 6, titulo: "Presurizadoras individuales y múltiples", descripcion: "Sistemas tradicionales y de presión constante para caudal estable en todo momento.", imagen: "https://placehold.co/600x450/f97316/white?text=Presurización", industria: "Presurización" },
  { id: 7, titulo: "Bombas de superficie", descripcion: "Bombas para aplicaciones residenciales, comerciales e industriales con alta confiabilidad.", imagen: "https://placehold.co/600x450/16a34a/white?text=Bombas", industria: "Bombas de superficie" },
  { id: 8, titulo: "Equipos para aguas residuales", descripcion: "Manejo de efluentes y tratamiento de aguas residuales con equipos robustos y eficientes.", imagen: "https://placehold.co/600x450/64748b/white?text=Aguas+Residuales", industria: "Aguas residuales" },
  { id: 9, titulo: "Equipos y accesorios sumergibles", descripcion: "Bombas y accesorios sumergibles para pozos, drenaje y aplicaciones exigentes.", imagen: "https://placehold.co/600x450/475569/white?text=Sumergibles", industria: "Sumergibles" },
];


export default function ProyectosEmpresariales() {
  const [filtro, setFiltro] = useState("Todos");
  const [view, setView] = useState("grid"); // "grid" | "list"
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
      filtro === "Todos" ? proyectos : proyectos.filter((p) => p.industria === filtro);
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
    return base; // relevancia (orden original)
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
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto px-6 md:px-10 max-w-screen-2xl">
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-sm font-semibold tracking-wider uppercase bg-slate-900 text-white px-4 py-1.5 rounded-full">
              Soluciones a la medida
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
              Proyectos Empresariales
            </h2>
            <p className="mt-4 text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
              Llave en mano, desde la ingeniería hasta la puesta en marcha y soporte continuo.
            </p>
          </div>

          {/* Controles: Filtros + Vista + Ordenar */}
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-[1fr_auto_auto] items-center">
            {/* Filtros */}
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 backdrop-blur-xl p-3 flex flex-wrap gap-2.5 shadow-sm">
              {["Todos", ...industrias].map((cat) => {
                const activo = filtro === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFiltro(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${
                        activo
                          ? "bg-lime-300 text-lime-950 shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                    aria-pressed={activo}
                  >
                    {cat} <span className="opacity-60 font-normal">({conteo[cat] ?? 0})</span>
                  </button>
                );
              })}
            </div>

            {/* Vista */}
            <div className="justify-self-start md:justify-self-end flex items-center gap-2 bg-white/60 border border-gray-200/80 rounded-2xl p-2 shadow-sm">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "grid"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                aria-pressed={view === "grid"}
                title="Vista de cuadrícula"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "list"
                    ? "bg-slate-800 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                aria-pressed={view === "list"}
                title="Vista de lista"
              >
                <ListIcon />
              </button>
            </div>

            {/* Ordenar */}
            <div className="justify-self-start md:justify-self-end">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border-gray-300 bg-white/80 px-3 py-2 text-slate-700 font-semibold shadow-sm outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="az">A-Z</option>
                  <option value="industria">Industria</option>
                </select>
              </label>
            </div>
          </div>

          {/* Grid / Lista */}
          <div className="mt-12">
            {view === "grid" ? (
              <div className="grid gap-x-6 gap-y-10 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
                {proyectosFiltrados.map((p, idx) => (
                  <MotionCard key={p.id} delay={idx * 0.03}>
                    <ProjectCard proyecto={p} setForm={setForm} />
                  </MotionCard>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {proyectosFiltrados.map((p, idx) => (
                  <MotionCard key={p.id} delay={idx * 0.03}>
                    <ProjectRow proyecto={p} setForm={setForm} />
                  </MotionCard>
                ))}
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="mt-24 mb-12 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Formulario */}
          <div id="formulario-proyectos" className="max-w-5xl mx-auto scroll-mt-20">
            <div className="rounded-2xl bg-white p-8 md:p-12 shadow-xl shadow-slate-200/50">
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
                ¿Listo para cotizar tu proyecto?
              </h3>
              <p className="text-slate-600 text-center mt-3 max-w-2xl mx-auto">
                Completa el formulario y se abrirá tu cliente de correo con un borrador listo para enviar a{' '}
                <span className="font-semibold text-slate-800">darmaxagua@gmail.com</span>.
              </p>

              <form onSubmit={handleGmailSubmit} className="mt-10 grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput required label="Nombre" name="nombre" value={form.nombre} onChange={onChange} />
                  <FormInput required type="email" label="Email" name="email" value={form.email} onChange={onChange} placeholder="tucorreo@dominio.com" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormInput label="Teléfono" name="telefono" value={form.telefono} onChange={onChange} placeholder="55 1234 5678" />
                  <FormSelect label="Industria de Interés" name="industria" value={form.industria} onChange={onChange} options={industrias} />
                  <FormInput label="Proyecto de Interés" name="proyecto" value={form.proyecto} onChange={onChange} placeholder="Ej. Vending Touch + Purificadora" />
                </div>

                <FormTextarea required label="Mensaje / Detalles" name="detalles" rows={5} value={form.detalles} onChange={onChange} placeholder="Describe tu proyecto: ubicación, capacidad requerida, presupuesto estimado, etc." />

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-semibold text-black bg-lime-300 hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/10 hover:shadow-xl hover:shadow-lime-500/20"
                  >
                    Abrir Gmail y Enviar
                  </button>
                  <a
                    href={buildMailto({ to: GMAIL_TO, subject: "Consulta desde Proyectos Empresariales", body: "" })}
                    className="px-8 py-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    Usar otro cliente de correo
                  </a>
                </div>

                <p className="text-sm text-slate-500 mt-2">
                  *No se envía automáticamente. Se abrirá una ventana con tu correo listo para que lo revises y envíes.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ========= Animación contenedor ========= */
function MotionCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ========= Cards ========= */
function ProjectCard({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim() ? proyecto.imagen : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="relative isolate overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img
            src={imgSrc}
            alt={proyecto.titulo}
            className="h-full w-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        {badge && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-slate-900">
          {proyecto.titulo}
        </h3>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed flex-1">
          {proyecto.descripcion}
        </p>
        <div className="mt-5">
          <span className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1">
            {proyecto.industria}
          </span>
        </div>
        <div className="mt-auto pt-6">
          <a
            href="#formulario-proyectos"
            className="inline-block w-full text-center px-5 py-2.5 rounded-lg font-semibold text-black bg-lime-300 hover:bg-lime-400 transition-colors"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                proyecto: proyecto.titulo,
                industria: proyecto.industria,
              }))
            }
          >
            Cotizar por Email
          </a>
        </div>
      </div>
    </article>
  );
}

/* Vista Lista (fila) */
function ProjectRow({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim() ? proyecto.imagen : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article className="group grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-x-8 gap-y-4 items-start rounded-2xl border border-transparent bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:border-gray-200/80">
      <div className="relative isolate overflow-hidden rounded-xl">
        <img
          src={imgSrc}
          alt={proyecto.titulo}
          className="h-full w-full object-cover aspect-[16/10] md:aspect-[4/3]"
          loading="lazy"
        />
        {badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="flex h-full flex-col pt-1">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">
          {proyecto.titulo}
        </h3>
        <p className="mt-2 text-slate-600 flex-1">{proyecto.descripcion}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1">
            {proyecto.industria}
          </span>
        </div>
        <div className="mt-auto pt-5">
          <a
            href="#formulario-proyectos"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-black bg-lime-300 hover:bg-lime-400 transition-colors"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                proyecto: proyecto.titulo,
                industria: proyecto.industria,
              }))
            }
          >
            Cotizar por Email
          </a>
        </div>
      </div>
    </article>
  );
}

/* ========= Form helpers ========= */
function FormInput({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}{props.required && '*'}</span>}
      <input
        {...props}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      />
    </label>
  );
}

function FormSelect({ label, options = [], ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}{props.required && '*'}</span>}
      <select
        {...props}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      >
        <option value="">Selecciona…</option>
        {options.map((i) => (
          <option key={i} value={i}>{i}</option>
        ))}
        <option value="Otra">Otra</option>
      </select>
    </label>
  );
}

function FormTextarea({ label, rows = 4, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold text-slate-800">{label}{props.required && '*'}</span>}
      <textarea
        rows={rows}
        {...props}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      />
    </label>
  );
}

/* ========= Icons ========= */
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);


/* ========= Badge ========= */
function getBadge(industria = "", titulo = "") {
  const i = industria.toLowerCase();
  const t = titulo.toLowerCase();
  if (i.includes("franquicia") || t.includes("franquicia")) return "Nuevo";
  if (i.includes("hotel") || t.includes("hotel")) return "24/7";
  if (i.includes("centro") || i.includes("comercial") || t.includes("comercial"))
    return "Alta demanda";
  if (i.includes("presurización") || i.includes("presurizacion"))
    return "Caudal estable";
  if (i.includes("aguas residuales")) return "Robusto";
  if (i.includes("sumergibles")) return "Profundidad";
  return null;
}
