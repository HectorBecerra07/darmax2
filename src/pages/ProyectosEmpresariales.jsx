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
    imagen: "https://placehold.co/600x450/3f3f46/white?text=Centros+Comerciales",
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

/* ========= Motion helpers ========= */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1], delay },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

/* ========= Página ========= */
export default function ProyectosEmpresariales() {
  const [filtro, setFiltro] = useState("Todos");
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("relevancia"); // "relevancia" | "az" | "industria"
  const [q, setQ] = useState("");

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

    if (q.trim()) {
      const t = q.toLowerCase();
      base = base.filter(
        (p) =>
          (p.titulo || "").toLowerCase().includes(t) ||
          (p.descripcion || "").toLowerCase().includes(t) ||
          (p.industria || "").toLowerCase().includes(t)
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
  }, [filtro, sortBy, q]);

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

  const total = proyectosFiltrados.length;

  return (
    <>
      <Helmet>
        <title>Proyectos Empresariales - Darmax</title>
        <meta
          name="description"
          content="Soluciones empresariales a la medida. Proyectos llave en mano, desde la ingeniería hasta la puesta en marcha y soporte continuo."
        />
      </Helmet>

      {/* Animación shimmer (sin tocar tailwind config) */}
      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>

      {/* Fondo premium */}
      <section className="relative overflow-hidden py-14 sm:py-16">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f7fbfb] via-white to-white" />
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#24d4da]/18 blur-3xl" />
          <div className="absolute -bottom-36 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#007377]/12 blur-3xl" />
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:22px_22px]" />
        </div>

        <div className="mx-auto px-6 md:px-10 max-w-screen-2xl">
          {/* HERO */}
          <motion.div {...fadeUp(0)} className="max-w-5xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] uppercase text-slate-700 backdrop-blur">
              Soluciones a la medida
              <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
            </span>

            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-950">
              Proyectos Empresariales
            </h1>

            <p className="mt-4 text-slate-600 text-base md:text-xl max-w-3xl mx-auto">
              Llave en mano, desde la ingeniería hasta la puesta en marcha y soporte
              continuo. Elige tu industria y cotiza en minutos.
            </p>

            {/* Stats */}
            <motion.div
              {...fadeUp(0.12)}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <StatChip label="Proyectos" value={proyectos.length} />
              <StatChip label="Industrias" value={industrias.length} />
              <StatChip label="Atención" value="Nacional" />
            </motion.div>
          </motion.div>

          {/* Controls bar (sticky-ish) */}
          <motion.div
            {...scaleIn(0.05)}
            className="mt-12 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-4 md:p-5 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center">
              {/* Search + chips */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar proyecto, industria o palabra clave..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-[#24d4da]/40 focus:border-[#24d4da]/60"
                  />
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  {q && (
                    <button
                      onClick={() => setQ("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-500 grid place-items-center"
                      aria-label="Limpiar búsqueda"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>

                {/* Filter chips (scrollable) */}
                <div
                  className="
                    flex items-center gap-2 overflow-x-auto whitespace-nowrap
                    [-ms-overflow-style:none] [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    pb-1
                  "
                >
                  {["Todos", ...industrias].map((cat) => {
                    const activo = filtro === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setFiltro(cat)}
                        className={`
                          shrink-0 px-4 py-2 rounded-full text-sm font-extrabold border transition
                          ${
                            activo
                              ? "bg-slate-900 text-white border-slate-900 shadow"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }
                        `}
                        aria-pressed={activo}
                      >
                        {cat}
                        <span className="ml-2 text-[11px] opacity-70 font-black">
                          {conteo[cat] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs text-slate-500 font-bold">
                  Mostrando{" "}
                  <span className="text-slate-900">{total}</span>{" "}
                  {total === 1 ? "resultado" : "resultados"}
                  {filtro !== "Todos" && (
                    <>
                      {" "}
                      en <span className="text-slate-900">{filtro}</span>
                    </>
                  )}
                </div>
              </div>

              {/* View toggle */}
              <div className="justify-self-start lg:justify-self-end flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-xl transition-colors ${
                    view === "grid"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                  aria-pressed={view === "grid"}
                  title="Vista de cuadrícula"
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-xl transition-colors ${
                    view === "list"
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                  aria-pressed={view === "list"}
                  title="Vista de lista"
                >
                  <ListIcon />
                </button>
              </div>

              {/* Sort */}
              <div className="justify-self-start lg:justify-self-end">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600 font-extrabold">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-2xl border-slate-200 bg-white px-4 py-2.5 text-slate-800 font-extrabold shadow-sm outline-none focus:ring-2 focus:ring-[#24d4da]/40 focus:border-[#24d4da]/60"
                  >
                    <option value="relevancia">Relevancia</option>
                    <option value="az">A-Z</option>
                    <option value="industria">Industria</option>
                  </select>
                </label>
              </div>
            </div>
          </motion.div>

          {/* GRID / LIST */}
          <div className="mt-10">
            {total === 0 ? (
              <EmptyState
                onClear={() => {
                  setFiltro("Todos");
                  setQ("");
                  setSortBy("relevancia");
                }}
              />
            ) : view === "grid" ? (
              <div className="grid gap-x-6 gap-y-10 [grid-template-columns:repeat(auto-fill,minmax(310px,1fr))]">
                {proyectosFiltrados.map((p, idx) => (
                  <motion.div key={p.id} {...fadeUp(idx * 0.03)}>
                    <ProjectCard proyecto={p} setForm={setForm} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {proyectosFiltrados.map((p, idx) => (
                  <motion.div key={p.id} {...fadeUp(idx * 0.03)}>
                    <ProjectRow proyecto={p} setForm={setForm} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="mt-20 mb-12 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* FORM */}
          <div id="formulario-proyectos" className="max-w-5xl mx-auto scroll-mt-24">
            <motion.div {...scaleIn(0)} className="relative">
              {/* borde degradado */}
              <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-[#24d4da]/35 via-transparent to-[#007377]/25 blur-0" />
              <div className="relative rounded-[34px] border border-slate-200 bg-white p-8 md:p-12 shadow-[0_22px_70px_rgba(15,23,42,0.12)] overflow-hidden">
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#24d4da]/18 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#007377]/12 blur-3xl" />

                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-950 text-center tracking-tight">
                  ¿Listo para cotizar tu proyecto?
                </h3>

                <p className="text-slate-600 text-center mt-3 max-w-2xl mx-auto">
                  Completa el formulario y se abrirá tu correo con un borrador listo
                  para enviar a{" "}
                  <span className="font-extrabold text-slate-900">
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
                      placeholder="Tu nombre completo"
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

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="
                        px-8 py-3 rounded-2xl font-extrabold
                        text-white bg-slate-900
                        hover:bg-black transition
                        shadow-lg shadow-slate-900/10
                        active:scale-[0.98]
                      "
                    >
                      Abrir Gmail y Enviar
                    </button>

                    <a
                      href={buildMailto({
                        to: GMAIL_TO,
                        subject: "Consulta desde Proyectos Empresariales",
                        body: "",
                      })}
                      className="
                        px-8 py-3 rounded-2xl font-extrabold
                        bg-white border border-slate-200
                        text-slate-900 hover:bg-slate-50 transition
                        active:scale-[0.98]
                      "
                    >
                      Usar otro cliente de correo
                    </a>
                  </div>

                  <p className="text-sm text-slate-500">
                    *No se envía automáticamente. Se abrirá una ventana con tu correo
                    listo para que lo revises y envíes.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ========= UI ========= */
function StatChip({ label, value }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-2 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-[#24d4da]" />
      <div className="text-left leading-tight">
        <div className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
          {label}
        </div>
        <div className="text-sm font-extrabold text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 grid place-items-center text-slate-700">
        <SearchIcon className="w-5 h-5" />
      </div>
      <p className="mt-4 text-2xl font-extrabold text-slate-950">
        No encontramos proyectos
      </p>
      <p className="mt-2 text-slate-600">
        Prueba con otra industria o ajusta tu búsqueda.
      </p>
      <button
        onClick={onClear}
        className="mt-6 px-6 py-3 rounded-2xl bg-[#24d4da] text-white font-extrabold hover:bg-[#007377] transition active:scale-[0.98]"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

/* ========= Cards (WOW) ========= */
function ProjectCard({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim()
    ? proyecto.imagen
    : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden rounded-3xl
        border border-slate-200 bg-white
        shadow-[0_16px_55px_rgba(15,23,42,0.07)]
        hover:shadow-[0_30px_95px_rgba(15,23,42,0.12)]
        transition-all duration-300 hover:-translate-y-1
      "
    >
      {/* borde glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#24d4da]/20 via-transparent to-[#007377]/18" />
      </div>

      {/* Media */}
      <div className="relative isolate overflow-hidden">
        <div className="aspect-[4/3] w-full">
          <img
            src={imgSrc}
            alt={proyecto.titulo}
            className="h-full w-full object-cover will-change-transform transition-transform duration-700 group-hover:scale-[1.06]"
            loading="lazy"
          />
        </div>

        {/* overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* badge */}
        {badge && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-extrabold px-3 py-1.5 shadow-sm">
            {badge}
          </span>
        )}

        {/* chip industria */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur text-slate-900 text-[11px] font-extrabold px-3 py-1.5 border border-white/40">
            {proyecto.industria}
          </span>

          <span className="opacity-0 group-hover:opacity-100 transition text-white text-[11px] font-extrabold">
            Ver más →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col flex-1">
        <h3 className="text-xl font-extrabold text-slate-950 leading-snug">
          {proyecto.titulo}
        </h3>

        <p className="mt-2 text-slate-600 text-sm leading-relaxed flex-1">
          {proyecto.descripcion}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-6">
          <a
            href="#formulario-proyectos"
            className="
              inline-flex w-full items-center justify-center gap-2
              px-5 py-3 rounded-2xl font-extrabold
              bg-[#24d4da] text-white
              hover:bg-[#007377] transition
              shadow-sm hover:shadow
              active:scale-[0.98]
            "
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                proyecto: proyecto.titulo,
                industria: proyecto.industria,
              }))
            }
          >
            Cotizar por Email
            <span className="text-base">→</span>
          </a>
        </div>
      </div>
    </article>
  );
}

/* Vista Lista (row premium) */
function ProjectRow({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim()
    ? proyecto.imagen
    : "https://placehold.co/600x450/e2e8f0/475569?text=Proyecto";

  return (
    <article
      className="
        group relative grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr]
        gap-x-8 gap-y-4 items-start rounded-3xl
        border border-slate-200 bg-white p-5
        shadow-[0_14px_45px_rgba(15,23,42,0.06)]
        hover:shadow-[0_26px_80px_rgba(15,23,42,0.10)]
        transition-all duration-300 hover:-translate-y-0.5
      "
    >
      <div className="relative isolate overflow-hidden rounded-2xl border border-slate-200">
        <img
          src={imgSrc}
          alt={proyecto.titulo}
          className="h-full w-full object-cover aspect-[16/10] md:aspect-[4/3] transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        {badge && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-white/95 text-slate-900 text-xs font-extrabold px-3 py-1.5 shadow-sm">
            {badge}
          </span>
        )}
        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/90 backdrop-blur text-slate-900 text-[11px] font-extrabold px-3 py-1.5 border border-white/40">
          {proyecto.industria}
        </span>
      </div>

      <div className="flex h-full flex-col pt-1">
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-950">
          {proyecto.titulo}
        </h3>
        <p className="mt-2 text-slate-600 flex-1">{proyecto.descripcion}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#formulario-proyectos"
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-2xl font-extrabold
              bg-[#24d4da] text-white hover:bg-[#007377]
              transition active:scale-[0.98]
            "
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                proyecto: proyecto.titulo,
                industria: proyecto.industria,
              }))
            }
          >
            Cotizar por Email <span>→</span>
          </a>

          <a
            href="#formulario-proyectos"
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-2xl font-extrabold
              bg-white border border-slate-200 text-slate-900 hover:bg-slate-50
              transition active:scale-[0.98]
            "
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                proyecto: proyecto.titulo,
                industria: proyecto.industria,
              }))
            }
          >
            Ver formulario
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
      {label && (
        <span className="mb-1.5 block text-sm font-extrabold text-slate-900">
          {label}
          {props.required && <span className="text-[#24d4da]"> *</span>}
        </span>
      )}
      <input
        {...props}
        className="
          block w-full rounded-2xl border border-slate-200
          bg-slate-50/70 px-4 py-3 text-slate-900 shadow-sm
          transition placeholder:text-slate-400
          focus:bg-white focus:ring-2 focus:ring-[#24d4da]/35 focus:border-[#24d4da]/60 outline-none
        "
      />
    </label>
  );
}

function FormSelect({ label, options = [], ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-extrabold text-slate-900">
          {label}
          {props.required && <span className="text-[#24d4da]"> *</span>}
        </span>
      )}
      <select
        {...props}
        className="
          block w-full rounded-2xl border border-slate-200
          bg-slate-50/70 px-4 py-3 text-slate-900 shadow-sm
          transition focus:bg-white
          focus:ring-2 focus:ring-[#24d4da]/35 focus:border-[#24d4da]/60 outline-none
        "
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
        <span className="mb-1.5 block text-sm font-extrabold text-slate-900">
          {label}
          {props.required && <span className="text-[#24d4da]"> *</span>}
        </span>
      )}
      <textarea
        rows={rows}
        {...props}
        className="
          block w-full rounded-2xl border border-slate-200
          bg-slate-50/70 px-4 py-3 text-slate-900 shadow-sm
          transition placeholder:text-slate-400
          focus:bg-white focus:ring-2 focus:ring-[#24d4da]/35 focus:border-[#24d4da]/60 outline-none
        "
      />
    </label>
  );
}

/* ========= Icons ========= */
function GridIcon() {
  return (
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
}

function ListIcon() {
  return (
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
}

function SearchIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 104.473 8.713l2.657 2.657a.75.75 0 101.06-1.06l-2.657-2.657A5.5 5.5 0 009 3.5zm-4 5.5a4 4 0 118 0 4 4 0 01-8 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 10-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
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
