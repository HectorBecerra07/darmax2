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
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* --- Configuration --- */
const BRAND_BLUE = "#5188C9";
const BRAND_BLUE_LIGHT = "#93C5FD";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data: 4 Atlantis Models --- */
const atlantisModels = [
  {
    id: "Atlantis",
    name: "Atlantis 300 Tradicional",
    tagline: "Vending Tradicional",
    price: "$54,950",
    gradient: "from-blue-600 to-blue-400",
    osmosis: false,
    interface: "Botones Físicos",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_hbnrfy.png",
    specs: [
      "Bomba Jet 3/4 HP (Inox)",
      "Filtración NSF (Profundo/Carbón/Suavizador)",
      "3 Modos de Llenado (G, ½, P)",
      "Interfaz de Botones",
      "Gabinete Inox 304 Blindado",
      "Desinfección UV 16 LPM + Ozono",
      "Tinaco 2,500 L de Regalo",
    ]
  },
  {
    id: "AtlantisMax",
    name: "Atlantis 300 Tradicional Max",
    tagline: "Vending Tradicional + Ósmosis",
    price: "$82,950",
    gradient: "from-blue-800 to-blue-600",
    osmosis: true,
    interface: "Botones Físicos",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776397327/tradicional_atlantis_max_e2obmt.png",
    specs: [
      "Ósmosis Inversa Industrial Incluida",
      "Bomba Multietapas de Alta Presión",
      "Eliminación de 99% Sales y Sarro",
      "Sabor de Agua Premium",
      "Ideal para Zonas de Agua Pesada",
      "3 Modos de Llenado Tradicional",
      "Gabinete Reforzado Inox 304",
    ]
  },
  {
    id: "AtlantisTouch",
    name: "Atlantis 300 Touch",
    tagline: "Vending Touch Max",
    price: "$64,950",
    gradient: "from-blue-500 to-indigo-600",
    osmosis: false,
    interface: "Pantalla Touch 8\"",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776394713/touch_atlantis_oh7wui.png",
    specs: [
      "Pantalla Touch Interactiva 8\"",
      "4 Modos de Llenado (G, ½, Gln, L)",
      "Sistema de Audio Guía Integral",
      "Sensado de Precisión por Litros",
      "Dispensador de Tapas Integrado",
      "Verificación Automática de Fallas",
      "Bomba Jet 3/4 HP (Inox)",
    ]
  },
  {
    id: "AtlantisMaxTouch",
    name: "Atlantis 300 Touch Max",
    tagline: "Vending Touch + Ósmosis",
    price: "$92,950",
    gradient: "from-indigo-700 to-blue-600",
    osmosis: true,
    interface: "Pantalla Touch 8\"",
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776394713/touch_atlantis_max_q41zpd.png",
    specs: [
      "La Estación de Agua más Avanzada",
      "Ósmosis Inversa + Pantalla Touch",
      "Automatización Total de Purificación",
      "Audio Guía y 4 Modos de Llenado",
      "Sensado Digital e Historial de Ventas",
      "Pureza Garantizada Grado Quirúrgico",
      "Máximo Valor de Reventa Darmax",
    ]
  },
];

const extras = [
  { name: "Upgrade Agua Alcalina", price: "$12,000 MXN", desc: "Añade un segundo tipo de agua (Alcalina) a tu equipo." },
  { name: "Seguro de Vending Anual", price: "$4,950 MXN", desc: "Protección total contra robo y vandalismo." },
  { name: "Aviso de Funcionamiento", price: "$3,500 MXN", desc: "Trámite de alta ante COFEPRIS / Salubridad." },
  { name: "Kit Insumos Anuales", price: "$3,900 MXN", desc: "Repuestos de filtros, resinas y lámparas UV." },
  { name: "Tinaco 5,000 L Translúcido", price: "$10,500 MXN", desc: "Mayor capacidad de almacenamiento de agua cruda." },
  { name: "Mantenimiento Anual", price: "$8,500 MXN", desc: "Servicio preventivo integral por técnicos Darmax." },
];

