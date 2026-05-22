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

/* --- Data --- */
const atlantisModels = [
  {
    id: "Atlantis",
    name: "Atlantis 300 Tradicional",
    tagline: "Sencillez Industrial",
    price: "$54,950",
    gradient: "from-blue-600 to-blue-400",
    osmosis: false,
    interface: "Botones Físicos",
    image: "/img/vending/ATLANTIS300MAX.png",
    specs: [
      "500 garrafones por mes",
      "Bomba 3/4 HP en acero inoxidable",
      "Tanques de filtración 9x48 (NSF)",
      "Sistema UV 16 LPM Inoxidable",
      "Generador de Ozono + Ventury 3/4",
      "Despachador 4 modos (1, 4, 10, 20L)",
      "Monedero antirrobo con cambio",
    ]
  },
  {
    id: "AtlantisMax",
    name: "Atlantis 300 Tradicional + Ósmosis",
    tagline: "Máxima Pureza",
    price: "$82,000",
    gradient: "from-blue-800 to-blue-600",
    osmosis: true,
    interface: "Botones Físicos",
    image: "/img/vending/ATLANTIS300MAX.png",
    specs: [
      "800 garrafones por mes",
      "Sistema de Ósmosis Inversa Industrial",
      "Bomba multietapas especial",
      "Filtro lecho profundo + carbón + suavizador",
      "2 portafiltros polyspun (20” y 10”)",
      "UV 16 LPM + Ozono + Ventury",
      "Monedero antirrobo con cambio",
    ]
  },
  {
    id: "AtlantisTouch",
    name: "Atlantis 300 Touch Max",
    tagline: "Tecnología Inteligente",
    price: "$64,950",
    gradient: "from-blue-500 to-indigo-600",
    osmosis: false,
    interface: "Pantalla Touch 8\"",
    image: "/img/vending/TOUCHAGUA.png",
    specs: [
      "500 garrafones por mes",
      "Pantalla TOUCH interactiva de 8\"",
      "Sistema de audio con mensajes",
      "Sensado de precisión por litros",
      "Dispensador de tapas integrado",
      "Sistema de verificación de fallas",
      "Gabinete Inox 304 Grado Alimenticio",
    ]
  },
  {
    id: "AtlantisMaxTouch",
    name: "Atlantis 300 Touch Max + Ósmosis",
    tagline: "Liderazgo en Purificación",
    price: "$92,950",
    gradient: "from-indigo-700 to-blue-600",
    osmosis: true,
    interface: "Pantalla Touch 8\"",
    image: "/img/vending/TOUCHAGUA.png",
    specs: [
      "800 garrafones por mes",
      "Ósmosis Inversa de alta producción",
      "Pantalla TOUCH interactiva de 8\"",
      "Audio guía para el usuario",
      "Automatización total de procesos",
      "Sensores de flujo y solenoides",
      "Máximo valor de reventa",
    ]
  },
];

const commonComponents = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Tanques 9x48 NSF", desc: "Material certificado para alta presión y filtración eficiente." },
      { name: "Medios Filtrantes", desc: "Zeolita, carbón activado y resina catiónica de alta pureza." },
      { name: "Bomba Jet 3/4 HP", desc: "Construcción en acero inoxidable para durabilidad extrema." },
      { name: "Sistema UV & Ozono", desc: "Doble barrera bacteriológica para agua 100% segura." },
    ]
  },
  {
    category: "Vending & Control",
    items: [
      { name: "Gabinete Inox 304", desc: "Acero quirúrgico resistente a corrosión e intemperie." },
      { name: "Validador Premium", desc: "Acepta todas las monedas mexicanas y entrega cambio." },
      { name: "Electrónica Inteligente", desc: "Control de flujo y sistema de autodiagnóstico de fallas." },
      { name: "Protección UV", desc: "Vinil laminado de alta resistencia contra rayos solares." },
    ]
  }
];

const requirements = [
  { title: "Espacio", desc: "Local mínimo de 12 m² con acceso frontal." },
  { title: "Eléctrico", desc: "127V con tierra física y No-Break." },
  { title: "Hidráulico", desc: "Toma de red y drenaje de 2\"." },
  { title: "Construcción", desc: "Muro de 80.5 x 80.5 cm para empotre." },
];

