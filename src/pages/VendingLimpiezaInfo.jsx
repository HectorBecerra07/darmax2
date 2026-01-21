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
  CpuChipIcon,
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/5productos.jpg";

const highlights = [
  {
    icon: BeakerIcon,
    title: "Hasta 5 Productos",
    desc: "Cloro, detergente, suavizante y más",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Cobro en Efectivo",
    desc: "Acepta $1, $2, $5 y $10 (da cambio)",
  },
  {
    icon: CpuChipIcon,
    title: "Registra Ventas",
    desc: "Control de litros vendidos y recargas",
  },
  {
    icon: SparklesIcon,
    title: "Eco-Friendly",
    desc: "Fomenta la recarga y reutilización",
  },
];

const features = [
  {
    icon: CircleStackIcon,
    title: "Dispensador de Precisión",
    description:
      "Sistema automático con bombas de 1/2 hp con válvula check que dosifica exactamente 1 litro por ciclo, evitando derrames y asegurando una venta justa y eficiente.",
    image: "/img/limpieza/dispensador.png",
  },
  {
    icon: ArchiveBoxIcon,
    title: "Compatibilidad con Envases",
    description:
      "Diseñada para trabajar con bidones y botellas reutilizables, ideal para modelos de recarga que reducen residuos plásticos y aumentan la fidelidad de tus clientes.",
    image: "/img/limpieza/envases.png",
  },
  {
    icon: CogIcon,
    title: "Portafolio de Productos Flexible",
    description:
      "Configura hasta cinco productos de alta demanda: cloro, detergente para ropa, suavizante, desengrasante, limpiador multiusos y más, con precios ajustables por producto.",
    image: "/img/limpieza/productos.png",
  },
];

const processSteps = [
  {
    icon: ArchiveBoxIcon,
    title: "1. Abastecimiento",
    desc: "La carga de los contenedores es sencilla. Te capacitamos en la calibración de los dosificadores y en el control de inventario.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "2. Definición de Precios",
    desc: "Configura fácilmente los precios por litro desde el panel interno y crea estrategias atractivas para tu zona.",
  },
  {
    icon: SparklesIcon,
    title: "3. Mantenimiento y Limpieza",
    desc: "Con una rutina de higiene simple y purga de líneas, mantienes tu vending segura, limpia y confiable.",
  },
  {
    icon: ArrowTrendingUpIcon,
    title: "4. Crecimiento del Negocio",
    desc: "Te asesoramos en promociones en punto de venta, visibilidad, cupones y recompra para escalar tu proyecto.",
  },
];

const faqs = [
  {
    q: "¿Qué espacio necesita?",
    a: "Solo requieres un área compacta de al menos 2 m² con toma eléctrica, drenaje y posibilidad de anclaje a muro o piso. Su diseño vertical maximiza el espacio del local.",
  },
  {
    q: "¿Cada cuándo se necesita recargar los productos?",
    a: "Depende de la demanda de tu ubicación. La máquina registra las ventas y el volumen despachado, por lo que puedes revisar los contadores y planear el reabastecimiento de forma eficiente.",
  },
  {
    q: "¿Puedo cambiar los productos que ofrezco?",
    a: "Sí. El sistema es flexible: puedes cambiar el tipo de producto en cada línea y ajustar los precios en cualquier momento, adaptándote a la demanda de tu mercado.",
  },
  {
    q: "¿Incluye garantía y soporte?",
    a: "Por supuesto. Todos nuestros equipos incluyen garantía sobre componentes, materiales de instalación, capacitación y acceso a soporte técnico para resolver cualquier duda.",
  },
];

const galleryImages = [
  HERO_IMG,
  "/img/vending/productoslimpieza5.png",
  "/img/vending/9productos.jpeg",
  "/img/vending/productoslimpieza8.png",
];

/* --- Nuevos bloques: precios, extras, requisitos, componentes --- */

