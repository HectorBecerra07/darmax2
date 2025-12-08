import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

/* ----------------- Utils de animación ----------------- */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] },
  viewport: { once: true, amount: 0.25 },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, amount: 0.3 },
});

const SectionTitle = ({ label, title, center = true }) => (
  <div className={center ? "text-center" : ""}>
    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase bg-black text-white/90 px-4 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
      {label}
    </span>
    <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
      {title}
    </h2>
  </div>
);

/* ----------------- Página Nosotros ----------------- */

export default function Nosotros() {
  return (
    <>
      <Helmet>
        <title>Nosotros | Darmax Purificadoras y Máquinas Vending</title>
        <meta
          name="description"
          content="Conoce la historia de Darmax: un proyecto mexicano que impulsa el emprendimiento mediante purificadoras, vending y tecnología accesible para todos."
        />
        <link rel="canonical" href="https://tudominio.com/nosotros" />
        <meta
          property="og:title"
          content="Nosotros | Darmax Purificadoras y Máquinas Vending"
        />
        <meta
          property="og:description"
          content="Darmax nació con la misión de ofrecer oportunidades de negocio, tecnología accesible y soluciones para emprendedores. Descubre nuestra historia, misión y visión."
        />
        <meta
          property="og:image"
          content="https://tudominio.com/img/og-image.png"
        />
        <meta property="og:url" content="https://tudominio.com/nosotros" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="font-sans text-gray-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* ---------- HERO PARALLAX ---------- */}
        <section className="relative overflow-hidden">
          {/* background decorativo */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_55%)] opacity-40" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(148,163,184,0.2)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
          </div>

          <div className="max-w-7xl mx-auto px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
            <div className="grid lg:grid-cols-[1.15fr,0.95fr] gap-12 items-center">
              {/* texto hero */}
              <motion.div {...fadeUp(0)}>
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] tracking-[0.2em] uppercase text-white/80 backdrop-blur">
                  Hecho en México
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                </span>
                <h1 className="mt-5 text-3xl md:text-5xl lg:text-[3.4rem] leading-tight font-extrabold text-white">
                  Soluciones reales
                  <br />
                  para personas reales.
                </h1>
                <p className="mt-4 md:mt-5 text-sm md:text-base text-slate-200/80 max-w-xl">
                  En Darmax unimos tecnología, diseño y acompañamiento experto
                  para que emprender con purificadoras y máquinas vending sea
                  más fácil, rentable y escalable.
                </p>

                {/* botones */}
                <motion.div
                  {...fadeUp(0.1)}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <a
                    href="#historia"
                    className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold text-slate-950 bg-lime-400 hover:bg-lime-300 transition shadow-[0_18px_60px_rgba(190,242,100,0.4)]"
                  >
                    <span>Conócenos</span>
                    <span className="text-lg group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border border-black/10" />
                  </a>
                  <a
                    href="/proyectos-empresariales"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-semibold bg-white/5 border border-white/20 text-white hover:bg-white/10 transition"
                  >
                    Ver proyectos
                  </a>
                </motion.div>

                {/* badges inferiores */}
                <motion.div
                  {...fadeUp(0.2)}
                  className="mt-8 flex flex-wrap gap-4 text-xs md:text-sm text-slate-300/80"
                >
                  <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Instalación y soporte en México</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Modelos de negocio probados</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* tarjeta hero / mockup negocio */}
              <motion.div
                {...scaleIn(0.1)}
                className="relative"
              >
                <div className="relative rounded-[32px] bg-white/5 border border-white/20 shadow-[0_30px_120px_rgba(15,23,42,0.9)] p-5 md:p-6 overflow-hidden backdrop-blur-xl">
                  {/* glow */}
                  <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-lime-300/30 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-12 -left-12 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.2em] uppercase text-slate-200/80">
                          Emprendimiento Darmax
                        </p>
                        <h3 className="text-lg md:text-xl font-bold text-white">
                          Purificadora + Vending 24/7
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] text-slate-100">
                        ROI promedio
                        <span className="font-semibold text-lime-300">12-18m</span>
                      </span>
                    </div>

                    {/* Imagen principal */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/70">
                      <img
                        src="/img/Historia2.jpg"
                        alt="Purificadora y máquina vending Darmax"
                        className="w-full h-52 md:h-60 object-cover transform hover:scale-[1.03] transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                      {/* mini chip arriba */}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-[10px] text-slate-100 border border-white/15">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Operación 24/7
                      </div>
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-3 text-xs text-slate-100/90">
                        <span>✔ Agua purificada</span>
                        <span>✔ Pago con monedas</span>
                        <span>✔ Opciones cashless</span>
                      </div>
                    </div>

                    {/* stats */}
                    <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
                      {[
                        { k: "+300", v: "Equipos instalados", c: "text-lime-300" },
                        { k: "24/7", v: "Soporte y asistencia", c: "text-sky-300" },
                        { k: "100%", v: "Enfoque en el cliente", c: "text-amber-300" },
                      ].map((s, i) => (
                        <div
                          key={s.k}
                          className="group rounded-2xl bg-white/5 border border-white/10 p-3 hover:bg-white/10 transition-transform transform hover:-translate-y-0.5"
                        >
                          <div className={`text-base md:text-lg font-extrabold ${s.c}`}>
                            {s.k}
                          </div>
                          <div className="mt-1 text-[10px] leading-snug text-slate-200/80">
                            {s.v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- HISTORIA ---------- */}
        <section
          id="historia"
          className="relative bg-slate-950/60 border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <motion.div {...fadeUp(0)}>
                <SectionTitle
                  label="Nuestra historia"
                  title="El origen de Darmax"
                  center={false}
                />
                <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-200/90">
                  Darmax nació con un sueño claro: transformar la manera en que
                  las personas acceden al agua y a productos esenciales,
                  convirtiéndolos en oportunidades reales de negocio.
                </p>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-300/90">
                  Detrás de este proyecto está <strong>Max</strong>, un joven
                  emprendedor que, a los 17 años, comenzó vendiendo
                  purificadores caseros y suministros para purificadoras. Su
                  curiosidad lo llevó a descubrir el potencial de las máquinas
                  vending de agua purificada.
                </p>
                <p className="mt-4 text-base md:text-lg leading-relaxed text-slate-300/90">
                  Con sus primeros ahorros y el apoyo de su familia,
                  adquirió la primera purificadora:{" "}
                  <strong>DARMAX</strong>. Desde entonces, cada equipo
                  instalado representa una historia de emprendimiento, disciplina,
                  integridad y compromiso.
                </p>

                {/* mini stats */}
                <motion.div
                  {...fadeUp(0.15)}
                  className="mt-7 grid sm:grid-cols-3 gap-4"
                >
                  {[
                    { k: "+5", v: "Años impulsando emprendedores" },
                    { k: "+12", v: "Estados con presencia Darmax" },
                    { k: "01", v: "Misión: ayudarte a crecer" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-slate-900/70 border border-white/10 p-4"
                    >
                      <div className="text-xl font-extrabold text-lime-300">
                        {stat.k}
                      </div>
                      <div className="text-[11px] mt-1 text-slate-200/80">
                        {stat.v}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                {...fadeUp(0.1)}
                className="relative"
              >
                <div className="relative rounded-[28px] overflow-hidden border border-lime-300/30 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
                  <img
                    src="/img/Historia2.jpg"
                    alt="Nuestro camino en Darmax"
                    className="w-full h-[360px] md:h-[430px] object-cover transform hover:scale-[1.05] transition-transform duration-[1200ms]"
                    loading="lazy"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  {/* tarjeta flotante */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[180px] rounded-2xl bg-black/60 backdrop-blur border border-white/10 px-4 py-3">
                      <p className="text-[11px] tracking-[0.2em] uppercase text-slate-200/80">
                        Propósito
                      </p>
                      <p className="mt-1 text-sm text-slate-50">
                        Que cada máquina Darmax sea el inicio de una nueva
                        historia de negocio.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 border border-white/20">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-950 text-lime-300 font-bold">
                        MX
                      </span>
                      <div className="text-xs text-slate-50">
                        <div className="font-semibold">Hecho en México</div>
                        <div className="text-[11px] text-slate-200/80">
                          Talento local, impacto nacional.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* glow */}
                <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-lime-300/40 blur-3xl opacity-80" />
              </motion.div>
            </div>

            <motion.p
              {...fadeUp(0.25)}
              className="max-w-3xl mx-auto mt-12 text-center text-base md:text-lg leading-relaxed text-slate-100/85"
            >
              En Darmax creemos que, con las herramientas correctas, una sola
              idea puede cambiar una vida, y una vida puede transformar una
              comunidad.
            </motion.p>
          </div>
        </section>

        {/* ---------- LÍNEA DEL TIEMPO ---------- */}
        <section className="relative bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
            <SectionTitle
              label="Nuestro camino"
              title="Evolución del negocio"
            />
            <div className="mt-12 relative">
              {/* línea central */}
              <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 h-full w-px bg-gradient-to-b from-slate-500/70 via-slate-600/40 to-slate-800" />
              <div className="space-y-12">
                {[
                  {
                    year: "2019",
                    title: "Nace Darmax",
                    desc: "Iniciamos con una pequeña purificadora, mucha pasión y la convicción de que el agua podía ser un modelo de negocio accesible.",
                  },
                  {
                    year: "2021",
                    title: "Primera máquina vending",
                    desc: "Integramos tecnología vending para ofrecer agua purificada 24/7 y abrir nuevas oportunidades de emprendimiento.",
                  },
                  {
                    year: "2023",
                    title: "Crecemos a nivel nacional",
                    desc: "Fortalecimos nuestra logística, soporte técnico y red de aliados para llegar a más estados de la República.",
                  },
                  {
                    year: "2025",
                    title: "Innovación que no se detiene",
                    desc: "Lanzamos nuevos modelos con tecnología de vanguardia para hacer más fácil y rentable iniciar tu propio negocio.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.year}
                    {...fadeUp(0.05 * i)}
                    className="relative sm:grid sm:grid-cols-2 sm:gap-10"
                  >
                    {/* año */}
                    <div className="pl-12 sm:pl-0 sm:text-right sm:pr-12 flex items-start justify-start sm:justify-end">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-50">
                        <span className="w-2.5 h-2.5 rounded-full bg-lime-300 shadow-[0_0_20px_rgba(190,242,100,0.7)]" />
                        {item.year}
                      </span>
                    </div>

                    {/* contenido */}
                    <div className="pl-12 sm:pl-0">
                      <div className="absolute left-3.5 sm:left-1/2 sm:-translate-x-1/2 top-1.5 h-3.5 w-3.5 rounded-full bg-lime-300 ring-4 ring-slate-950" />
                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-2xl p-5 hover:border-lime-300/80 hover:-translate-y-1 transition-all duration-300">
                        <h3 className="font-semibold text-slate-50 text-sm md:text-base">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm mt-2 text-slate-300/90 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- MISIÓN & VISIÓN & DIFERENCIADORES ---------- */}
        <section className="relative bg-slate-950/90">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
            <div className="grid lg:grid-cols-[3fr,2.3fr] gap-12 lg:gap-16 items-start">
              {/* misión & visión */}
              <div className="space-y-6">
                <SectionTitle
                  label="Lo que nos mueve"
                  title="Misión y visión Darmax"
                  center={false}
                />
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {[
                    {
                      label: "Misión",
                      title: "Impulsar el emprendimiento con tecnología accesible",
                      text: "Ser líderes en innovación, desarrollo, venta y mantenimiento de máquinas vending y purificadoras de alta calidad, empoderando a emprendedores con modelos rentables y sostenibles.",
                    },
                    {
                      label: "Visión",
                      title: "Tecnología que transforma comunidades",
                      text: "Ser un referente en soluciones automatizadas que faciliten el acceso a productos esenciales, con responsabilidad social, innovación constante y visión de largo plazo.",
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      {...scaleIn(0.05 * i)}
                      className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 backdrop-blur border border-slate-700/70 shadow-[0_25px_80px_rgba(15,23,42,0.9)] p-6 md:p-7 group overflow-hidden"
                    >
                      <div className="pointer-events-none absolute -top-10 right-0 w-32 h-32 rounded-full bg-lime-300/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[11px] uppercase tracking-[0.2em] text-lime-300">
                        {card.label}
                      </span>
                      <h3 className="mt-2 text-lg md:text-xl font-extrabold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-slate-200/85">
                        {card.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* por qué elegirnos */}
              <motion.div
                {...fadeUp(0.15)}
                className="relative rounded-[28px] bg-slate-900/90 border border-slate-700/80 p-6 md:p-7 shadow-[0_25px_80px_rgba(15,23,42,0.9)] overflow-hidden"
              >
                <div className="pointer-events-none absolute -top-16 -left-12 w-44 h-44 rounded-full bg-sky-400/20 blur-3xl" />
                <h3 className="relative text-lg md:text-xl font-extrabold text-white">
                  ¿Por qué elegir Darmax?
                </h3>
                <p className="relative mt-2 text-sm text-slate-300/90">
                  Más que proveedores de equipos, somos aliados estratégicos en
                  tu proyecto.
                </p>
                <ul className="relative mt-5 space-y-4 text-sm text-slate-200/90">
                  {[
                    "Acompañamiento antes, durante y después de la instalación.",
                    "Modelos de negocio claros y aterrizados a tu realidad.",
                    "Soporte técnico humano, cercano y disponible.",
                    "Equipos diseñados para operar 24/7 con alta confiabilidad.",
                    "Enfoque total en rentabilidad y experiencia del usuario final.",
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-lime-300/10 border border-lime-300/70 text-[11px] text-lime-200">
                        ✓
                      </span>
                      <span>{txt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- VALORES ---------- */}
        <section className="relative bg-slate-950">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
            <SectionTitle label="Nuestra cultura" title="Valores que nos definen" />

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  img: "/img/valor/DISCIPLINA.png",
                  t: "Disciplina",
                  d: "Enfoque riguroso y ordenado para garantizar resultados consistentes.",
                },
                {
                  img: "/img/valor/CONSTANCIA.png",
                  t: "Constancia",
                  d: "Evolucionar a diario para mantenernos a la vanguardia de la industria.",
                },
                {
                  img: "/img/valor/RESPONSABILIDAD.png",
                  t: "Responsabilidad",
                  d: "Compromiso con nuestros clientes, colaboradores y el medio ambiente.",
                },
                {
                  img: "/img/valor/INTEGRIDAD.png",
                  t: "Integridad",
                  d: "Actuar con honestidad para construir relaciones de confianza.",
                },
                {
                  img: "/img/valor/LIDERAZGO.png",
                  t: "Liderazgo",
                  d: "Inspirar a otros con visión, innovación y ejemplo.",
                },
                {
                  img: "/img/valor/COMPROMISO.png",
                  t: "Compromiso",
                  d: "Ofrecer productos y servicios que aporten valor real y duradero.",
                },
              ].map((v, i) => (
                <motion.div
                  key={v.t}
                  {...fadeUp(0.05 * i)}
                  className="group relative rounded-3xl p-6 pb-24 text-center bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] overflow-visible transform transition-transform duration-300 hover:-translate-y-1 hover:border-lime-300/80"
                >
                  <h4 className="font-extrabold text-lg md:text-xl tracking-wide text-white">
                    {v.t.toUpperCase()}
                  </h4>
                  <p className="mt-3 text-xs md:text-sm leading-relaxed text-slate-200/85">
                    {v.d}
                  </p>

                  {/* Ícono circular lleno */}
                  <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 w-20 h-20 rounded-full bg-slate-950 border border-slate-700/80 shadow-[0_16px_50px_rgba(15,23,42,0.9)] overflow-hidden flex items-center justify-center group-hover:border-lime-300/70">
                    <img
                      src={v.img}
                      alt={v.t}
                      className="w-12 h-12 object-contain opacity-90 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA FINAL ---------- */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-6 pb-20 lg:pb-24">
            <motion.div
              {...scaleIn(0)}
              className="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-lime-300 via-emerald-400 to-sky-400 p-[1px] shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
            >
              <div className="relative rounded-[30px] bg-slate-950/95 px-7 py-9 md:px-12 md:py-12 flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-lime-300/25 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />

                <div className="relative z-10 flex-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                    ¿Listo para construir algo grande con nosotros?
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-slate-200/85 max-w-xl">
                    Hablemos de tu proyecto. Te acompañamos desde la idea hasta
                    la puesta en marcha, paso a paso, con un plan aterrizado a tu
                    realidad y objetivos.
                  </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/contacto"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-slate-950 bg-lime-300 hover:bg-lime-200 transition shadow-[0_18px_60px_rgba(190,242,100,0.6)]"
                  >
                    Contáctanos
                  </a>
                  <a
                    href="https://wa.me/525519655369?text=Hola%20Darmax,%20quiero%20información%20sobre%20sus%20soluciones%20de%20purificadoras%20y%20vending."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold bg-white/10 border border-white/30 text-white hover:bg-white/15 transition"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