const faqs = [
  {
    q: "¿Qué incluye el precio de inversión?",
    a: "Incluye el equipo vending completo, sistema de purificación industrial (filtros, UV, Ozono), gabinete de acero inoxidable 304, validador de monedas con cambio y un tinaco de 2,500L de regalo para agua cruda.",
  },
  {
    q: "¿Cuándo es necesaria la Ósmosis Inversa?",
    a: "Se recomienda en zonas donde el agua de red tiene alta concentración de sales o sarro. La ósmosis garantiza la eliminación de minerales pesados, asegurando un sabor premium y protegiendo la vida útil del equipo.",
  },
  {
    q: "¿El equipo entrega cambio?",
    a: "Sí, todos nuestros modelos Atlantis 300 cuentan con un validador de monedas de alta gama que acepta todas las denominaciones y entrega cambio de forma automática y segura.",
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
          <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5188C9] to-[#93C5FD]">
            {String(highlight)}
          </span>
        )}
      </h2>
    </div>
  );
}

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
    <table className="w-full text-left border-collapse min-w-[850px]">
      <thead>
        <tr className="bg-blue-900 text-white">
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Atributo Técnico</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Tradicional</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest text-blue-300 border-r border-white/10">Tradicional + Ósmosis</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/10">Touch Max</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest text-blue-300">Touch Max + Ósmosis</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium">
        {[
          { label: "Interfaz de Usuario", vals: ["Botones Físicos", "Botones Físicos", "Touch 8\" Full Color", "Touch 8\" Full Color"] },
          { label: "Variedad de Llenado", vals: ["3 Modos", "3 Modos", "4 Modos", "4 Modos"] },
          { label: "Ósmosis Inversa", vals: [false, true, false, true] },
          { label: "Audio y Bocina", vals: [false, false, true, true] },
          { label: "Medición de Despacho", vals: ["Temporizado", "Temporizado", "Flujómetro Digital", "Flujómetro Digital"] },
          { label: "Capacidad (Lts/Día)", vals: ["~10,000", "16,000+", "~10,000", "16,000+"] },
          { label: "Inversión Sugerida", vals: ["$54,950", "$82,000", "$64,950", "$92,950"], bold: true },
        ].map((row, i) => (
          <tr key={i} className="hover:bg-blue-50/20 transition-colors">
            <td className="p-7 text-slate-900 font-black text-sm uppercase tracking-tight">{row.label}</td>
            {row.vals.map((v, idx) => (
              <td key={idx} className={`p-7 text-sm ${row.bold ? "font-black text-blue-900" : "text-slate-500"}`}>
                {typeof v === "boolean" ? (
                  v ? <CheckIcon className="h-6 w-6 text-blue-600" /> : <XMarkIcon className="h-6 w-6 text-slate-200" />
                ) : String(v)}
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
        <title>Vending Atlantis 300 | Ficha Técnica y Modelos | Darmax</title>
        <meta name="description" content="Detalles técnicos de la familia Atlantis 300. Componentes de purificación, ósmosis inversa y sistemas vending touch 24/7." />
      </Helmet>

      <SEO 
        title="Vending Atlantis 300 - Ingeniería y Componentes"
        description="Explora los componentes de alta gama de la Atlantis 300. Purificación certificada y tecnología vending de vanguardia."
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
              <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#5188C9] to-[#93C5FD]">de alto nivel.</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/70 mb-12 max-w-xl leading-relaxed">
              La familia Atlantis 300 combina componentes de grado industrial con tecnología inteligente para ofrecerte la purificadora 24/7 más confiable del mercado.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Vending"
                className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-900/40 transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Atlantis
              </Link>
              <button
                onClick={() => document.getElementById("tecnico")?.scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Ver Ficha Técnica
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN MODELOS */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Configuraciones"
            title="Cuatro niveles de"
            highlight="potencia y tecnología."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {atlantisModels.map((m, i) => (
              <motion.div
                key={m.id}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${m.gradient}`} />
                <div className="p-10 flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">{m.tagline}</span>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4">{m.name}</h3>
                  
                  <div className="aspect-square mb-8 bg-slate-50 rounded-3xl p-6 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                    <img src={m.image} alt={m.name} className="max-h-full object-contain transform group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="mt-auto space-y-6">
                    <ul className="space-y-2">
                       {m.specs.map((s, idx) => (
                         <li key={idx} className="flex items-start gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                           <CheckIcon className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                           <span>{String(s)}</span>
                         </li>
                       ))}
                    </ul>
                    <div className="pt-8 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Desde</span>
                        <span className="text-2xl font-black text-slate-900">{m.price}</span>
                      </div>
                      <Link
                        to="/configurar-maquina/Vending"
                        className="block w-full py-4 text-center bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black rounded-2xl hover:shadow-lg transition-all text-[10px] uppercase tracking-widest"
                      >
                        Seleccionar Modelo
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
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
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">{String(item.name)}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{String(item.desc)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN REQUERIMIENTOS */}
      <section className="py-24 sm:py-32 bg-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-2/5 text-left">
              <SectionTitle 
                align="left"
                light
                eyebrow="Preparación"
                title="Lo que necesitas"
                highlight="en tu local."
              />
              <p className="text-blue-100/70 text-lg mb-12 leading-relaxed font-medium">
                Un negocio exitoso comienza con una instalación profesional. Nuestros técnicos te guían en cada paso de la obra civil.
              </p>
              <Link to="/contacto" className="inline-flex items-center gap-4 text-blue-300 font-black uppercase tracking-[0.3em] text-[10px] hover:gap-6 transition-all group">
                Hablar con un técnico <ChevronDownIcon className="w-4 h-4 -rotate-90 group-hover:text-white" />
              </Link>
            </div>
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map((r) => (
                <div key={r.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-700">
                  <h5 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
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
              className="px-14 py-7 bg-white text-blue-900 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-sm"
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
