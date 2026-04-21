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
  LightBulbIcon,
  ShieldCheckIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  ScaleIcon,
  HandThumbUpIcon,
  FingerPrintIcon
} from "@heroicons/react/24/outline";

/* =========================================
   Data Constants
========================================= */
const TIMELINE = [
  {
    year: "2019",
    title: "Nace Darmax",
    desc: "Iniciamos con una purificadora y la convicción de que el agua puede ser un negocio accesible.",
  },
  {
    year: "2021",
    title: "Primera vending",
    desc: "Integramos automatización para operar 24/7 y facilitar el emprendimiento.",
  },
  {
    year: "2023",
    title: "Crecimiento nacional",
    desc: "Fortalecimos logística y soporte técnico para llegar a más estados.",
  },
  {
    year: "2025",
    title: "Innovación continua",
    desc: "Mejoramos modelos y operación para que el negocio sea más rentable.",
  },
];

const VALORES = [
  {
    icon: ClipboardDocumentCheckIcon,
    t: "Disciplina",
    d: "Orden, método y ejecución impecable para resultados consistentes.",
    color: "from-cyan-500 to-[#168387]"
  },
  {
    icon: ArrowTrendingUpIcon,
    t: "Constancia",
    d: "Mejora diaria: evolución continua para estar siempre a la vanguardia.",
    color: "from-[#24d4da] to-cyan-600"
  },
  {
    icon: BriefcaseIcon,
    t: "Responsabilidad",
    d: "Compromiso real con clientes, equipo y el entorno de negocio.",
    color: "from-slate-700 to-slate-900"
  },
  {
    icon: ScaleIcon,
    t: "Integridad",
    d: "Honestidad para construir relaciones duraderas y transparentes.",
    color: "from-cyan-400 to-[#24d4da]"
  },
  {
    icon: UserGroupIcon,
    t: "Liderazgo",
    d: "Inspirar con visión, innovación y ejemplo en cada proyecto.",
    color: "from-[#168387] to-teal-700"
  },
  {
    icon: HandThumbUpIcon,
    t: "Compromiso",
    d: "Atención y soluciones que aportan valor real y medible.",
    color: "from-[#ccff00] to-lime-600"
  },
];

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

