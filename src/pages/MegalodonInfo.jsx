import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  SparklesIcon,
  CircleStackIcon,
  CpuChipIcon,
  WrenchIcon,
  BeakerIcon,
  ArchiveBoxIcon,
  RectangleStackIcon,
  UserGroupIcon,
  CubeIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* --- Identity & Style (Megalodón: Petroleum Blue to Deep Navy) --- */
const BRAND = {
  petrol: "#2f7384",
  darkTeal: "#245f73",
  navy: "#17355b",
  petrolDark: "#1e5670",
  lightBlue: "#e0f2fe",
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data: 4 Megalodón Configurations --- */
const megalodonBundles = [
  {
    id: "MegalodonTradicional",
    name: "Megalodón Tradicional 8",
    tagline: "Vending Tradicional Atlantis 300 Max + Mostrador + Clean 8",
    price: "$127,900",
    gradient: "from-[#2f7384] to-[#245f73]",
    images: [
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_hbnrfy.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400526/mostrador_djpelm.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400516/8_productos_vfaf1e.png"
    ],
    specs: [
      "Atlantis 300 Tradicional",
      "Mostrador Neptuno Inox 304",
      "Vending Clean 8 Productos",
      "Bomba Jet 1.5 HP Inox",
      "Interfaz de Botones Físicos",
      "Filtración NSF 10x34",
      "Tinaco 2,500L + 8 Bidones Regalo",
    ]
  },
  {
    id: "MegalodonTradicionalMax",
    name: "Megalodón Tradicional Max 8",
    tagline: "Vending Tradicional Atlantis 300 Max + Mostrador + Clean 8",
    price: "$154,950",
    gradient: "from-[#245f73] to-[#1e5670]",
    images: [
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_max_e2obmt.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776403043/mostrador_osmosis_jqr3cb.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400516/8_productos_vfaf1e.png"
    ],
    specs: [
      "Atlantis 300 Max + Ósmosis",
      "Mostrador Neptuno Inox 304",
      "Vending Clean 8 Productos",
      "Eliminación de Sarro y Sales",
      "Producción de Alta Demanda",
      "Ideal para Zonas Críticas",
      "Instalación Premium Incluida",
    ]
  },
  {
    id: "MegalodonTouch",
    name: "Megalodón Touch Pro 8",
    tagline: "Vending Touch Atlantis 300 Max + Mostrador + Clean 8",
    price: "$137,900",
    gradient: "from-[#1e5670] to-[#17355b]",
    images: [
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776394713/touch_atlantis_oh7wui.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400526/mostrador_djpelm.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400516/8_productos_vfaf1e.png"
    ],
    specs: [
      "Atlantis 300 Touch Max (8\")",
      "Mostrador Neptuno Inox 304",
      "Vending Clean 8 Productos",
      "Sensado Digital de Precisión",
      "Audio Guía e Interfaz Color",
      "Control de Ventas Digital",
      "Máximo Impacto Visual",
    ]
  },
  {
    id: "MegalodonTouchMax",
    name: "Megalodón Touch Max 8",
    tagline: "Vending Touch Atlantis 300 Max + Mostrador + Clean 8",
    price: "$164,950",
    gradient: "from-[#17355b] via-[#245f73] to-[#2f7384]",
    images: [
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776394713/touch_atlantis_max_q41zpd.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776403043/mostrador_osmosis_jqr3cb.png",
      "https://res.cloudinary.com/defkuaytw/image/upload/v1776400516/8_productos_vfaf1e.png"
    ],
    specs: [
      "Atlantis 300 Touch + Ósmosis",
      "Mostrador Neptuno Inox 304",
      "Vending Clean 8 Productos",
      "La Estación de Mayor Tráfico",
      "Automatización Inteligente",
      "Pureza Premium Garantizada",
      "El ROI más alto de la línea",
    ]
  },
];

const extras = [
  { name: "Upgrade Agua Alcalina", price: "$12,000 MXN", desc: "Doble tipo de agua en tu estación de ultra flujo." },
  { name: "Seguro de Vending Anual", price: "$10,500 MXN", desc: "Protección integral para los tres módulos blindados." },
  { name: "Aviso de Funcionamiento", price: "$3,500 MXN", desc: "Gestoría ante COFEPRIS / Salubridad." },
  { name: "Mantenimiento Anual", price: "$15,000 MXN", desc: "Servicio preventivo para estación de alta demanda." },
];

const sharedEngineering = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Planta de Ultra Capacidad", desc: "Equipada con tanques NSF de gran volumen y bombas Jet de 1.5 HP para flujo masivo." },
      { name: "Mostrador Sanitario Neptuno", desc: "Mesa mixta de acero inoxidable 304 con tarja integrada para lavado y llenado doble." },
      { name: "Sistemas de Desinfección", desc: "Lámparas UV de alto flujo (30 LPM) y generadores de ozono industriales." },
    ]
  },
  {
    category: "Vending Clean 8",
    items: [
      { name: "8 Canales de Despacho", desc: "Ocho bombas independientes de 1/2 HP con válvulas check para un portafolio completo." },
      { name: "Cobro Centralizado", desc: "Sistemas de monedero electrónico blindados con alta capacidad de cambio automático." },
      { name: "Gestión Digital", desc: "Registro digital inalterable de litros vendidos por cada uno de los 8 productos." },
    ]
  }
];

