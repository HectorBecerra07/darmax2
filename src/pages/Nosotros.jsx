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
import { Handshake } from "lucide-react";

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
    d: "Mantenemos un enfoque riguroso y ordenado en todas nuestras acciones para garantizar resultados consistentes y de calidad, impulsando la mejora continua.",
    color: "from-cyan-500 to-[#168387]"
  },
  {
    icon: ArrowTrendingUpIcon,
    t: "Constancia",
    d: "Nos esforzamos día a día para superar desafíos, alcanzar nuestras metas y mantenernos en la vanguardia tecnológica del sector.",
    color: "from-[#24d4da] to-cyan-600"
  },
  {
    icon: BriefcaseIcon,
    t: "Responsabilidad",
    d: "Asumimos con seriedad nuestro compromiso con clientes, colaboradores y el medio ambiente, desarrollando soluciones que promueven un uso consciente y sostenible del agua.",
    color: "from-slate-700 to-slate-900"
  },
  {
    icon: ScaleIcon,
    t: "Integridad",
    d: "Actuamos con honestidad y ética, construyendo relaciones basadas en la confianza, la transparencia y el respeto mutuo.",
    color: "from-cyan-400 to-[#24d4da]"
  },
  {
    icon: UserGroupIcon,
    t: "Liderazgo",
    d: "Inspiramos y guiamos con visión, motivando a nuestro equipo y comunidad hacia la innovación, el éxito sostenible y la excelencia en el servicio.",
    color: "from-[#168387] to-teal-700"
  },
  {
    icon: Handshake,
    t: "Compromiso",
    d: "Estamos dedicados a cumplir nuestras promesas, brindando productos y servicios de calidad que aportan valor real y duradero a quienes confían en nosotros.",
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
    className="relative p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-teal-100 shadow-xl shadow-teal-900/5 group overflow-hidden font-montserrat not-italic"
  >
    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-teal-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
    <div className="relative z-10 flex flex-col items-center text-center font-montserrat not-italic">
      <div className="w-14 h-14 rounded-2xl bg-[#168387] text-white flex items-center justify-center mb-5 shadow-lg shadow-teal-600/20 group-hover:rotate-12 transition-transform">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <div className="text-4xl md:text-5xl font-extrabold text-[#031638] tracking-tight mb-1.5 font-montserrat not-italic">
        <Counter value={value} suffix={suffix} />
      </div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] font-montserrat not-italic">{title}</p>
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

  return <span ref={ref} className="font-montserrat not-italic">{count.toLocaleString()}{suffix}</span>;
};