const pricingCards = [
  {
    name: "Vending 5 Productos de Limpieza",
    price: "$34,950 MXN",
    badge: "Equipo principal",
    description:
      "Máquina vending para cinco productos de limpieza con gabinete de acero inoxidable, sistema de cobro y dosificación automática por litro.",
    items: [
      "Bombas de 1/2 hp con válvula check",
      "Gabinete de acero inoxidable con llave",
      "Monedero antirrobo con alta capacidad",
      "Sensado de litros y registro de ventas",
      "Llenado de 1 litro por ciclo",
    ],
  },
  {
    name: "Paquete de prodductos",
    badge: "Inicia",
    description:
      "Todo lo necesario para poner en marcha tu negocio de recarga de limpieza adquiere con nostros el paquete inicial de productos.",
    items: [
      "5 bidones de 20 litros para producto",
    ],
  },
];

const extras = [
  { name: "Trámite de aviso de funcionamiento", price: "+ $3,500 MXN" },
  { name: "Seguro de vending", price: "+ $4,950 MXN" },
  { name: "Paquete para promoción o inauguración", price: "+ $7,500 MXN" },
];

const installRequirements = [
  {
    title: "Espacio Comercial",
    desc: "Local de al menos 2 m², con buena visibilidad y flujo de personas.",
  },
  {
    title: "Instalación Eléctrica y Drenaje",
    desc: "Conexiones de luz independientes, regulador de voltaje no break, contactos y drenaje dentro del local.",
  },
  {
    title: "Muro para Vending",
    desc: "Levantamiento de muro con medidas 96 x 58 cm para la máquina, altura de 75 cm del suelo y cajón interior de 15 cm.",
  },
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
    <div className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">
      {a}
    </div>
  </details>
);

