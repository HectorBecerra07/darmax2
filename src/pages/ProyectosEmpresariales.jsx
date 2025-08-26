import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ← animaciones

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
  ].filter(Boolean).join("&");
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
  { id: 1, titulo: "Franquicias DarmaxAgua", descripcion: "Conoce nuestras propuestas de franquicias DarmaxAgua. Asesoría personalizada en toda tu adquisición.", imagen: "", industria: "Franquicias" },
  { id: 2, titulo: "Vending personalizado para hoteles", descripcion: "Vending machines con branding del hotel, operando 24/7 sin personal.", imagen: "/img/proyectos/hotel.jpg", industria: "Hoteles" },
  { id: 3, titulo: "Planta purificadora para centros comerciales", descripcion: "Proyecto llave en mano (+10,000 L/día). Incluye consultoría y capacitación.", imagen: "/img/proyectos/centro-comercial.jpg", industria: "Centros comerciales" },
  { id: 4, titulo: "Equipos de calentamiento de agua", descripcion: "Soluciones de calentamiento eficientes para aplicaciones residenciales, comerciales e industriales.", imagen: "/img/proyectos/calentamiento-agua.jpg", industria: "Calentamiento de agua" },
  { id: 5, titulo: "Equipos y accesorios para piscina y spa", descripcion: "Filtración, circulación y accesorios para mantener tu piscina y spa en óptimas condiciones.", imagen: "/img/proyectos/piscina-spa.jpg", industria: "Piscinas y Spa" },
  { id: 6, titulo: "Presurizadoras individuales y múltiples", descripcion: "Sistemas tradicionales y de presión constante para caudal estable en todo momento.", imagen: "/img/proyectos/presurizadoras.jpg", industria: "Presurización" },
  { id: 7, titulo: "Bombas de superficie", descripcion: "Bombas para aplicaciones residenciales, comerciales e industriales con alta confiabilidad.", imagen: "/img/proyectos/bombas-superficie.jpg", industria: "Bombas de superficie" },
  { id: 8, titulo: "Equipos para aguas residuales", descripcion: "Manejo de efluentes y tratamiento de aguas residuales con equipos robustos y eficientes.", imagen: "/img/proyectos/aguas-residuales.jpg", industria: "Aguas residuales" },
  { id: 9, titulo: "Equipos y accesorios sumergibles", descripcion: "Bombas y accesorios sumergibles para pozos, drenaje y aplicaciones exigentes.", imagen: "/img/proyectos/sumergibles.jpg", industria: "Sumergibles" },
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
    const base = filtro === "Todos" ? proyectos : proyectos.filter((p) => p.industria === filtro);
    if (sortBy === "az") {
      return [...base].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    }
    if (sortBy === "industria") {
      return [...base].sort((a, b) => a.industria.localeCompare(b.industria, "es") || a.titulo.localeCompare(b.titulo, "es"));
    }
    return base; // relevancia (orden original)
  }, [filtro, sortBy]);

  /* ======= Form ======= */
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", industria: "", proyecto: "", detalles: "",
  });
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
    <section className="mt-20 bg-white py-14">
      <div className="mx-auto px-6 md:px-10 max-w-screen-2xl">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-[11px] tracking-widest uppercase bg-black text-white px-3 py-1 rounded-full">
            Soluciones a la medida
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Proyectos Empresariales
          </h2>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Llave en mano, desde la ingeniería hasta la puesta en marcha y soporte.
          </p>
        </div>

        {/* Controles: Filtros + Vista + Ordenar */}
        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_auto] items-center">
          {/* Filtros */}
          <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur p-3 flex flex-wrap gap-2">
            {["Todos", ...industrias].map((cat) => {
              const activo = filtro === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltro(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition
                    ${activo ? "text-black" : "bg-white text-slate-700 border-gray-300 hover:bg-gray-100"}`}
                  style={activo ? { backgroundColor: "#ccff00", borderColor: "#ccff00" } : {}}
                  aria-pressed={activo}
                >
                  {cat} <span className="opacity-70">({conteo[cat] ?? 0})</span>
                </button>
              );
            })}
          </div>

          {/* Vista */}
          <div className="justify-self-end flex items-center gap-2">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded-xl border ${view === "grid" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"}`}
              aria-pressed={view === "grid"}
              title="Vista de cuadrícula"
            >
              ▦
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 rounded-xl border ${view === "list" ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100"}`}
              aria-pressed={view === "list"}
              title="Vista de lista"
            >
              ☰
            </button>
          </div>

          {/* Ordenar */}
          <div className="justify-self-end">
            <label className="flex items-center gap-2 text-sm">
              <span className="text-slate-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#ccff00]"
              >
                <option value="relevancia">Relevancia</option>
                <option value="az">A-Z</option>
                <option value="industria">Industria</option>
              </select>
            </label>
          </div>
        </div>

        {/* Grid / Lista */}
        {view === "grid" ? (
          <div className="grid gap-x-8 gap-y-12 mt-10 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {proyectosFiltrados.map((p, idx) => (
              <MotionCard key={p.id} delay={idx * 0.03}>
                <ProjectCard proyecto={p} setForm={setForm} />
              </MotionCard>
            ))}
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {proyectosFiltrados.map((p, idx) => (
              <MotionCard key={p.id} delay={idx * 0.03}>
                <ProjectRow proyecto={p} setForm={setForm} />
              </MotionCard>
            ))}
          </div>
        )}

        {/* Separador */}
        <div className="mt-20 mb-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Formulario */}
        <div id="formulario-proyectos" className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-gray-100 shadow-sm bg-white p-6 md:p-10">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 text-center">
              ¿Listo para cotizar?
            </h3>
            <p className="text-slate-600 text-center mt-2">
              Completa el formulario y se abrirá Gmail con tu mensaje listo para enviar a{" "}
              <span className="font-semibold">darmaxagua@gmail.com</span>.
            </p>

            <form onSubmit={handleGmailSubmit} className="mt-8 grid gap-5">
              <div className="grid md:grid-cols-2 gap-5">
                <FormInput required label="Nombre*" name="nombre" value={form.nombre} onChange={onChange} />
                <FormInput required type="email" label="Email*" name="email" value={form.email} onChange={onChange} placeholder="tucorreo@dominio.com" />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <FormInput label="Teléfono" name="telefono" value={form.telefono} onChange={onChange} placeholder="55 1234 5678" />
                <FormSelect label="Industria" name="industria" value={form.industria} onChange={onChange} options={industrias} />
                <FormInput label="Proyecto" name="proyecto" value={form.proyecto} onChange={onChange} placeholder="Ej. Vending Touch + Purificadora" />
              </div>

              <FormTextarea required label="Mensaje / Detalles*" name="detalles" rows={5} value={form.detalles} onChange={onChange} placeholder="Ubicación, capacidad requerida, tiempos, presupuesto…" />

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg" style={{ backgroundColor: "#ccff00" }}>
                  Abrir Gmail y enviar
                </button>
                <a
                  href={buildMailto({ to: GMAIL_TO, subject: "Consulta desde Proyectos Empresariales", body: "" })}
                  className="px-6 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-900 transition"
                >
                  Usar cliente de correo
                </a>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                *No se envía automáticamente. Se abrirá una ventana con tu correo listo para revisar y enviar.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= Animación contenedor ========= */
function MotionCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ========= Cards ========= */
function ProjectCard({ proyecto, setForm }) {
  const badge = getBadge(proyecto.industria, proyecto.titulo);
  const imgSrc = proyecto.imagen?.trim() ? proyecto.imagen : "/img/placeholder-proyecto.jpg";

  return (
    <article className="group rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 hover:ring-1 hover:ring-gray-200 flex flex-col">
      <div className="relative isolate overflow-hidden rounded-t-3xl">
        <div className="aspect-[4/3] w-full">
          <img src={imgSrc} alt={proyecto.titulo} className="h-full w-full object-cover will-change-transform transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        {badge && <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 shadow">{badge}</span>}
        <h3 className="absolute left-5 bottom-4 z-10 text-xl font-bold text-white drop-shadow">{proyecto.titulo}</h3>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-slate-700 text-sm leading-relaxed">{proyecto.descripcion}</p>
        <div className="mt-6 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 text-slate-700 text-xs px-2.5 py-1">{proyecto.industria}</span>
        </div>
        <div className="mt-auto pt-6 flex flex-wrap gap-3">
          <Link to={`/proyectos/${proyecto.id ?? ""}`} className="px-5 py-2 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-800 transition">Ver detalles</Link>
          <a
            href="#formulario-proyectos"
            className="px-5 py-2 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-sm"
            style={{ backgroundColor: "#ccff00" }}
            onClick={() => setForm((prev) => ({ ...prev, proyecto: proyecto.titulo, industria: proyecto.industria }))}
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
  const imgSrc = proyecto.imagen?.trim() ? proyecto.imagen : "/img/placeholder-proyecto.jpg";

  return (
    <article className="group grid md:grid-cols-[320px_1fr] gap-5 items-stretch rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:ring-1 hover:ring-gray-200 transition-all overflow-hidden">
      {/* Media */}
      <div className="relative isolate">
        <img src={imgSrc} alt={proyecto.titulo} className="h-full w-full object-cover md:h-full aspect-[16/10] md:aspect-auto" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent md:hidden" />
        {badge && <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1 shadow">{badge}</span>}
      </div>

      {/* Body */}
      <div className="p-5 md:p-6 flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900">{proyecto.titulo}</h3>
        <p className="mt-2 text-slate-700">{proyecto.descripcion}</p>
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-gray-100 text-slate-700 text-xs px-2.5 py-1">
            {proyecto.industria}
          </span>
        </div>
        <div className="mt-auto pt-5 flex flex-wrap gap-3">
          <Link to={`/proyectos/${proyecto.id ?? ""}`} className="px-5 py-2 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-slate-800 transition">Ver detalles</Link>
          <a
            href="#formulario-proyectos"
            className="px-5 py-2 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-sm"
            style={{ backgroundColor: "#ccff00" }}
            onClick={() => setForm((prev) => ({ ...prev, proyecto: proyecto.titulo, industria: proyecto.industria }))}
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
      {label && <span className="text-sm font-medium text-slate-800">{label}</span>}
      <input {...props} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#ccff00]" />
    </label>
  );
}
function FormSelect({ label, options = [], ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-800">{label}</span>}
      <select {...props} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#ccff00]">
        <option value="">Selecciona…</option>
        {options.map((i) => (<option key={i} value={i}>{i}</option>))}
        <option value="Otra">Otra</option>
      </select>
    </label>
  );
}
function FormTextarea({ label, rows = 4, ...props }) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-slate-800">{label}</span>}
      <textarea rows={rows} {...props} className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#ccff00]" />
    </label>
  );
}

/* ========= Badge ========= */
function getBadge(industria = "", titulo = "") {
  const i = industria.toLowerCase();
  const t = titulo.toLowerCase();
  if (i.includes("franquicia") || t.includes("franquicia")) return "Nuevo";
  if (i.includes("hotel") || t.includes("hotel")) return "24/7";
  if (i.includes("centro") || i.includes("comercial") || t.includes("comercial")) return "Alta demanda";
  if (i.includes("presurización") || i.includes("presurizacion")) return "Caudal estable";
  if (i.includes("aguas residuales")) return "Robusto";
  if (i.includes("sumergibles")) return "Profundidad";
  return null;
}
