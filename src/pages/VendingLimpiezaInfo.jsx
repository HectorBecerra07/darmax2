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
  SparklesIcon,
  BeakerIcon,
  PaintBrushIcon,
  ArchiveBoxIcon,
  CogIcon,
  CircleStackIcon,
  CpuChipIcon
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/5productos.jpg";

const highlights = [
  {
    icon: BeakerIcon,
    title: "Hasta 8 Productos",
    desc: "Cloro, detergente, suavizante y más",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Cobro en Efectivo",
    desc: "Monedero de alta capacidad",
  },
  {
    icon: CpuChipIcon,
    title: "Fácil de Usar",
    desc: "Flujo de compra simple e intuitivo",
  },
  { 
    icon: SparklesIcon, 
    title: "Eco-Friendly", 
    desc: "Fomenta la recarga y reutilización" 
  },
];

const features = [
    {
        icon: CircleStackIcon,
        title: "Dispensador de Precisión",
        description: "Un sistema automático que dosifica con exactitud el volumen elegido por el cliente, evitando derrames y asegurando una venta justa y eficiente.",
        image: "/img/limpieza/dispensador.png",
    },
    {
        icon: ArchiveBoxIcon,
        title: "Compatibilidad con Envases",
        description: "Diseñado para admitir envases PET y otras botellas reutilizables, promoviendo un modelo de negocio sostenible que reduce los residuos plásticos.",
        image: "/img/limpieza/envases.png",
    },
    {
        icon: CogIcon,
        title: "Portafolio de Productos Flexible",
        description: "Te permite configurar una variedad de productos de alta demanda como cloro, detergente para ropa, suavizante, desinfectante de pisos y más.",
        image: "/img/limpieza/productos.png",
    },
];

const processSteps = [
  {
    icon: ArchiveBoxIcon,
    title: "1. Abastecimiento",
    desc: "La carga de los contenedores de productos es sencilla. Te capacitamos en la calibración de los dosificadores para un control exacto.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "2. Definición de Precios",
    desc: "Establece fácilmente los precios por litro o fracción desde un panel de control simple, y crea promociones para atraer más clientes.",
  },
  {
    icon: SparklesIcon,
    title: "3. Mantenimiento y Limpieza",
    desc: "Con una rutina de higiene simple y purga de líneas, aseguras una operación segura y confiable para tus clientes.",
  },
  {
    icon: ArrowTrendingUpIcon,
    title: "4. Crecimiento del Negocio",
    desc: "Te asesoramos en estrategias de promoción en el punto de venta para fomentar la visibilidad, el uso de cupones y la recompra.",
  },
];


const faqs = [
  { q: "¿Qué espacio necesita?", a: "Un área compacta con toma eléctrica y, de ser posible, anclaje al piso/pared es suficiente. Su diseño vertical optimiza el espacio." },
  { q: "¿Cada cuándo se necesita recargar los productos?", a: "La frecuencia depende de la demanda de tu ubicación. El sistema incluye contadores que te ayudan a planificar el reabastecimiento de forma eficiente." },
  { q: "¿Puedo cambiar los productos que ofrezco?", a: "Sí, el sistema es flexible. Puedes reconfigurar los productos y ajustar los precios en cualquier momento para adaptarte a las necesidades de tu mercado." },
  { q: "¿Incluye garantía y soporte?", a: "Por supuesto. Todos nuestros equipos incluyen garantía completa, un kit de refacciones inicial, y acceso a nuestro soporte técnico para resolver cualquier duda." },
];

const galleryImages = [
  HERO_IMG, 
  "/img/vending/productoslimpieza5.png", 
  "/img/vending/9productos.jpeg", 
  "/img/vending/productoslimpieza8.png"
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
export default function VendingLimpiezaInfo() {
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
        <title>Vending de Productos de Limpieza - Darmax</title>
        <meta
          name="description"
          content="Automatiza la venta de detergentes, cloro y suavizantes. Un negocio ecológico y rentable con insumos a granel."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-tr from-pink-900 via-fuchsia-800 to-rose-700">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Vending de productos de limpieza" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-rose-300 rounded-full text-sm font-semibold">Negocio Innovador y Ecológico</span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                    Vende Productos de Limpieza <span className="text-rose-300">a Granel, 24/7</span>.
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed">
                    Ofrece a tus clientes una forma económica y sostenible de comprar productos de limpieza, mientras generas ingresos de forma automática.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/configurar-maquina/Vending-Limpieza"
                        className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 shadow-lg hover:bg-rose-300 transition-all transform hover:scale-105"
                    >
                        Configurar mi Vending
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
                            <h.icon className="h-7 w-7 text-rose-400"/>
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
                    Eficiencia y Sostenibilidad en un Solo Equipo
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                    Diseñado para una operación rentable y un impacto ambiental positivo.
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
                                <span className="p-2 bg-rose-100 rounded-full">
                                    <feature.icon className="h-6 w-6 text-rose-700"/>
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
          <SectionTitle>Tu Negocio en 4 Simples Pasos</SectionTitle>
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
                <div className="inline-block p-4 bg-rose-100 text-rose-700 rounded-full mb-4">
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
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 shadow-lg hover:bg-rose-300 transition-all transform hover:scale-105"
                    >
                    Solicitar Asesoría
                </Link>
            </div>
        </div>
      </section>

      {/* ===== Gallery Section ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <SectionTitle className="px-6">Equipos y Configuraciones</SectionTitle>
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
                        <img src={src} alt={`Vending de limpieza ${i+1}`} className="w-full h-80 rounded-2xl object-cover shadow-lg bg-white p-4" />
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
            <h2 className="text-3xl font-extrabold text-slate-900">Inicia tu Negocio de Recarga Hoy</h2>
            <p className="mt-4 text-lg text-slate-600">
                Aprovecha la creciente demanda de soluciones ecológicas y económicas. Configura tu vending de limpieza o contáctanos para una asesoría sin costo.
            </p>
             <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                    to="/configurar-maquina/Vending-Limpieza"
                    className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 shadow-lg hover:bg-rose-300 transition-all transform hover:scale-105"
                >
                    Configurar mi Vending
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
