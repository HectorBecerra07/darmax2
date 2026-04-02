import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import IniciaNegocio from "../components/IniciaNegocio";
import HeroBannerSlide from "../components/HeroBannerSlide";
import { 
  BeakerIcon, 
  CircleStackIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  LightBulbIcon,
  HomeIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

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
const CompactInput = ({ label, value, setValue, color, suffix = "", prefix = "$", icon: Icon, help }) => {
  const handleChange = (e) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(cleanValue);
  };

  return (
    <div className="group w-full">
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-slate-600 transition-colors">
          {Icon && <Icon className="w-3 h-3" />}
          {label}
        </label>
        {help && (
          <div className="relative group/help">
            <InformationCircleIcon className="w-3.5 h-3.5 text-slate-300 cursor-help hover:text-cyan-500 transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 pointer-events-none group-hover/help:opacity-100 transition-all z-50 shadow-xl leading-relaxed border border-white/10">
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
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[9px] font-black">{suffix}</span>}
      </div>
    </div>
  );
};

const CompactSlider = ({ value, min, max, onChange, color, label }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
         <span className="text-2xl font-black text-slate-800">${value}</span>
      </div>
      <div className="relative w-full h-1.5 bg-slate-100 rounded-full">
        <div className="absolute h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
        <input type="range" min={min} max={max} value={value} onChange={onChange} className="absolute w-full h-full opacity-0 cursor-pointer z-10" />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 transition-transform active:scale-125" style={{ left: `${percentage}%`, borderColor: color, transform: 'translate(-50%, -50%)' }} />
      </div>
    </div>
  );
};

/* =========================================================
   CALCULADORA: PANEL DE RESULTADOS
========================================================= */
function DashboardResults({ data }) {
  const Card = ({ title, amount, sub }) => (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{title}</p>
      <p className="text-xl font-black text-white tracking-tight">{formatCurrency(amount)}</p>
      {sub && <p className="text-[9px] text-white/20 uppercase font-bold mt-1 tracking-wider">{sub}</p>}
    </div>
  );

  return (
    <div className="h-full bg-[#0f172a] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] -mr-40 -mt-40"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner border border-cyan-500/20">
            <ArrowTrendingUpIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight leading-none mb-1">Utilidad Proyectada</h3>
            <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Análisis de Retorno Mensual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card title="Ingreso Bruto" amount={data.ingresosBrutos} sub={`${data.ventasMes} vtas/mes`} />
          <Card title="Producción" amount={data.costosProduccion} sub="Insumos" />
          <Card title="Gastos Fijos" amount={data.gastosFijos} sub="Operación" />
          <Card title="Costo x Unidad" amount={data.costoUnitario} sub="Promedio" />
          
          <div className="col-span-2 mt-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/20 border border-white/10 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 mb-2">Utilidad Mensual Neta</p>
            <p className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{formatCurrency(data.utilidadMensual)}</p>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/20">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Utilidad Anual Est.</span>
              <span className="text-2xl font-black text-white leading-none">{formatCurrency(data.utilidadAnual)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between">
        <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
          Margen Neto: <span className="text-cyan-400 font-black ml-1">
            {data.ingresosBrutos > 0 ? Math.round((data.utilidadMensual / data.ingresosBrutos) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CALCULADORA: VISTA DE AGUA
========================================================= */
function AguaView({ isActive }) {
  const [precioVenta, setPrecioVenta] = useState(20);
  const [ventasDia, setVentasDia] = useState("30");
  const [diasOp, setDiasOp] = useState("30");
  const [costoPipa, setCostoPipa] = useState("2700");
  const [costoTapa, setCostoTapa] = useState("370");
  const [renta, setRenta] = useState("5000");
  const [luz, setLuz] = useState("500");
  const [internet, setInternet] = useState("500");
  const [otros, setOtros] = useState("400");
  const [osmosis, setOsmosis] = useState(true);

  const safe = (v) => (v === "" ? 0 : Number(v));
  const nVentasMes = safe(ventasDia) * safe(diasOp);
  const costoH2O = (21 * (osmosis ? 1.25 : 1)) * (safe(costoPipa) / 10000);
  const costsProd = (costoH2O + (safe(costoTapa) / 1000)) * nVentasMes;
  const costsFijos = safe(renta) + safe(luz) + safe(internet) + safe(otros);
  const ingresos = nVentasMes * precioVenta;
  const utilidad = ingresos - (costsProd + costsFijos);

  const results = {
    ventasMes: nVentasMes,
    diasActivos: diasOp,
    ingresosBrutos: ingresos,
    costosProduccion: costsProd,
    gastosFijos: costsFijos,
    utilidadMensual: utilidad,
    utilidadAnual: utilidad * 12,
    costoUnitario: nVentasMes > 0 ? (costsProd + costsFijos) / nVentasMes : 0
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* SECCIÓN CONFIGURACIÓN (IZQUIERDA) */}
      <div className="w-full lg:w-[62%] p-8 lg:p-12 space-y-8 overflow-y-auto custom-scrollbar-thin bg-white">
        
        <div className="space-y-8">
          <CompactSlider label="Precio de Venta Sugerido" value={precioVenta} min={10} max={60} onChange={(e) => setPrecioVenta(Number(e.target.value))} color={CALC_BRAND.accent} />
          
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
            <CompactInput label="Ventas / Día" value={ventasDia} setValue={setVentasDia} color={CALC_BRAND.accent} prefix="#" icon={CurrencyDollarIcon} help="Promedio de garrafones vendidos cada 24h." />
            <CompactInput label="Días de Operación" value={diasOp} setValue={setDiasOp} color={CALC_BRAND.accent} prefix="#" icon={GlobeAltIcon} help="Vending: 30 días. Mostrador: 22-26 días considerando descansos semanales." />
          </div>

          <div className="space-y-5">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <CircleStackIcon className="w-4 h-4" /> Producción e Insumos
            </p>
            <div className="grid grid-cols-2 gap-6">
              <CompactInput label="Costo Pipa (10k L)" value={costoPipa} setValue={setCostoPipa} color={CALC_BRAND.accent} icon={CircleStackIcon} help="Recomendación: Pipa acero inoxidable con agua de pozo certificado ($2,700 promedio)." />
              <CompactInput label="Millar de Tapas" value={costoTapa} setValue={setCostoTapa} color={CALC_BRAND.accent} icon={BeakerIcon} help="Insumo por garrafón: Tapa con liner de garantía ($370 el millar)." />
            </div>
            
            <div className="p-5 rounded-2xl bg-cyan-50/30 border border-cyan-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-cyan-700 tracking-widest">Sistema de Ósmosis Inversa</span>
                <button 
                  onClick={() => setOsmosis(!osmosis)} 
                  className={`w-9 h-5 rounded-full transition-all duration-300 ${osmosis ? 'bg-cyan-500 shadow-sm' : 'bg-slate-300'} relative cursor-pointer`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-md ${osmosis ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-[10px] text-cyan-800/50 leading-relaxed font-medium">
                *Este proceso garantiza la máxima calidad, considerando un 25% de merma técnica por rechazo de sales y lavado de membranas.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <HomeIcon className="w-4 h-4" /> Gastos Operativos Mensuales
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <CompactInput label="Renta" value={renta} setValue={setRenta} color={CALC_BRAND.accent} icon={HomeIcon} />
              <CompactInput label="Luz" value={luz} setValue={setLuz} color={CALC_BRAND.accent} icon={LightBulbIcon} />
              <CompactInput label="Internet" value={internet} setValue={setInternet} color={CALC_BRAND.accent} icon={GlobeAltIcon} />
              <CompactInput label="Otros" value={otros} setValue={setOtros} color={CALC_BRAND.accent} icon={WrenchScrewdriverIcon} />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN RESULTADOS (DERECHA) */}
      <div className="w-full lg:w-[38%] border-t lg:border-t-0 lg:border-l border-slate-100">
        <DashboardResults data={results} />
      </div>
    </div>
  );
}

/* =========================================================
   PÁGINA DE LANDING PRINCIPAL
========================================================= */
export default function LandingPage() {
  const [tipoCalc, setTipoCalc] = useState("agua");
  const inicioRef = useRef(null);
  const calculadoraRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Darmax | Emprende tu Negocio de Agua Purificada</title>
        <meta name="description" content="Inicia tu emprendimiento con purificadoras, máquinas vending de agua y productos de limpieza con tecnología Darmax." />
      </Helmet>

      <main className="min-h-screen bg-white selection:bg-[#24d4da] selection:text-white">
        {/* HERO SECTION */}
        <HeroBannerSlide />

        {/* CATÁLOGO Y ROI */}
        <div ref={inicioRef} className="scroll-mt-1">
          <IniciaNegocio />
        </div>

        {/* CALCULADORA INTEGRADA */}
        <section id="calculadora-negocio" ref={calculadoraRef} className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center w-full font-sans overflow-hidden py-24">
          
          <div className="max-w-7xl mx-auto px-4 w-full flex flex-col">
            {/* Header Calculadora - ARMONIZADO CON CATALOGO */}
            <div className="w-full mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="max-w-3xl text-left">
                <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block">
                  Inteligencia Financiera
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                  Calculadora de <span className="text-[#168387]">rentabilidad real</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Proyecta tus utilidades considerando costos de pipa, insumos y mermas operativas.
                </p>
              </div>

              {/* Switch de modo discreto */}
              <div className="bg-slate-200/50 p-1.5 rounded-xl flex shadow-inner border border-slate-200 shrink-0">
                <button 
                  onClick={() => setTipoCalc("agua")}
                  className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${tipoCalc === "agua" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  AGUA
                </button>
                <button 
                  onClick={() => setTipoCalc("limpieza")}
                  className={`px-5 py-2 text-[10px] font-black rounded-lg transition-all ${tipoCalc === "limpieza" ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  LIMPIEZA
                </button>
              </div>
            </div>

            <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col h-full lg:max-h-[650px] min-h-0">
              <div className="flex-1 min-h-0">
                <AguaView isActive={tipoCalc === "agua"} />
                {tipoCalc === "limpieza" && (
                  <div className="h-full flex items-center justify-center p-10 text-center animate-fade-in bg-slate-50/20">
                    <div className="space-y-6">
                      <div className="w-20 h-20 bg-fuchsia-50 text-fuchsia-400 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-sm border border-fuchsia-100">✨</div>
                      <div>
                        <h3 className="text-slate-900 font-black text-2xl tracking-tight">Vending Limpieza</h3>
                        <p className="text-slate-400 text-sm max-w-[250px] mx-auto mt-2 leading-relaxed">Módulo en calibración de costos variables e insumos químicos.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-70 shrink-0">
              <InformationCircleIcon className="w-4 h-4 text-[#168387]" />
              <span>Valores sugeridos basados en el mercado mexicano actual</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar-thin::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @media (max-width: 1024px) {
          #calculadora-negocio { height: auto; padding: 60px 16px; overflow: visible; }
          .max-w-7xl { max-height: none; }
        }
      `}</style>
    </>
  );
}
