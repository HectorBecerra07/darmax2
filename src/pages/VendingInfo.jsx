import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // o "react-helmet" según uses
import SEO from "../components/SEO";
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
  TruckIcon as ShippingIcon,
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/TOUCHAGUA.png";

const highlights = [
  {
    icon: CurrencyDollarIcon,
    title: "Desde $64,950 MXN",
    desc: "Atlantis 300 con sistema de purificación completo.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Certificación NSF",
    desc: "Filtros y resinas certificados para agua segura.",
  },
  {
    icon: BuildingStorefrontIcon,
    title: "Local desde 12 m²",
    desc: "Requisitos claros para montar tu purificadora.",
  },
  {
    icon: ClockIcon,
    title: "Entrega 15–20 días",
    desc: "A partir de la firma de contrato y anticipo.",
  },
];

const features = [
  {
    icon: ArrowTrendingUpIcon,
    title: "Sistema Completo de Purificación",
    description:
      "La Atlantis 300 integra bomba Jet de 3/4 hp en acero inoxidable, presurizador automático, filtro de lecho profundo, filtro de carbón activado, suavizador con resina catiónica y pulidor final. Todo en tanques con certificación NSF para ofrecer agua segura y cristalina.",
    image: "/img/vending/produccion.png",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Vending Touch con 4 Modalidades de Llenado",
    description:
      "Dispensador automático para 1, 4, 10 y 20 litros con pantalla touch de 8”, validador de monedas que da cambio, enjuague automático de garrafón, sensado de litros, solenoides de precisión y sistema de verificación de fallas para una operación confiable 24/7.",
    image: "/img/vending/pagos.png",
  },
  {
    icon: ShieldCheckIcon,
    title: "Gabinete de Acero Inoxidable 304",
    description:
      "Gabinete de acero quirúrgico grado alimenticio 304 con marco y puerta en inoxidable, vinil laminado contra luz UV, monedero antirrobo y bocina integrada. Imagen profesional y resistencia al uso rudo y a la intemperie.",
    image: "/img/vending/acero.png",
  },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Análisis de Ubicación",
    desc: "Te ayudamos a evaluar la zona, flujo de personas y competencia para elegir el mejor punto de venta.",
  },
  {
    icon: TruckIcon,
    title: "2. Instalación Profesional",
    desc: "Nuestro equipo instala la máquina, conecta el sistema hidráulico y deja todo funcionando.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Completa",
    desc: "Te enseñamos operación diaria, manejo del dinero, mantenimiento preventivo y buenas prácticas.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Operación y Soporte",
    desc: "Disfruta de un negocio de bajo mantenimiento con soporte técnico post-venta cuando lo necesites.",
  },
];

