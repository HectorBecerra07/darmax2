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
} from "@heroicons/react/24/outline";

/* --- Identity & Style (Vending Limpieza: Amarillo to Dorado) --- */
const BRAND = {
  yellowOrange: "#e7b341",
  warmGold: "#edc53a",
  intenseYellow: "#f2df1f",
  lemonYellow: "#ece61a",
  darkGold: "#856404",
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, ease: "easeOut" }
};

/* --- Data --- */
const limpiezaModels = [
  {
    id: "Vending5",
    name: "Darmax Clean - 5 Productos",
    tagline: "Diversificación Inteligente",
    price: "$34,950",
    gradient: "from-[#e7b341] via-[#edc53a] to-[#f2df1f]",
    image: "/img/vending/productoslimpieza5.png",
    specs: [
      "Despacho de 5 productos distintos",
      "5 Bombas 1/2 HP con Válvula Check",
      "Gabinete Inox 304 con Llave",
      "Monedero que da cambio ($1, $2, $5, $10)",
      "Llenado de 1 Litro por Ciclo",
      "Registro Electrónico de Ventas",
      "Vinil UV de Alta Resistencia",
    ]
  },
  {
    id: "Vending8",
    name: "Darmax Clean - 8 Productos",
    tagline: "Máximo Portafolio",
    price: "$44,950",
    gradient: "from-[#edc53a] via-[#f2df1f] to-[#ece61a]",
    image: "/img/vending/productoslimpieza8.png",
    specs: [
      "Despacho de 8 productos distintos",
      "8 Bombas 1/2 HP con Válvula Check",
      "Ideal para alta rotación de insumos",
      "Gabinete Reforzado Inox 304",
      "Sensado de precisión por litros",
      "Panel de configuración de precios",
      "Luz interna LED para área de servicio",
    ]
  },
];

const commonComponents = [
  {
    category: "Ingeniería de Dosificación",
    items: [
      { name: "Bombas 1/2 HP Inox", desc: "Motor de alta eficiencia con válvula check integrada para evitar goteos." },
      { name: "Sensado de Litros", desc: "Precisión exacta de 1 litro por operación, garantizando confianza al cliente." },
      { name: "Mangueras Industriales", desc: "Material resistente a químicos corrosivos como cloro y detergentes." },
      { name: "Gabinete Inox 304", desc: "Estructura blindada de acero quirúrgico calibre 18." },
    ]
  },
  {
    category: "Control y Seguridad",
    items: [
      { name: "Monedero de Alta Gama", desc: "Acepta todas las denominaciones nacionales y entrega cambio automático." },
      { name: "Contador de Ventas", desc: "Registro digital inalterable de litros vendidos y dinero recaudado." },
      { name: "Protección UV", desc: "Laminado especial que protege la imagen y componentes del sol." },
      { name: "Cierre de Seguridad", desc: "Chapa de alta seguridad para proteger la recaudación diaria." },
    ]
  }
];

const requirements = [
  { title: "Espacio", desc: "Compacto: requiere solo 2 m² de área libre." },
  { title: "Instalación", desc: "Muro de 96x58 cm a 75 cm del suelo." },
  { title: "Eléctrico", desc: "Contacto 127V con regulador de voltaje." },
  { title: "Hidráulico", desc: "Puntos de succión listos para bidones." },
];

const faqs = [
  {
    q: "¿Qué productos puedo vender en la máquina?",
    a: "Puedes configurar cualquier producto de limpieza líquido a granel: cloro, suavizante de telas, detergente líquido, desengrasante, limpiador multiusos, entre otros.",
  },
  {
    q: "¿Cómo se configuran los precios?",
    a: "Cada una de las líneas (5 u 8) es independiente. Puedes asignar un precio diferente a cada producto directamente desde el panel de control interno.",
  },
  {
    q: "¿La máquina requiere una conexión de agua constante?",
    a: "No, la máquina succiona el producto directamente de los bidones o contenedores que coloques en la parte trasera o interna de tu local.",
  },
];

