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
    imagen: "https://placehold.co/600x450/1e40af/white?text=Hoteles",
    industria: "Hoteles",
  },
  {
    id: 3,
    titulo: "Planta purificadora para centros comerciales",
    descripcion:
      "Proyecto llave en mano (+10,000 L/día). Incluye consultoría y capacitación.",
    imagen:
      "https://placehold.co/600x450/3f3f46/white?text=Centros+Comerciales",
    industria: "Centros comerciales",
  },
  {
    id: 4,
    titulo: "Equipos de calentamiento de agua",
    descripcion:
      "Soluciones de calentamiento eficientes para aplicaciones residenciales, comerciales e industriales.",
    imagen: "https://placehold.co/600x450/ef4444/white?text=Agua+Caliente",
    industria: "Calentamiento de agua",
  },
  {
    id: 5,
    titulo: "Equipos y accesorios para piscina y spa",
    descripcion:
      "Filtración, circulación y accesorios para mantener tu piscina y spa en óptimas condiciones.",
    imagen: "https://placehold.co/600x450/0ea5e9/white?text=Piscinas",
    industria: "Piscinas y Spa",
  },
  {
    id: 6,
    titulo: "Presurizadoras individuales y múltiples",
    descripcion:
      "Sistemas tradicionales y de presión constante para caudal estable en todo momento.",
    imagen: "https://placehold.co/600x450/f97316/white?text=Presurización",
    industria: "Presurización",
  },
  {
    id: 7,
    titulo: "Bombas de superficie",
    descripcion:
      "Bombas para aplicaciones residenciales, comerciales e industriales con alta confiabilidad.",
    imagen: "https://placehold.co/600x450/16a34a/white?text=Bombas",
    industria: "Bombas de superficie",
  },
  {
    id: 8,
    titulo: "Equipos para aguas residuales",
    descripcion:
      "Manejo de efluentes y tratamiento de aguas residuales con equipos robustos y eficientes.",
    imagen: "https://placehold.co/600x450/64748b/white?text=Aguas+Residuales",
    industria: "Aguas residuales",
  },
  {
    id: 9,
    titulo: "Equipos y accesorios sumergibles",
    descripcion:
      "Bombas y accesorios sumergibles para pozos, drenaje y aplicaciones exigentes.",
    imagen: "https://placehold.co/600x450/475569/white?text=Sumergibles",
    industria: "Sumergibles",
  },
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

      <div className="bg-slate-50">
        {/* HERO (estilo PurificadoresCaseros) */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HERO_BG}
              alt="Proyectos Empresariales"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-slate-50" />
            {/* Glow decorativo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-lime-300/20 blur-3xl" />
          </div>

          <div className="relative px-4 md:px-10 pt-14 pb-14 max-w-screen-2xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white/90 text-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
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
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-200"
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

            {/* Banda tipo “modelos y configuraciones” */}
            <div className="mt-12">
              <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur">
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
                          "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border",
                          activo
                            ? "bg-lime-300 text-slate-950 border-lime-200 shadow-sm"
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

        {/* CATÁLOGO / CONTROLES */}
        <section
          id="catalogo-proyectos"
          className="px-4 md:px-10 pt-10 pb-16 max-w-screen-2xl mx-auto"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Catálogo de Proyectos
                </h3>
                <p className="text-slate-600 mt-1">
                  Vista grid/lista, ordenamiento y CTA a cotización.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Vista */}
                <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm">
                  <button
                    onClick={() => setView("grid")}
                    className={[
                      "p-2 rounded-lg transition-colors",
                      view === "grid"
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                    ].join(" ")}
                    aria-pressed={view === "grid"}
                    title="Vista de cuadrícula"
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={[
                      "p-2 rounded-lg transition-colors",
                      view === "list"
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800",
                    ].join(" ")}
                    aria-pressed={view === "list"}
                    title="Vista de lista"
                  >
                    <ListIcon />
                  </button>
                </div>

                {/* Ordenar */}
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600 font-medium">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border-slate-300 bg-white/80 px-3 py-2 text-slate-700 font-semibold shadow-sm outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="az">A-Z</option>
                    <option value="industria">Industria</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-10">
              {view === "grid" ? (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="mt-20 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>
        </section>

        {/* FORM */}
        <section className="px-4 md:px-10 pb-24 max-w-screen-2xl mx-auto">
          <div id="formulario-proyectos" className="max-w-5xl mx-auto scroll-mt-20">
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
                ¿Listo para cotizar tu proyecto?
              </h3>
              <p className="mt-3 text-slate-600 text-center max-w-2xl mx-auto">
                Completa el formulario y se abrirá tu correo con un borrador listo
                para enviar a{" "}
                <span className="font-semibold text-slate-800">
                  darmaxagua@gmail.com
                </span>
                .
              </p>

              <form onSubmit={handleGmailSubmit} className="mt-10 grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    required
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                  />
                  <FormInput
                    required
                    type="email"
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="tucorreo@dominio.com"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <FormInput
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={onChange}
                    placeholder="55 1234 5678"
                  />
                  <FormSelect
                    label="Industria de Interés"
                    name="industria"
                    value={form.industria}
                    onChange={onChange}
                    options={industrias}
                  />
                  <FormInput
                    label="Proyecto de Interés"
                    name="proyecto"
                    value={form.proyecto}
                    onChange={onChange}
                    placeholder="Ej. Vending Touch + Purificadora"
                  />
                </div>

                <FormTextarea
                  required
                  label="Mensaje / Detalles"
                  name="detalles"
                  rows={5}
                  value={form.detalles}
                  onChange={onChange}
                  placeholder="Describe tu proyecto: ubicación, capacidad requerida, presupuesto estimado, etc."
                />

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-7 py-3 font-bold text-slate-950 shadow-lg shadow-lime-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-200"
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
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-7 py-3 font-semibold text-slate-800 transition-all duration-300 hover:bg-slate-200 hover:-translate-y-0.5"
                  >
                    Usar otro cliente
                    <ExternalIcon />
                  </a>
                </div>

                <p className="text-sm text-slate-500 mt-2">
                  *No se envía automáticamente. Se abrirá una ventana con tu correo
                  listo para que lo revises y envíes.
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
    >
      {children}
    </motion.div>
  );
}

