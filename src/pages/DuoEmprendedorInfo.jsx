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
  DocumentTextIcon,
  RectangleStackIcon,
  BoltIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/tridente.png";

/* Paquete real: Dúo Emprendedor Atlantis 300 + Limpieza 5 productos */
const highlights = [
  {
    icon: RectangleStackIcon,
    title: "2 Negocios en 1 Paquete",
    desc: "Agua purificada + productos de limpieza a granel",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Precio Paquete $99,900 MXN",
    desc: "Incluye Atlantis 300 y vending de 5 productos",
  },
  {
    icon: ShieldCheckIcon,
    title: "Calidad Certificada",
    desc: "Filtros y resinas con certificación NSF",
  },
  {
    icon: SparklesIcon,
    title: "Regalos Incluidos",
    desc: "Tinaco 2,500 L + instalación y capacitación",
  },
];

const features = [
  {
    icon: BeakerIcon,
    title: "Vending Touch Atlantis 300",
    description:
      "Sistema completo de purificación con bomba Jet de 3/4 hp en acero inoxidable, filtros de lecho profundo, carbón activado y suavizador 9x48 NSF, pulidor 10” Slim NSF, luz UV de 25 LPM y generador de ozono. Incluye vending touch con 4 modalidades de llenado (1, 4, 10 y 20 L), enjuague de garrafón, validador de monedas que da cambio, gabinete de acero quirúrgico 304 y tinaco de 2,500 L grado alimenticio (regalo).",
    image: "/img/vending/TOUCHAGUA.png",
  },
  {
    icon: RectangleStackIcon,
    title: "Vending 5 Productos de Limpieza",
    description:
      "Máquina Darmax Clean para cinco productos de limpieza con bombas de 1/2 hp con válvula check, gabinete de acero inoxidable con llave, mangueras y conectores, luz interna y vinil de alta calidad. Registra ventas, sensa litros y despacha 1 litro por ciclo. Acepta monedas de $1, $2, $5 y $10 pesos y da cambio, con monedero antirrobo de alta capacidad.",
    image: "/img/vending/productoslimpieza5.png",
  },
  {
    icon: CpuChipIcon,
    title: "Negocio Listo para Crecer",
    description:
      "Con este paquete puedes atender dos necesidades básicas de tu comunidad: agua purificada y productos de limpieza a granel. Aumentas el ticket promedio y creas un punto de venta recurrente con consumos frecuentes.",
    image: "/img/purificadoras/purificadora-comercial.jpg",
  },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Evaluación de Ubicación",
    desc: "Analizamos tu zona, flujo de personas y competencia para validar el potencial del Dúo Emprendedor.",
  },
  {
    icon: TruckIcon,
    title: "2. Producción e Instalación",
    desc: "Fabricamos tu Atlantis 300 y tu vending de limpieza, los enviamos e instalamos en tu local con todos los materiales necesarios.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Completa",
    desc: "Te capacitamos en operación diaria, manejo del dinero, reabastecimiento de productos, mantenimiento y buenas prácticas.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Arranque y Soporte",
    desc: "Dejas tus equipos trabajando y cuentas con nuestro soporte técnico y asesoría para seguir haciendo crecer tu negocio.",
  },
];