/* --- UI Components --- */
function SectionTitle({ eyebrow, title, highlight, light = false, align = "center" }) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const eyebrowColor = light ? "text-yellow-100" : "text-[#e7b341]";
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
          <span className="inline-block pb-2 pr-4 text-transparent bg-clip-text bg-gradient-to-r from-[#e7b341] to-[#ece61a]">
            {String(highlight)}
          </span>
        )}
      </h2>
    </div>
  );
}

const ComparisonTable = () => (
  <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-yellow-900/5">
    <table className="w-full text-left border-collapse min-w-[700px]">
      <thead>
        <tr className="bg-gradient-to-r from-[#e7b341] to-[#ece61a] text-yellow-950">
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/20">Característica Técnica</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest border-r border-white/20">Vending 5 Productos</th>
          <th className="p-7 text-[10px] font-black uppercase tracking-widest">Vending 8 Productos</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 font-medium">
        {[
          { label: "Número de Dispensadores", vals: ["5 Canales", "8 Canales"] },
          { label: "Sistema de Cobro con Cambio", vals: [true, true] },
          { label: "Bombas 1/2 HP", vals: ["5 Unidades", "8 Unidades"] },
          { label: "Gabinete Inox 304", vals: [true, true] },
          { label: "Sensado de Litros", vals: [true, true] },
          { label: "Luz LED de Servicio", vals: [true, true] },
          { label: "Inversión Base", vals: ["$34,950", "$44,950"], bold: true },
        ].map((row, i) => (
          <tr key={i} className="hover:bg-yellow-50/20 transition-colors">
            <td className="p-7 text-slate-900 font-black text-sm uppercase tracking-tight">{row.label}</td>
            {row.vals.map((v, idx) => (
              <td key={idx} className={`p-7 text-sm ${row.bold ? "font-black text-slate-900" : "text-slate-500"}`}>
                {typeof v === "boolean" ? (
                  v ? <CheckIcon className="h-6 w-6 text-yellow-600" /> : <XMarkIcon className="h-6 w-6 text-slate-200" />
                ) : String(v)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function VendingLimpiezaInfo() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white selection:bg-[#f2df1f] selection:text-yellow-950 font-sans overflow-x-hidden">
      <Helmet>
        <title>Vending de Productos de Limpieza | Darmax Clean</title>
        <meta name="description" content="Automatiza la venta de productos de limpieza a granel. Vending de 5 y 8 productos con gabinete de acero inoxidable y cobro automático." />
      </Helmet>

      <SEO 
        title="Darmax Clean - Vending de Limpieza 24/7"
        description="Inicia un negocio ecológico con nuestras máquinas vending de productos de limpieza. Alta rentabilidad y fácil operación."
      />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/vending/5productos.jpg"
            alt="Darmax Clean Vending"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#856404]/40 via-slate-900/60 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#e7b341]/20 via-transparent to-[#ece61a]/10" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl">
            <span className="inline-block px-5 py-1.5 rounded-full bg-yellow-500/10 text-[#f2df1f] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-yellow-500/20 backdrop-blur-sm">
              Darmax Clean Identity
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Negocio <br />
              que brilla <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7b341] to-[#ece61a]">por su cuenta.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              Automatiza la venta de detergente, cloro y suavizante. La línea Darmax Clean es la solución más rentable y sostenible para el emprendimiento moderno.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                to="/configurar-maquina/Vending-Limpieza"
                className="px-12 py-5 bg-gradient-to-r from-[#e7b341] to-[#edc53a] hover:shadow-yellow-500/20 text-yellow-950 font-black rounded-2xl shadow-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
              >
                Configurar mi Vending
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

      {/* SECCIÓN MODELOS */}
      <section id="modelos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Configuraciones Clean"
            title="Dos niveles de"
            highlight="capacidad operativa."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {limpiezaModels.map((m, i) => (
              <motion.div
                key={m.id}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-yellow-900/5 overflow-hidden hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${m.gradient}`} />
                <div className="p-10 flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#856404] mb-2">{m.tagline}</span>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight mb-6">{m.name}</h3>
                  
                  <div className="aspect-square mb-10 bg-[#FEFCE8] rounded-[2.5rem] overflow-hidden flex items-center justify-center group-hover:bg-[#FEF9C3] transition-colors duration-500">
                    <img src={m.image} alt={m.name} className="max-h-full object-contain transform group-hover:scale-110 transition-transform duration-700" />
                  </div>

                  <div className="mt-auto space-y-6">
                    <ul className="grid grid-cols-1 gap-3">
                       {m.specs.map((s, idx) => (
                         <li key={idx} className="flex items-start gap-3 text-xs font-bold text-slate-500 uppercase tracking-tight">
                           <CheckIcon className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
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
                        to="/configurar-maquina/Vending-Limpieza"
                        className="block w-full py-4 text-center bg-gradient-to-r from-[#e7b341] to-[#ece61a] text-yellow-950 font-black rounded-2xl hover:shadow-lg transition-all text-[10px] uppercase tracking-widest"
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
      <section className="py-24 sm:py-32 bg-[#FFFCF0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Transparencia Operativa"
            title="Diferencias que"
            highlight="impulsan tu rentabilidad."
          />
          <ComparisonTable />
        </div>
      </section>

      {/* SECCIÓN COMPONENTES TÉCNICOS */}
      <section id="tecnico" className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <SectionTitle 
            eyebrow="Tecnología Darmax Clean"
            title="Componentes de"
            highlight="grado industrial."
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {commonComponents.map((cat, i) => (
              <motion.div key={cat.category} initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e7b341] to-[#f2df1f] flex items-center justify-center text-yellow-950 shadow-lg">
                    {i === 0 ? <WrenchIcon className="w-6 h-6" /> : <ArchiveBoxIcon className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{String(cat.category)}</h3>
                </div>
                <div className="space-y-6">
                  {cat.items.map((item) => (
                    <div key={item.name} className="group p-8 rounded-[2rem] bg-[#FFFEF2] border border-yellow-100 hover:border-[#f2df1f] hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-yellow-900/5">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 group-hover:text-yellow-600 transition-colors">{String(item.name)}</h4>
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
      <section className="py-24 sm:py-32 bg-yellow-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(231,179,65,0.15),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-2/5 text-left">
              <SectionTitle 
                align="left"
                light
                eyebrow="Antes de Instalar"
                title="Preparando tu"
                highlight="punto de recarga."
              />
              <p className="text-yellow-100/70 text-lg mb-12 leading-relaxed font-medium">
                La eficiencia de tu vending Darmax Clean comienza con un local bien preparado. Nuestro equipo te asesora en las dimensiones y obra civil necesaria.
              </p>
              <Link to="/contacto" className="inline-flex items-center gap-4 text-[#f2df1f] font-black uppercase tracking-[0.3em] text-[10px] hover:gap-6 transition-all group">
                Hablar con un asesor técnico <ChevronDownIcon className="w-4 h-4 -rotate-90 group-hover:text-white" />
              </Link>
            </div>
            <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {requirements.map((r) => (
                <div key={r.title} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-700">
                  <h5 className="text-[#f2df1f] font-black text-[10px] uppercase tracking-[0.3em] mb-4">{String(r.title)}</h5>
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
          <div className="space-y-5 border border-slate-100 rounded-[3.5rem] overflow-hidden shadow-xl shadow-yellow-900/5">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-slate-50 last:border-none">
                <summary className="cursor-pointer list-none p-10 font-black text-slate-800 flex items-center justify-between hover:bg-[#FFFCF0] transition-colors uppercase tracking-tight text-sm">
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
          <img src="/img/vending/5productos.jpg" alt="Darmax Clean" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-10">
            Lidera la venta <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e7b341] to-[#ece61a]">de productos a granel.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
            Súmate a la tendencia ecológica más rentable de México. Configura tu vending Darmax Clean y empieza a facturar hoy.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/configurar-maquina/Vending-Limpieza"
              className="px-14 py-7 bg-gradient-to-r from-[#e7b341] to-[#ece61a] text-yellow-950 font-black rounded-2xl shadow-2xl shadow-yellow-500/20 transition-all transform hover:scale-110 uppercase tracking-widest text-sm"
            >
              Configurar mi Vending
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
