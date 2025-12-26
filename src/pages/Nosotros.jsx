import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

/* =========================================
   Animaciones (suaves y consistentes)
========================================= */
const easeOut = [0.22, 0.61, 0.36, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: easeOut },
  viewport: { once: true, amount: 0.25 },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.7, delay, ease: easeOut },
  viewport: { once: true, amount: 0.25 },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, amount: 0.3 },
});

/* =========================================
   UI helpers
========================================= */
const Badge = ({ children, dark = false }) => (
  <span
    className={[
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] uppercase backdrop-blur",
      dark
        ? "border-white/10 bg-white/10 text-white"
        : "border-slate-200 bg-white/70 text-slate-700",
      "border",
    ].join(" ")}
  >
    <span className="h-2 w-2 rounded-full bg-[#24d4da] shadow-[0_0_18px_rgba(36,212,218,0.7)]" />
    {children}
  </span>
);

const SectionHeader = ({ label, title, desc, align = "center", dark = false }) => {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : ""}>
      <Badge dark={dark}>{label}</Badge>
      <h2
        className={[
          "mt-5 font-extrabold tracking-tight",
          dark ? "text-white" : "text-slate-950",
          "text-3xl md:text-4xl",
        ].join(" ")}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className={[
            "mt-3 text-sm md:text-base leading-relaxed",
            dark ? "text-white/70" : "text-slate-600",
            center ? "max-w-2xl mx-auto" : "max-w-xl",
          ].join(" ")}
        >
          {desc}
        </p>
      ) : null}
    </div>
  );
};

const PrimaryButton = ({ href, onClick, children }) => {
  const base =
    "group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-extrabold shadow-sm hover:shadow-md transition active:scale-[0.98]";
  if (href) {
    return (
      <a
        href={href}
        className={`${base} bg-[#24d4da] text-slate-950 hover:bg-lime-200`}
      >
        {children}
        <span className="text-lg group-hover:translate-x-0.5 transition-transform">→</span>
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} bg-[#24d4da] text-slate-950 hover:bg-lime-200`}
    >
      {children}
      <span className="text-lg group-hover:translate-x-0.5 transition-transform">→</span>
    </button>
  );
};

const SecondaryButton = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-extrabold bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition active:scale-[0.98]"
  >
    {children}
  </a>
);

const MetricCard = ({ k, v, delay = 0 }) => (
  <motion.div
    {...scaleIn(delay)}
    className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur px-5 py-4 shadow-sm hover:shadow-md transition"
  >
    <div className="text-2xl font-extrabold text-[#007377] leading-none">{k}</div>
    <div className="mt-2 text-[11px] text-slate-600 font-semibold tracking-wide">
      {v}
    </div>
  </motion.div>
);

const IconChip = ({ children }) => (
  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
    ✔ {children}
  </span>
);

