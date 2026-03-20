import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

/* =========================================
   Motion helpers (limpio + premium)
========================================= */
const ease = [0.22, 0.61, 0.36, 1];

const inView = {
  viewport: { once: true, amount: 0.25 },
};

const fade = (d = 0) => ({
  ...inView,
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { duration: 0.7, delay: d, ease },
});

const up = (d = 0) => ({
  ...inView,
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay: d, ease },
});

const scale = (d = 0) => ({
  ...inView,
  initial: { opacity: 0, scale: 0.98 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.7, delay: d, ease: [0.16, 1, 0.3, 1] },
});

/* =========================================
   Data
========================================= */
const STATS = [
  { k: "24/7", v: "Soporte y acompañamiento real" },
  { k: "+300", v: "Equipos instalados y operando" },
  { k: "MX", v: "Cobertura nacional" },
  { k: "+5", v: "Años impulsando emprendedores" },
];

const VALORES = [
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

const TIMELINE = [
  {
    year: "2019",
    title: "Nace Darmax",
    desc: "Iniciamos con una purificadora y la convicción de que el agua puede ser un negocio accesible y escalable.",
  },
  {
    year: "2021",
    title: "Primera máquina vending",
    desc: "Integramos automatización para operar 24/7 y facilitar el emprendimiento con mínima fricción.",
  },
  {
    year: "2023",
    title: "Crecimiento nacional",
    desc: "Fortalecimos logística y soporte técnico para llegar a más estados con servicio confiable.",
  },
  {
    year: "2025",
    title: "Innovación continua",
    desc: "Mejoramos modelos, diseño y operación para que el negocio sea más rentable y simple de administrar.",
  },
];

/* =========================================
   UI
========================================= */
const Container = ({ children, className = "" }) => (
  <div className={["max-w-7xl mx-auto px-5 sm:px-6", className].join(" ")}>
    {children}
  </div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] uppercase text-slate-700 backdrop-blur">
    <span
      aria-hidden="true"
      className="h-2 w-2 rounded-full bg-[#24d4da] shadow-[0_0_18px_rgba(36,212,218,0.7)]"
    />
    {children}
  </span>
);

const H2 = ({ title, desc, align = "center" }) => (
  <div className={align === "center" ? "text-center" : ""}>
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
      {title}
    </h2>
    {desc ? (
      <p
        className={[
          "mt-3 text-sm md:text-base leading-relaxed text-slate-600",
          align === "center" ? "max-w-2xl mx-auto" : "max-w-xl",
        ].join(" ")}
      >
        {desc}
      </p>
    ) : null}
  </div>
);

const PrimaryButton = ({ href, children }) => (
  <a
    href={href}
    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-3 text-sm font-extrabold text-white shadow-sm hover:shadow-md transition active:scale-[0.99]"
  >
    {children}
    <span className="text-lg group-hover:translate-x-0.5 transition-transform">
      →
    </span>
  </a>
);

const GhostButton = ({ href, children }) => (
  <a
    href={href}
    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-50 transition active:scale-[0.99]"
  >
    {children}
  </a>
);

const StatCard = ({ k, v, i }) => (
  <motion.div
    {...scale(0.05 * i)}
    className="rounded-3xl border border-slate-200 bg-white/80 backdrop-blur px-5 py-4 shadow-sm hover:shadow-md transition"
  >
    <div className="text-2xl font-extrabold text-slate-950 leading-none">
      {k}
    </div>
    <div className="mt-2 text-[12px] font-semibold text-slate-600">{v}</div>
  </motion.div>
);