const commonComponents = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Tanques 9x48 NSF", desc: "Material certificado para alta presión con difusores internos." },
      { name: "Filtración Especializada", desc: "Zeolita, carbón activado vegetal y resina catiónica de alta pureza." },
      { name: "Bomba Jet (Inox)", desc: "Motor de alta eficiencia en acero quirúrgico 304." },
      { name: "Barrera Bactericida", desc: "Lámpara de luz UV y Generador de Ozono con inyección Ventury." },
    ]
  },
  {
    category: "Vending & Control",
    items: [
      { name: "Gabinete Inox 304", desc: "Construcción blindada calibre 18 resistente a la intemperie." },
      { name: "Validador Inteligente", desc: "Acepta todas las monedas nacionales y entrega cambio automático." },
      { name: "Historial de Ventas", desc: "Registro electrónico inalterable de transacciones y litros." },
      { name: "Vinil Pro-UV", desc: "Laminado de alta gama que protege la imagen del sol y humedad." },
    ]
  }
];

const requirements = [
  { title: "Espacio", desc: "Área mínima sugerida de 12 m²." },
  { title: "Muro de Empotre", desc: "Levantamiento de muro de 80.5 x 80.5 cm." },
  { title: "Electricidad", desc: "Línea 127V con tierra y regulador." },
  { title: "Hidráulico", desc: "Toma de agua de red y drenaje de 2\"." },
];

