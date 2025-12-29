import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CubeIcon,
  UserGroupIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/megalodon.png"; 

const highlights = [
  {
    icon: UserGroupIcon,
    title: "Ultra Alta Capacidad",
    desc: "Para zonas de tráfico masivo",
  },
  {
    icon: ComputerDesktopIcon,
    title: "Tecnología de Vanguardia",
    desc: "Pantallas interactivas y analítica",
  },
  {
    icon: CubeIcon,
    title: "Diseño de Impacto",
    desc: "Una presencia que atrae multitudes",
  },
  { 
    icon: CpuChipIcon, 
    title: "Operación Premium", 
    desc: "Totalmente automatizado y remoto" 
  },
];

const features = [
    {
        icon: UserGroupIcon,
        title: "Dispensadores Múltiples de Alta Velocidad",
        description: "Equipado con una gran cantidad de dispensadores para despachar múltiples productos simultáneamente, reduciendo tiempos de espera en horas pico y maximizando el volumen de ventas.",
        image: "/img/purificadoras/purificadora-comercial.jpg", // Placeholder
    },
    {
        icon: ComputerDesktopIcon,
        title: "Pantallas Interactivas y Publicidad Dinámica",
        description: "Grandes pantallas táctiles de alta definición que no solo guían al usuario en una experiencia de compra fluida, sino que también funcionan como una plataforma publicitaria para generar ingresos adicionales.",
        image: "/img/vending/TOUCHAGUA.png", // Placeholder
    },
    {
        icon: ShieldCheckIcon,
        title: "Capacidad Industrial y Monitoreo Inteligente",
        description: "Tanques de almacenamiento de gran volumen y un sistema de telemetría avanzada que monitorea el inventario en tiempo real y predice las necesidades de reabastecimiento para una operación sin interrupciones.",
        image: "/img/purificadora/tanque.png", // Placeholder
    },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Consultoría y Diseño",
    desc: "Analizamos tu ubicación de alto tráfico y diseñamos una configuración de Megalodon a la medida de tus necesidades específicas.",
  },
  {
    icon: TruckIcon,
    title: "2. Fabricación e Instalación VIP",
    desc: "Construimos tu estación con los más altos estándares y nuestro equipo especializado se encarga de una instalación impecable.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Software y Personalización",
    desc: "Configuramos el software de gestión, personalizamos la interfaz de usuario y te capacitamos para usar todas las herramientas de analítica.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Lanzamiento y Soporte Prioritario",
    desc: "Te acompañamos en el lanzamiento y te ofrecemos un plan de soporte prioritario para garantizar el máximo rendimiento y disponibilidad.",
  },
];


const faqs = [
  {
    q: "¿Para qué tipo de ubicación es el Megalodon?",
    a: "Está diseñado para lugares con un flujo de personas masivo: aeropuertos, estaciones de transporte público, grandes centros comerciales, estadios y arenas. Su capacidad y velocidad de despacho están optimizadas para la más alta demanda.",
  },
  {
    q: "¿Es muy complejo de operar?",
    a: "A pesar de su tamaño y tecnología, la operación es sorprendentemente simple gracias a nuestro software de gestión centralizado. Las alertas de inventario en tiempo real y el autodiagnóstico facilitan el mantenimiento.",
  },
  {
    q: "¿Qué nivel de personalización ofrece?",
    a: "El Megalodon es nuestro modelo más personalizable. Podemos adaptar la configuración de dispensadores, el software de la interfaz y el diseño exterior para que se alinee perfectamente con tu marca o la del lugar de instalación.",
  },
];

const galleryImages = [
  "/img/trabajos/trabajos1.jpg",
  "/img/trabajos/trabajos2.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos5.jpg",
  "/img/purificadoras/purificadora-negocio.jpeg",
  "/img/purificadoras/purificadora-comercial.jpg",
];

