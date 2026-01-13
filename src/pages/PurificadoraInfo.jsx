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
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

/* --- Data --- */
const HERO_IMG = "/img/vending/mostrador.jpg";

const highlights = [
  {
    icon: ArrowTrendingUpIcon,
    title: "Hasta 3,000 L/Día",
    desc: "Capacidad de producción industrial (según configuración)",
  },
  {
    icon: ShieldCheckIcon,
    title: "Agua 100% Pura",
    desc: "Filtración multi-etapas y desinfección UV + ozono",
  },
  {
    icon: BeakerIcon,
    title: "Acero Inoxidable 304",
    desc: "Máxima higiene y grado alimenticio en la tarja",
  },
  {
    icon: ClockIcon,
    title: "Operación Continua",
    desc: "Equipos diseñados para trabajar 24/7",
  },
];

const features = [
  {
    icon: CircleStackIcon,
    title: "Filtración Multi-Etapas de Alta Eficiencia",
    description:
      "El sistema Mostrador integra lecho profundo, carbón activado y suavizador con resina catiónica certificada NSF, eliminando sedimentos, cloro, dureza, sabores y olores para obtener una base de agua perfecta.",
    image: "/img/purificadora/filtrado.png",
  },
  {
    icon: SunIcon,
    title: "Desinfección Avanzada con UV y Ozono",
    description:
      "Cuenta con lámpara de luz ultravioleta de 30 LPM en acero inoxidable y generador de ozono con inyector tipo ventury, asegurando la inocuidad microbiológica del agua hasta el momento del llenado.",
    image: "/img/purificadora/uv.png",
  },
  {
    icon: CubeTransparentIcon,
    title: "Mostrador Sanitario para Lavado y Llenado",
    description:
      "Incluye tarja de acero inoxidable con mesa mixta para lavado interior de un garrafón, lavado exterior para dos garrafones y llenado simultáneo de dos garrafones, todo en una sola estación compacta.",
    image: "/img/purificadora/tanque.png",
  },
];

const processSteps = [
  {
    icon: MapPinIcon,
    title: "1. Diseño y Consultoría",
    desc: "Analizamos tu espacio, volumen de venta y proyecciones para recomendarte la configuración ideal de planta y mostrador.",
  },
  {
    icon: TruckIcon,
    title: "2. Instalación y Puesta en Marcha",
    desc: "Nuestro equipo instala la línea de purificación, la tarja Mostrador, las conexiones hidráulicas y realiza pruebas de funcionamiento.",
  },
  {
    icon: AcademicCapIcon,
    title: "3. Capacitación Técnica",
    desc: "Te capacitamos en operación, lavado de garrafones, control de calidad, bitácoras y mantenimiento preventivo.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "4. Soporte y Consumibles",
    desc: "Te acompañamos con soporte técnico post-venta y suministro de insumos, cartuchos, lámparas y refacciones.",
  },
];

const faqs = [
  {
    q: "¿Qué espacio se requiere para un Mostrador Darmax?",
    a: "Para el paquete con Mostrador y opción de vending se recomienda un local de entre 30 m² y 40 m², con buena visibilidad y flujo de personas. En función de tu proyecto ajustamos la distribución y el equipo necesario.",
  },
  {
    q: "¿Qué incluye el sistema de purificación del Mostrador?",
    a: "Incluye bomba Jet de 1.5 hp en acero inoxidable 127 volts, presurizador automático, filtro de lecho profundo 10x54 NSF, filtro de carbón activado 10x54 NSF, filtro suavizador 10x54 NSF con tanque de salmuera y resina catiónica certificada, portacartuchos pulidor 10\" Slim NSF, lámpara UV de 30 LPM en acero inoxidable, generador de ozono y ventury de 3/4\".",
  },
  {
    q: "¿Cómo son los pagos y cuánto tarda la entrega?",
    a: "El esquema es 50% de anticipo y 50% restante a la entrega del equipo. Si requieres factura, se suma el IVA al costo. El tiempo de entrega es de entre 15 y 20 días naturales a partir de la firma del contrato.",
  },
  {
    q: "¿Qué incluye la garantía de Darmax?",
    a: "Nuestra garantía cubre defectos de fabricación en los componentes clave del sistema. Además, cuentas con instalación, capacitación y soporte técnico para resolver cualquier situación durante la operación.",
  },
];

