import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CubeIcon,
  SparklesIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/tridente.png"; 

const highlights = [
  {
    icon: RectangleStackIcon,
    title: "Triple Negocio Integrado",
    desc: "Agua, limpieza y un módulo extra",
  },
  {
    icon: BoltIcon,
    title: "Máxima Versatilidad",
    desc: "Adapta tu oferta al mercado",
  },
  {
    icon: DocumentTextIcon,
    title: "Solución Todo en Uno",
    desc: "Gestiona todo desde un lugar",
  },
  { 
    icon: SparklesIcon, 
    title: "Diferenciación Total", 
    desc: "Lidera el mercado local" 
  },
];

const features = [
    {
        icon: RectangleStackIcon,
        title: "Tres Módulos de Negocio",
        description: "Integra en una sola estación la venta de agua purificada, productos de limpieza a granel y un tercer módulo personalizable para snacks, café, o cualquier producto de alta rotación.",
        image: "/img/purificadoras/purificadora-comercial.jpg", // Placeholder
    },
    {
        icon: CpuChipIcon,
        title: "Plataforma de Gestión Unificada",
        description: "Controla los tres negocios desde un solo panel de administración. Obtén estadísticas de ventas, alertas de inventario y gestiona precios para toda la estación en tiempo real.",
        image: "/img/vending/TOUCHAGUA.png", // Placeholder
    },
    {
        icon: ShieldCheckIcon,
        title: "Experiencia de Cliente Inigualable",
        description: "Ofrece una conveniencia sin precedentes que fideliza a tus clientes. Un solo punto para resolver múltiples necesidades, disponible 24/7.",
        image: "/img/purificadora/tanque.png", // Placeholder
    },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Diseño Estratégico",
    desc: "Evaluamos tu ubicación y mercado para definir la mejor combinación de productos para los tres módulos de tu Tridente.",
  },
  {
    icon: TruckIcon,
    title: "2. Fabricación e Instalación",
    desc: "Construimos tu estación multiservicio y nuestro equipo técnico se encarga de la instalación y configuración completa en tu local.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Integral",
    desc: "Te formamos en la gestión de la plataforma unificada, el reabastecimiento de los 3 módulos y el mantenimiento preventivo.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Soporte y Crecimiento",
    desc: "Recibe soporte técnico continuo y asesoría para optimizar tu oferta de productos y maximizar la rentabilidad de tu estación.",
  },
];


const faqs = [
  {
    q: "¿Qué puedo incluir en el tercer módulo?",
    a: "El tercer módulo es altamente flexible. Podemos adaptarlo para vender una amplia gama de productos como snacks, bebidas frías, café de grano, artículos de higiene personal, o cualquier otro producto que se ajuste a un formato de vending automatizado."
  },
  {
    q: "¿Este modelo es para cualquier ubicación?",
    a: "El Tridente brilla en ubicaciones de alto a mediano tráfico con una comunidad residente o recurrente, como grandes complejos residenciales, universidades, centros de oficinas, y plazas comerciales de barrio.",
  },
  {
    q: "¿Requiere una instalación muy especializada?",
    a: "Necesita un espacio más amplio que un vending tradicional, además de acceso a toma de agua, drenaje y conexiones eléctricas adecuadas. Nuestro equipo técnico realiza una visita de factibilidad y se encarga de todo el proceso.",
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
export default function TridenteInfo() {
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
        <title>Modelo Tridente 3 en 1 - Darmax</title>
        <meta
          name="description"
          content="La estación de multiservicio definitiva. Combina agua, limpieza y un tercer negocio a tu elección para dominar el mercado."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Estación Tridente de Darmax" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-teal-300 rounded-full text-sm font-semibold">Solución Multiservicio 3 en 1</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Modelo <span className="text-teal-400">Tridente</span>: Tres Negocios, Un Mismo Lugar.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                   Revoluciona el vending con la estación multiservicio definitiva. Combina agua purificada, productos de limpieza y un tercer negocio a tu elección para dominar tu mercado.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Tridente"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-teal-400 shadow-lg hover:bg-teal-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Tridente
                    </Link>
                    <Link
                        to="#features"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 rounded-full font-semibold border-2 border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-800 transition"
                    >
                        Ver Módulos
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
                            <h.icon className="h-7 w-7 text-teal-400"/>
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
                    Una Oferta de Servicios sin Competencia
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Diseñado para una máxima versatilidad y una gestión simplificada que multiplica tus fuentes de ingreso.
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
                                <span className="p-2 bg-teal-100 rounded-full">
                                    <feature.icon className="h-6 w-6 text-teal-700"/>
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
          <SectionTitle>Tu Estación Multiservicio, Lista para Operar</SectionTitle>
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
                <div className="inline-block p-4 bg-teal-100 text-teal-700 rounded-full mb-4">
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
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-teal-400 shadow-lg hover:bg-teal-300 transition-all transform hover:scale-105"
                    >
                    Solicitar Propuesta
                </Link>
            </div>
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionTitle className="px-6">Proyectos y Diseños Conceptuales</SectionTitle>
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
                        <img src={src} alt={`Concepto Tridente ${i+1}`} className="w-full h-80 rounded-2xl object-cover shadow-lg" />
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
            <h2 className="text-3xl font-extrabold text-slate-900">Una Solución, Múltiples Fuentes de Ingreso</h2>
            <p className="mt-4 text-lg text-slate-600">
                Diversifica tu inversión y captura a un público más amplio con el modelo Tridente. Contáctanos y diseña tu estación multiservicio.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Tridente"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-teal-400 shadow-lg hover:bg-teal-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Tridente
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
