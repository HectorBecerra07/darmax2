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
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* --- Identity & Style (Mostrador Identity: Lavanda to Turquesa) --- */
const BRAND = {
  lavender: "#A5B4FC",
  sky: "#7DD3FC",
  aqua: "#99F6E4",
  cyan: "#67E8F9",
  indigoText: "#4338CA",
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data --- */
const purificadoraModels = [
  {
    id: "Neptuno",
    name: "Mostrador Neptuno Tradicional",
    tagline: "El Estándar de Oro",
    price: "$52,950",
    gradient: "from-[#A5B4FC] to-[#7DD3FC]",
    osmosis: false,
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776400526/mostrador_djpelm.png",
    specs: [
      "Capacidad ~600 garrafones/día",
      "Bomba Jet 1.5 HP Acero Inoxidable",
      "Tanques de purificación 10x54 NSF",
      "Tarja Inox 304 Grado Alimenticio",
      "Lavado y Llenado Doble Simultáneo",
      "Sistema UV 30 LPM + Ozono",
      "Presurizador Automático Incluido",
    ]
  },
  {
    id: "NeptunoAPlus",
    name: "Mostrador Neptuno + Ósmosis Inversa",
    tagline: "Pureza Embajador",
    price: "$80,950",
    gradient: "from-[#7DD3FC] to-[#67E8F9]",
    osmosis: true,
    image: "https://res.cloudinary.com/defkuaytw/image/upload/v1776403043/mostrador_osmosis_jqr3cb.png",
    specs: [
      "Capacidad ~800 garrafones/día",
      "Sistema de Ósmosis Inversa Industrial",
      "Bomba Multietapas de Alta Presión",
      "Eliminación de 99% sales y sarro",
      "Calidad de agua premium certificada",
      "Ideal para zonas de agua pesada",
      "Filtros de pulido extra fino",
    ]
  },
];

const extras = [
  { name: "Upgrade Agua Alcalina", price: "$12,000 MXN", desc: "Doble tipo de agua (Natural + Alcalina)." },
  { name: "Aviso de Funcionamiento", price: "$3,500 MXN", desc: "Trámite de alta ante COFEPRIS / Salubridad." },
  { name: "Kit Insumos Anuales", price: "$6,900 MXN", desc: "Filtros, resinas y lámparas UV de repuesto." },
  { name: "Mantenimiento Anual", price: "$8,500 MXN", desc: "Servicio preventivo integral por técnicos Darmax." },
  { name: "Vending Tradicional", price: "$23,000 MXN", desc: "Módulo para venta automática de agua." },
  { name: "Tinaco 5,000 L Translúcido", price: "$10,500 MXN", desc: "Mayor almacenamiento de agua cruda." },
];

const commonComponents = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Tanques 10x54 NSF", desc: "Material con certificación NSF para lecho profundo y carbón activado." },
      { name: "Bomba 1.5 HP Inox", desc: "Motor industrial de alta eficiencia para flujo constante." },
      { name: "Sistema de Desinfección", desc: "Lámpara UV de 30 LPM y Generador de Ozono por Ventury." },
      { name: "Filtración Especializada", desc: "Resina catiónica certificada para eliminación de dureza." },
    ]
  },
  {
    category: "Módulo de Servicio",
    items: [
      { name: "Tarja Mostrador", desc: "Acero quirúrgico 304 con diseño ergonómico de fácil limpieza." },
      { name: "Estación de Lavado", desc: "Lavado interior con bomba dedicada y exterior doble." },
      { name: "Llenado Simultáneo", desc: "Doble boquilla de llenado para maximizar el tiempo de atención." },
      { name: "Válvulas de Control", desc: "Presurizador automático para control inteligente de flujo." },
    ]
  }
];

const requirements = [
  { title: "Local", desc: "Área sugerida de 30 m² a 40 m²." },
  { title: "Hidráulico", desc: "Toma de agua de red y drenaje de 2\"." },
  { title: "Eléctrico", desc: "Línea 127V independiente con tierra." },
  { title: "Tanques", desc: "Espacio para 2 tinacos de 2,500 L." },
];