/* --- Sub-components --- */
const FaqItem = ({ q, a }) => (
  <details className="group border-b border-slate-200/80 last:border-none">
    <summary className="cursor-pointer list-none p-5 md:p-6 font-semibold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition">
      {q}
      <div className="ml-4 text-slate-400 transition-transform duration-300 group-open:rotate-180">
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </summary>
    <div className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">{a}</div>
  </details>
);

const SectionTitle = ({ children, className = '' }) => (
    <div className={`text-center mb-12 ${className}`}>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {children}
        </h2>
    </div>
);


/* --- Main Component --- */
export default function MegalodonInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const contRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => contRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div ref={contRef} className="min-h-screen bg-slate-50 text-slate-800">
      <Helmet>
        <title>Estación Megalodon - Darmax</title>
        <meta
          name="description"
          content="La bestia del vending. Una estación de ultra capacidad y tecnología de vanguardia diseñada para dominar los puntos de mayor tráfico."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Estación Megalodon de Darmax" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-blue-300 rounded-full text-sm font-semibold">Solución de Ultra Capacidad</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Estación de Vending <span className="text-blue-400">Megalodon</span>.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                   Diseñada para dominar. La estación de ultra capacidad y tecnología de vanguardia para los puntos de mayor tráfico y demanda en el mundo.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Megalodon"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 shadow-lg hover:bg-blue-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Estación
                    </Link>
                    <Link
                        to="#features"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 rounded-full font-semibold border-2 border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-800 transition"
                    >
                        Ver Tecnología
                    </Link>
                </div>
            </motion.div>
        </div>
      </section>

      {/* ===== Highlights Section ===== */}
      <section className="bg-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
                  {highlights.map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="flex items-center gap-4 text-white"
                      >
                          <div className="flex-shrink-0 bg-slate-700 p-3 rounded-lg">
                            <h.icon className="h-7 w-7 text-blue-400"/>
                          </div>
                          <div>
                              <p className="font-bold text-lg">{h.title}</p>
                              <p className="text-sm text-slate-400">{h.desc}</p>
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>
      </section>

      {/* ===== Key Features Section ===== */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Rendimiento y Presencia Inigualables
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Cada detalle del Megalodon está diseñado para un rendimiento extremo y una experiencia de usuario sin fricciones.
                </p>
            </div>

            <div className="space-y-16">
                {features.map((feature, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <span className="p-2 bg-blue-100 rounded-full">
                                    <feature.icon className="h-6 w-6 text-blue-700"/>
                                </span>
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-base">
                                {feature.description}
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img src={feature.image} alt={feature.title} className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
      
      {/* ===== How It Works Section ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Un Proyecto a la Medida de tu Ambición</SectionTitle>
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80"
              >
                <div className="inline-block p-4 bg-blue-100 text-blue-700 rounded-full mb-4">
                    <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{step.desc}</p>
              </motion.div>
            ))}
          </div>
            <div className="mt-12 text-center">
                 <Link
                    to="/contacto"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 shadow-lg hover:bg-blue-300 transition-all transform hover:scale-105"
                    >
                    Solicitar Propuesta
                </Link>
            </div>
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionTitle className="px-6">Conceptos y Proyectos</SectionTitle>
        </div>
        <div className="mt-8 relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 px-6 md:px-10">
                {galleryImages.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        className="flex-shrink-0 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center"
                    >
                        <img src={src} alt={`Concepto Megalodon ${i+1}`} className="w-full h-80 rounded-2xl object-cover shadow-lg" />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <SectionTitle>Preguntas Frecuentes</SectionTitle>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

       {/* ===== Final CTA Section ===== */}
       <section className="py-20">
         <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">El Vending a Otra Escala</h2>
            <p className="mt-4 text-lg text-slate-600">
                Si tu visión es grande, el Megalodon es tu herramienta. Contáctanos para diseñar una solución a la medida de tu proyecto.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Megalodon"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-blue-400 shadow-lg hover:bg-blue-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Estación
                </Link>
                <button
                    onClick={() => navigate(-1)}
                    className="px-8 py-3 rounded-full font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
                >
                    Volver
                </button>
            </div>
         </div>
       </section>

    </div>
  );
}
