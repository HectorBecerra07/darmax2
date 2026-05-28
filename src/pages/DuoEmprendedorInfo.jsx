import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* --- Identity & Style (Dúo Identity: Verde Menta to Teal) --- */
const BRAND = {
  mint: "#8fd8bc",
  teal: "#73cdbd",
  darkTeal: "#0d2e28",
  softTeal: "#f0fdfa",
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data --- */
const duoModels = [
  {
    id: "DuoTradicional",
    name: "Dúo Emprendedor Tradicional",
    tagline: "El Combo de Inicio",
    price: "$89,900",
    gradient: "from-[#8fd8bc] to-[#73cdbd]",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/tradicional_atlantis_max_umqitz.png", // Usar imagen de Atlantis como ref
    specs: [
      "Atlantis 300 Tradicional (Agua)",
      "Vending Clean 5 Productos (Limpieza)",
      "Purificación Industrial NSF",
      "Interfaz de Botones Físicos",
      "Monederos que dan cambio",
      "Gabinete Inox 304 Blindado",
      "Tinaco 2,500L de Regalo",
    ]
  },
  {
    id: "DuoTouchMax",
    name: "Dúo Emprendedor Touch Max",
    tagline: "Tecnología de Punta",
    price: "$127,900",
    gradient: "from-[#73cdbd] to-[#3ca794]",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1779689000/touch_atlantis_max_a2hi0p.png",
    specs: [
      "Atlantis 300 Touch + Ósmosis Inversa",
      "Vending Clean 5 Productos (Limpieza)",
      "Pantalla Touch Interactiva 8\"",
      "Purificación Grado Quirúrgico",
      "Audio Guía Integral",
      "Máximo Portafolio de Ventas",
      "La mejor inversión ROI 24/7",
    ]
  },
];

const extras = [
  { name: "Upgrade Agua Alcalina", price: "$12,000 MXN", desc: "Doble tipo de agua (Natural + Alcalina) en Atlantis." },
  { name: "Seguro de Vending Anual", price: "$8,500 MXN", desc: "Protección total para ambos equipos contra robo." },
  { name: "Aviso de Funcionamiento", price: "$3,500 MXN", desc: "Trámite de alta ante COFEPRIS / Salubridad." },
  { name: "Kit Insumos Anuales", price: "$7,800 MXN", desc: "Repuestos para sistema de agua y limpieza." },
  { name: "Mantenimiento Anual", price: "$12,500 MXN", desc: "Servicio preventivo para ambos módulos." },
];

const commonComponents = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Filtración Especializada", desc: "Zeolita, carbón activado y resina catiónica en tanques NSF." },
      { name: "Bomba Jet Inox", desc: "Motor de alta eficiencia para flujo constante de agua purificada." },
      { name: "Barrera Bactericida", desc: "Lámpara de luz UV y Generador de Ozono por Ventury." },
      { name: "Gabinete Inox 304", desc: "Estructura blindada resistente a la intemperie." },
    ]
  },
  {
    category: "Módulo Clean",
    items: [
      { name: "Dosificación Exacta", desc: "Sensores de alta precisión para 1 litro exacto por ciclo." },
      { name: "Bombas 1/2 HP Independientes", desc: "Una bomba por cada uno de los 5 canales de limpieza." },
      { name: "Panel de Configuración", desc: "Ajuste independiente de precios para cada producto." },
      { name: "Vinil Pro-UV", desc: "Laminado de alta gama que protege la imagen del negocio." },
    ]
  }
];

const requirements = [
  { title: "Espacio", desc: "Área sugerida de 15 m² a 20 m²." },
  { title: "Construcción", desc: "Muros frontales para empotre de ambos equipos." },
  { title: "Hidráulico", desc: "Toma de agua de red y drenaje de 2\"." },
  { title: "Eléctrico", desc: "Líneas 127V independientes con tierra." },
];

const faqs = [
  {
    q: "¿Por qué elegir el Dúo Emprendedor?",
    a: "Es la forma más eficiente de diversificar tu inversión. Atiendes dos mercados esenciales (agua y limpieza) con una sola gestión y en un mismo local.",
  },
  {
    q: "¿Las dos máquinas son independientes?",
    a: "Sí, operan con sistemas de cobro y gabinetes separados, permitiéndote mayor flexibilidad en la instalación.",
  },
  {
    q: "¿Qué productos de limpieza puedo vender?",
    a: "Detergente, cloro, suavizante, desengrasante y limpiador multiusos son los más recomendados por su alta rotación.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-teal-100" : "text-teal-600";
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
          <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd]">
            {String(highlight)}
          </span>
        )}
      </h2>
    </div>
  );
}