const GlassCard = ({ children, className = "" }) => (
  <div
    className={[
      "relative rounded-[34px] border border-white/10 bg-white/5 backdrop-blur overflow-hidden",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const ValueCard = ({ img, t, d, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    className="
      group relative rounded-3xl border border-slate-200 bg-white
      shadow-[0_16px_50px_rgba(15,23,42,0.06)]
      hover:shadow-[0_28px_80px_rgba(15,23,42,0.10)]
      transition-all duration-300 overflow-hidden
    "
  >
    <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#24d4da]/14 blur-3xl opacity-0 group-hover:opacity-100 transition" />
    <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#007377]/12 blur-3xl opacity-0 group-hover:opacity-100 transition" />

    <div className="relative p-7 flex flex-col h-full text-center">
      <div className="mx-auto mb-5 grid place-items-center h-24 w-24 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm group-hover:border-[#24d4da]/40 transition">
        <img
          src={img}
          alt={t}
          className="h-16 w-16 object-contain group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <h4 className="text-lg md:text-xl font-extrabold tracking-tight text-slate-950">
        {t}
      </h4>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{d}</p>

      <div className="mt-auto pt-5">
        <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-[#24d4da] to-[#007377] opacity-60 group-hover:opacity-100 transition" />
      </div>
    </div>
  </motion.div>
);

const TimelineItem = ({ year, title, desc, index }) => (
  <motion.div {...fadeUp(index * 0.06)} className="relative grid md:grid-cols-12 gap-6">
    <div className="md:col-span-4 flex md:justify-end">
      <div className="flex items-center gap-3 md:pr-6">
        <span className="h-2.5 w-2.5 rounded-full bg-[#24d4da] shadow-[0_0_18px_rgba(36,212,218,0.75)]" />
        <span className="text-sm font-extrabold text-slate-800">{year}</span>
      </div>
    </div>

    <div className="hidden md:block md:col-span-1 relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-2 h-full w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 top-2 h-3.5 w-3.5 rounded-full bg-[#24d4da] ring-4 ring-white" />
    </div>

    <div className="md:col-span-7">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
        <h3 className="text-base md:text-lg font-extrabold text-slate-950">
          {title}
        </h3>
        <p className="mt-2 text-sm md:text-[15px] text-slate-600 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

/* =========================================
   Página Nosotros (SUPER REDISEÑO)
========================================= */
export default function Nosotros() {
  const valores = [
    {
      img: "/img/valor/DISCIPLINA.png",
      t: "Disciplina",
      d: "Orden, método y ejecución impecable para resultados consistentes.",
    },
    {
      img: "/img/valor/CONSTANCIA.png",
      t: "Constancia",
      d: "Mejora diaria: evolución continua para estar siempre a la vanguardia.",
    },
    {
      img: "/img/valor/RESPONSABILIDAD.png",
      t: "Responsabilidad",
      d: "Compromiso real con clientes, equipo y el entorno.",
    },
    {
      img: "/img/valor/INTEGRIDAD.png",
      t: "Integridad",
      d: "Honestidad para construir relaciones duraderas y transparentes.",
    },
    {
      img: "/img/valor/LIDERAZGO.png",
      t: "Liderazgo",
      d: "Inspirar con visión, innovación y ejemplo.",
    },
    {
      img: "/img/valor/COMPROMISO.png",
      t: "Compromiso",
      d: "Atención y soluciones que aportan valor real y medible.",
    },
  ];

  const timeline = [
    {
      year: "2019",
      title: "Nace Darmax",
      desc: "Empezamos con una purificadora y la convicción de que el agua puede ser un negocio accesible y escalable.",
    },
    {
      year: "2021",
      title: "Primera máquina vending",
      desc: "Integramos tecnología para operar 24/7 y abrir oportunidades de emprendimiento con mínima fricción.",
    },
    {
      year: "2023",
      title: "Crecimiento nacional",
      desc: "Fortalecimos logística y soporte técnico para llegar a más estados con servicio confiable.",
    },
    {
      year: "2025",
      title: "Innovación continua",
      desc: "Nuevos modelos y mejoras para hacer más rentable, simple y automatizable el negocio.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Nosotros | Darmax Purificadoras y Máquinas Vending</title>
        <meta
          name="description"
          content="Conoce la historia de Darmax: un proyecto mexicano que impulsa el emprendimiento mediante purificadoras, vending y tecnología accesible."
        />
        <link rel="canonical" href="https://tudominio.com/nosotros" />
        <meta property="og:title" content="Nosotros | Darmax" />
        <meta
          property="og:description"
          content="Darmax nació con la misión de ofrecer oportunidades de negocio y tecnología accesible. Conoce nuestra historia, misión y visión."
        />
        <meta property="og:image" content="https://tudominio.com/img/og-image.png" />
        <meta property="og:url" content="https://tudominio.com/nosotros" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="min-h-screen font-sans text-slate-800 bg-white selection:bg-[#24d4da] selection:text-white">
        {/* Util: shimmer */}
        <style>{`
          @keyframes shimmer { 100% { transform: translateX(100%); } }
        `}</style>

        {/* ======================
            HERO (Cinematic)
        ====================== */}
        <section className="relative overflow-hidden">
          {/* Background layer */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#f7fbfb] via-white to-white" />
            <div className="absolute -top-44 -right-40 h-[34rem] w-[34rem] rounded-full bg-[#24d4da]/20 blur-3xl" />
            <div className="absolute -bottom-44 -left-40 h-[34rem] w-[34rem] rounded-full bg-[#007377]/14 blur-3xl" />
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:22px_22px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 lg:pt-24 lg:pb-16">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Copy */}
              <motion.div {...fadeUp(0)} className="lg:col-span-6">
                <Badge>Hecho en México</Badge>

                <h1 className="mt-5 text-3xl md:text-5xl lg:text-[3.35rem] leading-[1.06] font-extrabold tracking-tight text-slate-950">
                  Creamos oportunidades
                  <br />
                  con tecnología 24/7.
                </h1>

                <p className="mt-4 md:mt-5 text-sm md:text-base text-slate-600 max-w-xl">
                  En Darmax unimos diseño, ingeniería y soporte real para que tu
                  negocio con purificadoras y máquinas vending sea simple,
                  rentable y escalable.
                </p>

                <motion.div {...fadeUp(0.12)} className="mt-7 flex flex-wrap gap-3">
                  <PrimaryButton href="#historia">Conócenos</PrimaryButton>
                  <SecondaryButton href="/proyectos-empresariales">
                    Ver proyectos
                  </SecondaryButton>
                </motion.div>

                <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                  <MetricCard k="24/7" v="Soporte y acompañamiento" delay={0.06} />
                  <MetricCard k="+300" v="Equipos instalados" delay={0.1} />
                  <MetricCard k="MX" v="Cobertura nacional" delay={0.14} />
                </div>
              </motion.div>

              {/* Visual */}
              <motion.div {...scaleIn(0.08)} className="lg:col-span-6">
                <div className="relative rounded-[36px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.12)] overflow-hidden">
                  {/* Top bar */}
                  <div className="relative p-5 md:p-6 border-b border-slate-200 bg-white/80 backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500 font-extrabold">
                          Emprendimiento Darmax
                        </p>
                        <h3 className="mt-1 text-lg md:text-xl font-extrabold text-slate-950">
                          Purificadora + Vending
                        </h3>
                      </div>

                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold">
                        ROI promedio{" "}
                        <span className="text-[#24d4da]">12–18m</span>
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <IconChip>Agua purificada</IconChip>
                      <IconChip>Pago con monedas</IconChip>
                      <IconChip>Opciones cashless</IconChip>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    <img
                      src="/img/Historia2.jpg"
                      alt="Darmax purificadoras y vending"
                      className="w-full h-64 md:h-80 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                    {/* Chip */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 text-white text-[11px] font-extrabold px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Operación 24/7
                    </div>

                    {/* Bottom stats */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
                      {[
                        { k: "+5", v: "Años" },
                        { k: "+12", v: "Estados" },
                        { k: "100%", v: "Enfoque cliente" },
                      ].map((s) => (
                        <div
                          key={s.k}
                          className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-3 py-3"
                        >
                          <div className="text-white/80 text-[10px] font-bold tracking-wide">
                            {s.v}
                          </div>
                          <div className="text-white text-lg font-extrabold leading-none mt-1">
                            {s.k}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shimmer */}
                  <div className="relative h-1 bg-slate-100 overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[#24d4da]/40 to-transparent" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ======================
            STORY (split)
        ====================== */}
        <section id="historia" className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <motion.div {...fadeUp(0)} className="lg:col-span-6">
                <SectionHeader
                  label="Nuestra historia"
                  title="El origen de Darmax"
                  desc="Una idea simple: convertir el agua y la automatización en oportunidades reales para emprender."
                  align="left"
                />

                <div className="mt-7 space-y-4 text-slate-700">
                  <p className="text-sm md:text-base leading-relaxed">
                    Darmax nació con un sueño claro: transformar la manera en que
                    las personas acceden al agua y a productos esenciales,
                    convirtiéndolos en oportunidades reales de negocio.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    Detrás de este proyecto está <strong>Max</strong>, un joven
                    emprendedor que comenzó vendiendo purificadores caseros y
                    suministros para purificadoras, hasta descubrir el potencial
                    de las máquinas vending de agua purificada.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    Con sus primeros ahorros y apoyo familiar, adquirió su primera
                    purificadora: <strong>DARMAX</strong>. Hoy, cada instalación
                    representa disciplina, integridad y compromiso.
                  </p>
                </div>

                <motion.div
                  {...fadeUp(0.12)}
                  className="mt-8 grid sm:grid-cols-3 gap-3"
                >
                  <MetricCard k="+5" v="Años impulsando emprendedores" delay={0.02} />
                  <MetricCard k="+12" v="Estados con presencia" delay={0.06} />
                  <MetricCard k="01" v="Misión: ayudarte a crecer" delay={0.1} />
                </motion.div>
              </motion.div>

              <motion.div {...scaleIn(0.08)} className="lg:col-span-6">
                <div className="relative rounded-[36px] overflow-hidden border border-slate-200 bg-slate-50 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
                  <img
                    src="/img/Historia2.jpg"
                    alt="Nuestro camino en Darmax"
                    className="w-full h-[360px] md:h-[460px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/90 backdrop-blur border border-white/25 p-4">
                      <p className="text-[11px] tracking-[0.2em] uppercase text-slate-500 font-extrabold">
                        Propósito
                      </p>
                      <p className="mt-1 text-sm text-slate-900">
                        Que cada máquina Darmax sea el inicio de una nueva historia
                        de negocio.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-900/90 backdrop-blur text-white border border-white/10 p-4 flex items-center gap-3">
                      <span className="h-10 w-10 rounded-2xl bg-white text-slate-900 font-extrabold grid place-items-center">
                        MX
                      </span>
                      <div className="text-xs">
                        <div className="font-extrabold">Hecho en México</div>
                        <div className="text-[11px] text-white/80">
                          Talento local, impacto nacional.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.p
              {...fadeUp(0.2)}
              className="max-w-3xl mx-auto mt-12 text-center text-sm md:text-base leading-relaxed text-slate-600"
            >
              En Darmax creemos que, con las herramientas correctas, una sola idea
              puede cambiar una vida, y una vida puede transformar una comunidad.
            </motion.p>
          </div>
        </section>

        {/* ======================
            TIMELINE
        ====================== */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
            <SectionHeader
              label="Nuestro camino"
              title="Evolución del negocio"
              desc="Aprendizaje, mejora e innovación constante para crear mejores soluciones."
            />

            <div className="mt-12 space-y-6">
              {timeline.map((item, i) => (
                <TimelineItem key={item.year} {...item} index={i} />
              ))}
            </div>
          </div>
        </section>

        
        {/* ======================
            VALUES (clean wow)
        ====================== */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
            <SectionHeader
              label="Nuestra cultura"
              title="Valores que nos definen"
              desc="Cómo trabajamos, cómo servimos y cómo construimos confianza."
            />

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {valores.map((v, i) => (
                <ValueCard key={v.t} {...v} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================
            FINAL CTA (super)
        ====================== */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 pb-16 lg:pb-20">
            <motion.div
              {...scaleIn(0)}
              className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.12)]"
            >
              <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-[#24d4da]/18 blur-3xl" />
              <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#007377]/12 blur-3xl" />
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.08)_1px,transparent_0)] [background-size:22px_22px]" />

              <div className="relative p-7 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-950">
                    ¿Listo para construir algo grande con nosotros?
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-slate-600 max-w-xl">
                    Te acompañamos desde la idea hasta la puesta en marcha, paso a
                    paso, con un plan aterrizado a tus objetivos.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <IconChip>Asesoría</IconChip>
                    <IconChip>Instalación</IconChip>
                    <IconChip>Soporte</IconChip>
                    <IconChip>Capacitación</IconChip>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <PrimaryButton href="/contacto">Contáctanos</PrimaryButton>

                  <a
                    href="https://wa.me/525519655369?text=Hola%20Darmax,%20quiero%20información%20sobre%20sus%20soluciones%20de%20purificadoras%20y%20vending."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-2xl font-extrabold bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition active:scale-[0.98]"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative h-1 bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-[#24d4da]/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