const GlassCard = ({ title, desc, icon: Icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease }}
    whileHover={{ y: -6, transition: { duration: 0.3 } }}
    className="p-7 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all group shadow-xl h-full font-montserrat not-italic"
  >
    <motion.div 
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className="w-13 h-13 rounded-2xl bg-white text-[#168387] flex items-center justify-center mb-5 shadow-lg"
    >
      <Icon className="w-7 h-7 stroke-[1.8]" />
    </motion.div>
    <h3 className="text-xl font-bold mb-2.5 text-white font-montserrat not-italic">{title}</h3>
    <p className="text-cyan-50/90 text-sm leading-relaxed font-normal font-montserrat not-italic">{desc}</p>
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

      <main className="min-h-screen bg-white text-slate-900 selection:bg-[#24d4da] selection:text-white overflow-x-hidden font-montserrat not-italic">
        
        {/* SECTION 1: HERO */}
        <section className="relative pt-24 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-white font-montserrat not-italic">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/defkuaytw/image/upload/v1776407496/fondo_gotas_jrtijk.png" 
              alt="Fondo Gotas" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-[#24d4da]/15 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white" />
          </div>

          <Container className="relative z-10 font-montserrat not-italic">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-left lg:pr-8 font-montserrat not-italic">
                <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block">
                  Nuestra Filosofía
                </span>
                <h1 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight text-[#031638]">
                  Darmax Agua comenzó con una idea clara:{" "}
                  <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                    Reinventar la manera de emprender en el negocio del agua.
                  </span>
                </h1>
                
                <p className="mt-6 text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl">
                  Porque emprender en el negocio del agua merece ser más simple, inteligente y alcanzable para todos.
                </p>
                
                <motion.div {...fadeUp(0.3)} className="mt-8 sm:mt-10 font-montserrat not-italic">
                  <motion.a 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    href="#historia" 
                    className="inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 bg-white border-2 border-[#24d4da] text-[#168387] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-cyan-500/10 group transition-all font-montserrat not-italic"
                  >
                    <span className="h-px w-6 sm:w-8 bg-[#24d4da] group-hover:w-10 sm:group-hover:w-12 transition-all" />
                    CONOCE NUESTRA HISTORIA
                  </motion.a>
                </motion.div>
              </motion.div>

              <div className="relative h-[450px] md:h-[550px] flex items-center justify-center lg:justify-center">
                {[
                  { img: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/2mostrador_iajzgl.png", x: -120, r: -15, delay: 0.6 },
                  { img: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/6megalodon_wd13q6.png", x: 120, r: 15, delay: 0.8 },
                  { img: "https://res.cloudinary.com/defkuaytw/image/upload/v1776318780/1touch_heazvd.png", x: 0, r: 0, delay: 0.3, z: 30, s: 1 }
                ].map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, x: 0 }}
                    whileInView={{ opacity: 1, scale: card.s || 0.9, x: card.x, y: card.x !== 0 ? 20 : 0, rotate: card.r }}
                    viewport={{ once: true }}
                    transition={{ delay: card.delay, duration: 1, ease }}
                    className={`absolute ${card.z ? "z-30 w-52 md:w-64" : "z-10 w-44 md:w-56"} aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-50`}
                  >
                    <img src={card.img} className="w-full h-full object-contain p-4" alt="Darmax Vending" />
                  </motion.div>
                ))}
                <div className="absolute inset-0 bg-cyan-100/40 blur-[120px] -z-10 rounded-full scale-150" />
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 2: MÉTRICAS */}
        <section className="py-16 sm:py-20 bg-teal-50/50 border-y border-teal-100/50 font-montserrat not-italic">
          <Container>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 font-montserrat not-italic">
              <MetricCard title="Equipos Instalados" value="350" suffix="+" icon={CheckBadgeIcon} delay={0.1} />
              <MetricCard title="Negocios Rentables" value="280" suffix="+" icon={ChartBarIcon} delay={0.2} />
              <MetricCard title="Litros Purificados" value="10" suffix="M+" icon={BeakerIcon} delay={0.3} />
            </div>
          </Container>
        </section>

        {/* SECTION 3: HISTORIA / ORIGEN */}
        <section id="historia" className="py-20 sm:py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white relative overflow-hidden shadow-[inset_0_-20px_50px_rgba(0,0,0,0.1)] font-montserrat not-italic">
          <Container className="relative z-10 font-montserrat not-italic">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <motion.div {...fadeUp(0)} className="lg:col-span-5 font-montserrat not-italic">
                <span className="font-montserrat not-italic text-cyan-300 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-2 sm:mb-2.5 block">
                  Nuestra Trayectoria
                </span>
                <h2 className="font-montserrat not-italic text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
                  El origen de Darmax
                </h2>
                <div className="space-y-5 text-sm sm:text-base text-cyan-50/90 font-normal leading-relaxed font-montserrat not-italic">
                  <p>
                    Darmax nació con un sueño: transformar la manera en que las personas acceden al agua y a productos esenciales, creando soluciones que generen bienestar y nuevas oportunidades. Detrás de este sueño está <strong className="text-white drop-shadow-sm font-bold">Max</strong>, un joven emprendedor que, con solo 17 años, se inició en la venta de purificadores caseros y suministros para purificadoras. Su curiosidad y determinación lo llevaron a conocer a fondo el negocio, hasta descubrir el potencial de las máquinas vending de agua purificada. Fue entonces cuando comprendió que este modelo no solo resolvía una necesidad básica, sino que abría la puerta al emprendimiento local.
                  </p>
                  <p>
                    Con los ahorros generados por su trabajo y el apoyo de su familia, adquirió su primera purificadora: <strong className="text-white">DARMAX</strong>. Desde entonces, diseñar soluciones a la medida se convirtió en su filosofía, y conectar con las personas, en su mayor fortaleza. Hoy, esa visión sigue viva en cada producto y servicio de Darmax.
                  </p>
                  <p>
                    Más que vender tecnología, creamos oportunidades. Impulsamos a personas a emprender, a cuidar el agua y a mejorar su entorno, con disciplina, integridad, compromiso y pasión. En Darmax creemos que, con las herramientas correctas, una sola idea puede cambiar una vida, y una vida puede transformar una comunidad.
                  </p>
                </div>
              </motion.div>

              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 font-montserrat not-italic">
                {[
                  { 
                    t: "Misión", 
                    d: "Ser líderes en innovación, desarrollo, venta, distribución y mantenimiento de máquinas vending automáticas de alta calidad. En Darmax, empoderamos a emprendedores a través de modelos de negocio rentables y sostenibles. Nos comprometemos a ser un socio confiable y accesible, garantizando la satisfacción de nuestros clientes mediante un servicio excepcional, contribuyendo a mejorar la calidad de vida de las familias mexicanas al facilitar el acceso práctico a productos esenciales.", 
                    icon: RocketLaunchIcon 
                  },
                  { 
                    t: "Visión", 
                    d: "Ser una empresa referente en tecnología de vanguardia, ofreciendo soluciones automatizadas que mejoren la vida diaria al facilitar el acceso a productos esenciales. En Darmax aspiramos a transformar comunidades mediante modelos de negocio accesibles, fomentando el emprendimiento y generando un impacto positivo basado en la innovación, responsabilidad social y la sostenibilidad, con el firme propósito de construir un México más justo, saludable y próspero.", 
                    icon: GlobeAltIcon 
                  }
                ].map((card, i) => (
                  <motion.div 
                    key={i}
                    {...fadeUp(0.2 * i)}
                    className="p-7 sm:p-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md group hover:bg-white/20 transition-all shadow-xl flex flex-col justify-start font-montserrat not-italic"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white text-[#168387] shadow-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shrink-0 font-montserrat not-italic">
                      <card.icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2.5 font-montserrat not-italic">{card.t}</h4>
                    <p className="text-cyan-50/90 font-normal text-sm leading-relaxed font-montserrat not-italic">{card.d}</p>
                  </motion.div>
                ))}
                <motion.div 
                  {...fadeUp(0.4)}
                  className="sm:col-span-2 p-7 sm:p-8 rounded-3xl bg-[#0d2e35] text-white relative overflow-hidden group shadow-2xl border border-white/10 font-montserrat not-italic"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#168387]/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 font-montserrat not-italic">
                    <h4 className="text-xl font-bold mb-2 flex items-center gap-2.5 text-[#24d4da] font-montserrat not-italic">
                      <SparklesIcon className="w-6 h-6 text-[#24d4da]" /> Nuestra promesa
                    </h4>
                    <p className="text-cyan-50/90 font-medium text-base sm:text-lg leading-snug font-montserrat not-italic">
                      Convertimos una inversión en un negocio listo para crecer.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 4: LO QUE HACEMOS DIFERENTE */}
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden font-montserrat not-italic">
          <Container>
            <motion.div
              {...fadeUp(0)}
              className="text-center mb-14 sm:mb-20 max-w-4xl mx-auto font-montserrat not-italic"
            >
              <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block text-center">
                Nuestro valor diferencial
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-center">
                <span className="text-[#031638]">Lo que hacemos </span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                  diferente
                </span>
              </h2>
              <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto text-center">
                Creamos oportunidades reales para que más personas construyan un negocio propio y rentable.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* COLUMNA IZQUIERDA: FOTO */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1"
              >
                <div className="absolute w-[300px] h-[300px] bg-cyan-100/40 blur-[100px] rounded-full animate-pulse" />
                <motion.img 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  src="/img/darmaxfoto.png" 
                  className="relative z-10 w-full max-w-[280px] sm:max-w-sm drop-shadow-2xl" 
                  alt="Darmax Diferencia" 
                />
              </motion.div>

              {/* COLUMNA DERECHA: LOS PUNTOS (TARJETAS) */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 order-1 lg:order-2 font-montserrat not-italic">
                {[
                  { t: "Personalización Real", d: "Tú eliges cómo construir tu negocio según tu zona y objetivos.", icon: SparklesIcon, step: "01" },
                  { t: "Enfoque en Rentabilidad", d: "Herramientas para entender cuánto ganas, no solo cuánto inviertes.", icon: ChartBarIcon, step: "02" },
                  { t: "Tecnología 24/7", d: "Modelos automatizados adaptados al mercado actual.", icon: CpuChipIcon, step: "03" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    {...fadeUp(0.1 * i)}
                    whileHover={{ x: 10 }}
                    className="group relative overflow-hidden flex items-start gap-4 sm:gap-5 p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F7FAFD] border border-slate-200/90 transition-all duration-500 hover:shadow-lg cursor-default font-montserrat not-italic"
                  >
                    {/* Capa de fondo para el hover (Gradiente Premium) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0d5a5e] via-[#168387] to-[#24d4da] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div 
                      className="relative z-10 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#168387] group-hover:bg-white/10 group-hover:text-white transition-all duration-500 shrink-0 group-hover:rotate-12"
                    >
                      <item.icon className="w-6 h-6 stroke-[1.8]" />
                    </motion.div>
                    
                    <div className="relative z-10 font-montserrat not-italic">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#168387] group-hover:text-cyan-300 uppercase tracking-widest font-montserrat not-italic">{item.step}</span>
                        <h4 className="font-bold text-[#031638] group-hover:text-white text-base sm:text-lg transition-colors duration-500 font-montserrat not-italic">{item.t}</h4>
                      </div>
                      <p className="text-slate-600 group-hover:text-cyan-50 text-xs sm:text-sm leading-relaxed font-normal transition-colors duration-500 font-montserrat not-italic">{item.d}</p>
                    </div>

                    <div className="absolute top-5 right-6 text-slate-200/80 group-hover:text-white/5 font-extrabold text-4xl transition-colors duration-500 select-none font-montserrat not-italic">
                      {item.step}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* SECTION 5: EVOLUCIÓN & VISIÓN */}
        <section className="py-20 sm:py-24 bg-slate-50/50 overflow-hidden relative font-montserrat not-italic">
          <Container>
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 relative flex justify-center lg:block">
                <motion.div style={{ scale: scaleImage }} className="relative group w-full max-w-sm lg:max-w-none">
                  <div className="relative aspect-[4/5] rounded-[3rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-950">
                    <img src="https://res.cloudinary.com/defkuaytw/image/upload/v1776662291/ChatGPT_Image_19_abr_2026_07_16_41_p.m._wx55yy.png" alt="Darmax Noche" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent pointer-events-none" />
                  </div>
                  <motion.div 
                    {...fadeUp(0.4)} 
                    className="absolute -bottom-10 left-0 right-0 mx-auto w-[92%] sm:w-[85%] lg:w-auto lg:max-w-xs lg:left-auto lg:-right-6 lg:translate-x-0 bg-slate-900/90 backdrop-blur-xl text-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl shadow-2xl z-20 border border-white/15 font-montserrat not-italic"
                  >
                    <p className="text-base sm:text-lg font-bold leading-snug text-center lg:text-left drop-shadow-md font-montserrat not-italic">
                      “Mientras otros venden equipos, nosotros construimos negocios.”
                    </p>
                    <div className="mt-3 w-10 h-1 bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] rounded-full mx-auto lg:mx-0" />
                  </motion.div>
                </motion.div>
              </div>

              <div className="lg:col-span-7 lg:pl-8 pt-12 lg:pt-0 font-montserrat not-italic">
                <motion.div {...fadeUp(0)} className="mb-12 font-montserrat not-italic">
                  <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 block">
                    Trayectoria
                  </span>
                  <h2 className="font-montserrat not-italic text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#031638] leading-tight">
                    Nuestra evolución
                  </h2>
                  <p className="mt-3 text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                    Un camino de innovación constante para tu éxito.
                  </p>
                </motion.div>
                <div className="relative font-montserrat not-italic">
                  <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-[#288EB9] via-[#1DB3BA] to-cyan-100 rounded-full" />
                  <div className="space-y-8 sm:space-y-10">
                    {TIMELINE.map((item, i) => (
                      <motion.div key={i} {...fadeUp(0.1 * i)} className="relative pl-14 sm:pl-16 group font-montserrat not-italic">
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-white border-4 border-[#288EB9] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform z-10 font-montserrat not-italic">
                          <span className="font-bold text-[#168387] text-xs sm:text-sm font-montserrat not-italic">{item.year}</span>
                        </div>
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm group-hover:border-[#1DB3BA] transition-all font-montserrat not-italic">
                          <h4 className="text-base sm:text-lg font-bold text-[#031638] mb-1.5 font-montserrat not-italic">{item.title}</h4>
                          <p className="text-slate-600 font-normal text-xs sm:text-sm leading-relaxed font-montserrat not-italic">{item.desc}</p>
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
        <section className="py-20 sm:py-24 bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] text-white relative overflow-hidden shadow-[inset_0_20px_50px_rgba(0,0,0,0.1)] font-montserrat not-italic">
          <Container className="relative z-10 font-montserrat not-italic">
            <motion.div {...fadeUp(0)} className="text-center mb-12 sm:mb-16 font-montserrat not-italic">
              <span className="font-montserrat not-italic text-cyan-300 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 block text-center">
                Propuesta de Valor
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-3 text-center">
                ¿Por qué Darmax es tu mejor opción?
              </h2>
              <p className="text-cyan-50/90 font-montserrat not-italic max-w-2xl mx-auto text-sm sm:text-base md:text-lg font-normal leading-relaxed text-center">
                Impulsamos emprendedores con tecnología inteligente y acompañamiento real.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 font-montserrat not-italic">
              <GlassCard title="Modelo Híbrido" desc="Mostrador + vending + limpieza: maximizamos tu alcance comercial y fuentes de ingreso." icon={GlobeAltIcon} delay={0.2} />
              <GlassCard title="Control de Inversión" desc="Negocios inteligentes y escalables donde tú tienes el control real sobre cada peso ganado." icon={CheckBadgeIcon} delay={0.4} />
              <GlassCard title="Visión Escalable" desc="Diseñamos sistemas que crecen conforme tus metas se expanden. El agua es tu oportunidad." icon={RocketLaunchIcon} delay={0.6} />
            </div>
          </Container>
        </section>

        {/* SECTION 7: VALORES */}
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden font-montserrat not-italic">
          <Container>
            <motion.div
              {...fadeUp(0)}
              className="text-center mb-14 sm:mb-20 max-w-4xl mx-auto font-montserrat not-italic"
            >
              <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-2 sm:mb-2.5 block text-center">
                Nuestra esencia
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-3 sm:mb-4 text-center">
                <span className="text-[#031638]">Lo que nos </span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                  mueve
                </span>
              </h2>
              <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto text-center">
                Nuestros valores se reflejan en cada proyecto, cada instalación y cada negocio que ayudamos a crecer.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 font-montserrat not-italic">
              {VALORES.map((v, i) => (
                <motion.div 
                  key={i}
                  {...fadeUp(0.1 * i)}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="group relative overflow-hidden p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 flex flex-col transition-all duration-500 hover:shadow-xl shadow-slate-900/5 cursor-default font-montserrat not-italic"
                >
                  {/* Capa de fondo para el hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d5a5e] via-[#168387] to-[#24d4da] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 font-montserrat not-italic">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-white/10 text-[#168387] group-hover:text-white flex items-center justify-center mb-5 shadow-sm group-hover:rotate-12 transition-all duration-500">
                      <v.icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    
                    <h4 className="text-lg sm:text-xl font-bold text-[#031638] group-hover:text-white mb-2 tracking-tight transition-colors duration-500 font-montserrat not-italic">
                      {v.t}
                    </h4>
                    
                    <p className="text-slate-600 group-hover:text-cyan-50 font-normal text-xs sm:text-sm leading-relaxed transition-colors duration-500 font-montserrat not-italic">
                      {v.d}
                    </p>
                    
                    <div className="mt-6 flex items-center gap-2">
                      <div className="h-px w-6 bg-slate-200 group-hover:bg-white/20 group-hover:w-10 transition-all duration-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-300 transition-colors duration-500 font-montserrat not-italic">Valor {i+1}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* SECTION 8: CTA FINAL (BRAND GRADIENT) */}
        <section className="py-16 sm:py-24 bg-white font-montserrat not-italic">
          <Container>
            <motion.div 
              {...fadeUp(0)} 
              className="bg-gradient-to-br from-[#24d4da] via-[#168387] to-[#0d5a5e] rounded-3xl sm:rounded-[3.5rem] p-8 sm:p-14 md:p-16 text-center text-white relative overflow-hidden shadow-2xl font-montserrat not-italic"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-black/10 pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl mx-auto font-montserrat not-italic">
                <span className="font-montserrat not-italic text-cyan-300 font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs uppercase mb-2 sm:mb-2.5 block text-center">
                  Alianzas que Crecen
                </span>
                <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-sm text-white">
                  Más que clientes, aliados
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-cyan-50 font-normal leading-relaxed mb-8 max-w-2xl mx-auto font-montserrat not-italic">
                  Acompañamos a cada emprendedor en la construcción de un negocio pensado para crecer.<br />
                  <span className="font-bold text-white mt-3 block uppercase tracking-wider text-xs sm:text-sm bg-white/10 py-2 px-4 rounded-full border border-white/15 backdrop-blur-sm">
                    Porque cuando tu negocio crece, nosotros también.
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-5 font-montserrat not-italic">
                  <motion.a 
                    whileHover={{ scale: 1.04, y: -2 }} 
                    whileTap={{ scale: 0.96 }}
                    href="/contacto" 
                    className="px-8 py-3.5 sm:px-9 sm:py-4 bg-slate-950 text-white font-bold rounded-2xl shadow-xl text-xs sm:text-sm uppercase tracking-wider transition-all border border-slate-800 font-montserrat not-italic"
                  >
                    INICIA TU PROYECTO
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.04, bg: "rgba(255,255,255,0.2)" }} 
                    whileTap={{ scale: 0.96 }}
                    href="https://wa.me/525519655369" 
                    className="px-8 py-3.5 sm:px-9 sm:py-4 bg-white/15 backdrop-blur-xl border border-white/25 text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all font-montserrat not-italic"
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