const faqs = [
  {
    q: "¿Qué diferencia al Mostrador Neptuno de una purificadora convencional?",
    a: "El Mostrador Neptuno integra en una sola unidad compacta y profesional el lavado interior, exterior y el llenado doble, eliminando la necesidad de múltiples estaciones separadas.",
  },
  {
    q: "¿Cuándo debo elegir la versión con Ósmosis Inversa?",
    a: "Se recomienda si el agua en tu zona tiene altos niveles de sarro o sales. La Ósmosis Inversa garantiza un sabor ligero y purificación de nivel embotelladora premium.",
  },
  {
    q: "¿Incluyen instalación y capacitación?",
    a: "Sí, todos nuestros modelos incluyen la instalación técnica profesional y la capacitación completa sobre la operación y control de calidad.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-blue-100" : "text-indigo-600";
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
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#67E8F9]">
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
      className={`flex flex-col ${index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-900/5 overflow-hidden group`}
    >
      <div className="w-full lg:w-1/2 aspect-video bg-[#F1F5F9] relative overflow-hidden flex items-center justify-center group-hover:bg-[#E0F2FE] transition-colors duration-500">
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
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">{product.tagline}</span>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-6">{product.name}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
           {product.specs.map((s, idx) => (
             <div key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
               <CheckIcon className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
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
            to="/configurar-maquina/Purificadora"
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-[#A5B4FC] to-[#7DD3FC] text-indigo-900 font-black rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 transition-all text-xs uppercase tracking-widest text-center"
          >
            Seleccionar Modelo
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-indigo-900/5">
    <table className="w-full text-left border-collapse min-w-[750px]">
      <thead>
        <tr className="bg-gradient-to-r from-[#A5B4FC] to-[#67E8F9] text-indigo-900">
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/20">Especificación Técnica</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/20 text-center">Mostrador Tradicional</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest text-center">Mostrador Ósmosis Inversa</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium">
        {[
          { label: "Sistema Purificación NSF", vals: [true, true] },
          { label: "Ósmosis Inversa Industrial", vals: [false, true] },
          { label: "Capacidad de Producción", vals: ["600 Garrafones", "800 Garrafones"] },
          { label: "Bomba Multietapas OI", vals: [false, true] },
          { label: "Despacho de Garrafones", vals: ["Simultáneo Doble", "Simultáneo Doble"] },
          { label: "Gabinete Inox 304", vals: [true, true] },
          { label: "Inversión Sugerida", vals: ["$52,950", "$80,950"], bold: true },
        ].map((row, i) => (
          <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
            <td className="p-7 text-slate-900 font-black text-sm uppercase tracking-tight">{row.label}</td>
            {row.vals.map((v, idx) => (
              <td key={idx} className={`p-7 text-sm text-center ${row.bold ? "font-black text-slate-900" : "text-slate-500"}`}>
                {typeof v === "boolean" ? (
                  v ? <CheckIcon className="h-6 w-6 text-indigo-600 mx-auto" /> : <XMarkIcon className="h-6 w-6 text-slate-200 mx-auto" />
                ) : String(v)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function PurificadoraInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#7DD3FC] selection:text-indigo-900 font-sans overflow-x-hidden">
      <Helmet>
        <title>Planta Purificadora Neptuno | Ingeniería Darmax</title>
        <meta name="description" content="Conoce la planta purificadora con Mostrador Neptuno. Estaciones de lavado y llenado en acero inoxidable con ósmosis inversa." />
      </Helmet>

      <SEO 
        title="Mostrador Neptuno - Planta Purificadora Profesional"
        description="Ficha técnica del Mostrador Neptuno. Tecnología de purificación industrial con ósmosis inversa y tarjas inoxidables."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/vending/mostrador.png"
            alt="Mostrador Darmax Neptuno"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#A5B4FC]/40 via-slate-900/60 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A5B4FC]/20 via-transparent to-[#67E8F9]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-indigo-500/10 text-[#A5B4FC] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-indigo-500/20 backdrop-blur-sm">
              Neptuno Series Identity
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Pureza que <br />
              se nota <span className="inline-block pb-2 pr-6 text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#67E8F9]">al instante.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              El Mostrador Neptuno redefine la eficiencia operativa con un diseño estético y componentes de grado industrial. Tu planta, tu éxito.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Purificadora"
                className="px-12 py-5 bg-gradient-to-r from-[#A5B4FC] to-[#7DD3FC] hover:shadow-indigo-500/20 text-indigo-900 font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Planta
              </Link>
              <button
                onClick={() => document.getElementById("modelos").scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Ver Variaciones
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN MODELOS (HORIZONTAL ZIGZAG) */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Configuraciones Neptuno"
            title="Dos niveles de"
            highlight="purificación industrial."
          />
          
          <div className="space-y-12 sm:space-y-20">
            {purificadoraModels.map((m, i) => (
              <ProductCard key={m.id} product={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN TABLA COMPARATIVA */}
      <section className="py-24 sm:py-32 bg-[#F5F7FF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Transparencia Técnica"
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
            title="Ficha técnica de"
            highlight="grado quirúrgico."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {commonComponents.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A5B4FC] to-[#7DD3FC] flex items-center justify-center text-indigo-900 shadow-lg">
                    {i === 0 ? <WrenchIcon className="w-6 h-6" /> : <BeakerIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-8 rounded-[2rem] bg-[#F8FAFC] border border-slate-100 hover:border-[#7DD3FC] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-indigo-600 transition-colors">{String(item.name)}</h4>
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
            highlight="planta Neptuno."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {extras.map((extra, i) => (
              <motion.div key={i} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-2">{extra.name}</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">{extra.desc}</p>
                <div className="text-xl font-black text-indigo-600">{extra.price}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-3 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
            <p className="font-medium">
              <strong>Nota importante:</strong> El precio no incluye obra civil, acabados de local, adecuaciones hidráulicas/eléctricas mayores, ni fletes/viáticos fuera de zona.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN REQUERIMIENTOS & PAGO */}
      <section className="py-24 sm:py-32 bg-indigo-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(165,180,252,0.15),transparent)]" />
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
              <p className="text-[#E0E7FF] text-lg mb-12 leading-relaxed font-medium">
                La planta Neptuno es un activo de alta rentabilidad. Te asesoramos en cada detalle técnico para asegurar una operación fluida desde el primer día.
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
                  <h5 className="text-[#A5B4FC] font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
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
          <div className="space-y-5 border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-slate-50 last:border-none">
                <summary className="cursor-pointer list-none p-10 font-black text-slate-800 flex items-center justify-between hover:bg-[#F5F7FF] transition-colors uppercase tracking-tight text-sm">
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
          <img src="/img/vending/mostrador.png" alt="Darmax Mostrador" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-tight mb-10">
            Crea tu propia <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A5B4FC] to-[#67E8F9]">marca de agua.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            El agua purificada es el producto más esencial. Da el primer paso hacia un negocio estable y rentable con Darmax.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-maquina/Purificadora"
              className="px-14 py-7 bg-gradient-to-r from-[#A5B4FC] to-[#7DD3FC] text-indigo-900 font-black rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all transform hover:scale-110 uppercase tracking-widest text-sm"
            >
              Configurar mi Planta
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
