import React, { useState, useRef, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroBannerSlide from "../components/HeroBannerSlide";
import TouchModal from "../components/TouchModal";
import { 
  BeakerIcon, 
  CircleStackIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  LightBulbIcon,
  HomeIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const IniciaNegocio = lazy(() => import("../components/IniciaNegocio"));

/* =========================================
   ANIMATION & PREMIUM HELPERS
========================================= */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.6, delay: d, ease: "easeOut" }
});

const GSAPCounter = React.memo(({ value, suffix = "" }) => {
  const el = useRef();
  const numericValue = parseInt(value.toString().replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(el.current, 
        { innerText: 0 }, 
        { 
          innerText: numericValue, 
          duration: 2.5, 
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: el.current,
            start: "top 90%",
          },
          ease: "expo.out",
          onUpdate: function() {
            if (el.current) {
              el.current.innerText = Math.floor(this.targets()[0].innerText).toLocaleString() + suffix;
            }
          }
        }
      );
    });
    return () => ctx.revert();
  }, [numericValue, suffix]);

  return <span ref={el}>0{suffix}</span>;
});

const MetricCard = React.memo(({ title, value, suffix, icon: Icon, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.55, delay, ease: "easeOut" }}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="relative p-6 sm:p-8 rounded-[2.5rem] bg-white border border-cyan-100 shadow-xl shadow-cyan-900/5 group overflow-hidden cursor-default transition-shadow hover:shadow-2xl hover:shadow-cyan-900/10"
  >
    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-cyan-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#168387] text-white flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-cyan-600/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
        <GSAPCounter value={value} suffix={suffix} />
      </div>
      <p className="text-[#168387] font-bold uppercase tracking-widest text-xs sm:text-sm">{title}</p>
    </div>
  </motion.div>
));

/* =========================================================
   CALCULADORA: UTILIDADES
========================================================= */
const CALC_BRAND = {
  accent: "#24d4da",
  accentDark: "#168387"
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/* =========================================================
   CALCULADORA: COMPONENTES UI
========================================================= */
const CompactInput = React.memo(({ label, value, setValue, color, suffix = "", prefix = "$", icon: Icon, help }) => {
  const handleChange = (e) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(cleanValue);
  };

  return (
    <div className="group w-full">
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 group-focus-within:text-slate-600 transition-colors">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
        </label>
        {help && (
          <div className="relative group/help">
            <InformationCircleIcon className="w-4 h-4 text-slate-300 cursor-help hover:text-cyan-500 transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-52 sm:w-56 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 pointer-events-none group-hover/help:opacity-100 transition-all z-50 shadow-xl leading-relaxed border border-white/10">
              {help}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-10 text-slate-900 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-opacity-20 text-sm"
          style={{ "--tw-ring-color": color }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-black">{suffix}</span>}
      </div>
    </div>
  );
});

const CompactSlider = React.memo(({ value, min, max, onChange, color, label }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1.5">
         <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
         <span className="text-xl sm:text-2xl font-black text-slate-800">${value}</span>
      </div>
      <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
        <div className="absolute h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
        <input type="range" min={min} max={max} value={value} onChange={onChange} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 transition-transform active:scale-125" style={{ left: `${percentage}%`, borderColor: color, transform: 'translate(-50%, -50%)' }} />
      </div>
    </div>
  );
});

/* =========================================================
   CALCULADORA: PANEL DE RESULTADOS
========================================================= */
const DashboardCard = React.memo(({ title, amount, sub }) => {
  const el = useRef();
  const count = useRef({ value: 0 });
  
  useEffect(() => {
    const targetValue = isNaN(amount) ? 0 : amount;
    const ctx = gsap.context(() => {
      gsap.to(count.current, {
        value: targetValue,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          if (el.current) {
            el.current.innerText = formatCurrency(Math.floor(count.current.value));
          }
        }
      });
    });
    return () => ctx.revert();
  }, [amount]);

  return (
    <div className="p-3 sm:p-3.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-colors duration-500">
      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 group-hover:text-cyan-400/50 transition-colors">{title}</p>
      <p className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
        <span ref={el}>{formatCurrency(amount || 0)}</span>
      </p>
      {sub && <p className="text-[8px] text-white/20 uppercase font-bold mt-0.5 tracking-wider">{sub}</p>}
    </div>
  );
});

const GSAPCurrencyCounter = React.memo(({ value }) => {
  const el = useRef();
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(el.current, {
        innerText: value || 0,
        duration: 2,
        snap: { innerText: 1 },
        ease: "expo.out",
        onUpdate: function() {
          if (el.current) {
            el.current.innerText = formatCurrency(Math.floor(this.targets()[0].innerText));
          }
        }
      });
    });
    return () => ctx.revert();
  }, [value]);
  return <span ref={el}>$0</span>;
});

