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
  SparklesIcon,
  RectangleGroupIcon,
  CircleStackIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/duo-emprendedor.png"; 

const highlights = [
  {
    icon: RectangleGroupIcon,
    title: "Agua + Limpieza",
    desc: "Dos negocios de alta demanda en uno",
  },
  {
    icon: BoltIcon,
    title: "Alta Rentabilidad",
    desc: "Maximiza ingresos por metro cuadrado",
  },
  {
    icon: CpuChipIcon,
    title: "Operación Simplificada",
    desc: "Gestiona ambos negocios fácilmente",
  },
  { 
    icon: SparklesIcon, 
    title: "Crecimiento Acelerado", 
    desc: "Capta una base de clientes más amplia" 
  },
];

const features = [
    {
        icon: RectangleGroupIcon,
        title: "Dispensadores Independientes",
        description: "Un sistema robusto con módulos separados para agua purificada y hasta 8 productos de limpieza a granel, permitiendo una operación simultánea y eficiente.",
        image: "/img/purificadoras/purificadora-comercial.jpg", // Placeholder
    },
    {
        icon: CpuChipIcon,
        title: "Punto de Cobro Centralizado",
        description: "Un solo punto de cobro inteligente para todos los productos, compatible con múltiples métodos de pago para una experiencia de cliente sin fricciones.",
        image: "/img/vending/TOUCHAGUA.png", // Placeholder
    },
    {
        icon: ShieldCheckIcon,
        title: "Diseño Compacto y Eficiente",
        description: "Nuestra ingeniería optimiza el espacio al combinar dos máquinas en una sola estructura sólida y atractiva, ideal para locales con espacio limitado.",
        image: "/img/purificadora/tanque.png", // Placeholder
    },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Estrategia de Mercado",
    desc: "Analizamos tu ubicación para determinar la mezcla de productos de limpieza con mayor potencial de venta junto al agua purificada.",
  },
  {
    icon: TruckIcon,
    title: "2. Instalación Integral",
    desc: "Nos encargamos de la instalación completa de tu Dúo Emprendedor, incluyendo conexiones de agua, drenaje y electricidad.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación de Doble Negocio",
    desc: "Te enseñamos a gestionar ambos inventarios, a configurar precios y a mantener el equipo en perfectas condiciones operativas.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Soporte y Expansión",
    desc: "Cuentas con nuestro respaldo técnico y te asesoramos para escalar tu negocio, añadiendo más productos o equipos.",
  },
];


const faqs = [
    {
    q: "¿Qué ventajas ofrece el modelo 2 en 1?",
    a: "La principal ventaja es la diversificación de ingresos y la captación de una base de clientes más amplia. Ofreces dos servicios esenciales en un solo punto, aumentando la rentabilidad por metro cuadrado y la frecuencia de visitas.",
  },
  {
    q: "¿La gestión de dos inventarios es complicada?",
    a: "No, el sistema está diseñado para ser gestionado de forma centralizada. Nuestro software te da una visión clara de las ventas y el inventario de cada módulo, simplificando el reabastecimiento.",
  },
  {
    q: "¿Puedo elegir qué productos de limpieza vender?",
    a: "Sí, el módulo de limpieza es personalizable. Puedes seleccionar una gama de hasta 8 productos según la demanda de tu zona, como detergente, suavizante, cloro, limpiador de pisos, etc.",
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
export default function DuoEmprendedorInfo() {
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
        <title>Dúo Emprendedor 2 en 1 - Darmax</title>
        <meta
          name="description"
          content="La solución definitiva que combina una purificadora de agua y un vending de productos de limpieza. Doble impacto, doble ganancia."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Estación Duo Emprendedor de Darmax" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-lime-300 rounded-full text-sm font-semibold">Doble Negocio, Doble Impacto</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Dúo Emprendedor: <span className="text-lime-400">Agua y Limpieza en Uno</span>.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                   La solución 2 en 1 que revoluciona el comercio local. Ofrece agua purificada y productos de limpieza a granel desde una sola estación automatizada y maximiza tus ganancias.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Duo-Emprendedor"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-lime-400 shadow-lg hover:bg-lime-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Dúo
                    </Link>
                    <Link
                        to="#features"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 rounded-full font-semibold border-2 border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-800 transition"
                    >
                        Ver Características
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
                            <h.icon className="h-7 w-7 text-lime-400"/>
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
                    Un Negocio Diversificado y Eficiente
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Combina lo mejor de dos mundos en una estación robusta, diseñada para una gestión simple y máxima rentabilidad.
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
                                <span className="p-2 bg-lime-100 rounded-full">
                                    <feature.icon className="h-6 w-6 text-lime-700"/>
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
          <SectionTitle>Tu Doble Negocio, Listo para Operar</SectionTitle>
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
                <div className="inline-block p-4 bg-lime-100 text-lime-700 rounded-full mb-4">
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
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-lime-400 shadow-lg hover:bg-lime-300 transition-all transform hover:scale-105"
                    >
                    Solicitar Asesoría
                </Link>
            </div>
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionTitle className="px-6">Nuestros Equipos 2 en 1</SectionTitle>
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
                        <img src={src} alt={`Concepto Duo Emprendedor ${i+1}`} className="w-full h-80 rounded-2xl object-cover shadow-lg" />
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
            <h2 className="text-3xl font-extrabold text-slate-900">Duplica tus Oportunidades de Ingreso</h2>
            <p className="mt-4 text-lg text-slate-600">
                No elijas entre un negocio u otro, ¡tenlos los dos! Configura tu Dúo Emprendedor y empieza a construir un negocio más sólido y rentable.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Duo-Emprendedor"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-lime-400 shadow-lg hover:bg-lime-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Dúo
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
