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
  RectangleStackIcon,
} from "@heroicons/react/24/outline";

/* --- Identity & Style (Dúo Emprendedor: Menta to Aqua) --- */
const BRAND = {
  mint: "#8fd8bc",
  aquaMint: "#7edcb7",
  turquoise: "#73cdbd",
  deepAqua: "#5aa7bf",
  greenCyan: "#67cdb9",
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data: 4 Bundle Variations --- */
const duoBundles = [
  {
    id: "DuoTradicional",
    name: "Dúo Tradicional",
    tagline: "El Punto de Partida",
    price: "$89,900",
    gradient: "from-[#8fd8bc] to-[#7edcb7]",
    image: "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png",
    specs: [
      "Atlantis 300 Tradicional",
      "Vending Clean 5 Productos",
      "Purificación Industrial NSF",
      "Interfaz de Botones",
      "Monederos con Cambio",
      "Gabinete Inox 304",
      "Tinaco 2,500L de Regalo",
    ]
  },
  {
    id: "DuoTradicionalMax",
    name: "Dúo Tradicional Max",
    tagline: "Pureza Garantizada",
    price: "$116,950",
    gradient: "from-[#7edcb7] to-[#73cdbd]",
    image: "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png",
    specs: [
      "Atlantis 300 Tradicional + Ósmosis",
      "Vending Clean 5 Productos",
      "Eliminación de Sarro y Sales",
      "Sabor Premium Embajador",
      "Ideal para Zonas de Agua Dura",
      "Capacidad de Producción Max",
      "Kit de Instalación Completo",
    ]
  },
  {
    id: "DuoTouch",
    name: "Dúo Touch Pro",
    tagline: "Tecnología y Servicio",
    price: "$99,900",
    gradient: "from-[#73cdbd] to-[#67cdb9]",
    image: "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png",
    specs: [
      "Atlantis 300 Touch Max (8\")",
      "Vending Clean 5 Productos",
      "Sensado de Precisión",
      "Sistema de Audio y Guía",
      "Interfaz Touch Interactiva",
      "Control de Ventas Digital",
      "Máximo Valor de Reventa",
    ]
  },
  {
    id: "DuoTouchMax",
    name: "Dúo Touch Max + Ósmosis",
    tagline: "La Estación Definitiva",
    price: "$127,900",
    gradient: "from-[#67cdb9] to-[#5aa7bf]",
    image: "https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png",
    specs: [
      "Atlantis 300 Touch + Ósmosis",
      "Vending Clean 5 Productos",
      "Purificación Grado Quirúrgico",
      "Máximo Portafolio de Ventas",
      "Automatización Total",
      "Membranas Industriales OI",
      "La mejor inversión ROI 24/7",
    ]
  },
];

const sharedEngineering = [
  {
    category: "Ingeniería de Purificación",
    items: [
      { name: "Atlantis 300 Tech", desc: "Sistema de filtración en 4 etapas: lecho profundo, carbón activado, suavizado y pulido." },
      { name: "Desinfección Dual", desc: "Lámpara de rayos ultravioleta de 25 LPM y Generador de Ozono de alta eficiencia." },
      { name: "Bomba Inox 3/4 HP", desc: "Potencia constante para el despacho de agua purificada certificada." },
    ]
  },
  {
    category: "Tecnología de Dosificación",
    items: [
      { name: "Vending Clean 5", desc: "5 Bombas de 1/2 HP con válvula check para dosificación exacta de productos químicos." },
      { name: "Control de Ventas", desc: "Registro digital de transacciones y litros despachados en ambas unidades." },
      { name: "Gabinetes Inox 304", desc: "Construcción blindada en acero inoxidable grado alimenticio para máxima durabilidad." },
    ]
  }
];

const requirements = [
  { title: "Local", desc: "Área mínima sugerida de 16 m² a 18 m²." },
  { title: "Instalación", desc: "Muro para vending de agua y espacio interno para bidones." },
  { title: "Eléctrico", desc: "Líneas 127V independientes con tierra física." },
  { title: "Hidráulico", desc: "Toma de red y drenaje interno de 2\"." },
];

const faqs = [
  {
    q: "¿Por qué invertir en un paquete Dúo?",
    a: "El Dúo Emprendedor permite captar dos nichos de mercado: el de consumo vital (agua) y el de consumo recurrente (limpieza), duplicando las oportunidades de venta sin duplicar el local.",
  },
  {
    q: "¿Qué mantenimiento requieren los equipos?",
    a: "El sistema de agua requiere cambio de filtros y resinas periódico, mientras que el de limpieza solo requiere reabastecimiento de bidones y purga de líneas para mantener la higiene.",
  },
  {
    q: "¿Incluye todo para operar?",
    a: "Sí, el paquete incluye desde los equipos hasta el tinaco de regalo, materiales de instalación y la capacitación necesaria para que tú mismo operes tu negocio.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-emerald-100" : "text-teal-600";
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
          <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#5aa7bf]">
            {String(highlight)}
          </span>
        )}
      </h2>
    </div>
  );
}

