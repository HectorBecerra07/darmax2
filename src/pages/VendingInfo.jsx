import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDownIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  TruckIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/TOUCHAGUA.png";

const highlights = [
  {
    icon: ArrowTrendingUpIcon,
    title: "1200 Garrafones/Mes",
    desc: "Máxima capacidad de producción",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Cobro Flexible",
    desc: "Acepta efectivo, tarjeta y QR",
  },
  {
    icon: ShieldCheckIcon,
    title: "Acero Inoxidable",
    desc: "Construcción robusta y durable",
  },
  { icon: ClockIcon, title: "Operación 24/7", desc: "Genera ingresos sin parar" },
];

const features = [
  {
    icon: ArrowTrendingUpIcon,
    title: "Producción de Alto Rendimiento",
    description: "Diseñadas para operar de forma continua, con una capacidad de hasta 1200 garrafones al mes, asegurando un flujo constante de ingresos y satisfaciendo la alta demanda.",
    image: "/img/vending/produccion.png",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Sistema de Cobro Automatizado y Versátil",
    description: "Integra múltiples métodos de pago: monedero para efectivo, terminal para tarjetas y pagos sin contacto con QR. Ofrece comodidad a tus clientes y simplifica tu gestión.",
    image: "/img/vending/pagos.png",
  },
  {
    icon: ShieldCheckIcon,
    title: "Construcción de Grado Industrial",
    description: "Fabricadas con acero inoxidable 304, nuestras máquinas resisten la corrosión y el uso rudo, garantizando una larga vida útil y una apariencia siempre profesional.",
    image: "/img/vending/acero.png",
  },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Análisis de Ubicación",
    desc: "Te ayudamos a evaluar y seleccionar la zona con el mayor potencial de clientes para maximizar tu retorno de inversión.",
  },
  {
    icon: TruckIcon,
    title: "2. Instalación Profesional",
    desc: "Nuestro equipo se encarga del montaje, la puesta en marcha del equipo y la configuración inicial del sistema.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Completa",
    desc: "Te brindamos una capacitación detallada sobre la operación, el mantenimiento preventivo y la gestión del equipo.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Operación y Soporte",
    desc: "Disfruta de un negocio de bajo mantenimiento. Ofrecemos soporte continuo para resolver cualquier duda o incidencia.",
  },
];

const faqs = [
  {
    q: "¿Qué se necesita para la instalación?",
    a: "Se requiere un espacio seguro y visible con acceso a una toma de agua potable, un punto de drenaje y una conexión eléctrica estándar. Nuestro equipo técnico te guiará en cada paso.",
  },
  {
    q: "¿El equipo purifica el agua?",
    a: "Sí, cada máquina vending cuenta con un sistema de purificación integrado de múltiples etapas (sedimentos, carbón activado, y luz ultravioleta) que garantiza agua de la más alta calidad.",
  },
  {
    q: "¿Cómo gestiono el dinero recaudado?",
    a: "El equipo cuenta con un contador de ventas y un compartimento de seguridad para el efectivo. Para pagos digitales, el dinero se deposita directamente en tu cuenta bancaria.",
  },
  {
    q: "¿Qué garantía y soporte ofrecen?",
    a: "Ofrecemos una garantía completa sobre todos los componentes del equipo y un plan de soporte técnico post-venta para asegurar el funcionamiento óptimo de tu inversión.",
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

const SectionTitle = ({ children }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {children}
        </h2>
    </div>
);


/* --- Main Component --- */
export default function VendingInfo() {
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
        <title>Vending de Agua Purificada 24 Horas | Negocio Rentable | Darmax</title>
        <meta
          name="description"
          content="Inicia tu negocio de Vending de Agua Purificada 24/7. Equipos de acero inoxidable, alta rentabilidad y bajo mantenimiento. Compite con las grandes franquicias."
        />
        <meta name="keywords" content="vending de agua, purificadora de agua 24 horas, negocio de agua, franquicia de agua, vending machine agua, agua inmaculada competencia" />
        <link rel="canonical" href="https://darmaxagua.com.mx/vending-info" />
        
        {/* Datos Estructurados (Schema.org) para Producto/Servicio */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Máquina Vending de Agua Purificada Darmax",
              "image": "https://darmaxagua.com.mx/img/vending/TOUCHAGUA.png",
              "description": "Máquina expendedora de agua purificada 24/7 con capacidad de 1200 garrafones al mes, acero inoxidable y múltiples métodos de pago.",
              "brand": {
                "@type": "Brand",
                "name": "Darmax Agua"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "MXN",
                "lowPrice": "55000",
                "highPrice": "120000",
                "offerCount": "5"
              }
            }
          `}
        </script>
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Máquina Vending de Agua Darmax" className="w-full h-full object-cover opacity-30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    El Negocio del Agua, <span className="text-cyan-400">Automatizado</span>.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                    Genera ingresos pasivos 24/7 con nuestras máquinas vending de agua purificada. Una inversión de alta rentabilidad, bajo mantenimiento y gran impacto en tu comunidad.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Vending"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Equipo
                    </Link>
                    <Link
                        to="#features"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 rounded-full font-semibold border-2 border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-800 transition"
                    >
                        Descubrir Características
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
                    Diseño Inteligente, Operación Eficiente
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Cada componente está pensado para maximizar tu rentabilidad y minimizar el mantenimiento.
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
          <SectionTitle>De la Idea a la Realidad en 4 Pasos</SectionTitle>
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
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Nuestros Equipos en Acción</SectionTitle>
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
          <SectionTitle>Preguntas Frecuentes</SectionTitle>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

       {/* ===== Final CTA Section ===== */}
       <section className="py-20">
         <div className="max-w-3xl mx-auto text-center px-6">
            <h2 className="text-3xl font-extrabold text-slate-900">¿Listo para Iniciar tu Negocio?</h2>
            <p className="mt-4 text-lg text-slate-600">
                Da el primer paso hacia tu independencia financiera. Configura tu equipo ideal o contáctanos para una asesoría personalizada sin compromiso.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Vending"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Equipo
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
