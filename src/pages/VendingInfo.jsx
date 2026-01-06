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
} from "@heroicons/react/24/outline";

const cn = (...c) => c.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

const softPop = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.98, y: 10, transition: { duration: 0.35 } },
};

function useActiveSection(sectionIds = []) {
  const [active, setActive] = useState(sectionIds[0] || "");
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.35, 0.5, 0.7] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds.join("|")]);

  return active;
}

const Pill = ({ icon: Icon, title, desc }) => (
  <motion.div
    variants={fadeUp}
    className="group flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-md transition"
  >
    <span className="p-2 rounded-xl bg-cyan-50 border border-cyan-100">
      <Icon className="h-5 w-5 text-cyan-700" />
    </span>
    <div>
      <p className="font-extrabold text-slate-900 leading-tight">{title}</p>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  </motion.div>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2">
    <CheckCircleIcon className="h-5 w-5 text-cyan-700 mt-0.5 flex-shrink-0" />
    <span className="text-slate-700">{children}</span>
  </li>
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
        layoutId="activeGlow"
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
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-slate-400"
        >
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

export default function ConoceMasVending_Dinamico() {
  const models = useMemo(
    () => [
      {
        key: "atlantis300",
        name: "ATLANTIS 300",
        subtitle: "Arranque rápido • Sistema completo sin ósmosis",
        tag: "ESENCIAL",
        quick: [
          "Acero inoxidable 304 (grado alimenticio).",
          "Pantalla TOUCH 8”.",
          "Validador de monedas: da cambio y enjuaga.",
          "Despacho: 1, 4, 10 y 20 litros.",
          "UV + ozono para calidad de agua.",
        ],
        forWho: [
          "Perfecta para iniciar con operación simple y robusta.",
          "Ideal si buscas eficiencia sin agregar ósmosis desde el inicio.",
        ],
        treatment: [
          "Lecho profundo (NSF) + válvula manual 3 vías.",
          "Carbón activado (NSF) + válvula manual 3 vías.",
          "Suavizador (NSF) con resina catiónica + tanque salmuera.",
          "Pulidor 10” Slim (NSF).",
          "UV 25 LPM + generador de ozono + Ventury 3/4.",
        ],
        dispensing: [
          "Despachador automático para 4 modalidades.",
          "Monedero/validador: cambio + enjuague.",
        ],
        install: [
          "Local mínimo recomendado: 12 m².",
          "Luz independiente + regulador/No Break + drenaje dentro del local.",
          "Tinacos agua cruda: 2,500 L x2 (o 5,000 L x1).",
          "Muro: 80.5 x 80.5 y altura 90 cm del suelo a la vending.",
        ],
        include: [
          "Instalación incluida.",
          "Capacitación incluida (operación y mantenimiento preventivo).",
          "Materiales PVC hidráulico C.D. 40 incluidos.",
        ],
        extras: [
          "Opción Agua Alcalina (2 tipos de agua con tarjeta).",
          "Trámite aviso de funcionamiento (opcional).",
          "Kit de insumos anuales, seguro, mantenimiento anual (opcionales).",
          "Mostrador, toma de pipa y upgrade ósmosis (opcionales).",
        ],
      },
      {
        key: "atlantis300max",
        name: "ATLANTIS 300 Max",
        subtitle: "Ósmosis inversa • Mayor demanda • Máxima calidad",
        tag: "PRO",
        quick: [
          "Ósmosis inversa alta producción (membrana 4x40).",
          "Pantalla TOUCH 8”.",
          "Validador de monedas: da cambio y enjuaga.",
          "Despacho: 1, 4, 10 y 20 litros.",
          "UV + ozono para alta calidad.",
        ],
        forWho: [
          "Ideal si necesitas ósmosis desde el inicio por condiciones del agua.",
          "Recomendable para ubicaciones de alta demanda.",
        ],
        treatment: [
          "Lecho profundo + carbón activado + suavizador (NSF).",
          "Ósmosis: membrana 4x40 + medición/controles + bomba multietapas.",
          "Portafiltro 20” Slim + 10” Slim (polyspun).",
          "UV 25 LPM + ozono + Ventury 3/4.",
        ],
        dispensing: [
          "Despachador TOUCH para 8 modalidades.",
          "Monedero/validador: cambio + enjuague.",
        ],
        install: [
          "Local recomendado: 30–40 m².",
          "Luz independiente + regulador/No Break + drenaje dentro del local.",
          "Tinacos agua cruda: 5,000 L x2.",
          "Muro: 80.5 x 80.5 y altura 90 cm del suelo a la vending.",
        ],
        include: [
          "Instalación incluida.",
          "Capacitación incluida (operación y mantenimiento preventivo).",
          "Materiales PVC hidráulico C.D. 40 incluidos.",
        ],
        extras: [
          "Automatización de ósmosis (opcional).",
          "Opción Agua Alcalina (2 tipos de agua con tarjeta).",
          "Trámite, kit insumos, seguro, mantenimiento anual (opcionales).",
          "Mostrador y toma de pipa (opcionales).",
        ],
      },
    ],
    []
  );

  const sectionIds = ["lo-importante", "diferencias", "tratamiento", "instalacion", "incluye", "extras"];
  const [activeModel, setActiveModel] = useState(models[0].key);
  const model = models.find((m) => m.key === activeModel);

  const activeSection = useActiveSection(sectionIds);

  // Progress bar
  const contRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: contRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={contRef} className="relative min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Top progress bar */}
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-1 origin-left bg-cyan-400 z-[60]" />

      {/* Animated background blobs */}
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
      <section className="relative pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 bg-cyan-50 border border-cyan-100 px-4 py-1.5 rounded-full">
              <SparklesIcon className="h-4 w-4" />
              Conoce más (sin precios)
            </p>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Una experiencia <span className="text-cyan-600">premium</span> para elegir tu vending
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Lo importante importante: qué incluye, diferencias reales, tratamiento del agua, requisitos de instalación y extras que sí valen la pena.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Vending"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-lg hover:shadow-xl"
              >
                Configurar mi Equipo <ChevronRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold border border-slate-200 bg-white/80 hover:bg-white transition"
              >
                Hablar con un asesor
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
                <NavChip active={activeSection === "lo-importante"} label="Lo importante" onClick={() => scrollTo("lo-importante")} />
                <NavChip active={activeSection === "diferencias"} label="Diferencias" onClick={() => scrollTo("diferencias")} />
                <NavChip active={activeSection === "tratamiento"} label="Tratamiento" onClick={() => scrollTo("tratamiento")} />
                <NavChip active={activeSection === "instalacion"} label="Instalación" onClick={() => scrollTo("instalacion")} />
                <NavChip active={activeSection === "incluye"} label="Incluye" onClick={() => scrollTo("incluye")} />
                <NavChip active={activeSection === "extras"} label="Extras" onClick={() => scrollTo("extras")} />
              </div>

              <div className="flex gap-2">
                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  {model?.name}
                </span>
                <Link
                  to="/configurar-maquina/Vending"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-sm"
                >
                  Configurar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left rail */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <motion.div variants={softPop} initial="hidden" animate="show">
                <Glass className="p-4 md:p-5">
                  <p className="text-sm font-extrabold text-slate-900">Elige el modelo</p>
                  <p className="text-sm text-slate-600 mt-1">Cambia de modelo y verás todo con transición suave.</p>

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
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
                variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Pill icon={ShieldCheckIcon} title="Acero 304" desc="Imagen profesional + durabilidad." />
                <Pill icon={CpuChipIcon} title="TOUCH" desc="Operación clara para el cliente." />
                <Pill icon={CurrencyDollarIcon} title="Cobro" desc="Validador: cambio + enjuague." />
                <Pill icon={BeakerIcon} title="Calidad" desc="UV + ozono (ósmosis en Max)." />
              </motion.div>

              <motion.div variants={softPop} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-lg">
                  <p className="text-sm text-slate-300 font-semibold">¿Quieres que lo dejemos listo?</p>
                  <p className="mt-1 text-xl font-extrabold">Te ayudamos a elegir el setup ideal para tu ubicación.</p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/configurar-maquina/Vending"
                      className="text-center px-6 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition"
                    >
                      Configurar mi equipo
                    </Link>
                    <Link
                      to="/contacto"
                      className="text-center px-6 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                    >
                      Solicitar asesoría
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right content */}
            <div className="lg:col-span-8 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div key={model.key} variants={softPop} initial="hidden" animate="show" exit="exit">
                  <Glass className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-cyan-700">Conoce más • {model.subtitle}</p>
                        <h2 className="mt-1 text-2xl md:text-4xl font-extrabold text-slate-900">{model.name}</h2>
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-extrabold">
                          {model.tag}
                        </span>
                      </div>
                    </div>

                    {/* Sections */}
                    <div className="mt-7 space-y-6">
                      {/* LO IMPORTANTE */}
                      <div id="lo-importante" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={BoltIcon}
                            title="Lo importante importante"
                            subtitle="Los puntos que definen el equipo (sin relleno)."
                          />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                              {model.quick.slice(0, Math.ceil(model.quick.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                            <ul className="space-y-2">
                              {model.quick.slice(Math.ceil(model.quick.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* DIFERENCIAS */}
                      <div id="diferencias" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={SparklesIcon}
                            title="Diferencias (decisión rápida)"
                            subtitle="Para elegir sin confundirte."
                          />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Este modelo es para ti si…</p>
                              <ul className="mt-3 space-y-2">
                                {model.forWho.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Tip pro</p>
                              <p className="mt-2 text-slate-700">
                                Si tu zona tiene <span className="font-semibold">agua complicada</span> o quieres el nivel más alto,
                                ve por <span className="font-semibold">Max con ósmosis</span>. Si buscas <span className="font-semibold">arranque eficiente</span>,
                                Atlantis 300 es excelente.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TRATAMIENTO */}
                      <div id="tratamiento" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={BeakerIcon}
                            title="Tratamiento del agua (resumen claro)"
                            subtitle="Lo esencial del sistema de purificación."
                          />
                          <div className="mt-5">
                            <Accordion title="Ver componentes principales" icon={BeakerIcon} defaultOpen>
                              <ul className="mt-3 space-y-2">
                                {model.treatment.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </Accordion>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="font-extrabold text-slate-900">¿Qué gana tu cliente?</p>
                                <p className="mt-2 text-slate-700">
                                  Agua de alta calidad con procesos de filtración + desinfección (UV y ozono) para confianza y recompra.
                                </p>
                              </div>
                              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <p className="font-extrabold text-slate-900">Experiencia “wow”</p>
                                <p className="mt-2 text-slate-700">
                                  La sensación de equipo profesional (acero + touch + enjuague) eleva percepción y conversión.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* INSTALACION */}
                      <div id="instalacion" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={BuildingStorefrontIcon}
                            title="Requisitos de instalación"
                            subtitle="Lo mínimo para instalar bien desde el día 1."
                          />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="space-y-2">
                              {model.install.slice(0, Math.ceil(model.install.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                            <ul className="space-y-2">
                              {model.install.slice(Math.ceil(model.install.length / 2)).map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* INCLUYE */}
                      <div id="incluye" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={WrenchScrewdriverIcon}
                            title="Incluye (sin letras chiquitas)"
                            subtitle="Lo que necesitas para arrancar con confianza."
                          />
                          <div className="mt-5">
                            <ul className="space-y-2">
                              {model.include.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* EXTRAS */}
                      <div id="extras" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={ShieldCheckIcon}
                            title="Extras que sí valen la pena"
                            subtitle="Opcionales para escalar o mejorar tu oferta."
                          />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900 flex items-center gap-2">
                                <ShieldCheckIcon className="h-5 w-5 text-cyan-700" />
                                Extras recomendados
                              </p>
                              <ul className="mt-3 space-y-2">
                                {model.extras.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900 flex items-center gap-2">
                                <CurrencyDollarIcon className="h-5 w-5 text-cyan-700" />
                                Despacho + cobro (UX)
                              </p>
                              <ul className="mt-3 space-y-2">
                                {model.dispensing.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                              <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4">
                                <p className="font-extrabold text-slate-900">Tip de conversión</p>
                                <p className="mt-1 text-slate-700">
                                  El “enjuague” y el “cambio” aumentan confianza y hacen la compra más fluida.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom CTA */}
                      <div className="rounded-3xl bg-slate-900 text-white p-7 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div>
                            <p className="text-sm text-slate-300 font-semibold">Último paso</p>
                            <p className="mt-1 text-2xl font-extrabold">
                              Configura tu vending ideal y te asesoramos para la ubicación.
                            </p>
                            <p className="mt-2 text-slate-300">
                              Te ayudamos a elegir el modelo correcto (Atl. 300 vs Max) según tu necesidad.
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to="/configurar-maquina/Vending"
                              className="text-center px-7 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-lg"
                            >
                              Configurar mi equipo
                            </Link>
                            <Link
                              to="/contacto"
                              className="text-center px-7 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                            >
                              Cotizar / asesoría
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

      {/* Floating quick CTA (mobile) */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Modelo</p>
            <p className="text-sm font-extrabold text-slate-900 truncate">{model.name}</p>
          </div>
          <Link
            to="/configurar-maquina/Vending"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition"
          >
            Configurar <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