const SoftCard = ({ children, className = "" }) => (
  <div
    className={[
      "rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.06)]",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const ValueCard = ({ img, t, d, i }) => (
  <motion.div
    {...up(0.06 * i)}
    className="group rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_60px_rgba(15,23,42,0.06)] hover:shadow-[0_26px_90px_rgba(15,23,42,0.10)] transition overflow-hidden"
  >
    <div className="relative p-7">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#24d4da]/12 blur-3xl opacity-0 group-hover:opacity-100 transition" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-950/6 blur-3xl opacity-0 group-hover:opacity-100 transition" />

      <div className="relative">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-slate-200 bg-slate-50">
          <img
            src={img}
            alt={t}
            className="h-12 w-12 object-contain group-hover:scale-110 transition-transform"
            loading="lazy"
            decoding="async"
          />
        </div>

        <h4 className="mt-5 text-center text-lg font-extrabold tracking-tight text-slate-950">
          {t}
        </h4>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          {d}
        </p>

        <div className="mt-6 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#24d4da] to-slate-950/80 opacity-60 group-hover:opacity-100 transition" />
        </div>
      </div>
    </div>
  </motion.div>
);

const TimelineRow = ({ year, title, desc, i }) => (
  <motion.div {...up(0.05 * i)} className="relative grid md:grid-cols-12 gap-5">
    <div className="md:col-span-3 flex md:justify-end">
      <div className="inline-flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 rounded-full bg-[#24d4da] shadow-[0_0_18px_rgba(36,212,218,0.7)]"
        />
        <span className="text-sm font-extrabold text-slate-800">{year}</span>
      </div>
    </div>

    <div className="hidden md:block md:col-span-1 relative" aria-hidden="true">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-3.5 w-3.5 rounded-full bg-[#24d4da] ring-4 ring-white" />
    </div>

    <div className="md:col-span-8">
      <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base md:text-lg font-extrabold text-slate-950">
            {title}
          </h3>
          <span className="hidden sm:inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold text-slate-600">
            Hito
          </span>
        </div>
        <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-slate-600">
          {desc}
        </p>
      </div>
    </div>
  </motion.div>
);

/* =========================================
   Página Nosotros (REDISEÑO TOTAL)
========================================= */
export default function Nosotros() {
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

      <main className="min-h-screen bg-white text-slate-800 selection:bg-[#24d4da] selection:text-white">
        {/* Fondo global (limpio + premium) */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(36,212,218,0.13),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(15,23,42,0.06),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.10)_1px,transparent_0)] [background-size:24px_24px]" />
        </div>

        {/* ======================
            HERO (nuevo, limpio)
        ====================== */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-20">
          <Container>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Copy */}
              <motion.div {...up(0)} className="lg:col-span-6">
                <Pill>Hecho en México</Pill>

                <h1 className="mt-5 text-4xl md:text-5xl lg:text-[3.4rem] leading-[1.03] font-extrabold tracking-tight text-slate-950">
                  Creamos oportunidades
                  <span className="block">
                    con tecnología <span className="text-[#007377]">24/7</span>.
                  </span>
                </h1>

                <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-600 max-w-xl">
                  Unimos diseño, ingeniería y soporte real para que tu negocio con
                  purificadoras y máquinas vending sea simple, rentable y escalable.
                </p>

                <motion.div {...up(0.12)} className="mt-7 flex flex-wrap gap-3">
                  <PrimaryButton href="#historia">Conócenos</PrimaryButton>
                  <GhostButton href="/proyectos-empresariales">Ver proyectos</GhostButton>
                </motion.div>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STATS.map((s, i) => (
                    <StatCard key={s.k} {...s} i={i} />
                  ))}
                </div>

                <motion.div
                  {...fade(0.16)}
                  className="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-slate-600"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold">
                    ✔ Asesoría
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold">
                    ✔ Instalación
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold">
                    ✔ Soporte
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold">
                    ✔ Capacitación
                  </span>
                </motion.div>
              </motion.div>

              {/* Visual */}
              <motion.div {...scale(0.08)} className="lg:col-span-6">
                <SoftCard className="overflow-hidden h-full">
                  <div className="relative h-[360px] md:h-[430px] lg:h-full">
                    <img
                      src="/img/Historia2.jpg"
                      alt="Darmax purificadoras y vending"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/45 via-transparent to-transparent" />

                    {/* Tarjetitas flotantes */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-4 py-3 text-white">
                          <div className="text-sm font-extrabold">Modelo 24/7</div>
                          <div className="mt-1 text-[12px] text-white/75">
                            Operación automatizada
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-4 py-3 text-white">
                          <div className="text-sm font-extrabold">Soporte real</div>
                          <div className="mt-1 text-[12px] text-white/75">
                            Acompañamiento cercano
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SoftCard>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ======================
            STORY / PROPÓSITO (nuevo)
        ====================== */}
        <section id="historia" className="py-16 sm:py-20">
          <Container>
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <motion.div {...up(0)} className="lg:col-span-5">
                <Pill>Nuestra historia</Pill>
                <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950">
                  El origen de Darmax
                </h2>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-slate-600">
                  Una idea simple: convertir el agua y la automatización en oportunidades
                  reales para emprender con un modelo claro y rentable.
                </p>

                <div className="mt-7 space-y-4 text-slate-700">
                  <p className="text-sm md:text-base leading-relaxed">
                    Darmax nació con un sueño claro: transformar la manera en que
                    las personas acceden al agua y a productos esenciales,
                    convirtiéndolos en oportunidades reales de negocio.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    Detrás de este proyecto está <strong>Max</strong>, un joven emprendedor
                    que comenzó vendiendo purificadores caseros y suministros para purificadoras,
                    hasta descubrir el potencial de las máquinas vending de agua purificada.
                  </p>
                </div>
              </motion.div>

              <motion.div {...scale(0.08)} className="lg:col-span-7">
                <div className="grid sm:grid-cols-2 gap-4">
                  <SoftCard className="p-7">
                    <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-slate-500">
                      Misión
                    </div>
                    <div className="mt-3 text-lg font-extrabold text-slate-950">
                      Ayudarte a crecer con un negocio simple.
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Te acompañamos desde la elección del equipo hasta la puesta en marcha,
                      con soporte y capacitación.
                    </p>
                  </SoftCard>

                  <SoftCard className="p-7">
                    <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-slate-500">
                      Visión
                    </div>
                    <div className="mt-3 text-lg font-extrabold text-slate-950">
                      Tecnología accesible para emprender 24/7.
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      Diseñamos soluciones robustas, estéticas y automatizadas para mejorar rentabilidad
                      y facilitar operación.
                    </p>
                  </SoftCard>

                  <SoftCard className="p-7 sm:col-span-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-slate-500">
                          Nuestra promesa
                        </div>
                        <div className="mt-2 text-lg font-extrabold text-slate-950">
                          Equipos + acompañamiento = resultados
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-2xl">
                          No vendemos “solo máquinas”. Creamos un sistema completo: instalación, soporte,
                          y una ruta clara para operar y escalar.
                        </p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600">
                          ✔ Estructura
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600">
                          ✔ Soporte
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600">
                          ✔ Escalabilidad
                        </span>
                      </div>
                    </div>
                  </SoftCard>
                </div>
              </motion.div>
            </div>

            <motion.p
              {...up(0.18)}
              className="max-w-3xl mx-auto mt-10 text-center text-sm md:text-base leading-relaxed text-slate-600"
            >
              Creemos que con las herramientas correctas, una sola idea puede cambiar una vida,
              y una vida puede transformar una comunidad.
            </motion.p>
          </Container>
        </section>

        {/* ======================
            TIMELINE (limpio)
        ====================== */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="text-center">
              <Pill>Nuestro camino</Pill>
              <H2
                title="Evolución del negocio"
                desc="Aprendizaje, mejora e innovación constante para crear mejores soluciones."
              />
            </div>

            <div className="mt-12 space-y-6">
              {TIMELINE.map((t, i) => (
                <TimelineRow key={t.year} {...t} i={i} />
              ))}
            </div>
          </Container>
        </section>

        {/* ======================
            VALUES (premium grid)
        ====================== */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="text-center">
              <Pill>Nuestra cultura</Pill>
              <H2
                title="Valores que nos definen"
                desc="Cómo trabajamos, cómo servimos y cómo construimos confianza."
              />
            </div>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALORES.map((v, i) => (
                <ValueCard key={v.t} {...v} i={i} />
              ))}
            </div>
          </Container>
        </section>

        {/* ======================
            CTA FINAL (premium, minimal)
        ====================== */}
        <section className="pb-16 sm:pb-20">
          <Container>
            <motion.div
              {...scale(0)}
              className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 text-white shadow-[0_20px_70px_rgba(15,23,42,0.20)]"
            >
              <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-[#24d4da]/20 blur-3xl" />
              <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:22px_22px]" />

              <div className="relative p-7 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-[0.22em] uppercase">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#24d4da] shadow-[0_0_18px_rgba(36,212,218,0.75)]"
                    />
                    Emprende con Darmax
                  </div>

                  <h3 className="mt-5 text-2xl md:text-3xl font-extrabold tracking-tight">
                    ¿Listo para construir algo grande?
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/75 max-w-xl leading-relaxed">
                    Te acompañamos desde la idea hasta la puesta en marcha, paso a paso,
                    con un plan aterrizado a tus objetivos.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-[12px]">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold text-white/85">
                      ✔ Asesoría
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold text-white/85">
                      ✔ Instalación
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold text-white/85">
                      ✔ Soporte
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-semibold text-white/85">
                      ✔ Capacitación
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/contacto"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-3 text-sm font-extrabold text-slate-950 hover:bg-slate-100 transition active:scale-[0.99]"
                  >
                    Contáctanos
                  </a>

                  <a
                    href="https://wa.me/525519655369?text=Hola%20Darmax,%20quiero%20informaci%C3%B3n%20sobre%20sus%20soluciones%20de%20purificadoras%20y%20vending."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-3 text-sm font-extrabold text-white hover:bg-white/15 transition active:scale-[0.99]"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </>
  );
}