const faqs = [
  {
    q: "¿Qué incluye el precio de inversión?",
    a: "Incluye el equipo vending completo, sistema de purificación industrial, gabinete de acero inoxidable, validador de monedas con cambio, tinaco de 2,500L de regalo y kit de instalación inicial.",
  },
  {
    q: "¿Cuándo es necesaria la Ósmosis Inversa?",
    a: "Se recomienda si el agua de tu localidad tiene altos niveles de sales, sarro o minerales pesados. La ósmosis garantiza un sabor ligero y purificación de nivel embotelladora premium.",
  },
  {
    q: "¿Cuál es el tiempo de entrega?",
    a: "El tiempo estimado de entrega es de entre 15 y 20 días naturales a partir de la firma del contrato y el pago del anticipo.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-blue-100" : "text-blue-600";
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
          <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#5188C9] to-[#93C5FD]">
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
      className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden group`}
    >
      <div className="w-full lg:w-1/2 aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
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
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">{product.tagline}</span>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-6">{product.name}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
           {product.specs.map((s, idx) => (
             <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
               <CheckIcon className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
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
            to="/configurar-maquina/Vending"
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all text-xs uppercase tracking-widest text-center"
          >
            Seleccionar Modelo
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
    <table className="w-full text-left border-collapse min-w-[900px]">
      <thead>
        <tr className="bg-blue-900 text-white">
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Atributo Técnico</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center">Tradicional</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center text-blue-300">Tradicional Max</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10 text-center">Touch</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest text-center text-blue-300">Touch Max</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium">
        {[
          { label: "Interfaz de Usuario", vals: ["Botones Físicos", "Botones Físicos", "Touch 8\" Color", "Touch 8\" Color"] },
          { label: "Ósmosis Inversa", vals: [false, true, false, true] },
          { label: "Modalidades Llenado", vals: ["3 (G, ½, P)", "3 (G, ½, P)", "4 (G, ½, Gln, L)", "4 (G, ½, Gln, L)"] },
          { label: "Audio Guía", vals: [false, false, true, true] },
          { label: "Medición Precisión", vals: ["Temporizado", "Temporizado", "Litraje Digital", "Litraje Digital"] },
          { label: "Inversión Sugerida", vals: ["$54,950", "$82,950", "$64,950", "$92,950"], bold: true },
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

export default function VendingInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Vending Atlantis 300 | Modelos y Ficha Técnica | Darmax</title>
        <meta name="description" content="Explora los 4 niveles de la Atlantis 300. Vending tradicional y touch con ósmosis inversa. Tecnología de purificación industrial 24/7." />
      </Helmet>

      <SEO 
        title="Vending Atlantis 300 - Líder en Rentabilidad"
        description="Selecciona la potencia de tu negocio de agua. Cuatro configuraciones premium con tecnología touch y certificación NSF."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/vending/vendingmodelcss.png"
            alt="Darmax Atlantis 300"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-slate-900/40 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-500/20 backdrop-blur-sm">
              Identity: Atlantis Line
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Ingeniería <br />
              <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#5188C9] to-[#93C5FD]">de alto nivel.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/70 mb-12 max-w-xl leading-relaxed">
              La familia Atlantis 300 combina componentes de grado industrial con tecnología inteligente para ofrecerte la purificadora 24/7 más confiable del mercado.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Vending"
                className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Atlantis
              </Link>
              <button
                onClick={() => document.getElementById("modelos").scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Comparar Modelos
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN MODELOS (HORIZONTAL ZIGZAG) */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Configuraciones"
            title="Cuatro niveles de"
            highlight="potencia y tecnología."
          />
          
          <div className="space-y-12 sm:space-y-20">
            {atlantisModels.map((m, i) => (
              <ProductCard key={m.id} product={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN TABLA COMPARATIVA */}
      <section className="py-24 sm:py-32 bg-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Análisis Detallado"
            title="Diferencias que"
            highlight="impulsan tu éxito."
          />
          <ComparisonTable />
        </div>
      </section>

      {/* SECCIÓN COMPONENTES TÉCNICOS */}
      <section id="tecnico" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Ingeniería Darmax"
            title="Componentes de"
            highlight="grado industrial."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {commonComponents.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-lg">
                    {i === 0 ? <WrenchIcon className="w-6 h-6" /> : <CpuChipIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1 group-hover:text-blue-600 transition-colors">{String(item.name)}</h4>
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
            highlight="estación Atlantis."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {extras.map((extra, i) => (
              <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2">{extra.name}</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{extra.desc}</p>
                <div className="text-xl font-black text-blue-600">{extra.price}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-3 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
            <p className="font-medium">
              <strong>Nota importante:</strong> El precio no incluye obra civil (muro), adecuaciones hidráulicas/eléctricas del local, ni fletes/viáticos fuera de la zona metropolitana.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN REQUERIMIENTOS & PAGO */}
      <section className="py-24 sm:py-32 bg-blue-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.15),transparent)]" />
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
                La Atlantis 300 es una inversión sólida y profesional. Te acompañamos en cada etapa, desde la preparación del local hasta la capacitación técnica.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                     <CreditCardIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-blue-300">Forma de Pago</h5>
                     <p className="font-bold text-sm">50% Anticipo / 50% Contra Entrega</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-400 transition-colors">
                     <ClockIcon className="w-6 h-6" />
                   </div>
                   <div>
                     <h5 className="font-black uppercase tracking-widest text-[10px] text-blue-300">Tiempo de Entrega</h5>
                     <p className="font-bold text-sm">15 a 20 Días Naturales</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map((r) => (
                <div key={r.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-700">
                  <h5 className="text-blue-300 font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
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
          <div className="space-y-5 border border-slate-100 rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-slate-50 last:border-none">
                <summary className="cursor-pointer list-none p-10 font-black text-slate-800 flex items-center justify-between hover:bg-blue-50/20 transition-colors uppercase tracking-tight text-sm">
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
      <section className="py-24 sm:py-40 bg-blue-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src="/img/vending/atlantistouchvending.jpg" alt="Darmax Atlantis" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-tight mb-10">
            ¿Tu próximo gran <br />
            <span style={{ color: BRAND_BLUE }}>negocio rentable?</span>
          </h2>
          <p className="text-xl text-blue-100/60 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Únete a los emprendedores que ya facturan 24/7 con la tecnología Atlantis 300. Configura tu equipo hoy.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-maquina/Vending"
              className="px-14 py-7 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 transition-all transform hover:scale-110 uppercase tracking-widest text-sm"
            >
              Configurar mi Equipo
            </Link>
            <Link
              to="/contacto"
              className="px-14 py-7 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest text-sm"
            >
              Hablar con Ventas
            </Link>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-20 text-blue-500 hover:text-white transition-colors flex items-center gap-3 mx-auto font-black uppercase tracking-[0.4em] text-[10px]"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" /> Volver atrás
          </button>
        </div>
      </section>
    </div>
  );
}