const galleryImages = [
  "/img/trabajos/trabajos1.jpg",
  "/img/trabajos/trabajos3.jpg",
  "/img/trabajos/trabajos6.jpg",
  "/img/trabajos/trabajos7.jpg",
  "/img/purificadoras/purificadora-negocio.jpeg",
  "/img/purificadoras/purificadora-comercial.jpg",
];

/* --- Nuevas secciones: precios, extras, requisitos --- */

const pricingCards = [
  {
    name: "Mostrador de Lavado y Llenado",
    price: "$52,950 MXN",
    badge: "Equipo principal",
    description:
      "Estación completa para lavado interior y exterior de garrafones y llenado doble, con sistema de purificación multi-etapas.",
    items: [
      "Bomba Jet de 1.5 hp en acero inoxidable 127 V",
      "Presurizador automático",
      "Filtros de lecho profundo, carbón activado y suavizador 10x54 NSF",
      "Portacartuchos pulidor 10\" Slim NSF",
      "Lámpara UV 30 LPM y generador de ozono con ventury",
    ],
  },
  {
    name: "Módulo de Ósmosis Inversa",
    price: "+ $28,000 MXN",
    badge: "Upgrade opcional",
    description:
      "Ideal para zonas con agua de alta mineralización o cuando buscas una pureza aún más exigente.",
    items: [
      "Equipo de ósmosis inversa para refinar la calidad del agua",
      "Integración con la línea de purificación existente",
      "Aumenta la percepción de valor de tu marca de agua",
    ],
  },
  {
    name: "Módulo de Agua Alcalina",
    price: "+ $12,000 MXN",
    badge: "Producto premium",
    description:
      "Ofrece una segunda línea de agua alcalina para diferenciar tu negocio y aumentar el ticket promedio.",
    items: [
      "Filtro alcalinizador",
      "Pre-filtro pulidor",
      "Lámpara UV 16 watts",
      "Tarjeta vending para 2 tipos de agua",
    ],
  },
  {
    name: "Regalos Incluidos",
    price: "Valor +$5,500 MXN",
    badge: "Incluido en la compra",
    description:
      "Todo lo que necesitas para arrancar tu planta con el Mostrador Darmax.",
    items: [
      "Tinaco grado alimenticio translúcido de 2,500 litros",
      "Materiales de instalación en PVC hidráulico Cédula 40",
      "Instalación profesional",
      "Capacitación en sitio al momento de la entrega",
    ],
  },
];

const extras = [
  { name: "Vending tradicional", price: "+ $23,000 MXN" },
  { name: "Vending touch", price: "+ $33,000 MXN" },
  { name: "Trámite de aviso de funcionamiento", price: "+ $3,500 MXN" },
  { name: "Seguro de vending", price: "+ $4,950 MXN" },
  {
    name: 'Toma de pipa 2" PVC Cédula 40',
    price: "+ $5,500 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 5,000 L",
    price: "+ $10,500 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 2,500 L",
    price: "+ $5,500 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 1,100 L",
    price: "+ $3,300 MXN",
  },
  {
    name: "Tinaco grado alimenticio translúcido 1,100 L tipo bala",
    price: "+ $3,600 MXN",
  },
  { name: "Mantenimiento anual", price: "+ $8,500 MXN" },
  { name: "Ósmosis inversa (equipo adicional)", price: "+ $28,000 MXN" },
  { name: "Automatización de ósmosis", price: "+ $9,000 MXN" },
  {
    name: "Kit de insumos anuales",
    price: "+ $6,900 MXN",
  },
  {
    name: "Paquete para promoción o inauguración",
    price: "+ $7,500 MXN",
  },
];