export default function DuoEmprendedorInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#73cdbd] selection:text-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Paquetes Dúo Emprendedor | Agua + Limpieza | Darmax</title>
        <meta name="description" content="Compara los 4 paquetes del Dúo Emprendedor. Combina Atlantis 300 con Vending de Limpieza para maximizar tu rentabilidad 24/7." />
      </Helmet>

      <SEO 
        title="Dúo Emprendedor - Cuatro Niveles de Inversión"
        description="Selecciona la potencia de tu negocio multiservicio. Agua purificada y productos de limpieza a granel en una sola estación."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/dunrpwsfq/image/upload/v1767901903/duo_emprendedor_mgs6zz.png"
            alt="Dúo Emprendedor Darmax"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e28]/80 via-slate-900/40 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8fd8bc]/20 via-transparent to-[#5aa7bf]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-teal-500/10 text-[#8fd8bc] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-teal-500/20 backdrop-blur-sm">
              Bundle Experience: Dúo Emprendedor
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Tu éxito, <br />
              potenciado <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd]">al doble.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              El Dúo Emprendedor es la estación multiservicio más rentable de México. Selecciona el nivel de tecnología que mejor se adapte a tu territorio.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Tridente"
                className="px-12 py-5 bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd] hover:shadow-[#8fd8bc]/20 text-[#0d2e28] font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Dúo
              </Link>
              <button
                onClick={() => document.getElementById("modelos").scrollIntoView({ behavior: "smooth" })}
                className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs backdrop-blur-sm"
              >
                Comparar Paquetes
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN MODELOS (4 PAQUETES JUNTOS) */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Gama de Inversión"
            title="Cuatro variaciones de"
            highlight="paquete multiservicio."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {duoBundles.map((m, i) => (
              <motion.div
                key={m.id}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-teal-900/5 overflow-hidden hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${m.gradient}`} />
                <div className="p-10 flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0f766e] mb-2">{m.tagline}</span>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-6">{m.name}</h3>
                  
                  <div className="aspect-video mb-8 bg-[#f0fdfa] rounded-[2rem] overflow-hidden flex items-center justify-center group-hover:bg-[#ccfbf1] transition-colors duration-500">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="mt-auto space-y-6">
                    <ul className="grid grid-cols-1 gap-2.5">
                       {m.specs.map((s, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                           <CheckIcon className="h-4 w-4 text-[#73cdbd] mt-0.5 shrink-0" />
                           <span>{String(s)}</span>
                         </li>
                       ))}
                    </ul>
                    <div className="pt-8 border-t border-slate-50">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Desde</span>
                        <span className="text-2xl font-black text-slate-900">{m.price}</span>
                      </div>
                      <Link
                        to="/configurar-maquina/Tridente"
                        className="block w-full py-4 text-center bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd] text-[#0d2e28] font-black rounded-2xl hover:shadow-lg transition-all text-[10px] uppercase tracking-widest"
                      >
                        Seleccionar Dúo
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN INGENIERÍA COMPARTIDA */}
      <section className="py-24 sm:py-32 bg-[#f0fdfa]/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Potencia Combinada"
            title="Componentes técnicos"
            highlight="de alta gama."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {sharedEngineering.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8fd8bc] to-[#73cdbd] flex items-center justify-center text-[#0d2e28] shadow-lg">
                    {i === 0 ? <WrenchIcon className="w-6 h-6" /> : <ArchiveBoxIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-[#73cdbd] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-[#0f766e] transition-colors">{String(item.name)}</h4>
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
      <section className="py-24 sm:py-32 bg-[#0d2e28] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(143,216,188,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-2/5 text-left">
              <SectionTitle 
                align="left"
                light
                eyebrow="Preparación"
                title="Requisitos de tu"
                highlight="punto multiservicio."
              />
              <p className="text-teal-100/70 text-lg mb-12 leading-relaxed font-medium">
                La eficiencia de tu estación depende de una infraestructura sólida. Nuestros técnicos te asesoran en la distribución estratégica de tus equipos.
              </p>
              <Link to="/contacto" className="inline-flex items-center gap-4 text-[#8fd8bc] font-black uppercase tracking-[0.3em] text-[10px] hover:gap-6 transition-all group">
                Hablar con un técnico <ChevronDownIcon className="w-4 h-4 -rotate-90 group-hover:text-white" />
              </Link>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8fd8bc] to-[#73cdbd]">con un solo paquete.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Agua y limpieza: los negocios con mayor retorno de inversión en un solo lugar. Asegura tu éxito con Darmax.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-maquina/Tridente"
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
