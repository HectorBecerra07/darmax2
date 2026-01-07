import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BeakerIcon,
  SunIcon,
  CircleStackIcon,
  CubeTransparentIcon
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/mostrador.jpg";

const highlights = [
  {
    icon: ArrowTrendingUpIcon,
    title: "Hasta 3,000 L/Día",
    desc: "Capacidad de producción industrial",
  },
  {
    icon: ShieldCheckIcon,
    title: "Agua 100% Pura",
    desc: "Filtración multi-etapas y UV",
  },
  {
    icon: BeakerIcon,
    title: "Acero Inoxidable 304",
    desc: "Máxima higiene y grado alimenticio",
  },
  { 
    icon: ClockIcon, 
    title: "Operación Continua", 
    desc: "Diseñadas para trabajar 24/7" 
  },
];

const features = [
    {
        icon: CircleStackIcon,
        title: "Filtración Multi-Etapas de Alta Eficiencia",
        description: "Nuestro sistema de purificación de agua utiliza múltiples etapas, incluyendo lecho profundo, carbón activado y suavizadores, para eliminar sedimentos, cloro, sabores y olores, garantizando una base de agua perfecta.",
        image: "/img/purificadora/filtrado.png",
    },
    {
        icon: SunIcon,
        title: "Desinfección Avanzada con UV y Ozono",
        description: "Incorporamos lámparas de luz ultravioleta (UV) para eliminar bacterias y virus, seguido de una inyección de ozono, un poderoso desinfectante que garantiza la inocuidad total del agua hasta el momento del envasado.",
        image: "/img/purificadora/uv.png",
    },
    {
        icon: CubeTransparentIcon,
        title: "Construcción Sanitaria y Durable",
        description: "Utilizamos tanques de almacenamiento y componentes de acero inoxidable grado alimenticio para prevenir la contaminación y asegurar un contacto seguro con el agua, cumpliendo con las más altas normas de calidad.",
        image: "/img/purificadora/tanque.png",
    },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Diseño y Consultoría",
    desc: "Analizamos tu espacio y necesidades de producción para diseñar una planta purificadora a la medida de tu proyecto.",
  },
  {
    icon: TruckIcon,
    title: "2. Instalación y Puesta en Marcha",
    desc: "Nuestro equipo de expertos se encarga de la instalación completa, las conexiones y las pruebas para asegurar un funcionamiento óptimo.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Técnica",
    desc: "Te ofrecemos una formación completa sobre la operación del equipo, el mantenimiento preventivo y las buenas prácticas de manufactura.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Soporte y Consumibles",
    desc: "Te respaldamos con soporte técnico continuo y el abastecimiento de todos los consumibles y refacciones que necesites.",
  },
];


const faqs = [
  { q: "¿Qué espacio se requiere para una planta purificadora?", a: "Depende del modelo y la capacidad. Ofrecemos soluciones compactas para locales pequeños desde 15 m², hasta sistemas industriales que requieren más espacio. Realizamos una evaluación técnica para optimizar tu local." },
  { q: "¿Qué normativas de salud debo cumplir?", a: "Te asesoramos para que tu planta cumpla con todas las normativas locales y federales de salud (COFEPRIS en México), asegurando que tu producto sea 100% seguro para el consumo humano." },
  { q: "¿Cuál es el costo de mantenimiento y operación?", a: "El costo es bajo. Principalmente consiste en el cambio programado de cartuchos de filtración, lámparas UV y el consumo de energía. Te proporcionamos un estimado detallado de costos operativos." },
  { q: "¿Qué incluye la garantía de Darmax?", a: "Nuestra garantía cubre todos los defectos de fabricación en los componentes clave del sistema. Además, nuestro soporte técnico está siempre disponible para asistirte en cualquier eventualidad." },
];

const galleryImages = [
  "/img/trabajos/trabajos1.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos6.jpg",
  "/img/trabajos/trabajos7.jpg",
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
export default function PurificadoraInfo() {
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
        <title>Plantas Purificadoras de Agua - Darmax</title>
        <meta
          name="description"
          content="Inicia tu propio negocio de agua purificada con nuestras plantas de alto rendimiento, construcción sanitaria y la mejor tecnología de filtración."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Planta purificadora de agua Darmax" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                 <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-cyan-300 rounded-full text-sm font-semibold">Negocio Rentable y de Alta Demanda</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Conquista el Mercado del Agua <span className="text-cyan-400">con tu Propia Marca</span>.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                   Te ofrecemos la tecnología, la capacitación y el soporte para que inicies tu negocio de agua purificada. Un producto de primera necesidad con un potencial de crecimiento ilimitado.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Purificadora"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Planta
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
                            <h.icon className="h-7 w-7 text-cyan-400"/>
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
                    Tecnología Superior para Agua Perfecta
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Cada etapa del proceso está diseñada para cumplir con los más altos estándares de calidad y pureza.
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
                                <span className="p-2 bg-cyan-100 rounded-full">
                                    <feature.icon className="h-6 w-6 text-cyan-700"/>
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
          <SectionTitle>Tu Proyecto de Purificación, Simplificado</SectionTitle>
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
                <div className="inline-block p-4 bg-cyan-100 text-cyan-700 rounded-full mb-4">
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
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
                    >
                    Solicitar Asesoría
                </Link>
            </div>
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionTitle className="px-6">Nuestras Plantas en Operación</SectionTitle>
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
                        <img src={src} alt={`Instalación real ${i+1}`} className="w-full h-80 rounded-2xl object-cover shadow-lg" />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <SectionTitle>Resolvemos tus Dudas</SectionTitle>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

       {/* ===== Final CTA Section ===== */}
       <section className="py-20">
         <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">Emprende con un Producto Esencial</h2>
            <p className="mt-4 text-lg text-slate-600">
                El agua purificada es un negocio noble y de alta demanda. Contáctanos hoy y da el primer paso para construir tu propia marca de agua.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Purificadora"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Planta
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
