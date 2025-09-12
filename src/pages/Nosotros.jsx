import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

/** Utilidades pequeñas */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true, amount: 0.25 },
});

const SectionTitle = ({ label, title, center = true }) => (
  <div className={center ? "text-center" : ""}>
    <span className="inline-block text-[11px] tracking-widest uppercase bg-black text-white/90 px-3 py-1 rounded-full">
      {label}
    </span>
    <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
      {title}
    </h2>
  </div>
);

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
        <meta property="og:title" content="Nosotros | Darmax Purificadoras y Máquinas Vending" />
        <meta
          property="og:description"
          content="Darmax nació con la misión de ofrecer oportunidades de negocio, tecnología accesible y soluciones para emprendedores. Descubre nuestra historia, misión y visión."
        />
        <meta property="og:image" content="https://tudominio.com/img/og-image.png" />
        <meta property="og:url" content="https://tudominio.com/nosotros" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="font-sans text-gray-800">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-900 via-slate-800 to-black" />
          <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-black">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] tracking-widest uppercase backdrop-blur">
                Hecho en México
              </span>
              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                SOLUCCIONES REAALES PARA PERSONAS REALES
              </h1>
              <p className="mt-3 md:mt-4 text-black/80 max-w-2xl">
                Equipos confiables, asesoria experta y soluciones escalables. <br></br>
                Inicia tu negocio hoy en Darmax
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              {...fadeUp(0.1)}
            >
              <a
                href="#historia"
                className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                style={{ backgroundColor: "#5188C9" }}
              >
                Conócenos
              </a>
              <a
                href="/proyectos-empresariales"
                className="px-6 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                Ver proyectos
              </a>
            </motion.div>
          </div>

          {/* círculo decorativo */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </section>

        {/* HISTORIA */}
        <section id="historia" className="py-20 bg-gray-50 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0)}>
              <SectionTitle label="Nuestra historia" title="NUESTRA HISTORIA" center={false} />
              <p className="mt-4 text-lg leading-relaxed">
                Darmax nació con un sueño: transformar la manera en que las
                personas acceden al agua y a productos esenciales, creando
                soluciones que generen bienestar y nuevas oportunidades.
              </p>
              <p className="mt-4 text-lg leading-relaxed">
                Detrás de este sueño está <strong>Max</strong>, un joven
                emprendedor que, con solo 17 años, se inició en la venta de
                purificadores caseros y suministros para purificadoras. Su
                curiosidad lo llevó a descubrir el potencial de las máquinas
                vending de agua purificada.
              </p>
              <p className="mt-4 text-lg leading-relaxed">
                Con los ahorros generados por su trabajo y el apoyo de su
                familia, adquirió su primera purificadora:{" "}
                <strong>DARMAX</strong>. Más que vender tecnología, creamos
                oportunidades. Lo hacemos con disciplina, integridad, compromiso
                y pasión.
              </p>

              {/* mini tarjetas */}
<div className="mt-6 grid sm:grid-cols-3 gap-4">
  {[
    { k: "+300", v: "equipos instalados" },
    { k: "24/7", v: "soporte y asistencia" },
    { k: "100%", v: "enfoque en el cliente" },
  ].map((stat, i) => {
    const colors = ["#5188C9", "#03A4A4", "#F97316"]; 
    return (
      <motion.div
        key={i}
        {...fadeUp(0.1 + i * 0.05)}
        className="rounded-2xl p-4 border border-gray-100 shadow-sm"
        style={{ backgroundColor: colors[i] }}
      >
        <div className="text-2xl font-extrabold text-white">
          {stat.k}
        </div>
        <div className="text-sm text-white">{stat.v}</div>
      </motion.div>
    );
  })}
</div>

            </motion.div>

            <motion.div {...fadeUp(0.1)}>
              <div className="relative">
                <img
                  src="/img/Historia2.jpg"
                  alt="Nuestro camino en Darmax"
                  className="w-full rounded-2xl shadow-xl ring-1 ring-black/5 object-cover"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-[#ccff00] blur-2xl opacity-60" />
              </div>
            </motion.div>
          </div>

          <motion.p
            {...fadeUp(0.2)}
            className="max-w-4xl mx-auto mt-12 text-center text-lg leading-relaxed"
          >
            En Darmax creemos que, con las herramientas correctas, una sola idea
            puede cambiar una vida, y una vida puede transformar una comunidad.
          </motion.p>
        </section>

        {/* LÍNEA DEL TIEMPO */}
        <section className="py-16 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <SectionTitle label="Nuestro camino" title="EVOLUCION DEL NEGOCIO" />
            <div className="mt-10 relative">
              <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px h-full w-0.5 bg-gray-200" />
              <div className="space-y-10">
                {[
                  {
                    year: "2019",
                    title: "NACE DARMAX",
                    desc: "Comenzamos con una pequeña purificadora y una gran determinación: hacer del agua un modelo de negocio accesible y rentable.",
                  },
                  {
                    year: "2021",
                    title: "PRIMERA MÁQUINA VENDING",
                    desc: "Incorporamos tecnología vending para facilitar el acceso al agua purificada y abrir nuevas oportunidades de emprendimiento.",
                  },
                  {
                    year: "2023",
                    title: "CRECEMOS A NIVEL NACIONAL",
                    desc: "Establecimos alianzas logísticas y soporte técnico para atender a más estados de la república, ampliando la red de emprendedores Darmax.",
                  },
                  {
                    year: "2025",
                    title: "INNOVACIÓN QUE NO SE DETIENE",
                    desc: "Lanzamos nuevos modelos con tecnología de vanguardia que hacen más fácil y rentable iniciar tu propio negocio.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(0.05 * i)}
                    className="relative sm:grid sm:grid-cols-2 sm:gap-10"
                  >
                    <div className="pl-12 sm:pl-0 sm:text-right sm:pr-10">
                      <span className="inline-block font-bold text-slate-900 text-lg">
                        {item.year}
                      </span>
                    </div>

                    <div className="pl-12 sm:pl-0">
                      <div className="absolute left-3.5 sm:left-1/2 sm:-translate-x-1/2 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white"
                        style={{ backgroundColor: "#5188C9" }}
                      />
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MISIÓN & VISIÓN */}
        <section className="py-20 bg-[#F9FAFB] px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {[
              {
                label: "Misión",
                title: "Impulsar el emprendimiento con tecnología accesible",
                text: "Ser líderes en innovación, desarrollo, venta, distribución y mantenimiento de máquinas vending de alta calidad. Empoderamos a emprendedores con modelos rentables y sostenibles, elevando la calidad de vida de las familias mexicanas.",
              },
              {
                label: "Visión",
                title: "Tecnología que transforma comunidades",
                text: "Ser referentes en soluciones automatizadas que faciliten el acceso a productos esenciales. Impulsamos el crecimiento con innovación, responsabilidad social y sostenibilidad.",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                {...fadeUp(0.05 * i)}
                className="relative rounded-3xl bg-[#5188C9] backdrop-blur border border-gray-100 shadow-sm p-6 md:p-8"
              >
                <div
                  className="absolute inset-x-0 -top-0.5 h-1 rounded-t-3xl"
                  style={{ backgroundColor: "#03A4A4" }}
                />
                <span className="text-xs uppercase tracking-widest text-white">
                  {card.label}
                </span>
                <h3 className="mt-1 text-xl md:text-2xl font-extrabold text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-white leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

{/* VALORES */}
<section className="py-20 bg-white px-6">
  <div className="max-w-7xl mx-auto">
    <SectionTitle label="Nuestra cultura" title="VALORES" />

    <div className="mt-10 grid sm:grid-cols- lg:grid-cols-3 gap-12">
      {[
        { img: "/img/valor/DISCIPLINA.png",       t: "DISCIPLINA",       d: "ENFOQUE RIGUROSO Y ORDENADO PARA GARANTIZAR RESULTADOS." },
        { img: "/img/valor/CONSTANCIA.png",       t: "CONSTANCIA",       d: "EVOLUCIONAR A DIARIO PARA MANTENERNOS A LA VANGUARDIA." },
        { img: "/img/valor/RESPONSABILIDAD.png",  t: "RESPONSABILIDAD",  d: "COMPROMISO CON CLIENTES, COLABORADORES Y MEDIO AMBIENTE." },
        { img: "/img/valor/INTEGRIDAD.png",       t: "INTEGRIDAD",       d: "ACTUAR CON HONESTIDAD, CONSTRUYENDO RELACIONES DE CONFIANZA." },
        { img: "/img/valor/LIDERAZGO.png",        t: "LIDERAZGO",        d: "INSPIRAR CON VISIÓN HACIA LA INNOVACIÓN Y EXCELENCIA." },
        { img: "/img/valor/COMPROMISO.png",       t: "COMPROMISO",       d: "PRODUCTOS Y SERVICIO QUE APORTAN VALOR REAL Y DURADERO." },
      ].map((v, i) => (
        <motion.div
          key={i}
          {...fadeUp(0.05 * i)}
          className="relative rounded-xl p-6 pb-24 text-center text-white shadow-md overflow-visible"
          style={{ backgroundColor: i % 2 === 0 ? "#5188C9" : "#03A4A4" }}
        >
          <h4 className="font-extrabold text-xl tracking-wide mb-3">{v.t}</h4>
          <p className="text-sm leading-relaxed opacity-95">{v.d}</p>

          {/* Ícono circular lleno */}
          <div className="absolute left-1/2 -bottom-10 -translate-x-1/2 w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden">
            <img src={v.img} alt={v.t} className="w-full h-full object-contain" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


        {/* CTA FINAL */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-black p-8 md:p-12">
            <div className="relative z-10 text-white">
              <h3 className="text-2xl md:text-3xl font-extrabold">
                ¿Listo para construir algo grande con nosotros?
              </h3>
              <p className="mt-2 text-white/80 max-w-2xl">
                Hablemos de tu proyecto. Te acompañamos desde la idea hasta la
                puesta en marcha.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/contacto"
                  className="px-6 py-3 rounded-xl font-semibold text-black hover:brightness-95 transition shadow-lg"
                  style={{ backgroundColor: "#ccff00" }}
                >
                  Contáctanos
                </a>
                <a
                  href="https://wa.me/525519655369?text=Hola%20Darmax,%20quiero%20información%20sobre%20sus%20soluciones%20de%20purificadoras%20y%20vending."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 hover:bg-white/15 transition"
                >
                  Cotizar por WhatsApp
                </a>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          </div>
        </section>
      </main>
    </>
  );
}