const SectionTitle = ({ children, className = "" }) => (
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
    const t = setTimeout(
      () => contRef.current?.scrollIntoView({ behavior: "smooth" }),
      200
    );
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div ref={contRef} className="min-h-screen bg-slate-50 text-slate-800">
      <Helmet>
        <title>Vending de Productos de Limpieza | Darmax Clean</title>
        <meta
          name="description"
          content="Máquina vending para 5 productos de limpieza a granel: cloro, detergente, suavizante y más. Cobro en efectivo, registro de ventas y gabinete de acero inoxidable."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-gradient-to-tr from-pink-900 via-fuchsia-800 to-rose-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Vending de productos de limpieza"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-fuchsia-900/40 to-rose-900/60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-rose-200 rounded-full text-sm font-semibold">
              Negocio Innovador y Ecológico
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Vende Productos de Limpieza{" "}
              <span className="text-rose-300">a Granel, 24/7</span>.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed">
              Ofrece a tus clientes una forma económica y sostenible de comprar
              productos de limpieza, mientras generas ingresos de forma
              automática con tu vending Darmax Clean.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/configurar-maquina/Vending-Limpieza"
                className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-rose-400 shadow-lg hover:bg-rose-300 transition-all transform hover:scale-105"
              >
                Configurar mi Vending
              </Link>
              <Link
                to="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 rounded-full font-semibold border-2 border-slate-200/60 text-slate-100 hover:bg-slate-900/40 hover:border-slate-50 transition"
              >
                Ver Precio y Qué Incluye
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
                  <h.icon className="h-7 w-7 text-rose-400" />
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

      {/* ===== Pricing & What's Included ===== */}
      <section
        id="pricing"
        className="py-20 md:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Inversión y Paquetes Disponibles</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {pricingCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative rounded-3xl p-7 md:p-8 bg-white shadow-lg border ${
                  i === 0
                    ? "border-rose-200 shadow-rose-100"
                    : "border-slate-200/80"
                }`}
              >
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 ${
                    i === 1
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {card.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {card.name}
                </h3>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {card.price}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {card.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-rose-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 max-w-3xl mx-auto text-center text-sm text-slate-500">
            <p>
              Forma de pago: <strong>50% de anticipo</strong> y{" "}
              <strong>50% restante a la entrega</strong> del equipo. Si
              requieres factura, se maneja esquema{" "}
              <strong>Costo + IVA</strong>.
            </p>
            <p className="mt-2">
              Tiempo de entrega estimado: entre{" "}
              <strong>15 y 20 días naturales</strong> a partir de la firma del
              contrato.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Technical Components Section ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Componentes y Sistema de Cobro</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Componentes físicos */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 rounded-3xl bg-slate-50 border border-slate-200/80 p-7 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-full bg-rose-100 text-rose-700">
                  <ShieldCheckIcon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Componentes Principales
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Construida en acero inoxidable para proteger el sistema y el
                efectivo, con conexiones listas para trabajo continuo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                <ul className="space-y-2">
                  <li>• Bombas de 1/2 hp con válvula check.</li>
                  <li>• Mangueras y conectores de alta resistencia.</li>
                  <li>
                    • Gabinete de acero inoxidable con llave para protección del
                    dinero y del sistema.
                  </li>
                  <li>• Conexiones listas para instalación hidráulica.</li>
                  <li>• Luz interna para visibilidad del área de servicio.</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Vinil exterior Darmax Clean de alta calidad.</li>
                  <li>• Pantalla frontal con botones de acero inoxidable.</li>
                  <li>• Espacio frontal para exhibir tus productos.</li>
                  <li>• Rack para bidones no incluido (opcional).</li>
                </ul>
              </div>
            </motion.div>

            {/* Cobro y electrónica */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-slate-900 text-slate-50 p-7 md:p-8 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-10 h-32 w-32 rounded-full bg-rose-500/30 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 rounded-full bg-slate-800 text-rose-300">
                    <CurrencyDollarIcon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">
                    Sistema de Cobro y Control
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li>• Registra ventas y litros despachados.</li>
                  <li>• Sensado de litros para cada despacho.</li>
                  <li>• Llenado estándar de 1 litro por operación.</li>
                  <li>• Configuración de precios por producto.</li>
                  <li>
                    • Acepta monedas de $1, $2, $5 y $10 pesos (da cambio).
                  </li>
                  <li>• Monedero antirrobo de alta seguridad.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Key Features Section ===== */}
      <section id="features" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Eficiencia y Sostenibilidad en un Solo Equipo
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Diseñado para una operación rentable, controlada y con impacto
              ambiental positivo.
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
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <span className="p-2 bg-rose-100 rounded-full">
                      <feature.icon className="h-6 w-6 text-rose-700" />
                    </span>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto rounded-2xl shadow-xl object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Extras Section ===== */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Extras y Servicios Opcionales</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
            {extras.map((extra, i) => (
              <motion.div
                key={extra.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <p className="font-semibold text-sm text-slate-900">
                  {extra.name}
                </p>
                <p className="mt-3 text-rose-700 font-bold text-sm">
                  {extra.price}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-xs text-slate-500 flex items-center gap-2">
            <TruckIcon className="h-4 w-4" />
            *Flete y viáticos se cotizan de acuerdo con el código postal de
            instalación.
          </p>
        </div>
      </section>

      {/* ===== Installation Requirements Section ===== */}
      <section className="py-20 md:py-28 bg-slate-900 text-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle className="text-left md:text-left">
            ¿Qué requieres para instalar tu Vending?
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {installRequirements.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative rounded-2xl bg-slate-800/60 border border-slate-700/80 p-6"
              >
                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-rose-500/30 blur-xl" />
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.desc}</p>
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
          <SectionTitle className="px-6">
            Equipos y Configuraciones
          </SectionTitle>
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
                <img
                  src={src}
                  alt={`Vending de limpieza ${i + 1}`}
                  className="w-full h-80 rounded-2xl object-cover shadow-lg bg-white p-4"
                />
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
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA Section ===== */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Inicia tu Negocio de Recarga Hoy
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Aprovecha la creciente demanda de soluciones ecológicas y
            económicas. Configura tu vending de limpieza o contáctanos para una
            asesoría sin costo.
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