const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      variants={fadeUp}
      className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-teal-900/5 overflow-hidden group`}
    >
      <div className="w-full lg:w-1/2 aspect-video bg-[#f0fdfa] relative overflow-hidden flex items-center justify-center group-hover:bg-[#ccfbf1] transition-colors duration-500">
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-700`} />
        
        <div className="w-full h-full flex items-center justify-center p-8 sm:p-12">
          <img
            src={product.image}
            className="max-w-full max-h-full object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-700"
            alt={product.name}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 p-10 sm:p-14 flex flex-col h-full">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#0d2e28] mb-2">{product.tagline}</span>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-6">{product.name}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
           {product.specs.map((s, idx) => (
             <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
               <CheckIcon className="h-4 w-4 text-teal-500 mt-0.5 shrink-0" />
               <span>{String(s)}</span>
             </div>
           ))}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Inversión Desde</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{product.price}</span>
          </div>
          <Link
            to="/configurar-paquete/Duo-Emprendedor"
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd] text-[#0d2e28] font-black rounded-2xl hover:shadow-2xl hover:shadow-teal-500/30 transition-all text-xs uppercase tracking-widest text-center"
          >
            Seleccionar Paquete
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default function DuoEmprendedorInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#8fd8bc] selection:text-[#0d2e28] font-sans overflow-x-hidden">
      <Helmet>
        <title>Paquete Dúo Emprendedor | Agua + Limpieza | Darmax</title>
        <meta name="description" content="Emprende con el Dúo Emprendedor de Darmax. Combina una vending de agua con una vending de productos de limpieza. Doble rentabilidad en un solo lugar." />
      </Helmet>

      <SEO 
        title="Dúo Emprendedor - Negocio Dual Rentable"
        description="Ficha técnica del Paquete Dúo. Vending de Agua Atlantis + Vending Clean. La solución integral para emprendedores."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png"
            alt="Dúo Emprendedor Darmax"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e28]/60 via-slate-900/40 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8fd8bc]/20 via-transparent to-[#73cdbd]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-teal-500/10 text-[#8fd8bc] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-teal-500/20 backdrop-blur-sm">
              Bundle Identity: Dúo Series
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              El doble <br />
              de <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd]">oportunidades.</span>
            </h1>
            <p className="text-lg sm:text-xl text-teal-100/70 mb-12 max-w-xl leading-relaxed">
              El Paquete Dúo maximiza tu rentabilidad al combinar los dos negocios vending más sólidos de México. Agua y Limpieza operando para ti 24/7.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-paquete/Duo-Emprendedor"
                className="px-12 py-5 bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd] hover:shadow-teal-500/20 text-[#0d2e28] font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Dúo
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

      {/* SECCIÓN MODELOS */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Configuraciones Dúo"
            title="Dos niveles de"
            highlight="alcance operativo."
          />
          
          <div className="space-y-12 sm:space-y-20">
            {duoModels.map((m, i) => (
              <ProductCard key={m.id} product={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN COMPONENTES TÉCNICOS */}
      <section id="tecnico" className="py-24 sm:py-32 bg-[#f0fdfa]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Sinergia Tecnológica"
            title="Ingeniería integrada"
            highlight="en un solo lugar."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {commonComponents.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8fd8bc] to-[#73cdbd] flex items-center justify-center text-[#0d2e28] shadow-lg">
                    {i === 0 ? <SparklesIcon className="w-6 h-6" /> : <BeakerIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-8 rounded-[2rem] bg-white border border-teal-100 hover:border-[#73cdbd] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-teal-600 transition-colors">{String(item.name)}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{String(item.desc)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN REQUERIMIENTOS & PAGO */}
      <section className="py-24 sm:py-32 bg-teal-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(143,216,188,0.15),transparent)]" />
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
              <p className="text-teal-100/70 text-lg mb-12 leading-relaxed font-medium">
                Un negocio de dos frentes requiere una planeación precisa. Te acompañamos en la distribución estratégica de tus equipos.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-teal-400 transition-colors">
                     <CreditCardIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-teal-300">Forma de Pago</h5>
                     <p className="font-bold text-sm">50% Anticipo / 50% Contra Entrega</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-teal-400 transition-colors">
                     <ClockIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-teal-300">Tiempo de Entrega</h5>
                     <p className="font-bold text-sm">15 a 20 Días Naturales</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map((r) => (
                <div key={r.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-700">
                  <h5 className="text-[#8fd8bc] font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
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
          <div className="space-y-5 border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-xl shadow-teal-900/5">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-slate-50 last:border-none">
                <summary className="cursor-pointer list-none p-10 font-black text-slate-800 flex items-center justify-between hover:bg-[#f0fdfa] transition-colors uppercase tracking-tight text-sm">
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
          <img src="https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png" alt="Dúo Emprendedor" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-tight mb-10">
            Dúplica tus ingresos <br />
            <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd]">con un solo paquete.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Agua y limpieza: los negocios con mayor retorno de inversión en un solo lugar. Asegura tu éxito con Darmax.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-paquete/Duo-Emprendedor"
              className="px-14 py-7 bg-gradient-to-r from-[#8fd8bc] to-[#7edcb7] text-[#0d2e28] font-black rounded-2xl shadow-2xl transition-all transform hover:scale-110 uppercase tracking-widest text-sm"
            >
              Configurar mi Dúo
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