const DashboardResults = React.memo(function DashboardResults({ data }) {
  return (
    <div className="h-full bg-[#0f172a] px-5 py-6 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden">
      {/* Luces de fondo dinámicas */}
      <div className="absolute top-0 right-0 w-80 h-80 blur-[100px] -mr-40 -mt-40 animate-pulse pointer-events-none" style={{ backgroundColor: `${CALC_BRAND.accent}15` }}></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 blur-[100px] -ml-32 -mb-32 pointer-events-none" style={{ backgroundColor: `${CALC_BRAND.accent}10` }}></div>
      
      <div className="relative z-10 space-y-4 sm:space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-inner border transition-transform duration-500 hover:rotate-12" style={{ backgroundColor: `${CALC_BRAND.accent}20`, color: CALC_BRAND.accent, borderColor: `${CALC_BRAND.accent}20` }}>
            <ArrowTrendingUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="text-white font-black text-base sm:text-lg tracking-tight leading-none mb-1">Utilidad Proyectada</h3>
            <p className="text-white/30 text-[9px] sm:text-[10px] uppercase tracking-widest font-black">Análisis de Retorno Mensual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          <DashboardCard title="Ingreso Bruto" amount={data.ingresosBrutos} sub={`${data.ventasMes} vtas/mes`} />
          <DashboardCard title="Producción" amount={data.costosProduccion} sub="Insumos" />
          <DashboardCard title="Gastos Fijos" amount={data.gastosFijos} sub="Operación" />
          <DashboardCard title="Costo x Unidad" amount={data.costoUnitario} sub="Promedio" />
          
          {/* CONTENEDOR GARRAFON TÉCNICO */}
          <div className="col-span-2 mt-2 sm:mt-4 relative flex items-center justify-center min-h-[220px] sm:min-h-[320px] group overflow-hidden">
            {/* SVG GARRAFON TÉCNICO */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2 sm:p-4">
              <svg 
                viewBox="0 0 200 300" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-auto h-full max-h-[360px] sm:max-h-[400px] transition-all duration-1000 drop-shadow-[0_0_50px_rgba(36,212,218,0.3)] scale-[1.8] sm:scale-[1.2] translate-y-[20%] sm:translate-y-[15%]"
              >
                <path 
                  d="M85 30 H115 V50 C160 50 195 60 195 90 v 40 q -5 0 -5 3 v 14 q 0 3 5 3 v 20 q -5 0 -5 3 v 14 q 0 3 5 3 v 20 q -5 0 -5 3 v 14 q 0 3 5 3 v 45 C195 286 186 295 175 295 H25 C14 295 5 286 5 275 v -45 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -20 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -20 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -40 C5 60 40 50 85 50 V30 Z" 
                  fill="url(#garrafonGradient)"
                  stroke="#24d4da"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                />
                <rect x="85" y="10" width="30" height="20" rx="3" fill="#24d4da" fillOpacity="0.2" stroke="#24d4da" strokeWidth="2" strokeOpacity="0.6" />
                <defs>
                  <linearGradient id="garrafonGradient" x1="100" y1="30" x2="100" y2="290" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#24d4da" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#24d4da" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* CONTENIDO DE DATOS */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center gap-1 sm:gap-2 translate-y-2 sm:translate-y-4">
              <div className="mb-2 sm:mb-2">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/70 drop-shadow-sm">Utilidad Mensual Neta</p>
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter leading-none drop-shadow-md">
                  <GSAPCurrencyCounter value={data.utilidadMensual} />
                </div>
              </div>
              
              <div>
                <p className="text-[8px] sm:text-[9px] font-black text-white/60 uppercase tracking-widest drop-shadow-sm">Utilidad Anual Estimada</p>
                <div className="text-lg sm:text-2xl md:text-2xl font-black text-white/80 leading-none drop-shadow-md">
                  <GSAPCurrencyCounter value={data.utilidadAnual} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
          Margen Neto: <span className="font-black ml-1.5" style={{ color: CALC_BRAND.accent }}>
            {data.ingresosBrutos > 0 ? Math.round((data.utilidadMensual / data.ingresosBrutos) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
});

/* =========================================================
   CALCULADORA: VISTA DE AGUA
========================================================= */
const AguaView = React.memo(function AguaView() {
  const [precioVenta, setPrecioVenta] = useState(25);
  const [ventasDia, setVentasDia] = useState("30");
  const [diasOp, setDiasOp] = useState("28");
  const [costoPipa, setCostoPipa] = useState("2700");
  const [costoTapa, setCostoTapa] = useState("365");
  const [renta, setRenta] = useState("5000");
  const [luz, setLuz] = useState("500");
  const [internet, setInternet] = useState("500");
  const [otros, setOtros] = useState("0");
  const [osmosis, setOsmosis] = useState(true);

  const handlePrecioVentaChange = useCallback((e) => {
    setPrecioVenta(Number(e.target.value));
  }, []);

  const handleOsmosisToggle = useCallback(() => {
    setOsmosis((prev) => !prev);
  }, []);

  const results = useMemo(() => {
    const safe = (v) => (v === "" ? 0 : Number(v));
    const nVentasMes = safe(ventasDia) * safe(diasOp);
    
    // Logica de costos unitarios
    const costoH2OUnitario = (21 * (osmosis ? 1.25 : 1)) * (safe(costoPipa) / 10000);
    const costoTapaUnitario = safe(costoTapa) / 1000;
    
    const costsProd = (costoH2OUnitario + costoTapaUnitario) * nVentasMes;
    const costsFijos = safe(renta) + safe(luz) + safe(internet) + safe(otros);
    const ingresos = nVentasMes * precioVenta;
    const utilidad = ingresos - (costsProd + costsFijos);

    return {
      ventasMes: nVentasMes,
      diasActivos: diasOp,
      ingresosBrutos: ingresos,
      costosProduccion: costsProd,
      gastosFijos: costsFijos,
      utilidadMensual: utilidad,
      utilidadAnual: utilidad * 12,
      costoUnitario: nVentasMes > 0 ? (costsProd + costsFijos) / nVentasMes : 0
    };
  }, [ventasDia, diasOp, osmosis, costoPipa, costoTapa, renta, luz, internet, otros, precioVenta]);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* SECCIÓN CONFIGURACIÓN (IZQUIERDA) */}
      <div className="w-full lg:w-[62%] p-5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar-thin bg-white">
        
        <div className="space-y-6 sm:space-y-8">
          <CompactSlider label="Precio de Venta Sugerido" value={precioVenta} min={10} max={60} onChange={handlePrecioVentaChange} color={CALC_BRAND.accent} />
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-inner">
            <CompactInput label="Ventas / Día" value={ventasDia} setValue={setVentasDia} color={CALC_BRAND.accent} prefix="#" icon={CurrencyDollarIcon} help="Promedio de garrafones vendidos cada 24h." />
            <CompactInput label="Días de Operación" value={diasOp} setValue={setDiasOp} color={CALC_BRAND.accent} prefix="#" icon={GlobeAltIcon} help="Vending: 30 días. Mostrador: 22-26 días considerando descansos semanales." />
          </div>

          <div className="space-y-4 sm:space-y-5">
            <p className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-200 pb-2 flex items-center gap-2">
                <CircleStackIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Producción e Insumos
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <CompactInput label="Costo Pipa (10k L)" value={costoPipa} setValue={setCostoPipa} color={CALC_BRAND.accent} icon={CircleStackIcon} help="Recomendación: Pipa acero inoxidable con agua de pozo certificado ($2,700 promedio)." />
              <CompactInput label="Millar de Tapas" value={costoTapa} setValue={setCostoTapa} color={CALC_BRAND.accent} icon={BeakerIcon} help="Insumo por garrafón: Tapa con liner de garantía ($370 el millar)." />
            </div>
            
            <div className="p-4 sm:p-4 rounded-xl bg-cyan-50/30 border border-cyan-200/50 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black uppercase text-cyan-700 tracking-widest">Sistema de Ósmosis Inversa</span>
                <button 
                  type="button"
                  onClick={handleOsmosisToggle} 
                  className={`w-9 h-5 sm:w-10 sm:h-5.5 rounded-full transition-colors duration-300 ${osmosis ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300'} relative cursor-pointer`}
                >
                  <div className={`absolute top-0.5 sm:top-0.75 left-0.5 sm:left-0.75 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md ${osmosis ? 'translate-x-4 sm:translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-cyan-800/60 leading-relaxed font-medium">
                *Este proceso garantiza la máxima calidad, considerando un 25% de merma técnica por rechazo de sales y lavado de membranas.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <p className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-200 pb-2 flex items-center gap-2">
                <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Gastos Operativos Mensuales
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <CompactInput label="Renta" value={renta} setValue={setRenta} color={CALC_BRAND.accent} icon={HomeIcon} />
              <CompactInput label="Luz" value={luz} setValue={setLuz} color={CALC_BRAND.accent} icon={LightBulbIcon} />
              <CompactInput label="Internet" value={internet} setValue={setInternet} color={CALC_BRAND.accent} icon={GlobeAltIcon} />
              <CompactInput label="Otros" value={otros} setValue={setOtros} color={CALC_BRAND.accent} icon={WrenchScrewdriverIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN RESULTADOS (DERECHA) */}
      <div className="w-full lg:w-[38%] border-t lg:border-t-0 lg:border-l border-slate-100 bg-white">
        <DashboardResults data={results} />
      </div>
    </div>
  );
});

/* =========================================================
   PÁGINA DE LANDING PRINCIPAL
========================================================= */
export default function LandingPage() {
  const [tipoCalc, setTipoCalc] = useState("agua");
  const [isTouchModalOpen, setIsTouchModalOpen] = useState(false);

  // Apertura inteligente sutil tras 4.5 segundos si nunca se ha visto/cerrado previamente
  useEffect(() => {
    try {
      const hasSeenModal = localStorage.getItem("darmax_touch_modal_seen");
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setIsTouchModalOpen(true);
        }, 4500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Error al leer localStorage:", e);
    }
  }, []);

  const handleCloseTouchModal = useCallback(() => {
    try {
      localStorage.setItem("darmax_touch_modal_seen", "true");
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
    setIsTouchModalOpen(false);
  }, []);

  const handleOpenTouchModal = useCallback(() => {
    setIsTouchModalOpen(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Darmax Agua | Purificadoras, Vending y Ósmosis Inversa</title>
        <meta name="description" content="Inicia tu negocio 24/7 con purificadoras de agua, máquinas vending y sistemas de ósmosis inversa. Expertos en agua alcalina y vending de productos de limpieza en México." />
        <meta name="keywords" content="purificadora, agua purificada, vending de agua purificada, negocio 24/7, vending productos de limpieza, osmosis inversa, agua alcalina, vending, inicia tu negocio, darmax agua" />
        
        {/* Open Graph para redes sociales */}
        <meta property="og:title" content="Darmax Agua | Líderes en Purificadoras y Vending 24/7" />
        <meta property="og:description" content="Emprende un negocio rentable de agua purificada y productos de limpieza con tecnología de vanguardia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://darmaxagua.com.mx/" />
        
        {/* Datos Estructurados (JSON-LD) optimizados */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Darmax Agua",
            "description": "Expertos en plantas purificadoras de agua, máquinas vending 24/7 y sistemas de ósmosis inversa para negocios rentables.",
            "url": "https://darmaxagua.com.mx/",
            "telephone": "+525519655369",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Nezahualcóyotl",
              "addressRegion": "Estado de México",
              "addressCountry": "MX"
            },
            "areaServed": "MX",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Catálogo de Negocios",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Plantas Purificadoras de Agua"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Máquinas Vending 24/7"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Sistemas de Ósmosis Inversa y Agua Alcalina"
                  }
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-white selection:bg-[#24d4da] selection:text-white">
        {/* HERO SECTION */}
        <HeroBannerSlide onOpenTouchModal={handleOpenTouchModal} />

        {/* SECCIÓN DE AUTORIDAD */}
        <section className="py-12 sm:py-16 bg-slate-50/50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <MetricCard title="Equipos Instalados" value="350" suffix="+" icon={CheckBadgeIcon} delay={0} />
              <MetricCard title="Negocios Rentables" value="280" suffix="+" icon={ChartBarIcon} delay={0.12} />
              <MetricCard title="Litros Purificados" value="10" suffix="M+" icon={RocketLaunchIcon} delay={0.24} />
            </div>
          </div>
        </section>

        {/* CATÁLOGO Y ROI CON CARGA DIFERIDA */}
        <div className="scroll-mt-1">
          <Suspense fallback={
            <div className="min-h-[400px] flex items-center justify-center bg-slate-50/50">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <IniciaNegocio />
          </Suspense>
        </div>

        {/* CALCULADORA INTEGRADA */}
        <section id="calculadora-negocio" className="min-h-screen lg:min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center w-full font-sans overflow-visible lg:overflow-hidden py-12 sm:py-16">
          
          <div className="max-w-[1440px] mx-auto px-0 sm:px-6 w-full flex flex-col">
            {/* Header Calculadora - HISTORIA DE ÉXITO MATEMÁTICO */}
            <motion.div 
              {...fadeUp(0)}
              className="w-full mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-6 sm:px-0"
            >
              <div className="max-w-3xl text-left">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-2 sm:mb-4">
                  Tu éxito, <br />
                  es <span style={{ color: CALC_BRAND.accentDark }}>matemática pura.</span>
                </h2>
                <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed">
                  Descubre el potencial real de tu inversión, las mejores decisiones comienzan con datos reales.
                </p>
              </div>

              {/* Switch de modo discreto */}
              <div className="bg-slate-200/50 p-1 rounded-xl flex shadow-inner border border-slate-200 shrink-0 mx-6 sm:mx-0">
                <button 
                  type="button"
                  onClick={() => setTipoCalc("agua")}
                  className={`px-5 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-black rounded-lg transition-all ${tipoCalc === "agua" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  AGUA
                </button>
                <button 
                  type="button"
                  onClick={() => setTipoCalc("limpieza")}
                  className={`px-5 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-black rounded-lg transition-all ${tipoCalc === "limpieza" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  LIMPIEZA
                </button>
              </div>
            </motion.div>

            <motion.div 
              {...fadeUp(0.2)}
              className="w-full bg-white rounded-none sm:rounded-[3rem] shadow-2xl shadow-slate-900/10 overflow-hidden border-y sm:border border-slate-200 flex flex-col lg:h-[620px] min-h-0"
            >
              <div className="flex-1 min-h-0">
                {/* Contenedor persistente para no perder datos al alternar de pestana */}
                <div className={tipoCalc === "agua" ? "h-full" : "hidden"}>
                  <AguaView />
                </div>
                {tipoCalc === "limpieza" && (
                  <div className="h-full flex items-center justify-center p-8 sm:p-12 text-center animate-fade-in bg-slate-50/20">
                    <div className="space-y-6 sm:space-y-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 text-amber-400 rounded-[2.5rem] flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-sm border border-amber-100">✨</div>
                      <div>
                        <h3 className="text-slate-900 font-black text-2xl sm:text-3xl tracking-tight">Vending Limpieza</h3>
                        <p className="text-slate-400 text-base sm:text-lg max-w-[300px] mx-auto mt-3 leading-relaxed">Módulo de alta demanda en calibración de costos variables e insumos químicos.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs sm:text-sm text-slate-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-70 shrink-0 px-6 sm:px-0">
              <InformationCircleIcon className="w-5 h-5 shrink-0" style={{ color: CALC_BRAND.accentDark }} />
              <span>Valores sugeridos basados en el mercado mexicano actual</span>
            </div>
          </div>
        </section>
      </main>
      <TouchModal isOpen={isTouchModalOpen} onClose={handleCloseTouchModal} />
    </>
  );
}

