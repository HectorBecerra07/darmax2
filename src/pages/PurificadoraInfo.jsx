import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  CpuChipIcon,
  BoltIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

const cn = (...c) => c.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

const cardSwap = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.3 } },
};

function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] || "");
  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.12, 0.22, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds.join("|")]);

  return active;
}

const Glass = ({ className, children }) => (
  <div
    className={cn(
      "rounded-3xl border border-white/40 bg-white/75 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(15,23,42,0.28)]",
      className
    )}
  >
    {children}
  </div>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2">
    <CheckCircleIcon className="h-5 w-5 text-cyan-700 mt-0.5 flex-shrink-0" />
    <span className="text-slate-700">{children}</span>
  </li>
);

const NavChip = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-semibold border transition",
      active
        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
        : "bg-white/80 text-slate-700 border-slate-200 hover:bg-white"
    )}
  >
    {label}
  </button>
);

const ModelCard = ({ active, title, subtitle, tag, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full text-left rounded-2xl border p-5 transition relative overflow-hidden",
      active
        ? "border-cyan-200 bg-gradient-to-br from-cyan-50 to-white shadow-sm"
        : "border-slate-200 bg-white/80 hover:bg-white"
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-extrabold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
      </div>
      <span
        className={cn(
          "text-xs font-extrabold px-3 py-1 rounded-full border",
          active
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-slate-50 text-slate-700 border-slate-200"
        )}
      >
        {tag}
      </span>
    </div>

    {active ? (
      <motion.div
        layoutId="activeGlowMostrador"
        className="absolute inset-0 pointer-events-none"
        initial={false}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl" />
      </motion.div>
    ) : null}
  </button>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <span className="p-2 rounded-2xl bg-cyan-50 border border-cyan-100">
      <Icon className="h-6 w-6 text-cyan-700" />
    </span>
    <div>
      <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm md:text-base text-slate-600">{subtitle}</p> : null}
    </div>
  </div>
);

const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
            <Icon className="h-5 w-5 text-cyan-700" />
          </span>
          <p className="font-extrabold text-slate-900">{title}</p>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="text-slate-400">
          <ChevronDownIcon className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.35 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
            className="px-5 pb-5"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default function ConoceMasMostrador() {
  // IMPORTANT: sin precios (aquí NO hay precios)
  const models = useMemo(
    () => [
      {
        key: "mostrador",
        name: "Mostrador",
        tag: "BASE",
        subtitle: "Flujo rápido: lavado + llenado en una misma estación",
        highlights: [
          "Bomba Jet acero inoxidable 1.5 hp (127 V) + presurizador automático.",
          "Filtración: lecho profundo + carbón activado + suavizador (tanques 10x54 NSF).",
          "Desinfección: UV 30 LPM + ozono.",
          "Tarja inox: lavado interior, exterior y llenado de 2 garrafones (con tapa).",
          "Incluye tinaco 2,500 L grado alimenticio (según ficha).",
        ],
        treatment: [
          "Filtro lecho profundo (10x54 NSF) con gravas/arenas sílicas/zeolita (NSF) + válvula manual 3 vías.",
          "Carbón activado (10x54 NSF) (NSF) + válvula manual 3 vías.",
          "Suavizador (10x54 NSF) con válvula manual de 5 pasos + tanque salmuera + resina catiónica (NSF).",
          "Pulidor 10” Slim (NSF).",
          "UV 30 LPM con balastro en acero inoxidable.",
          "Generador de ozono + Ventury 3/4.",
        ],
        tarja: [
          "Mesa mixta: lavado interior (1 garrafón) + lavado exterior (2 garrafones) + llenado (2 garrafones).",
          "Charola de lavado interior fija para 1 garrafón.",
          "Tarja de acero inoxidable.",
          "Incluye tubería PVC cédula 40.",
          "Medidas del conjunto: 170 cm frente x 160 cm alto x 50 cm fondo.",
        ],
        requirements: [
          "Espacio y conexiones: luz independiente + regulador/No Break + contactos + drenaje dentro del local.",
          "Levantamiento de muro (si aplica): 80.5 x 80.5 y altura 90 cm.",
          "Tinacos y capacidades pueden variar según tu operación (te asesoramos).",
        ],
        include: ["Materiales de instalación PVC hidráulico C.D. 40", "Instalación", "Capacitación"],
        pay: ["50% anticipo", "50% a la entrega del equipo", "Si requieres factura: costo + IVA", "Entrega estimada: 15 a 20 días naturales tras firma"],
        extras: [
          "Trámite aviso de funcionamiento",
          "Toma de pipa 2” PVC cédula 40",
          "Kit de insumos anuales",
          "Paquete promoción / inauguración",
          "Tinacos (varias capacidades)",
          "Mantenimiento anual",
          "Seguro",
          "Opción Agua Alcalina (kit)",
          "Upgrade: ósmosis inversa (si lo requieres)",
        ],
        alkaline: ["Filtro alcalinizador", "Pre-filtro pulidor", "Lámpara UV 16 watts", "Tarjeta para 2 tipos de agua"],
      },
      {
        key: "mostrador_ro",
        name: "Mostrador + Ósmosis Inversa",
        tag: "PRO",
        subtitle: "Mejor control de calidad cuando necesitas ósmosis desde el inicio",
        highlights: [
          "Incluye ósmosis inversa (según ficha).",
          "Bomba Jet acero inoxidable 1.5 hp (127 V) + presurizador automático.",
          "Filtración: lecho profundo + carbón activado + suavizador (tanques 10x54 NSF).",
          "Desinfección: UV 30 LPM + ozono.",
          "Tarja inox: lavado interior, exterior y llenado de 2 garrafones (con tapa).",
        ],
        treatment: [
          "Pretratamiento completo (lecho profundo + carbón + suavizador) con tanques 10x54 NSF.",
          "Pulidor 10” Slim (NSF).",
          "UV 30 LPM + ozono + Ventury 3/4.",
          "Módulo de ósmosis inversa incluido (según la versión).",
        ],
        tarja: [
          "Mesa mixta: lavado interior (1 garrafón) + lavado exterior (2 garrafones) + llenado (2 garrafones).",
          "Charola interior fija para 1 garrafón.",
          "Tarja de acero inoxidable + tubería PVC cédula 40.",
          "Medidas del conjunto: 170 cm frente x 160 cm alto x 50 cm fondo.",
        ],
        requirements: [
          "Espacio y conexiones: luz independiente + regulador/No Break + contactos + drenaje dentro del local.",
          "Levantamiento de muro (si aplica): 80.5 x 80.5 y altura 90 cm.",
          "Tinacos y requerimientos exactos dependen de tu volumen/meta (te asesoramos).",
        ],
        include: ["Materiales de instalación PVC hidráulico C.D. 40", "Instalación", "Capacitación"],
        pay: ["50% anticipo", "50% a la entrega del equipo", "Si requieres factura: costo + IVA", "Entrega estimada: 15 a 20 días naturales tras firma"],
        extras: [
          "Automatización de ósmosis (opcional)",
          "Trámite aviso de funcionamiento",
          "Toma de pipa 2” PVC cédula 40",
          "Kit de insumos anuales",
          "Paquete promoción / inauguración",
          "Tinacos (varias capacidades)",
          "Mantenimiento anual",
          "Seguro",
          "Opción Agua Alcalina (kit)",
        ],
        alkaline: ["Filtro alcalinizador", "Pre-filtro pulidor", "Lámpara UV 16 watts", "Tarjeta para 2 tipos de agua"],
      },
    ],
    []
  );

  const sectionIds = ["imp", "trat", "tarja", "inst", "incl", "extras"];
  const [activeModel, setActiveModel] = useState(models[0].key);
  const model = models.find((m) => m.key === activeModel);

  const activeSection = useActiveSection(sectionIds);

  // progress bar
  const contRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: contRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={contRef} className="relative min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-1 origin-left bg-cyan-400 z-[60]" />

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-cyan-300/20 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 -right-40 h-[34rem] w-[34rem] rounded-full bg-indigo-300/18 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-[22rem] w-[44rem] -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <section className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 px-4 py-1.5 rounded-full">
              <SparklesIcon className="h-4 w-4" />
              Conoce más • Mostrador (sin precios)
            </p>
            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Una estación <span className="text-cyan-600">premium</span> para lavado y llenado
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Cambia de modelo con transición suave y revisa lo importante: tratamiento, tarja, requisitos, incluye y extras.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Purificadora"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-lg hover:shadow-xl"
              >
                Configurar mi Planta <ChevronRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold border border-slate-200 bg-white/80 hover:bg-white transition"
              >
                Asesoría
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky mini-nav */}
      <div className="sticky top-2 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="rounded-2xl border border-slate-200 bg-white/75 backdrop-blur-xl shadow-sm px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <NavChip active={activeSection === "imp"} label="Lo importante" onClick={() => scrollTo("imp")} />
                <NavChip active={activeSection === "trat"} label="Tratamiento" onClick={() => scrollTo("trat")} />
                <NavChip active={activeSection === "tarja"} label="Tarja" onClick={() => scrollTo("tarja")} />
                <NavChip active={activeSection === "inst"} label="Instalación" onClick={() => scrollTo("inst")} />
                <NavChip active={activeSection === "incl"} label="Incluye" onClick={() => scrollTo("incl")} />
                <NavChip active={activeSection === "extras"} label="Extras" onClick={() => scrollTo("extras")} />
              </div>

              <div className="flex gap-2 items-center">
                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  {model?.name}
                </span>
                <Link
                  to="/configurar-maquina/Purificadora"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-sm"
                >
                  Configurar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left rail */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <Glass className="p-4 md:p-5">
                <p className="text-sm font-extrabold text-slate-900">Elige modelo</p>
                <p className="text-sm text-slate-600 mt-1">Cámbialo y todo se actualiza con animación.</p>

                <div className="mt-4 space-y-3">
                  {models.map((m) => (
                    <ModelCard
                      key={m.key}
                      active={m.key === activeModel}
                      title={m.name}
                      subtitle={m.subtitle}
                      tag={m.tag}
                      onClick={() => setActiveModel(m.key)}
                    />
                  ))}
                </div>
              </Glass>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                      <ShieldCheckIcon className="h-5 w-5 text-cyan-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Sanitario</p>
                      <p className="text-sm text-slate-600">Acero inoxidable + componentes NSF.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                      <BeakerIcon className="h-5 w-5 text-cyan-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Calidad</p>
                      <p className="text-sm text-slate-600">UV 30 LPM + ozono.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
                      <CircleStackIcon className="h-5 w-5 text-cyan-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Flujo de trabajo</p>
                      <p className="text-sm text-slate-600">Lavado + llenado de 2 garrafones.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-lg">
                <p className="text-sm text-slate-300 font-semibold">Siguiente paso</p>
                <p className="mt-1 text-xl font-extrabold">Te ayudamos a definir capacidad, tinacos y layout.</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/configurar-maquina/Purificadora"
                    className="text-center px-6 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition"
                  >
                    Configurar mi planta
                  </Link>
                  <Link
                    to="/contacto"
                    className="text-center px-6 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                  >
                    Solicitar asesoría
                  </Link>
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div key={model.key} variants={cardSwap} initial="hidden" animate="show" exit="exit">
                  <Glass className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-cyan-700">Conoce más • {model.subtitle}</p>
                        <h3 className="mt-1 text-2xl md:text-4xl font-extrabold text-slate-900">{model.name}</h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-extrabold">
                        {model.tag}
                      </span>
                    </div>

                    <div className="mt-7 space-y-6">
                      {/* Lo importante */}
                      <div id="imp" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={BoltIcon} title="Lo importante importante" subtitle="Resumen real para decidir rápido." />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                              {model.highlights.slice(0, Math.ceil(model.highlights.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                            <ul className="space-y-2">
                              {model.highlights.slice(Math.ceil(model.highlights.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Tratamiento */}
                      <div id="trat" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={BeakerIcon} title="Tratamiento del agua" subtitle="Etapas principales (claro y completo)." />
                          <div className="mt-5">
                            <Accordion title="Ver etapas y componentes" icon={BeakerIcon} defaultOpen>
                              <ul className="mt-3 space-y-2">
                                {model.treatment.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </Accordion>
                          </div>
                        </div>
                      </div>

                      {/* Tarja */}
                      <div id="tarja" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={WrenchScrewdriverIcon} title="Tarja / estación de trabajo" subtitle="Diseñada para operar rápido y limpio." />
                          <div className="mt-5">
                            <Accordion title="Ver características de la tarja" icon={WrenchScrewdriverIcon} defaultOpen>
                              <ul className="mt-3 space-y-2">
                                {model.tarja.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </Accordion>
                          </div>
                        </div>
                      </div>

                      {/* Instalación */}
                      <div id="inst" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={BuildingStorefrontIcon} title="¿Qué requieres para instalar?" subtitle="Checklist para que quede perfecto." />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                              {model.requirements.slice(0, Math.ceil(model.requirements.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                            <ul className="space-y-2">
                              {model.requirements.slice(Math.ceil(model.requirements.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Incluye + pago */}
                      <div id="incl" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={CpuChipIcon} title="Incluye + proceso" subtitle="Lo que te entregamos y cómo avanzamos." />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Incluye</p>
                              <ul className="mt-3 space-y-2">
                                {model.include.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Condiciones de pago / entrega</p>
                              <ul className="mt-3 space-y-2">
                                {model.pay.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Extras + Alcalina */}
                      <div id="extras" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={ShieldCheckIcon} title="Extras que sí valen la pena" subtitle="Opciones para escalar y vender más." />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Extras</p>
                              <ul className="mt-3 space-y-2">
                                {model.extras.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Opción: Agua Alcalina (kit)</p>
                              <ul className="mt-3 space-y-2">
                                {model.alkaline.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                              <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4">
                                <p className="font-extrabold text-slate-900">Tip de venta</p>
                                <p className="mt-1 text-slate-700">
                                  Agua alcalina te permite ofrecer “2 tipos de agua” y subir el ticket promedio.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA final */}
                      <div className="rounded-3xl bg-slate-900 text-white p-7 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div>
                            <p className="text-sm text-slate-300 font-semibold">¿Listo para avanzar?</p>
                            <p className="mt-1 text-2xl font-extrabold">
                              Configura tu planta y te asesoramos con el layout.
                            </p>
                            <p className="mt-2 text-slate-300">
                              (Recomendación de tinacos, conexiones y flujo de lavado/llenado según tu meta).
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to="/configurar-maquina/Purificadora"
                              className="text-center px-7 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-lg"
                            >
                              Configurar mi planta
                            </Link>
                            <Link
                              to="/contacto"
                              className="text-center px-7 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                            >
                              Solicitar asesoría
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Glass>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA (mobile) */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Modelo</p>
            <p className="text-sm font-extrabold text-slate-900 truncate">{model.name}</p>
          </div>
          <Link
            to="/configurar-maquina/Purificadora"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition"
          >
            Configurar <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
