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
  BoltIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CircleStackIcon,
  CpuChipIcon,
  ArchiveBoxIcon,
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
    <CheckCircleIcon className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
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
        ? "border-rose-200 bg-gradient-to-br from-rose-50 to-white shadow-sm"
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
        layoutId="activeGlowLimpieza"
        className="absolute inset-0 pointer-events-none"
        initial={false}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-rose-300/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </motion.div>
    ) : null}
  </button>
);

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-3">
    <span className="p-2 rounded-2xl bg-rose-50 border border-rose-100">
      <Icon className="h-6 w-6 text-rose-700" />
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
          <span className="p-2 rounded-xl bg-rose-50 border border-rose-100">
            <Icon className="h-5 w-5 text-rose-700" />
          </span>
          <p className="font-extrabold text-slate-slate-900">{title}</p>
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

export default function ConoceMasVendingLimpieza() {
  // Datos basados en fichas (SIN precios / SIN montos)
  const models = useMemo(
    () => [
      {
        key: "clean5",
        name: "Vending Limpieza",
        tag: "5 PRODUCTOS",
        subtitle: "Compacta • Ideal para arrancar",
        important: [
          "Gabinete de acero inoxidable con llave (protección del dinero y sistema).",
          "Monedero antirrobo con cambio (acepta $1, $2, $5 y $10).",
          "Sensado de litros + llenado por litro.",
          "Pantalla inicial con botones de acero inoxidable + luz interna.",
          "Registra ventas.",
          "*No incluye rack.",
        ],
        components: [
          "Bombas de 1/2 HP con válvula check.",
          "Mangueras.",
          "Conectores.",
          "Conexiones.",
          "Gabinete inoxidable con llave.",
        ],
        gift: ["5 bidones de 20 L.", "1 vinil."],
        install: [
          "Local mínimo: 2 m².",
          "Conexiones: luz independiente, regulador de voltaje/No Break, contactos y drenaje dentro del local.",
          "Levantamiento de muro: 96 x 58 (máquina) • altura del suelo a la vending: 75 cm • cajón interior: 15 cm.",
        ],
        payment: [
          "50% de anticipo.",
          "50% restante a la entrega del equipo.",
          "Si requieres factura: costo + IVA.",
          "Entrega estimada: 15–20 días naturales (a la firma del contrato).",
        ],
        extras: [
          "Trámite de aviso de funcionamiento.",
          "Seguro de vending.",
          "Paquete para promoción o inauguración.",
          "Flete y viáticos se cotizan por Código Postal.",
        ],
      },
      {
        key: "clean8",
        name: "Vending Limpieza",
        tag: "8 PRODUCTOS",
        subtitle: "Más variedad • Mayor capacidad de venta",
        important: [
          "Gabinete de acero inoxidable con llave (protección del dinero y sistema).",
          "Monedero antirrobo con cambio (acepta $1, $2, $5 y $10).",
          "Sensado de litros + llenado por litro.",
          "Pantalla inicial con botones de acero inoxidable + luz interna.",
          "Registra ventas.",
          "*No incluye rack.",
        ],
        components: [
          "Bombas de 1/2 HP con válvula check.",
          "Mangueras.",
          "Conectores.",
          "Conexiones.",
          "Gabinete inoxidable con llave.",
        ],
        gift: ["8 bidones de 20 L.", "1 vinil."],
        install: [
          "Local mínimo: 2 m².",
          "Conexiones: luz independiente, regulador de voltaje/No Break, contactos y drenaje dentro del local.",
          "Levantamiento de muro: 96 x 58 (máquina) • altura del suelo a la vending: 75 cm • cajón interior: 15 cm.",
        ],
        payment: [
          "50% de anticipo.",
          "50% restante a la entrega del equipo.",
          "Si requieres factura: costo + IVA.",
          "Entrega estimada: 15–20 días naturales (a la firma del contrato).",
        ],
        extras: [
          "Trámite de aviso de funcionamiento.",
          "Seguro de vending.",
          "Paquete para promoción o inauguración.",
          "Flete y viáticos se cotizan por Código Postal.",
        ],
      },
    ],
    []
  );

  const sectionIds = ["imp", "comp", "gift", "inst", "pay", "extras"];
  const [activeModel, setActiveModel] = useState(models[0].key);
  const model = models.find((m) => m.key === activeModel);
  const activeSection = useActiveSection(sectionIds);

  const contRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: contRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 });

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div ref={contRef} className="relative min-h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Progress */}
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-1 origin-left bg-rose-400 z-[60]" />

      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-rose-300/18 blur-3xl"
          animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 -right-40 h-[34rem] w-[34rem] rounded-full bg-fuchsia-300/14 blur-3xl"
          animate={{ x: [0, -26, 0], y: [0, 18, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 h-[22rem] w-[44rem] -translate-x-1/2 rounded-full bg-indigo-300/10 blur-3xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <section className="relative pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-4 py-1.5 rounded-full">
              <SparklesIcon className="h-4 w-4" />
              Conoce más • Vending Limpieza (sin precios)
            </p>
            <h2 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Recargas a granel con una experiencia <span className="text-rose-600">premium</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Cambia entre 5 y 8 productos con animaciones suaves. Te mostramos lo importante: equipo, instalación, proceso y extras.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/configurar-maquina/Vending-Limpieza"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 hover:bg-rose-300 transition shadow-lg hover:shadow-xl"
              >
                Configurar mi Vending <ChevronRightIcon className="h-5 w-5" />
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

      {/* Sticky nav */}
      <div className="sticky top-2 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="rounded-2xl border border-slate-200 bg-white/75 backdrop-blur-xl shadow-sm px-3 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <NavChip active={activeSection === "imp"} label="Lo importante" onClick={() => scrollTo("imp")} />
                <NavChip active={activeSection === "comp"} label="Componentes" onClick={() => scrollTo("comp")} />
                <NavChip active={activeSection === "gift"} label="Regalo" onClick={() => scrollTo("gift")} />
                <NavChip active={activeSection === "inst"} label="Instalación" onClick={() => scrollTo("inst")} />
                <NavChip active={activeSection === "pay"} label="Proceso" onClick={() => scrollTo("pay")} />
                <NavChip active={activeSection === "extras"} label="Extras" onClick={() => scrollTo("extras")} />
              </div>

              <div className="flex gap-2 items-center">
                <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  {model?.tag}
                </span>
                <Link
                  to="/configurar-maquina/Vending-Limpieza"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full font-semibold text-slate-900 bg-rose-400 hover:bg-rose-300 transition shadow-sm"
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
                <p className="text-sm font-extrabold text-slate-900">Elige configuración</p>
                <p className="text-sm text-slate-600 mt-1">Todo cambia con animación (UX premium).</p>

                <div className="mt-4 space-y-3">
                  {models.map((m) => (
                    <ModelCard
                      key={m.key}
                      active={m.key === activeModel}
                      title={`${m.name}`}
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
                    <span className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <ShieldCheckIcon className="h-5 w-5 text-rose-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Seguridad</p>
                      <p className="text-sm text-slate-600">Gabinete con llave + monedero antirrobo.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <CpuChipIcon className="h-5 w-5 text-rose-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Operación</p>
                      <p className="text-sm text-slate-600">Sensado de litros + registro de ventas.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm p-4 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <CircleStackIcon className="h-5 w-5 text-rose-700" />
                    </span>
                    <div>
                      <p className="font-extrabold text-slate-900">Recarga</p>
                      <p className="text-sm text-slate-600">Venta por litro (flujo simple).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-lg">
                <p className="text-sm text-slate-300 font-semibold">Siguiente paso</p>
                <p className="mt-1 text-xl font-extrabold">Configura tu vending y te asesoramos con ubicación y oferta.</p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/configurar-maquina/Vending-Limpieza"
                    className="text-center px-6 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 hover:bg-rose-300 transition"
                  >
                    Configurar mi Vending
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
                        <p className="text-sm font-semibold text-rose-700">Conoce más • {model.subtitle}</p>
                        <h3 className="mt-1 text-2xl md:text-4xl font-extrabold text-slate-900">
                          {model.name} <span className="text-rose-600">({model.tag})</span>
                        </h3>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-extrabold">
                        {model.tag}
                      </span>
                    </div>

                    <div className="mt-7 space-y-6">
                      {/* Lo importante */}
                      <div id="imp" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={BoltIcon} title="Lo importante importante" subtitle="Lo que hace que el equipo venda y sea seguro." />
                          <ul className="mt-5 space-y-2">
                            {model.important.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Componentes */}
                      <div id="comp" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={WrenchScrewdriverIcon} title="Componentes" subtitle="Lo esencial del equipo según ficha." />
                          <Accordion title="Ver lista de componentes" icon={WrenchScrewdriverIcon} defaultOpen>
                            <ul className="mt-3 space-y-2">
                              {model.components.map((t, i) => (
                                <Bullet key={i}>{t}</Bullet>
                              ))}
                            </ul>
                          </Accordion>
                        </div>
                      </div>

                      {/* Regalo */}
                      <div id="gift" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={ArchiveBoxIcon} title="Regalo" subtitle="Incluido con el equipo (sin montos)." />
                          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Incluye</p>
                              <ul className="mt-3 space-y-2">
                                {model.gift.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                              <p className="font-extrabold text-slate-900">Nota</p>
                              <p className="mt-2 text-slate-700">
                                El rack no va incluido. Te ayudamos a definir la mejor base según tu instalación.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Instalación */}
                      <div id="inst" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={BuildingStorefrontIcon} title="¿Qué requieres para instalar?" subtitle="Checklist claro para que quede perfecto." />
                          <ul className="mt-5 space-y-2">
                            {model.install.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Proceso / pago */}
                      <div id="pay" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={CurrencyDollarIcon} title="Proceso de compra / entrega" subtitle="Sin precios: solo el flujo y condiciones." />
                          <div className="mt-5">
                            <Accordion title="Ver condiciones" icon={CurrencyDollarIcon} defaultOpen>
                              <ul className="mt-3 space-y-2">
                                {model.payment.map((t, i) => (
                                  <Bullet key={i}>{t}</Bullet>
                                ))}
                              </ul>
                            </Accordion>
                          </div>
                        </div>
                      </div>

                      {/* Extras */}
                      <div id="extras" className="scroll-mt-28">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6">
                          <SectionHeader icon={ShieldCheckIcon} title="Extras" subtitle="Opcionales (sin montos) para escalar y operar mejor." />
                          <ul className="mt-5 space-y-2">
                            {model.extras.map((t, i) => (
                              <Bullet key={i}>{t}</Bullet>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* CTA final */}
                      <div className="rounded-3xl bg-slate-900 text-white p-7 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                          <div>
                            <p className="text-sm text-slate-300 font-semibold">¿Listo para iniciar?</p>
                            <p className="mt-1 text-2xl font-extrabold">Configura tu vending y te asesoramos con productos y ubicación.</p>
                            <p className="mt-2 text-slate-300">
                              Recomendación de mix (cloro, detergente, suavizante, etc.) según tu mercado.
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to="/configurar-maquina/Vending-Limpieza"
                              className="text-center px-7 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 hover:bg-rose-300 transition shadow-lg"
                            >
                              Configurar mi Vending
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
            <p className="text-xs font-semibold text-slate-500">Configuración</p>
            <p className="text-sm font-extrabold text-slate-900 truncate">{model.tag}</p>
          </div>
          <Link
            to="/configurar-maquina/Vending-Limpieza"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-slate-900 bg-rose-400 hover:bg-rose-300 transition"
          >
            Configurar <ChevronRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