const MetricCard = ({ title, value, suffix, icon: Icon, delay = 0 }) => (
  <motion.div 
    {...fadeUp(delay)}
    className="relative p-8 rounded-[2.5rem] bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden"
  >
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

const GlassCard = ({ title, desc, icon: Icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease }}
    whileHover={{ y: -10, transition: { duration: 0.3 } }}
    className="p-8 rounded-[2.5rem] bg-white/20 border border-white/40 backdrop-blur-md hover:bg-white/30 transition-all group shadow-xl shadow-cyan-950/5 h-full"
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
        <meta name="description" content="Descubre la historia de Darmax y por qué somos tu mejor opción en tecnología vending de agua y emprendimiento automatizado." />
      </Helmet>

      <main className="min-h-screen bg-white text-slate-900 selection:bg-[#24d4da] selection:text-white overflow-x-hidden italic">
        
        {/* SECTION 1: HERO */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/defkuaytw/image/upload/v1776407496/fondo_gotas_jrtijk.png" 
              alt="Fondo Gotas" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-[#24d4da]/15 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white" />
          </div>

          <Container className="relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-left">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95] text-slate-950">
                  <AnimatedText text="En Darmax Agua no comenzamos como una empresa..." className="block mb-2" delay={0.2} />
                  <motion.span 
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#168387] via-[#24d4da] to-[#168387] bg-[length:200%_auto] inline-block"
                  >
                    <AnimatedText text="comenzamos como una inquietud." delay={1.8} />
                  </motion.span>
                </h1>
                
                <p className="mt-8 text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                  <AnimatedText text="¿Por qué emprender en el negocio del agua tenía que ser complicado, caro o limitado?" delay={3.2} />
                </p>
                
                <motion.div {...fadeUp(5.2)} className="mt-10 flex flex-wrap gap-4">
                  <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/contacto" className="px-8 py-4 bg-[#24d4da] text-slate-950 font-black rounded-2xl shadow-lg shadow-cyan-500/20">INICIA HOY</motion.a>
                  <div className="flex items-center gap-3 text-[#168387] font-bold tracking-widest text-[10px] uppercase">
                    <motion.span initial={{ width: 0 }} whileInView={{ width: 32 }} transition={{ delay: 5.5, duration: 0.8 }} className="h-px bg-[#24d4da]" />
                    Nuestra Filosofía
                  </div>
                </motion.div>
              </motion.div>

              <div className="relative h-[450px] md:h-[550px] flex items-center justify-center lg:justify-end">
                {[
                  { img: "/img/vending/atlantistouchvending.jpg", x: -120, r: -15, delay: 0.6 },
                  { img: "/img/vending/vending.png", x: 120, r: 15, delay: 0.8 },
                  { img: "/img/vending/TOUCHAGUA.png", x: 0, r: 0, delay: 0.3, z: 30, s: 1 }
                ].map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, x: 0 }}
                    whileInView={{ opacity: 1, scale: card.s || 0.9, x: card.x, y: card.x !== 0 ? 20 : 0, rotate: card.r }}
                    viewport={{ once: true }}
                    transition={{ delay: card.delay, duration: 1, ease }}
                    className={`absolute ${card.z ? "z-30 w-52 md:w-64" : "z-10 w-44 md:w-56"} aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white`}
                  >
                    <img src={card.img} className="w-full h-full object-cover" alt="Darmax Vending" />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-cyan-100/40 blur-[120px] -z-10 rounded-full scale-150" />
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 2: MÉTTRICAS */}
        <section className="py-20 bg-teal-50/50 border-y border-teal-100/50">
          <Container>
            <div className="grid md:grid-cols-3 gap-8">
              <MetricCard title="Equipos Instalados" value="350" suffix="+" icon={CheckBadgeIcon} delay={0.1} />
              <MetricCard title="Negocios Rentables" value="280" suffix="+" icon={ChartBarIcon} delay={0.2} />
              <MetricCard title="Litros Purificados" value="10" suffix="M+" icon={BeakerIcon} delay={0.3} />
            </div>
          </Container>
        </section>

        {/* SECTION 3: HISTORIA / ORIGEN */}
        <section id="historia" className="py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white relative overflow-hidden shadow-[inset_0_-20px_50px_rgba(0,0,0,0.1)]">
          <Container className="relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <motion.div {...fadeUp(0)} className="lg:col-span-5">
                <span className="inline-block px-4 py-1.5 bg-white/20 text-white font-black rounded-full text-[10px] uppercase tracking-[0.2em] mb-6 border border-white/20 backdrop-blur-sm">Nuestra historia</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none mb-8">El origen de Darmax</h2>
                <div className="space-y-6 text-lg text-cyan-50 font-medium leading-relaxed">
                  <p>
                    Darmax nació con un sueño claro: transformar la manera en que las personas acceden al agua y a productos esenciales, convirtiéndolos en <strong>oportunidades reales de negocio</strong>.
                  </p>
                  <p>
                    Detrás de este proyecto está <strong className="text-white drop-shadow-sm">Max</strong>, un joven emprendedor que comenzó vendiendo purificadores caseros, hasta descubrir el potencial infinito de la automatización vending.
                  </p>
                </div>
              </motion.div>

              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                {[
                  { t: "Misión", d: "Ayudarte a crecer con un negocio simple. Te acompañamos desde la elección hasta la puesta en marcha.", icon: RocketLaunchIcon },
                  { t: "Visión", d: "Tecnología accesible para emprender 24/7. Soluciones robustas, estéticas y automatizadas.", icon: GlobeAltIcon }
                ].map((card, i) => (
                  <motion.div 
                    key={i}
                    {...fadeUp(0.2 * i)}
                    className="p-8 rounded-[2.5rem] bg-white/10 border border-white/20 backdrop-blur-md group hover:bg-white/20 transition-all shadow-xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white text-[#168387] shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <card.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black text-white mb-3">{card.t}</h4>
                    <p className="text-cyan-50/80 font-medium text-sm leading-relaxed">{card.d}</p>
                  </motion.div>
                ))}
                <motion.div 
                  {...fadeUp(0.4)}
                  className="sm:col-span-2 p-8 rounded-[2.5rem] bg-[#0d2e35] text-white relative overflow-hidden group shadow-2xl border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#168387]/20 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <h4 className="text-xl font-black mb-2 flex items-center gap-3 text-[#24d4da]">
                      <SparklesIcon className="w-6 h-6 text-[#24d4da]" /> Nuestra promesa
                    </h4>
                    <p className="text-cyan-50/90 font-medium text-lg leading-snug">
                      No vendemos “solo máquinas”. Creamos un sistema completo: instalación, soporte y una ruta clara para operar y escalar.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 4: LO QUE HACEMOS DIFERENTE */}
        <section className="py-24 bg-white relative overflow-hidden">
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
                      className="flex items-start gap-6 p-6 rounded-[2.5rem] bg-cyan-50/30 border border-cyan-100/50 hover:border-[#24d4da] transition-all group shadow-sm"
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
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="hidden lg:flex relative items-center justify-center"
              >
                <div className="absolute w-[400px] h-[400px] bg-cyan-100/60 blur-[100px] rounded-full animate-pulse" />
                <motion.img 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src="/img/darmaxfoto.png" 
                  className="relative z-10 w-full max-w-sm drop-shadow-2xl" 
                  alt="Darmax Diferencia" 
                />
              </motion.div>
            </div>
          </Container>
        </section>

        {/* SECTION 5: EVOLUCIÓN & VISIÓN */}
        <section className="py-24 bg-slate-50 overflow-hidden relative">
          <Container>
            <div className="grid lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-5 relative">
                <motion.div style={{ scale: scaleImage }} className="relative group w-full">
                  <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-[12px] border-white bg-slate-950">
                    <img src="https://res.cloudinary.com/defkuaytw/image/upload/v1776662291/ChatGPT_Image_19_abr_2026_07_16_41_p.m._wx55yy.png" alt="Darmax Noche" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent pointer-events-none" />
                  </div>
                  <motion.div {...fadeUp(0.4)} className="absolute -bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:-right-8 bg-white/10 backdrop-blur-xl text-white p-8 rounded-[2.5rem] shadow-2xl w-[90%] md:w-auto md:max-w-xs z-20 border border-white/20">
                    <p className="text-xl md:text-2xl font-black leading-tight italic text-center md:text-left drop-shadow-md">“Mientras otros venden equipos, nosotros construimos negocios.”</p>
                    <div className="mt-4 w-12 h-1.5 bg-[#24d4da] rounded-full mx-auto md:mx-0 shadow-[0_0_10px_#24d4da]" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="lg:col-span-7 lg:pl-10 pt-16 lg:pt-0">
                <motion.div {...fadeUp(0)} className="mb-16">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950">Nuestra evolución</h2>
                  <p className="mt-4 text-slate-500 text-lg font-medium">Un camino de innovación constante para tu éxito.</p>
                </motion.div>
                <div className="relative">
                  <div className="absolute left-6 top-0 w-1 h-full bg-gradient-to-b from-[#24d4da] via-[#168387] to-cyan-100 rounded-full" />
                  <div className="space-y-12">
                    {TIMELINE.map((item, i) => (
                      <motion.div key={i} {...fadeUp(0.1 * i)} className="relative pl-16 group">
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-4 border-[#24d4da] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                          <span className="font-black text-[#168387] text-sm">{item.year}</span>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 group-hover:border-[#24d4da] transition-all">
                          <h4 className="text-xl font-black text-slate-950 mb-2">{item.title}</h4>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 6: POR QUÉ DARMAX */}
        <section className="py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white relative overflow-hidden shadow-[inset_0_20px_50px_rgba(0,0,0,0.1)]">
          <Container className="relative z-10">
            <motion.div {...fadeUp(0)} className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">¿Por qué Darmax es tu mejor opción?</h2>
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

        {/* SECTION 7: VALORES (CARDS MEJORADAS) */}
        <section className="py-32 bg-white relative">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 items-end mb-24">
              <motion.div {...fadeUp(0)}>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-950 leading-none">Lo que nos mueve</h2>
                <p className="mt-6 text-xl text-slate-600 font-medium italic">Nuestros valores no están en la pared, están en cada equipo que instalamos.</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {VALORES.map((v, i) => (
                <motion.div 
                  key={i}
                  {...fadeUp(0.1 * i)}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="p-7 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(36,212,218,0.12)] hover:border-[#24d4da]/30 transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Decoración de fondo de tarjeta */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-40" />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:rotate-12 transition-transform duration-500`}>
                      <v.icon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h4 className="text-xl font-black text-slate-950 mb-2 tracking-tight">{v.t}</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{v.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* SECTION 8: CTA FINAL (BRAND GRADIENT) */}
        <section className="py-24 bg-white">
          <Container>
            <motion.div 
              {...fadeUp(0)} 
              className="bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-15px_rgba(22,131,135,0.4)]"
            >
              {/* Overlay de luz para profundidad */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/10 pointer-events-none" />
              
              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 drop-shadow-sm">Más que clientes, aliados</h2>
                <p className="text-xl md:text-2xl text-cyan-50 font-medium leading-relaxed mb-12">
                  No buscamos venderte una máquina. Buscamos ayudarte a construir un negocio que crezca contigo. <br />
                  <span className="font-black text-white mt-4 block uppercase tracking-widest text-lg bg-white/10 py-2 rounded-full border border-white/10 backdrop-blur-sm">Porque cuando tu negocio crece, nosotros también.</span>
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <motion.a 
                    whileHover={{ scale: 1.05, y: -5 }} 
                    whileTap={{ scale: 0.95 }}
                    href="/contacto" 
                    className="px-10 py-5 bg-slate-950 text-white font-black rounded-2xl shadow-2xl text-lg transition-all border border-slate-800"
                  >
                    INICIA TU PROYECTO
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.2)" }} 
                    whileTap={{ scale: 0.95 }}
                    href="https://wa.me/525519655369" 
                    className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-black rounded-2xl text-lg transition-all"
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