const requirements = [
  { title: "Espacio", desc: "Área sugerida de 35 m² a 45 m²." },
  { title: "Infraestructura", desc: "Muro de 96x58 cm a 75 cm del suelo." },
  { title: "Hidráulico", desc: "Drenaje de 2\" y 2 tinacos de 5,000L." },
  { title: "Eléctrico", desc: "Líneas 127V independientes con tierra." },
];

const faqs = [
  {
    q: "¿Por qué el Megalodón es para zonas de tráfico masivo?",
    a: "Por su capacidad de despacho simultáneo en agua y sus 8 canales de limpieza, lo que permite atender a múltiples clientes sin esperas, maximizando la facturación.",
  },
  {
    q: "¿Qué incluye el kit de regalo?",
    a: "Recibes un tinaco de 2,500 litros grado alimenticio y 8 bidones de 20 litros para los productos de limpieza.",
  },
  {
    q: "¿Incluyen instalación y capacitación?",
    a: "Sí, el paquete Megalodón incluye la instalación técnica profesional y la capacitación completa para operar la estación más potente de Darmax.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-blue-100" : "text-[#2f7384]";
  const titleColor = light ? "text-white" : "text-slate-900";

  return (
    <div className={`mb-12 sm:mb-20 ${alignClass}`}>
      {eyebrow && (
        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-4 block ${eyebrowColor}`}>
          {String(eyebrow)}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter leading-tight ${titleColor}`}>
        {String(title)} {highlight && <br className="hidden sm:block" />}
        {highlight && (
          <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#2f7384] to-[#1e5670]">
            {String(highlight)}
          </span>
        )}
      </h2>
    </div>
  );
}

const BundleCard = ({ bundle, index }) => {
  const [activeImg, setActiveImg] = useState(0);
  
  const nextImg = () => setActiveImg((prev) => (prev + 1) % bundle.images.length);
  const prevImg = () => setActiveImg((prev) => (prev - 1 + bundle.images.length) % bundle.images.length);

  return (
    <motion.div
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={fadeUp}
      className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden group`}
    >
      {/* Carousel Container */}
      <div className="w-full lg:w-1/2 aspect-video bg-[#f8fafc] relative overflow-hidden flex items-center justify-center">
        <div className={`absolute inset-0 bg-gradient-to-br ${bundle.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-700`} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center p-8 sm:p-12"
          >
            <img
              src={bundle.images[activeImg]}
              className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl"
              alt={`${bundle.name} - ${activeImg}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Custom Controls con Colores de Identidad */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
          <button 
            onClick={prevImg} 
            className="p-4 rounded-full bg-white/90 shadow-xl pointer-events-auto hover:bg-[#245f73] hover:text-white transition-all transform hover:scale-110 active:scale-95 group/btn"
          >
            <ChevronDownIcon className="h-6 w-6 rotate-90 text-slate-400 group-hover/btn:text-white" />
          </button>
          <button 
            onClick={nextImg} 
            className="p-4 rounded-full bg-white/90 shadow-xl pointer-events-auto hover:bg-[#245f73] hover:text-white transition-all transform hover:scale-110 active:scale-95 group/btn"
          >
            <ChevronDownIcon className="h-6 w-6 -rotate-90 text-slate-400 group-hover/btn:text-white" />
          </button>
        </div>

        {/* Indicators estilizados */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {bundle.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${activeImg === i ? "w-12 bg-[#245f73]" : "w-2.5 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      </div>

      {/* Info Container */}
      <div className="w-full lg:w-1/2 p-10 sm:p-14 flex flex-col h-full">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#245f73] mb-2">{bundle.tagline}</span>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-6">{bundle.name}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
           {bundle.specs.map((s, idx) => (
             <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
               <CheckIcon className="h-4 w-4 text-[#2f7384] mt-0.5 shrink-0" />
               <span>{String(s)}</span>
             </div>
           ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inversión Desde</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{bundle.price}</span>
          </div>
          <Link
            to="/configurar-maquina/Megalodon"
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#2f7384] to-[#17355b] text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all text-xs uppercase tracking-widest text-center"
          >
            Seleccionar Megalodón
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-blue-900/5">
    <table className="w-full text-left border-collapse min-w-[900px]">
      <thead>
        <tr className="bg-[#17355b] text-white">
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Atributo</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center">Tradicional 8</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center text-blue-300">Tradicional Max</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center">Touch Pro 8</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest text-center text-blue-300">Touch Max 8</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium">
        {[
          { label: "Canales de Limpieza", vals: ["8", "8", "8", "8"] },
          { label: "Ósmosis Inversa Industrial", vals: [false, true, false, true] },
          { label: "Interfaz de Agua", vals: ["Botones", "Botones", "Touch 8\"", "Touch 8\""] },
          { label: "Sensado de Precisión", vals: ["Temporizado", "Digital", "Digital", "Digital"] },
          { label: "Capacidad Producción", vals: ["Industrial", "Máxima", "Industrial", "Máxima"] },
          { label: "Inversión Sugerida", vals: ["$127,900", "$154,950", "$137,900", "$164,950"], bold: true },
        ].map((row, i) => (
          <tr key={i} className="hover:bg-blue-50/20 transition-colors">
            <td className="p-7 text-slate-900 font-black text-xs uppercase tracking-tight">{row.label}</td>
            {row.vals.map((v, idx) => (
              <td key={idx} className={`p-7 text-sm text-center ${row.bold ? "font-black text-slate-900" : "text-slate-500"}`}>
                {typeof v === "boolean" ? (
                  v ? <CheckIcon className="h-6 w-6 text-blue-600 mx-auto" /> : <XMarkIcon className="h-6 w-6 text-slate-200 mx-auto" />
                ) : v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function MegalodonInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#2f7384] selection:text-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Estación Megalodón | Vending de Ultra Capacidad | Darmax</title>
        <meta name="description" content="Domina zonas de alto tráfico con la Estación Megalodón. Agua purificada, mostrador profesional y recarga de 8 productos de limpieza." />
      </Helmet>

      <SEO 
        title="Megalodón - El Paquete Más Potente de México"
        description="Selecciona la ultra capacidad para tu negocio. Purificación Atlantis Max y Vending Clean de 8 productos en una estación total."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/Iniciatunegocio/fachadacalle.jpg"
            alt="Megalodón Darmax Ultra Tráfico"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#17355b]/80 via-slate-900/60 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2f7384]/20 via-transparent to-[#1e5670]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-blue-500/10 text-[#2f7384] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-500/20 backdrop-blur-sm">
              Ultra-High Capacity: Megalodón Edition
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Domina puntos <br />
              de alto <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#2f7384] to-[#1e5670]">tráfico.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              La Estación Megalodón es la herramienta definitiva para conquistar ubicaciones estratégicas. Agua purificada, lavado profesional Neptuno y 8 canales de limpieza a granel.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Megalodon"
                className="px-12 py-5 bg-gradient-to-r from-[#2f7384] to-[#245f73] hover:shadow-[#2f7384]/20 text-white font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Estación
              </Link>
              <button
                onClick={() => document.getElementById("modelos").scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Ver Combinaciones
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN MODELOS (HORIZONTAL ZIGZAG CON CARUSEL) */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Gama de Potencia"
            title="Cuatro variaciones"
            highlight="de ultra capacidad."
          />
          
          <div className="space-y-12 sm:space-y-20">
            {megalodonBundles.map((m, i) => (
              <BundleCard key={m.id} bundle={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN TABLA COMPARATIVA */}
      <section className="py-24 sm:py-32 bg-[#f1f5f9]/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Transparencia Técnica"
            title="Diferencias que"
            highlight="impulsan tu éxito."
          />
          <ComparisonTable />
        </div>
      </section>

      {/* SECCIÓN INGENIERÍA ULTRA */}
      <section id="tecnico" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Integración Industrial"
            title="Ingeniería total"
            highlight="en una sola unidad."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {sharedEngineering.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#17355b] flex items-center justify-center text-white shadow-lg">
                    {i === 0 ? <WrenchIcon className="w-6 h-6" /> : <ArchiveBoxIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-10 rounded-[2rem] bg-white border border-slate-100 hover:border-[#2f7384] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-[#245f73] transition-colors">{String(item.name)}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{String(item.desc)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN EXTRAS & UPGRADES */}
      <section className="py-24 sm:py-32 bg-[#F8FAFC] border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Personalización"
            title="Completa tu"
            highlight="estación Megalodón."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {extras.map((extra, i) => (
              <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
                <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2">{extra.name}</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{extra.desc}</p>
                <div className="text-xl font-black text-[#2f7384]">{extra.price}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-3 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
            <p className="font-medium">
              <strong>Nota importante:</strong> El paquete incluye bidones iniciales para limpieza, pero no incluye racks metálicos para los mismos ni envases para el cliente final.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN REQUERIMIENTOS & PAGO */}
      <section className="py-24 sm:py-32 bg-[#17355b] relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(47,115,132,0.2),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-2/5 text-left">
              <SectionTitle 
                align="left"
                light
                eyebrow="Inversión Segura"
                title="Términos y"
                highlight="requerimientos."
              />
              <p className="text-blue-100/70 text-lg mb-12 leading-relaxed font-medium">
                La Estación Megalodón es un proyecto de alto nivel. Te acompañamos en cada etapa, desde la preparación del local hasta la capacitación de tu personal.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#7DD3FC] transition-colors">
                     <CreditCardIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-blue-200">Forma de Pago</h5>
                     <p className="font-bold text-sm">50% Anticipo / 50% Contra Entrega</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#7DD3FC] transition-colors">
                     <ClockIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-blue-200">Tiempo de Entrega</h5>
                     <p className="font-bold text-sm">15 a 20 Días Naturales</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map((r) => (
                <div key={r.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-700">
                  <h5 className="text-[#2f7384] font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
                  <p className="text-white text-xl font-bold tracking-tight leading-snug">{String(r.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN FAQ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Resolviendo Dudas"
            title="Preguntas"
            highlight="frecuentes."
          />
          <div className="space-y-5 border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-xl shadow-blue-900/5">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-slate-50 last:border-none">
                <summary className="cursor-pointer list-none p-10 font-black text-slate-800 flex items-center justify-between hover:bg-[#f1f5f9] transition-colors uppercase tracking-tight text-sm">
                  {String(f.q)}
                  <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform duration-500">
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </summary>
                <div className="px-10 pb-10 text-slate-500 text-base leading-relaxed font-medium">
                  {String(f.a)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-40 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <img src="/img/Iniciatunegocio/fachadacalle.jpg" alt="Darmax Megalodón" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-tight mb-10">
            Domina el mercado <br />
            <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#2f7384] to-[#1e5670]">con la Estación Total.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Agua, mostrador y limpieza: la combinación más potente para dominar tu mercado. Inicia hoy con el respaldo tecnológico de Darmax.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-maquina/Megalodon"
              className="px-14 py-7 bg-gradient-to-r from-[#2f7384] to-[#245f73] text-white font-black rounded-2xl shadow-2xl transition-all transform hover:scale-110 uppercase tracking-widest text-sm"
            >
              Configurar mi Megalodón
            </Link>
            <Link
              to="/contacto"
              className="px-14 py-7 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-sm"
            >
              Hablar con Ventas
            </Link>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-20 text-slate-500 hover:text-white transition-colors flex items-center gap-3 mx-auto font-black uppercase tracking-[0.4em] text-[10px]"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" /> Volver atrás
          </button>
        </div>
      </section>
    </div>
  );
}