/* ========= Cards (mismo estilo que ProductCard) ========= */
function ProjectCard({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim()
    ? proyecto.imagen
    : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article
      className="
        group relative
        rounded-2xl bg-white
        border border-slate-200/70
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70
        overflow-hidden
      "
    >
      {/* Glow on hover */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-72 rounded-full bg-lime-300/25 blur-3xl" />
      </div>

      <div className="relative isolate overflow-hidden">
        <div className="aspect-[4/3] w-full bg-slate-50">
          <img
            src={imgSrc}
            alt={proyecto.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {badge && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 shadow-sm">
            {badge}
          </span>
        )}

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="p-5 flex flex-col">
        <h3 className="text-lg font-extrabold text-slate-900 leading-snug line-clamp-2">
          {proyecto.titulo}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
          {proyecto.descripcion}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1">
            {proyecto.industria}
          </span>

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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-2 text-sm font-extrabold text-slate-950 transition-all duration-300 hover:bg-lime-200"
          >
            Cotizar
            <ArrowRight />
          </button>
        </div>
      </div>
    </article>
  );
}

/* Vista Lista */
function ProjectRow({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim()
    ? proyecto.imagen
    : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article
      className="
        group relative
        grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr]
        gap-6 items-start
        rounded-2xl bg-white
        border border-slate-200/70
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70
        overflow-hidden
      "
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-72 rounded-full bg-lime-300/18 blur-3xl" />
      </div>

      <div className="relative isolate overflow-hidden">
        <img
          src={imgSrc}
          alt={proyecto.titulo}
          className="h-full w-full object-cover aspect-[16/10] md:aspect-[4/3]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        {badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <div className="p-5 md:py-5 md:pr-6 flex flex-col">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">
          {proyecto.titulo}
        </h3>
        <p className="mt-2 text-slate-600">{proyecto.descripcion}</p>

        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center rounded-md bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1">
            {proyecto.industria}
          </span>

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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-extrabold text-slate-950 transition-all duration-300 hover:bg-lime-200"
          >
            Cotizar por Email
            <ArrowRight />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ========= Form helpers ========= */
function FormInput({ label, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-slate-800">
          {label}
          {props.required && "*"}
        </span>
      )}
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
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-slate-800">
          {label}
          {props.required && "*"}
        </span>
      )}
      <select
        {...props}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      >
        <option value="">Selecciona…</option>
        {options.map((i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
        <option value="Otra">Otra</option>
      </select>
    </label>
  );
}

function FormTextarea({ label, rows = 4, ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-slate-800">
          {label}
          {props.required && "*"}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className="block w-full rounded-lg border-gray-300 bg-gray-50/80 px-4 py-2.5 text-slate-800 shadow-sm transition-colors placeholder:text-slate-400 focus:border-lime-400 focus:bg-white focus:ring-lime-400 focus:ring-1"
      />
    </label>
  );
}

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

/* ========= UI Bits ========= */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}

/* ========= Icons ========= */
const GridIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

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