const installRequirements = [
  {
    title: "Espacio Comercial",
    desc: "Local de entre 30 m² y 40 m², con buena visibilidad y flujo de personas.",
  },
  {
    title: "Instalación Eléctrica",
    desc: "Conexiones de luz independientes, regulador de voltaje no break, contactos y drenaje dentro del local.",
  },
  {
    title: "Almacenamiento de Agua Cruda",
    desc: "Dos tinacos grado alimenticio translúcidos de 5,500 litros para agua cruda (según ficha técnica).",
  },
  {
    title: "Muro para Vending (si agregas módulo)",
    desc: "Levantamiento de muro con medidas 80.5 x 80.5 cm y altura de 90 cm al suelo para la máquina vending.",
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
export default function PurificadoraInfo() {
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
        <title>Mostrador Purificadora de Agua | Planta Darmax</title>
        <meta
          name="description"
          content="Configura tu planta purificadora con Mostrador Darmax: sistema completo de filtración, tarja de acero inoxidable para lavado y llenado de garrafones, ósmosis inversa y agua alcalina opcional."
        />
      </Helmet>

      {/* ===== Hero Section ===== */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Planta purificadora de agua Darmax Mostrador"
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
            <span className="inline-block px-4 py-1.5 mb-4 bg-white/10 text-cyan-300 rounded-full text-sm font-semibold">
              Mostrador de Lavado y Llenado · Planta Purificadora
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Conquista el Mercado del Agua{" "}
              <span className="text-cyan-400">con tu Propia Planta</span>.
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
              Te ofrecemos la tecnología, la capacitación y el soporte para que
              produzcas y llenes tus propios garrafones con un mostrador
              profesional de acero inoxidable.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/configurar-maquina/Purificadora"
                className="px-8 py-3 rounded-full font-semibold text-slate-900 bg-cyan-400 shadow-lg hover:bg-cyan-300 transition-all transform hover:scale-105"
              >
                Configurar mi Planta
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
                  <h.icon className="h-7 w-7 text-cyan-400" />
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
                    ? "border-cyan-200 shadow-cyan-100"
                    : "border-slate-200/80"
                }`}
              >
                {card.badge && (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-4 ${
                      i === 3
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

          <div className="mt-8 max-w-3xl mx-auto text-center text-sm text-slate-500">
            <p>
              Forma de pago: <strong>50% de anticipo</strong> y{" "}
              <strong>50% restante a la entrega</strong> del equipo. Si
              requieres factura, se aplica <strong>Costo + IVA</strong>.
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
          <SectionTitle>Componentes de la Planta y Mostrador</SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Purificación */}
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
                  Sistema de Purificación Multi-Etapas
                </h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Basado en equipos certificados NSF para ofrecer agua de alta
                calidad lista para envasar.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
                <ul className="space-y-2">
                  <li>• Bomba de 1.5 hp Jet en acero inoxidable 127 volts.</li>
                  <li>• Presurizador automático.</li>
                  <li>
                    • Filtro de lecho profundo: tanque 10x54 NSF con gravas,
                    arenas sílicas y zeolita.
                  </li>
                  <li>
                    • Filtro de carbón activado: tanque 10x54 NSF con carbón
                    activado certificado.
                  </li>
                  <li>
                    • Filtro suavizador: tanque 10x54 NSF con válvula manual de
                    5 pasos y resina catiónica certificada (con tanque de
                    salmuera).
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li>• Portacartuchos pulidor 10\" Slim certificado NSF.</li>
                  <li>
                    • Lámpara de rayos ultravioleta de 30 LPM con balastro en
                    acero inoxidable.
                  </li>
                  <li>• Generador de ozono.</li>
                  <li>• Inyector tipo ventury de 3/4\".</li>
                  <li>
                    • Tinaco grado alimenticio de 2,500 litros incluido como
                    regalo.
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Tarja Mostrador */}
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
                    <BeakerIcon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold">
                    Características del Mostrador y Tarja
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-200/90">
                  <li>
                    • Mesa mixta para lavado interior de un garrafón, lavado
                    exterior para dos garrafones y llenado de dos garrafones.
                  </li>
                  <li>• Tarja de acero inoxidable grado alimenticio.</li>
                  <li>
                    • Charola de lavado interior fija para un solo garrafón.
                  </li>
                  <li>• Tubería en PVC Cédula 40.</li>
                  <li>• Bomba de 1/2 hp dedicada al sistema de lavados.</li>
                  <li>
                    • Dimensiones aproximadas del módulo: 170 cm de frente x 160
                    cm de alto x 50 cm de fondo.
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
              Tecnología Superior para Agua Perfecta
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Cada etapa del proceso está diseñada para cumplir con los más
              altos estándares de calidad y pureza.
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
                    <span className="p-2 bg-cyan-100 rounded-full">
                      <feature.icon className="h-6 w-6 text-cyan-700" />
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
            ¿Qué requieres para instalar tu Planta?
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
          <SectionTitle className="px-6">
            Nuestras Plantas en Operación
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
                  alt={`Instalación real ${i + 1}`}
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
          <SectionTitle>Resolvemos tus Dudas</SectionTitle>
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
            Emprende con un Producto Esencial
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            El agua purificada es un negocio noble y de alta demanda. Contáctanos
            hoy y da el primer paso para construir tu propia marca de agua con
            tu planta y mostrador Darmax.
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