const faqs = [
  {
    q: "¿Qué incluye exactamente el paquete Dúo Emprendedor?",
    a: "Incluye la máquina Vending Touch Atlantis 300 con sistema de purificación completo y gabinete de acero inoxidable, más la máquina vending Darmax Clean para 5 productos de limpieza con su gabinete metálico, bombas, mangueras, conectores y sistema de cobro. Además, recibes tinaco de 2,500 L grado alimenticio, materiales de instalación, instalación y capacitación.",
  },
  {
    q: "¿Cuál es el precio y cómo se paga?",
    a: "El paquete Dúo Emprendedor tiene un precio de $99,900 MXN. La forma de pago es 50% de anticipo y 50% restante a la entrega del equipo. Si requieres factura, se maneja esquema Costo + IVA.",
  },
  {
    q: "¿Qué tiempo de entrega manejan?",
    a: "El tiempo de entrega estimado es de entre 15 y 20 días naturales a partir de la firma del contrato, ya con tu anticipo aplicado.",
  },
  {
    q: "¿Qué requisitos tiene el local para instalar este paquete?",
    a: "Necesitas un local de al menos 16 m², conexiones de luz independiente con regulador de voltaje no break, drenaje dentro del local, dos tinacos de 2,500 L o uno de 5,000 L grado alimenticio para agua cruda y un muro con medidas 80.5 x 80.5 cm a 90 cm de altura para la vending de agua.",
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

/* Pricing, extras y requisitos específicos del PDF */

const pricingCards = [
  {
    name: "Dúo Emprendedor Atlantis 300 + Limpieza 5 Productos",
    price: "$99,900 MXN",
    badge: "Paquete principal",
    description:
      "Incluye Vending Touch Atlantis 300 con sistema de purificación completo y vending de 5 productos de limpieza Darmax Clean.",
    items: [
      "Bomba Jet 3/4 hp en acero inoxidable 127 V",
      "Filtros 9x48 NSF: lecho profundo, carbón activado y suavizador",
      "Pulidor 10\" Slim NSF, lámpara UV 25 LPM y generador de ozono",
      "Despachador automático 4 modalidades: 1, 4, 10 y 20 litros con enjuague",
      "Vending limpieza con bombas 1/2 hp, gabinete de acero inoxidable y monedero antirrobo",
    ],
  },
  {
    name: "Upgrade Agua Alcalina",
    price: "+ $12,000 MXN",
    badge: "Opcional recomendado",
    description:
      "Agrega agua alcalina a tu Atlantis 300 para ofrecer dos tipos de agua y aumentar tu ticket promedio.",
    items: [
      "Filtro alcalinizador",
      "Pre-filtro pulidor",
      "Lámpara UV 16 watts",
      "Tarjeta vending para 2 tipos de agua",
    ],
  },
  {
    name: "Regalos Incluidos",
    price: "Valor +$7,500 MXN",
    badge: "Incluido en la compra",
    description:
      "Beneficios adicionales al adquirir tu paquete Dúo Emprendedor.",
    items: [
      "Tinaco grado alimenticio translúcido 2,500 L",
      "Materiales de instalación en PVC hidráulico Cédula 40",
      "Instalación profesional",
      "Capacitación al momento de la entrega",
    ],
  },
  {
    name: "Regalo Vending Limpieza",
    price: "Valor +$2,000 MXN",
    badge: "Incluido",
    description: "Complemento para tu vending de 5 productos de limpieza.",
    items: ["5 bidones de 20 L para producto (no incluye rack)"],
  },
];

const extras = [
  { name: "Trámite de aviso de funcionamiento", price: "+ $3,500 MXN" },
  { name: "Toma de pipa 2” PVC Cédula 40", price: "+ $5,500 MXN" },
  { name: "Kit de insumos anuales", price: "+ $3,900 MXN" },
  { name: "Seguro de vending", price: "+ $4,950 MXN" },
  { name: "Tinaco 5,000 L grado alimenticio translúcido", price: "+ $10,500 MXN" },
  { name: "Tinaco 2,500 L grado alimenticio translúcido", price: "+ $5,500 MXN" },
  { name: "Tinaco 1,100 L grado alimenticio translúcido", price: "+ $3,300 MXN" },
  {
    name: "Tinaco 1,100 L grado alimenticio translúcido tipo bala",
    price: "+ $3,600 MXN",
  },
  { name: "Mantenimiento anual", price: "+ $8,500 MXN" },
  { name: "Mostrador (tarja de lavado y llenado)", price: "+ $18,000 MXN" },
  { name: "Ósmosis inversa", price: "+ $28,000 MXN" },
  { name: "Automatización de ósmosis", price: "+ $9,000 MXN" },
  {
    name: "Paquete para promoción o inauguración",
    price: "+ $7,500 MXN",
  },
];

const installRequirements = [
  {
    title: "Espacio Comercial",
    desc: "Local de al menos 16 m², con buena visibilidad y flujo de personas.",
  },
  {
    title: "Instalación Eléctrica y Drenaje",
    desc: "Conexiones de luz independiente, regulador de voltaje no break, contactos y drenaje dentro del local.",
  },
  {
    title: "Almacenamiento de Agua Cruda",
    desc: "Dos tinacos grado alimenticio translúcido de 2,500 L o un tinaco de 5,000 L para agua cruda.",
  },
  {
    title: "Muro para Vending de Agua",
    desc: "Levantamiento de muro con medidas 80.5 x 80.5 cm y altura de 90 cm del suelo para la vending Atlantis 300.",
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
    <div className="px-5 md:px-6 pb-6 text-slate-600 leading-relaxed">{a}</div>
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
export default function TridenteInfo() {
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
        <title>Dúo Emprendedor Atlantis 300 + Limpieza 5 Productos | Darmax</title>
        <meta
          name="description"
          content="Paquete Dúo Emprendedor: Vending Touch Atlantis 300 + Vending 5 productos de limpieza. Sistema completo de purificación, vending de limpieza a granel, regalos, extras y requisitos de instalación."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Dúo Emprendedor Atlantis 300 + Limpieza 5 productos"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/95" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center min-h-[85vh] text-center text-white pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-teal-300 rounded-full text-sm font-semibold">
              Paquete Dúo Emprendedor · Agua + Limpieza
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Atlantis 300 + Limpieza 5 Productos,{" "}
              <span className="text-teal-400">2 Negocios en 1 Inversión</span>.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-relaxed">
              Combina una vending de agua purificada de alto rendimiento con una
              vending de productos de limpieza a granel. Más ingresos, más
              clientes y un solo paquete listo para instalar.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/configurar-maquina/Tridente"
                className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-teal-400 shadow-lg hover:bg-teal-300 transition-all transform hover:scale-105"
              >
                Configurar mi Paquete
              </Link>
              <Link
                to="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 rounded-full font-semibold border-2 border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-slate-800 transition"
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
                  <h.icon className="h-7 w-7 text-teal-400" />
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
          <SectionTitle>Inversión, Agua Alcalina y Regalos</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {pricingCards.map((card, i) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`relative rounded-3xl p-7 md:p-8 bg-white shadow-lg border ${
                  i === 0
                    ? "border-teal-200 shadow-teal-100"
                    : "border-slate-200/80"
                }`}
              >
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 ${
                    i === 2 || i === 3
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-teal-100 text-teal-700"
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
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-teal-500" />
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
          <SectionTitle>Componentes de Purificación y Vending</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Purificación Atlantis 300 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 rounded-3xl bg-slate-50 border border-slate-200/80 p-7 md:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-full bg-teal-100 text-teal-700">
                  <ShieldCheckIcon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Sistema de Purificación Atlantis 300
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Basado en tanques y medios filtrantes con certificación NSF para
                garantizar la calidad del agua.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                <ul className="space-y-2">
                  <li>• Bomba de 3/4 hp Jet en acero inoxidable 127 V.</li>
                  <li>• Presurizador automático.</li>
                  <li>
                    • Filtro de lecho profundo 9x48 NSF con gravas, arenas
                    sílicas y zeolita certificadas.
                  </li>
                  <li>
                    • Filtro de carbón activado 9x48 NSF con carbón certificado
                    y válvula manual de 3 vías.
                  </li>
                  <li>
                    • Filtro suavizador 9x48 NSF con válvula de 5 pasos, tanque
                    de salmuera y resina catiónica certificada.
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li>• Portacartuchos pulidor 10\" Slim certificado NSF.</li>
                  <li>
                    • Lámpara de rayos ultravioleta de 25 LPM con balastro en
                    acero inoxidable.
                  </li>
                  <li>• Generador de ozono.</li>
                  <li>• Inyector tipo ventury de 3/4\".</li>
                  <li>
                    • Despachador automático de agua purificada para 4
                    modalidades con validador de monedas que da cambio y
                    enjuaga garrafón.
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Vending limpieza */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-slate-900 text-slate-50 p-7 md:p-8 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-10 h-32 w-32 rounded-full bg-teal-500/30 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 rounded-full bg-slate-800 text-teal-300">
                    <ArchiveBoxIcon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">
                    Vending Gabinete de Acero Inoxidable · Limpieza
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li>• Registra ventas y sensa litros.</li>
                  <li>• Llenado estándar de 1 litro por operación.</li>
                  <li>• Configuración de precios de llenado.</li>
                  <li>
                    • Acepta monedas de $1, $2, $5 y $10 pesos (da cambio).
                  </li>
                  <li>• Monedero antirrobo.</li>
                  <li>• Luz interna y vinil exterior Darmax Clean.</li>
                  <li>
                    • Bombas de 1/2 hp con válvula check, mangueras, conectores
                    y conexiones listas para instalación.
                  </li>
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
              Una Oferta de Servicios sin Competencia
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Dos equipos pensados para trabajar juntos y multiplicar tus
              ingresos desde el mismo punto de venta.
            </p>
          </div>

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
                    <span className="p-2 bg-teal-100 rounded-full">
                      <feature.icon className="h-6 w-6 text-teal-700" />
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
                <p className="mt-3 text-teal-700 font-bold text-sm">
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
            ¿Qué requieres para instalar tu Dúo Emprendedor?
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
                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-teal-500/30 blur-xl" />
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
          <SectionTitle>Tu Estación Multiservicio, Lista para Operar</SectionTitle>
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
          <SectionTitle className="px-6">
            Proyectos y Diseños de Instalación
          </SectionTitle>
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
                  alt={`Proyecto Dúo Emprendedor ${i + 1}`}
                  className="w-full h-80 rounded-2xl object-cover shadow-lg"
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
            Una Solución, Múltiples Fuentes de Ingreso
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Aprovecha el poder del Dúo Emprendedor: agua purificada y productos
            de limpieza en un solo punto. Contáctanos y diseña tu estación
            multiservicio con Darmax.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/configurar-maquina/Tridente"
              className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-teal-400 shadow-lg hover:bg-teal-300 transition-all transform hover:scale-105"
            >
              Configurar mi Paquete
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
