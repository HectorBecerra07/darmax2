import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { 
  RocketLaunchIcon, 
  UserGroupIcon, 
  CpuChipIcon, 
  ChartBarIcon, 
  CheckBadgeIcon,
  SparklesIcon,
  GlobeAltIcon,
  BeakerIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

/* =========================================
   Motion helpers & Master Typewriter
========================================= */
const ease = [0.22, 0.61, 0.36, 1];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay: d, ease }
});

const typewriterContainer = (delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: delay },
  },
});

const typewriterLetter = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hidden: {
    opacity: 0,
    y: 10,
  },
};

/* =========================================
   Componentes UI
========================================= */
const Container = ({ children, className = "" }) => (
  <div className={["max-w-7xl mx-auto px-5 sm:px-10", className].join(" ")}>
    {children}
  </div>
);

// Nuevo componente de Contador para el diseño de Authority
const Counter = ({ value, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const MetricCard = ({ title, value, suffix, icon: Icon, delay = 0 }) => (
  <motion.div 
    {...fadeUp(delay)}
    className="relative p-8 rounded-[2.5rem] bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden"
  >
    {/* Efecto de Pulso sutil al fondo */}
    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
    
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-teal-600/20 group-hover:rotate-12 transition-transform">
        <Icon className="w-8 h-8" />
      </div>
      <div className="text-4xl md:text-5xl font-black text-teal-900 tracking-tighter mb-2">
        <Counter value={value} suffix={suffix} />
      </div>
      <p className="text-teal-700/60 font-bold uppercase tracking-widest text-[10px]">{title}</p>
    </div>
  </motion.div>
);

const GlassCard = ({ title, desc, icon: Icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    className="p-8 rounded-[2.5rem] bg-white/20 border border-white/40 backdrop-blur-md hover:bg-white/30 transition-all group shadow-xl shadow-cyan-950/5"
  >
    <motion.div 
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className="w-14 h-14 rounded-2xl bg-white text-[#168387] flex items-center justify-center mb-6 shadow-lg"
    >
      <Icon className="w-8 h-8" />
    </motion.div>
    <h3 className="text-xl font-black mb-3 text-white">{title}</h3>
    <p className="text-white text-sm leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const AnimatedText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <motion.span
      variants={typewriterContainer(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span
              key={letterIndex}
              variants={typewriterLetter}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};

export default function Nosotros() {
  const { scrollYProgress } = useScroll();
  
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);

  return (
    <>
      <Helmet>
        <title>Nosotros | Darmax Agua - Más que máquinas, construimos negocios</title>
        <meta name="description" content="En Darmax Agua no vendemos solo purificadoras. Creamos modelos de negocio rentables y escalables con tecnología vending 24/7." />
      </Helmet>

      <main className="min-h-screen bg-white text-slate-900 selection:bg-[#24d4da] selection:text-white overflow-x-hidden">
        
        {/* HERO */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-cyan-50/50 to-white">
          <div className="absolute inset-0 -z-10">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-40 -right-40 w-[60rem] h-[60rem] bg-cyan-200/20 blur-[150px] rounded-full" 
            />
          </div>

          <Container>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-left z-10">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-slate-950">
                  <AnimatedText 
                    text="En Darmax Agua no comenzamos como una empresa..." 
                    className="block mb-2" 
                    delay={0.2}
                  />
                  <motion.span 
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#168387] via-[#24d4da] to-[#168387] bg-[length:200%_auto] inline-block"
                  >
                    <AnimatedText 
                      text="comenzamos como una inquietud." 
                      delay={1.8}
                    />
                  </motion.span>
                </h1>
                
                <p className="mt-8 text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                  <AnimatedText 
                    text="¿Por qué emprender en el negocio del agua tenía que ser complicado, caro o limitado?" 
                    delay={3.2}
                  />
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 5.2, duration: 0.8 }}
                  className="mt-10 flex flex-wrap gap-4"
                >
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/contacto" 
                    className="px-8 py-4 bg-[#24d4da] text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    INICIA HOY
                  </motion.a>
                  <div className="flex items-center gap-3 text-[#168387] font-bold tracking-widest text-[10px] uppercase">
                    <motion.span 
                      initial={{ width: 0 }}
                      whileInView={{ width: 32 }}
                      viewport={{ once: true }}
                      transition={{ delay: 5.5, duration: 0.8 }}
                      className="h-px bg-[#24d4da]" 
                    />
                    Nuestra Filosofía
                  </div>
                </motion.div>
              </motion.div>

              {/* Fan-out Cards */}
              <div className="relative h-[450px] md:h-[550px] flex items-center justify-center lg:justify-end pr-0 lg:pr-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 0, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 0.9, x: -120, y: 20, rotate: -15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 1, ease }}
                  className="absolute z-10 w-44 md:w-56 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transition-transform hover:z-40 hover:scale-105 duration-300"
                >
                  <img src="/img/vending/atlantistouchvending.jpg" className="w-full h-full object-cover" alt="Atlantis" />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, x: 0, rotate: 0 }}
                  whileInView={{ opacity: 1, scale: 0.9, x: 120, y: 20, rotate: 15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1, ease }}
                  className="absolute z-10 w-44 md:w-56 aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transition-transform hover:z-40 hover:scale-105 duration-300"
                >
                  <img src="/img/vending/vending.png" className="w-full h-full object-cover" alt="Vending" />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8, ease }}
                  className="absolute z-30 w-52 md:w-64 aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-white transition-transform hover:scale-105 duration-300"
                >
                  <img src="/img/vending/TOUCHAGUA.png" className="w-full h-full object-cover" alt="Touch Agua" />
                </motion.div>

                <div className="absolute inset-0 bg-cyan-100/40 blur-[120px] -z-10 rounded-full scale-150" />
              </div>
            </div>
          </Container>
        </section>

        {/* MÉTTRICAS DE IMPACTO (NUEVA SECCIÓN DE AUTORIDAD) */}
        <section className="py-24 bg-teal-50/30 overflow-hidden">
          <Container>
            <div className="grid md:grid-cols-3 gap-8">
              <MetricCard title="Equipos Instalados" value="350" suffix="+" icon={CheckBadgeIcon} delay={0.1} />
              <MetricCard title="Negocios Rentables" value="280" suffix="+" icon={ChartBarIcon} delay={0.2} />
              <MetricCard title="Litros Purificados" value="10" suffix="M+" icon={BeakerIcon} delay={0.3} />
            </div>
          </Container>
        </section>

        {/* SECCIÓN IMAGEN CENTRAL */}
        <section className="pb-20 bg-white overflow-hidden pt-20">
          <Container>
            <motion.div style={{ scale: scaleImage }} className="relative group">
              <div className="rounded-[3.5rem] overflow-hidden shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border-[8px] border-white">
                <img 
                  src="/img/Historia2.jpg" 
                  alt="Aliado Darmax" 
                  className="w-full h-[450px] md:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </div>
              <motion.div 
                {...fadeUp(0.3)}
                className="absolute -bottom-6 -right-4 md:right-16 bg-gradient-to-br from-[#168387] to-[#24d4da] text-white p-8 rounded-[2.5rem] shadow-2xl max-w-xs border border-white/20 z-20"
              >
                <p className="text-xl font-black leading-tight">
                  “Mientras otros venden equipos, nosotros construimos negocios.”
                </p>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* LO QUE HACEMOS DIFERENTE */}
        <section className="py-24 bg-white relative">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <motion.div {...fadeUp(0)}>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 leading-none">Lo que hacemos diferente</h2>
                  <p className="mt-6 text-lg text-slate-600 leading-relaxed font-medium">
                    No vendemos solo máquinas. <strong>Diseñamos sistemas de rentabilidad</strong> que permiten a cualquier persona ser dueña de su tiempo y su inversión.
                  </p>
                </motion.div>

                <div className="grid gap-6">
                  {[
                    { t: "Personalización Real", d: "Tú eliges cómo construir tu negocio según tu zona.", icon: SparklesIcon },
                    { t: "Enfoque en Rentabilidad", d: "Herramientas para entender cuánto ganas, no solo cuánto inviertes.", icon: ChartBarIcon },
                    { t: "Tecnología 24/7", d: "Modelos automatizados adaptados al mercado actual.", icon: CpuChipIcon }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      {...fadeUp(0.1 * i)}
                      className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-cyan-50/50 border border-cyan-100/50 hover:border-[#24d4da] transition-all group"
                    >
                      <motion.div 
                        whileHover={{ rotate: 15 }}
                        className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-[#168387] shrink-0"
                      >
                        <item.icon className="w-7 h-7" />
                      </motion.div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">{item.t}</h4>
                        <p className="text-slate-500 leading-relaxed mt-1 font-medium">{item.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Logo Halo */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease }}
                className="hidden lg:flex relative items-center justify-center"
              >
                <div className="absolute w-[400px] h-[400px] bg-cyan-100/60 blur-[100px] rounded-full animate-pulse" />
                <div className="relative z-10 p-10">
                  <motion.img 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    src="/img/darmaxfoto.png" 
                    className="w-full max-w-sm drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]" 
                    alt="Darmax Logo" 
                  />
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* POR QUÉ DARMAX */}
        <section className="py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white relative overflow-hidden">
          <Container className="relative z-10">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">¿Por qué Darmax y no otros?</h2>
              <p className="mt-6 text-cyan-50 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                Decidimos no competir igual… decidimos hacerlo mejor, con un enfoque 100% humano y tecnológico.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard title="Modelo Híbrido" desc="Mostrador + vending + limpieza: maximizamos tu alcance comercial y fuentes de ingreso." icon={GlobeAltIcon} delay={0.2} />
              <GlassCard title="Control de Inversión" desc="Negocios inteligentes y escalables donde tú tienes el control real sobre cada peso ganado." icon={CheckBadgeIcon} delay={0.4} />
              <GlassCard title="Visión Escalable" desc="Diseñamos sistemas que crecen conforme tus metas se expanden. El agua es tu oportunidad." icon={RocketLaunchIcon} delay={0.6} />
            </div>
          </Container>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-950 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,163,168,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#168387]/40 via-transparent to-cyan-400/20" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <motion.h2 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-black tracking-tighter mb-8">🤝 Más que clientes, aliados</motion.h2>
                <p className="text-xl md:text-2xl text-cyan-50 font-medium leading-relaxed mb-12">
                  No buscamos venderte una máquina. Buscamos ayudarte a construir un negocio que crezca contigo. <br />
                  <span className="font-black text-[#24d4da] mt-4 block uppercase tracking-widest text-lg">Porque cuando tu negocio crece, nosotros también.</span>
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/contacto" 
                    className="px-10 py-5 bg-[#24d4da] text-slate-950 font-black rounded-2xl hover:scale-105 transition-all text-lg shadow-xl shadow-cyan-500/20"
                  >
                    INICIA TU PROYECTO
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://wa.me/525519655369" 
                    className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all text-lg"
                  >
                    HABLAR CON UN ASESOR
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </>
  );
}
