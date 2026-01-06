import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  BoltIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  RectangleStackIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const cn = (...c) => c.filter(Boolean).join(" ");

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const cardSwap = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: { opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.25 } },
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
    <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm"
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
          active ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200"
        )}
      >
        {tag}
      </span>
    </div>

    {active ? (
      <motion.div
        layoutId="activeGlowMegalodon"
        className="absolute inset-0 pointer-events-none"
        initial={false}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
      </motion.div>
    ) : null}
  </button>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <span className="p-2 rounded-2xl bg-blue-50 border border-blue-100">
      <Icon className="h-6 w-6 text-blue-700" />
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
          <span className="p-2 rounded-xl bg-blue-50 border border-blue-100">
            <Icon className="h-5 w-5 text-blue-700" />
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

export default function ConoceMasMegalodon() {
  // Basado en fichas (SIN precios):
  // - Vending Touch Atlantis 300 con mostrador + Limpieza 8 productos
  // - Vending Touch Atlantis 300 Max con mostrador + Limpieza 8 productos
  const models = useMemo(
    () => [
      {
        key: "m300",
        name: "Megalodón",
        tag: "Atlantis 300 + Mostrador + Limpieza (8)",
        subtitle: "Vending TOUCH con tratamiento NSF + UV + ozono",
        important: [
          "Pantalla TOUCH de 8” + interfaz simple para compra rápida.",
          "Validador de monedas con da cambio + enjuague de garrafón.",
          "Agua: 4 modalidades de llenado (configurables).",
          "Tratamiento con tanques/filtros certificados NSF + pulidor NSF.",
          "Desinfección: UV 30 LPM + generador de ozono + ventury 3/4.",
          "Tarja/mostrador: lavado y llenado para flujo continuo.",
          "Limpieza: sensado de litros + sensor de flujo + solenoides + registro de ventas (8 productos).",
        ],
        agua: [
          "Bomba Jet 1.5 HP acero inoxidable 127V + presurizador automático.",
          "Filtro lecho profundo: tanque 10x34 NSF + válvula manual 3 vías + medios filtrantes con certificación NSF.",
          "Filtro carbón activado: tanque 10x34 NSF (carbón activado certificado) + válvula manual 3 vías.",
          "Filtro suavizador: tanque 10x34 NSF + válvula manual 5 pasos + tanque de salmuera + resina catiónica (NSF).",
          "Portacartuchos pulidor 10” Slim (certificado NSF).",
          "Lámpara UV 30 LPM con balastro en acero inoxidable.",
          "Generador de ozono metálico + ventury 3/4.",
          "Despachador automático para 4 modalidades con validador (da cambio y enjuaga).",
        ],
        mostrador: [
          "Mesa mixta: lavado interno (1 garrafón) + lavado exterior (2) + llenado (2).",
          "Charola interior fija para 1 garrafón.",
          "Tarja de acero inoxidable + bomba 1/2 HP.",
          "Tubería PVC cédula 40.",
          "Incluye tinaco grado alimenticio (según ficha).",
        ],
        limpieza: [
          "Gabinete de acero inoxidable con llave para protección del dinero y sistema.",
          "Pantalla inicial con botones de acero inoxidable.",
          "Sensado de litros + sensor de flujo.",
          "Llenado por fracción + da cambio.",
          "Luz interna + vinil.",
          "Registra ventas.",
          "Incluye mangueras, conectores, conexiones.",
          "Bombas 1/2 HP con válvula check.",
          "*No incluye rack (según ficha).",
          "Incluye 8 bidones de 20 L (según ficha).",
        ],
        instalacion: [
          "Local recomendado: 30 a 40 m².",
          "Conexión eléctrica independiente + regulador/no-break + contactos + drenaje dentro del local.",
          "2 tinacos grado alimenticio translúcido para agua cruda (según ficha).",
          "Levantamiento de muro: 96 cm alto x 58 cm largo; altura al piso 75 cm (con cajón interno).",
          "*Flete y viáticos se cotizan por Código Postal (según ficha).",
        ],
        incluye: ["Materiales de instalación en PVC hidráulico C.D 40", "Instalación", "Capacitación"],
        proceso: ["50% de anticipo", "50% restante a la entrega del equipo", "Entrega estimada: 15 a 20 días naturales (a la firma del contrato)"],
        extras: [
          "Trámite de aviso de funcionamiento",
          "Toma de pipa 2” PVC cédula 40",
          "Automatización de ósmosis",
          "Kit de insumos anuales",
          "Paquete para promoción/inauguración",
          "Seguro de vending",
          "Mantenimiento anual",
          "Tinacos grado alimenticio (varias capacidades)",
        ],
      },
      {
        key: "m300max",
        name: "Megalodón",
        tag: "Atlantis 300 Max + Mostrador + Limpieza (8)",
        subtitle: "Ósmosis inversa + 8 modalidades + monitoreo hidráulico",
        important: [
          "Pantalla TOUCH de 8” + gabinete en acero + interfaz rápida.",
          "Despacho automático de agua con 8 modalidades (da cambio y enjuaga).",
          "Ósmosis inversa con portamembrana en acero inoxidable + membrana 4x40 (alta producción).",
          "Monitoreo hidráulico: flujómetros, manómetros y válvula de aguja (según ficha).",
          "Bomba multietapas especial para ósmosis + rack inoxidable (según ficha).",
          "UV 30 LPM + ozono + ventury 3/4 para inocuidad.",
          "Limpieza: 8 productos con sensado de litros + registro de ventas.",
        ],
        agua: [
          "Bomba Jet 1.5 HP acero inoxidable 127V + presurizador automático.",
          "Filtro lecho profundo: tanque 10x34 NSF + válvula manual 3 vías + medios con certificación NSF.",
          "Filtro carbón activado: tanque 10x34 NSF + válvula manual 3 vías.",
          "Filtro suavizador: tanque 10x34 NSF + válvula manual 5 pasos + salmuera + resina catiónica (NSF).",
          "Ósmosis inversa: portamembrana en acero inoxidable + membrana 4x40 (alta producción).",
          "Flujómetros + manómetros + válvula de aguja (según ficha).",
          "Bomba multietapas especial para ósmosis 127V (según ficha) + rack inoxidable.",
          "Portafiltro 20” Slim con cartucho polyspun.",
          "Bomba Jet 3/4 HP acero inoxidable 127V + presurizador automático (según ficha).",
          "Portafiltro 10” Slim con cartucho polyspun.",
          "Lámpara UV 30 LPM con balastro en acero inoxidable.",
          "Generador de ozono metálico + ventury 3/4.",
          "Despachador automático para 8 modalidades con validador (da cambio y enjuaga).",
        ],
        mostrador: [
          "Mesa mixta: lavado interno (1) + exterior (2) + llenado (2).",
          "Charola interior fija para 1 garrafón.",
          "Tarja de acero inoxidable + bomba 1/2 HP.",
          "Tubería PVC cédula 40.",
          "Incluye tinaco grado alimenticio (según ficha).",
        ],
        limpieza: [
          "Gabinete de acero inoxidable con llave + controles (según ficha).",
          "Sensado de litros + sensor de flujo + solenoides.",
          "Da cambio + registro de ventas.",
          "Luz interna + vinil.",
          "Incluye mangueras, conectores, conexiones.",
          "Bombas 1/2 HP con válvula check.",
          "*No incluye rack (según ficha).",
          "Incluye 8 bidones de 20 L (según ficha).",
        ],
        instalacion: [
          "Local recomendado: 30 a 40 m².",
          "Conexión eléctrica independiente + regulador/no-break + contactos + drenaje dentro del local.",
          "2 tinacos grado alimenticio translúcido para agua cruda (según ficha).",
          "Levantamiento de muro: 96 cm alto x 58 cm largo; altura al piso 75 cm (con cajón interno).",
          "*Flete y viáticos se cotizan por Código Postal (según ficha).",
        ],
        incluye: ["Materiales de instalación en PVC hidráulico C.D 40", "Instalación", "Capacitación"],
        proceso: ["50% de anticipo", "50% restante a la entrega del equipo", "Entrega estimada: 15 a 20 días naturales (a la firma del contrato)"],
        extras: [
          "Trámite de aviso de funcionamiento",
          "Toma de pipa 2” PVC cédula 40",
          "Automatización de ósmosis",
          "Kit de insumos anuales",
          "Paquete para promoción/inauguración",
          "Seguro de vending",
          "Mantenimiento anual",
          "Tinacos grado alimenticio (varias capacidades)",
          "Ósmosis inversa (opcional adicional, según ficha)",
        ],
      },
    ],
    []
  );

  const sectionIds = ["imp", "agua", "most", "limp", "inst", "incl", "proc", "extras"];
  const [activeModel, setActiveModel] = useState(models[0].key);
  const model = models.find((m) => m.key === activeModel);
  const activeSection = useActiveSection(sectionIds);

  const contRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: contRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div ref={contRef} className="relative min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Progress bar */}
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-1 origin-left bg-blue-400 z-[60]" />

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-blue-300/18 blur-3xl"
          animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-24 -right-40 h-[34rem] w-[34rem] rounded-full bg-cyan-300/14 blur-3xl"
          animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <section className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full">
              <SparklesIcon className="h-4 w-4" />
              Conoce más • Megalodón (sin precios)
            </p>

            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Megalodón: <span className="text-blue-600">alto flujo</span>, operación rápida.
            </h2>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Elige Atlantis 300 o Atlantis 300 Max y revisa lo esencial: tratamiento, tarja/mostrador, módulo limpieza (8),
              instalación, incluye y proceso.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Megalodon"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 hover:bg-blue-300 transition shadow-lg hover:shadow-xl"
              >
                Configurar mi Estación <ChevronRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold border border-slate-200 bg-white/80 hover:bg-white transition"
              >
                Solicitar propuesta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky nav */}
      <div className="sticky top-2 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="rounded-2xl border border-slate-200 bg-white/75 backdrop-blur-xl shadow-sm px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <NavChip active={activeSection === "imp"} label="Lo importante" onClick={() => scrollTo("imp")} />
                <NavChip active={activeSection === "agua"} label="Módulo Agua" onClick={() => scrollTo("agua")} />
                <NavChip active={activeSection === "most"} label="Mostrador" onClick={() => scrollTo("most")} />
                <NavChip active={activeSection === "limp"} label="Limpieza (8)" onClick={() => scrollTo("limp")} />
                <NavChip active={activeSection === "inst"} label="Instalación" onClick={() => scrollTo("inst")} />
                <NavChip active={activeSection === "incl"} label="Incluye" onClick={() => scrollTo("incl")} />
                <NavChip active={activeSection === "proc"} label="Proceso" onClick={() => scrollTo("proc")} />
                <NavChip active={activeSection === "extras"} label="Extras" onClick={() => scrollTo("extras")} />
              </div>

              <div className="flex gap-2 items-center">
                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  {model?.tag}
                </span>
                <Link
                  to="/configurar-maquina/Megalodon"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold text-slate-900 bg-blue-400 hover:bg-blue-300 transition shadow-sm"
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
                <p className="text-sm font-extrabold text-slate-900">Elige versión</p>
                <p className="text-sm text-slate-600 mt-1">Atlantis 300 o Atlantis 300 Max.</p>

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
                    <span className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      <UserGroupIcon className="h-5 w-5 text-blue-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Alto flujo</p>
                      <p className="text-sm text-slate-600">Atiende más clientes.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      <ComputerDesktopIcon className="h-5 w-5 text-blue-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">TOUCH</p>
                      <p className="text-sm text-slate-600">Experiencia rápida.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">NSF + UV + Ozono</p>
                      <p className="text-sm text-slate-600">Calidad e inocuidad.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-lg">
                <p className="text-sm text-slate-300 font-semibold">Siguiente paso</p>
                <p className="mt-1 text-xl font-extrabold">
                  Configura tu Megalodón y lo adaptamos a tu ubicación.
                </p>
                <p className="mt-2 text-slate-300 text-sm">
                  Definimos layout, instalación y mezcla de productos según tu demanda.
                </p>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/configurar-maquina/Megalodon"
                    className="text-center px-6 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 hover:bg-blue-300 transition"
                  >
                    Configurar mi Estación
                  </Link>
                  <Link
                    to="/contacto"
                    className="text-center px-6 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                  >
                    Solicitar propuesta
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
                        <p className="text-sm font-semibold text-blue-700">
                          Conoce más • {model.subtitle}
                        </p>
                        <h3 className="mt-1 text-2xl md:text-4xl font-extrabold text-slate-900">
                          {model.name} <span className="text-blue-600">({model.tag})</span>
                        </h3>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-extrabold">
                        {model.tag}
                      </span>
                    </div>

                    <div className="mt-7 space-y-6">
                      {/* Importante */}
                      <div id="imp" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={BoltIcon}
                            title="Lo importante importante"
                            subtitle="Lo esencial que resuelve dudas y acelera la compra."
                          />
                          <ul className="mt-5 space-y-2">
                            {model.important.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>

                          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-extrabold text-slate-500">Experiencia</p>
                              <p className="mt-1 font-extrabold text-slate-900">TOUCH 8”</p>
                              <p className="text-sm text-slate-600 mt-1">Flujo de compra rápido.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-extrabold text-slate-500">Desinfección</p>
                              <p className="mt-1 font-extrabold text-slate-900">UV + Ozono</p>
                              <p className="text-sm text-slate-600 mt-1">Mayor inocuidad.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-extrabold text-slate-500">Operación</p>
                              <p className="mt-1 font-extrabold text-slate-900">Da cambio</p>
                              <p className="text-sm text-slate-600 mt-1">Menos fricción.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Agua */}
                      <div id="agua" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={CircleStackIcon}
                            title="Módulo Agua"
                            subtitle="Tratamiento, desinfección y despacho."
                          />
                          <Accordion title="Ver componentes del sistema" icon={BeakerIcon} defaultOpen>
                            <ul className="mt-3 space-y-2">
                              {model.agua.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </Accordion>
                        </div>
                      </div>

                      {/* Mostrador */}
                      <div id="most" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={WrenchScrewdriverIcon}
                            title="Mostrador / Tarja"
                            subtitle="Zona de lavado y llenado para flujo continuo."
                          />
                          <Accordion title="Ver características" icon={WrenchScrewdriverIcon} defaultOpen>
                            <ul className="mt-3 space-y-2">
                              {model.mostrador.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </Accordion>
                        </div>
                      </div>

                      {/* Limpieza */}
                      <div id="limp" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={RectangleStackIcon}
                            title="Módulo Limpieza (8 productos)"
                            subtitle="Recargas a granel con control y registro."
                          />
                          <Accordion title="Ver características del módulo" icon={RectangleStackIcon} defaultOpen>
                            <ul className="mt-3 space-y-2">
                              {model.limpieza.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </Accordion>
                        </div>
                      </div>

                      {/* Instalación */}
                      <div id="inst" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={BuildingStorefrontIcon}
                            title="Checklist de instalación"
                            subtitle="Lo que necesitas para instalar sin sorpresas."
                          />
                          <ul className="mt-5 space-y-2">
                            {model.instalacion.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Incluye */}
                      <div id="incl" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={SparklesIcon}
                            title="Incluye"
                            subtitle="Lo que te entregamos (sin montos)."
                          />
                          <ul className="mt-5 space-y-2">
                            {model.incluye.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Proceso */}
                      <div id="proc" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={CpuChipIcon}
                            title="Proceso / Entrega"
                            subtitle="Flujo claro para arrancar."
                          />
                          <Accordion title="Ver condiciones" icon={CpuChipIcon} defaultOpen>
                            <ul className="mt-3 space-y-2">
                              {model.proceso.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </Accordion>
                        </div>
                      </div>

                      {/* Extras */}
                      <div id="extras" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader
                            icon={ShieldCheckIcon}
                            title="Extras"
                            subtitle="Opcionales para escalar tu estación."
                          />
                          <ul className="mt-5 space-y-2">
                            {model.extras.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="rounded-3xl bg-slate-900 text-white p-7 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div>
                            <p className="text-sm text-slate-300 font-semibold">¿Listo para operar?</p>
                            <p className="mt-1 text-2xl font-extrabold">
                              Configura tu Megalodón y lo adaptamos a tu demanda real.
                            </p>
                            <p className="mt-2 text-slate-300">
                              Te guiamos con instalación, mezcla de productos y arranque.
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to="/configurar-maquina/Megalodon"
                              className="text-center px-7 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 hover:bg-blue-300 transition shadow-lg"
                            >
                              Configurar mi Estación
                            </Link>
                            <Link
                              to="/contacto"
                              className="text-center px-7 py-3 rounded-full font-semibold border border-white/20 bg-white/10 hover:bg-white/15 transition"
                            >
                              Solicitar propuesta
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

      {/* Mobile CTA */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden">
        <div className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg p-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">Versión</p>
            <p className="text-sm font-extrabold text-slate-900 truncate">{model.tag}</p>
          </div>
          <Link
            to="/configurar-maquina/Megalodon"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-slate-900 bg-blue-400 hover:bg-blue-300 transition"
          >
            Configurar <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