const faqs = [
  {
    q: "¿Qué se necesita para la instalación?",
    a: "Requieres un local mínimo de 12 m², conexiones de luz independientes con regulador de voltaje no break, drenaje dentro del local y tinacos grado alimenticio (dos de 2,500 litros para agua cruda o uno de 5,000 litros). También se levanta un muro con medidas aproximadas de 80.5 x 80.5 cm y 90 cm de altura al suelo para la máquina vending.",
  },
  {
    q: "¿Qué incluye el sistema de purificación de la Atlantis 300?",
    a: "Incluye bomba Jet de 3/4 hp, presurizador automático, filtro de lecho profundo, filtro de carbón activado, filtro suavizador con resina catiónica, portacartuchos pulidor, lámpara de luz ultravioleta de 25 LPM, generador de ozono y sistema de inyección tipo ventury. Todo en tanques con certificación NSF para garantizar agua de alta calidad.",
  },
  {
    q: "¿Cuáles son las formas de pago y tiempos de entrega?",
    a: "Se maneja 50% de anticipo y 50% restante a la entrega del equipo. Si requieres factura, se agrega el IVA al costo. El tiempo de entrega es de entre 15 y 20 días naturales a partir de la firma del contrato. Además, puedes complementar tu proyecto con extras como trámite de aviso de funcionamiento, kit de insumos anuales, ósmosis inversa, seguro de vending y más.",
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

const pricingCards = [
  {
    name: "Atlantis 300 Vending Touch",
    price: "$64,950 MXN",
    badge: "Equipo principal",
    description:
      "Máquina vending de agua purificada con sistema completo de filtración y gabinete de acero inoxidable 304.",
    items: [
      "Pantalla touch de 8”",
      "4 modalidades de llenado: 1, 4, 10 y 20 litros",
      "Validador de monedas que da cambio",
      "Enjuague automático de garrafón",
      "Sensado de litros y sistema de verificación de fallas",
    ],
  },
  {
    name: "Módulo de Agua Alcalina",
    price: "+ $12,000 MXN",
    badge: "Upgrade opcional",
    description:
      "Agrega valor a tu negocio ofreciendo agua alcalina en la misma estación vending.",
    items: [
      "Filtro alcalinizador",
      "Pre-filtro pulidor",
      "Lámpara UV de 16 watts",
      "Tarjeta vending para 2 tipos de agua",
    ],
  },
];

const extras = [
  { name: "Trámite de aviso de funcionamiento", price: "$3,500 MXN" },
  { name: 'Toma de pipa 2" PVC Cédula 40', price: "$5,500 MXN" },
  { name: "Kit de insumos anuales", price: "$3,900 MXN" },
  { name: "Seguro de vending", price: "$4,950 MXN" },
  {
    name: "Tinaco grado alimenticio translúcido 5,000 L",
    price: "$10,500 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 2,500 L",
    price: "$5,500 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 1,100 L",
    price: "$3,300 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 1,100 L tipo bala",
    price: "$3,600 MXN",
  },
  { name: "Mantenimiento anual", price: "$8,500 MXN" },
  { name: "Mostrador para atención", price: "$18,000 MXN" },
  { name: "Ósmosis inversa", price: "$28,000 MXN" },
  { name: "Automatización de ósmosis", price: "$9,000 MXN" },
  {
    name: "Paquete para promoción o inauguración",
    price: "$7,500 MXN",
  },
];

const installRequirements = [
  {
    title: "Espacio Comercial",
    desc: "Local mínimo de 12 m² con buena visibilidad y flujo de personas.",
  },
  {
    title: "Instalación Eléctrica",
    desc: "Conexiones de luz independientes, regulador de voltaje no break y contactos dentro del local.",
  },
  {
    title: "Hidráulico y Drenaje",
    desc: "Acceso a toma de agua, drenaje dentro del local y preparación para conexiones en PVC.",
  },
  {
    title: "Almacenamiento de Agua Cruda",
    desc: "Dos tinacos grado alimenticio translúcidos de 2,500 L o uno de 5,000 L para agua cruda.",
  },
  {
    title: "Muro para Vending",
    desc: "Levantamiento de muro con medidas aproximadas de 80.5 x 80.5 cm y 90 cm de altura al suelo para la vending.",
  },
];

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

const SectionTitle = ({ eyebrow, children, align = "center", className = "" }) => (
  <div className={`${align === "center" ? "text-center" : ""} mb-12`}>
    {eyebrow && (
      <p className="text-sm font-semibold tracking-[0.2em] uppercase text-cyan-600 mb-3">
        {eyebrow}
      </p>
    )}
    <h2 className={`text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight ${className}`}>
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
    const t = setTimeout(
      () => contRef.current?.scrollIntoView({ behavior: "smooth" }),
      200
    );
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div ref={contRef} className="min-h-screen bg-slate-50 text-slate-800">
      <Helmet>
        <title>
          Atlantis 300 Vending Touch | Purificadora de Agua 24 Horas | Darmax
        </title>
        <meta
          name="description"
          content="Conoce la máquina Vending Touch Atlantis 300 de Darmax: sistema de purificación con filtros certificados NSF, gabinete de acero inoxidable 304, pantalla touch, 4 modalidades de llenado, agua alcalina opcional y todos los requisitos para iniciar tu negocio."
        />
        <meta
          name="keywords"
          content="vending de agua, Atlantis 300, purificadora de agua 24 horas, negocio de agua, máquina expendedora de agua, Darmax Agua, agua alcalina, tinacos grado alimenticio"
        />
        <link
          rel="canonical"
          href="https://darmaxagua.com.mx/vending-info"
        />

        {/* Datos Estructurados (Schema.org) para Producto/Servicio */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "Máquina Vending Touch Atlantis 300 Darmax",
              "image": "https://darmaxagua.com.mx/img/vending/TOUCHAGUA.png",
              "description": "Máquina expendedora de agua purificada con sistema de filtros certificados NSF, gabinete de acero inoxidable 304, pantalla touch y 4 modalidades de llenado. Incluye tinaco de 2,500 L y opciones de agua alcalina.",
              "brand": {
                "@type": "Brand",
                "name": "Darmax Agua"
              },
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "MXN",
                "lowPrice": "64950",
                "highPrice": "76950",
                "offerCount": "2"
              }
            }
          `}
        </script>
      </Helmet>

      <SEO
        title="Vending de Agua Purificada 24/7 | Máquinas Rentables"
        description="Inicia tu negocio de Vending de Agua 24 horas con Darmax. Equipos automáticos de acero inoxidable, alta capacidad y múltiples formas de pago."
        keywords="vending de agua, purificadora 24 horas, negocio rentable, franquicia agua, vending machine precio"
        productData={{
          name: "Máquina Vending de Agua Purificada Darmax",
          price: "54950",
        }}
        faqData={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Máquina Vending de Agua Darmax Atlantis 300"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/95" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300 mb-5">
              Atlantis 300 · Vending Touch
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Tu Purificadora 24/7,
              <span className="text-cyan-400"> Lista para Vender.</span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed">
              Arranca tu negocio de agua con un equipo vending profesional:
              purificación certificada, gabinete de acero inoxidable 304,
              pantalla touch y sistema automático de cobro y llenado.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/configurar-maquina/Vending"
                className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-xl hover:bg-cyan-300 transition-all transform hover:scale-105"
              >
                Configurar mi Atlantis 300
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-3 rounded-full font-semibold border-2 border-slate-500 text-slate-100 hover:bg-slate-800 hover:border-slate-300 transition"
              >
                Ver Precio y Qué Incluye
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-300/80">
              Entrega estimada entre 15 y 20 días naturales a partir de la firma
              del contrato.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Highlights Section ===== */}
      <section className="bg-slate-800 py-10 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 text-white"
              >
                <div className="flex-shrink-0 bg-slate-900/60 backdrop-blur-sm p-3 rounded-xl border border-slate-700/80">
                  <h.icon className="h-7 w-7 text-cyan-400" />
                </div>
                <div>
                  <p className="font-semibold text-base">{h.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing & What's Included ===== */}
      <section
        id="pricing"
        className="py-20 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle eyebrow="Inversión y Alcance">
            Precio, Upgrades y Regalos Incluidos
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {pricingCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative rounded-3xl p-7 md:p-8 bg-white shadow-lg border ${
                  i === 0
                    ? "border-cyan-200 shadow-cyan-100"
                    : "border-slate-200/80"
                }`}
              >
                {card.badge && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 ${
                      i === 2
                        ? "bg-green-100 text-green-700"
                        : "bg-cyan-100 text-cyan-700"
                    }`}
                  >
                    {card.badge}
                  </span>
                )}
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
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 max-w-3xl mx-auto text-center text-sm text-slate-500">
            <p>
              Forma de pago: <strong>50% de anticipo</strong> y{" "}
              <strong>50% contra entrega</strong> del equipo. Si requieres
              factura, se agrega el <strong>IVA</strong> al costo.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Technical Components Section ===== */}
      <section className="py-20 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle eyebrow="Ficha Técnica">
            Componentes de Purificación y Vending
          </SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Sistema de purificación */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 rounded-3xl bg-slate-50 border border-slate-200/80 p-7 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-full bg-cyan-100 text-cyan-700">
                  <ShieldCheckIcon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Sistema de Purificación en Múltiples Etapas
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Cada etapa está diseñada para remover sedimentos, cloro,
                dureza, microorganismos y entregar agua purificada lista para
                consumo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                <ul className="space-y-2">
                  <li>• Bomba de 3/4 hp Jet en acero inoxidable 127 volts.</li>
                  <li>• Presurizador automático.</li>
                  <li>
                    • Filtro de lecho profundo: tanque 9x48 NSF con gravas,
                    arenas sílicas y zeolita certificadas.
                  </li>
                  <li>
                    • Filtro de carbón activado: tanque 9x48 NSF con carbón
                    activado certificado.
                  </li>
                  <li>
                    • Filtro suavizador: tanque 9x48 NSF con válvula manual de
                    5 pasos y resina catiónica certificada.
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li>• Portacartuchos pulidor 10” Slim certificado NSF.</li>
                  <li>
                    • Lámpara de rayos ultravioleta de 25 LPM con balastro en
                    acero inoxidable.
                  </li>
                  <li>• Generador de ozono.</li>
                  <li>• Inyector tipo ventury de 3/4”.</li>
                  <li>
                    • Tinaco grado alimenticio de 2,500 litros incluido sin
                    costo.
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Gabinete y electrónica */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-slate-900 text-slate-50 p-7 md:p-8 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-10 h-32 w-32 rounded-full bg-cyan-500/30 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 rounded-full bg-slate-800 text-cyan-300">
                    <CurrencyDollarIcon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">
                    Gabinete Vending y Electrónica
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li>• Gabinete de acero quirúrgico grado alimenticio 304.</li>
                  <li>• Marco y puerta en acero inoxidable.</li>
                  <li>• Pantalla inicial touch de 8”.</li>
                  <li>• Dispensador de tapas integrado.</li>
                  <li>• Monedero antirrobo.</li>
                  <li>• Bocina y mensajes auditivos.</li>
                  <li>• Vinil laminado contra luz UV.</li>
                  <li>• Sensores de flujo y solenoides de control.</li>
                  <li>• Sistema de verificación de fallas.</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Key Features Section (beneficios) ===== */}
      <section id="features" className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle eyebrow="Beneficios Clave">
            Diseño Profesional, Operación Eficiente
          </SectionTitle>

          <div className="space-y-16">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
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
                    <span className="p-2 bg-cyan-100 rounded-full">
                      <feature.icon className="h-6 w-6 text-cyan-700" />
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {feature.title}
                    </h3>
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
      <section className="py-20 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle eyebrow="Complementos Opcionales">
            Servicios y Accesorios para Potenciar tu Negocio
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {extras.map((extra, i) => (
              <motion.div
                key={extra.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <p className="font-semibold text-sm text-slate-900">
                  {extra.name}
                </p>
                <p className="mt-3 text-cyan-700 font-bold text-sm">
                  {extra.price}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-xs text-slate-500 flex items-center gap-2">
            <ShippingIcon className="h-4 w-4" />
            *Flete y viáticos se cotizan de acuerdo con el código postal de
            instalación.
          </p>
        </div>
      </section>

      {/* ===== Installation Requirements Section ===== */}
      <section className="py-20 md:py-24 bg-slate-900 text-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle eyebrow="Antes de Instalar" align="left" className="text-white">
            Requisitos del Local e Instalación
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
                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-cyan-500/30 blur-xl" />
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How It Works Section ===== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>De la Idea a la Realidad en 4 Pasos</SectionTitle>
          <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80"
              >
                <div className="inline-block p-4 bg-cyan-100 text-cyan-700 rounded-full mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {step.title}
                </h3>
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
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionTitle>Nuestros Equipos en Acción</SectionTitle>
        </div>
        <div className="mt-8 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 gap-6 px-6 md:px-10">
            {galleryImages.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex-shrink-0 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center"
              >
                <img
                  src={src}
                  alt={`Instalación real ${i + 1}`}
                  className="w-full h-80 rounded-2xl object-cover shadow-lg"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <section className="py-20 md:py-24 bg-white">
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
      <section className="py-20 bg-slate-900 text-slate-50">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            ¿Listo para Iniciar tu Negocio de Agua?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Da el primer paso hacia tu independencia financiera con la Atlantis
            300. Configura tu equipo ideal o contáctanos para una asesoría
            personalizada sin compromiso.
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
              className="px-8 py-3 rounded-full font-semibold bg-slate-800 hover:bg-slate-700 text-slate-50 border border-slate-600 transition"
            >
              Volver
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
