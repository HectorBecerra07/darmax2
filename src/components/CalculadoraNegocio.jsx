import React, { useState, useEffect } from "react";

/* =========================
   UTILIDADES & CONSTANTES
========================= */
const THEME = {
  agua: {
    primary: "#24d4da", // Cyan Darmax
    secondary: "#0ea5e9", // Sky Blue
    gradient: "from-[#24d4da] to-cyan-500",
    shadow: "shadow-cyan-500/20",
    bgResults: "bg-slate-900",
    icon: "💧"
  },
  limpieza: {
    primary: "#e879f9", // Fuchsia Neon
    secondary: "#d946ef",
    gradient: "from-fuchsia-400 to-pink-500",
    shadow: "shadow-fuchsia-500/20",
    bgResults: "bg-slate-900",
    icon: "✨"
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/* =========================
   COMPONENTES UI REUTILIZABLES
========================= */
const StyledInput = ({ label, value, setValue, color }) => {
  const handleChange = (e) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(cleanValue);
  };

  return (
    <div className="group">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-slate-700 transition-colors">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-8 pr-4 text-slate-900 font-bold transition-all outline-none focus:bg-white focus:border-transparent focus:ring-2 focus:shadow-lg"
          style={{ "--tw-ring-color": color }} // CSS variable para el color del ring dinámico
        />
      </div>
    </div>
  );
};

const CustomSlider = ({ value, min, max, onChange, color, label }) => {
  // Calculamos el porcentaje para el fondo del slider
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-4">
         <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
         <span className="text-3xl font-black tracking-tight" style={{ color }}>
            ${value}
         </span>
      </div>
      
      <div className="relative w-full h-2 bg-slate-100 rounded-full cursor-pointer touch-none">
        {/* Barra de progreso coloreada */}
        <div 
            className="absolute h-full rounded-full pointer-events-none" 
            style={{ width: `${percentage}%`, backgroundColor: color }} 
        />
        {/* Input Range Invisible pero funcional encima */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        {/* Thumb personalizado visual (círculo) */}
        <div 
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md border-2 transition-transform active:scale-110 pointer-events-none"
            style={{ left: `${percentage}%`, borderColor: color, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
};

/* =========================
   PANEL DE RESULTADOS (Lado Derecho)
========================= */
function ResultadosPanel({ data, theme }) {
  const { color, gradient } = theme;

  const ResultCard = ({ title, amount, isTotal = false }) => (
    <div className={`relative overflow-hidden rounded-2xl p-5 transition-all ${isTotal ? "col-span-2 bg-gradient-to-br " + gradient : "bg-white/5 border border-white/10"}`}>
       {!isTotal && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-white opacity-[0.03] rounded-full -mr-8 -mt-8 blur-xl"></div>
       )}
       <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isTotal ? "text-white/90" : "text-slate-400"}`}>
          {title}
       </p>
       <p className={`font-black tracking-tighter ${isTotal ? "text-4xl md:text-5xl text-white" : "text-2xl text-white"}`}>
          {formatCurrency(amount)}
       </p>
    </div>
  );

  return (
    <div className="h-full flex flex-col justify-center p-8 md:p-12 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-white opacity-[0.03] rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 opacity-[0.1] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: color }}></div>

      <div className="relative z-10 space-y-6">
         <div>
            <h2 className="text-3xl font-black text-white mb-2">Proyección Financiera</h2>
            <p className="text-slate-400 text-sm">Estimación basada en tus datos operativos.</p>
         </div>

         <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>

         <div className="grid grid-cols-2 gap-4">
            <ResultCard title="Ingreso Diario" amount={data.ingresosDiarios} />
            <ResultCard title="Gasto Operativo" amount={data.gastosDiarios} />
            <ResultCard title="Utilidad Mensual" amount={data.utilidadMensual} isTotal={true} />
            <ResultCard title="Utilidad Anual" amount={data.utilidadAnual} />
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 flex items-center justify-center text-center">
                <p className="text-xs text-slate-400">
                    Margen de Ganancia <br/>
                    <span className="text-xl font-bold" style={{ color }}>
                        {data.ingresosDiarios > 0 
                            ? Math.round((data.utilidadDiaria / data.ingresosDiarios) * 100) 
                            : 0}%
                    </span>
                </p>
            </div>
         </div>
         
         <p className="text-[10px] text-center text-slate-600 mt-6 max-w-xs mx-auto">
            *Los resultados son estimaciones y pueden variar según la ubicación y administración.
         </p>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTES LÓGICOS POR TIPO
========================= */

function CalculadoraAgua({ isActive }) {
  const [precioGarrafon, setPrecioGarrafon] = useState(18);
  const [garrafonesDia, setGarrafonesDia] = useState("");
  const [costoServicios, setCostoServicios] = useState("");
  const [costoRenta, setCostoRenta] = useState("");

  // Reset on tab change logic if needed, keeping simple for now
  
  const safeValue = (v) => (v === "" ? 0 : Number(v));
  const ingresosDiarios = safeValue(garrafonesDia) * precioGarrafon;
  const gastosDiarios = (safeValue(costoServicios) / 30) + (safeValue(costoRenta) / 30);
  const utilidadDiaria = ingresosDiarios - gastosDiarios;

  const themeData = {
      color: THEME.agua.primary,
      gradient: THEME.agua.gradient
  };

  const results = {
      ingresosDiarios,
      gastosDiarios,
      utilidadDiaria,
      utilidadMensual: utilidadDiaria * 30,
      utilidadAnual: utilidadDiaria * 365
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col md:flex-row h-full animate-fade-in">
      {/* Left: Inputs */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
         <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Configuración Purificadora</h3>
            <p className="text-xs text-slate-400">Ajusta los valores del mercado.</p>
         </div>

         <CustomSlider 
            label="Precio de Venta (Garrafón)"
            value={precioGarrafon} 
            min={10} 
            max={50} 
            onChange={(e) => setPrecioGarrafon(Number(e.target.value))}
            color={THEME.agua.primary}
         />

         <div className="grid grid-cols-1 gap-5">
             <StyledInput label="Ventas Diarias (Garrafones)" value={garrafonesDia} setValue={setGarrafonesDia} color={THEME.agua.primary} />
             <div className="grid grid-cols-2 gap-4">
                <StyledInput label="Servicios (Mes)" value={costoServicios} setValue={setCostoServicios} color={THEME.agua.primary} />
                <StyledInput label="Renta (Mes)" value={costoRenta} setValue={setCostoRenta} color={THEME.agua.primary} />
             </div>
             {/* Campo Insumos Desactivado (Visualmente sutil) */}
             <div className="opacity-50 pointer-events-none grayscale">
                <StyledInput label="Insumos (Agua Cruda)" value="0" setValue={()=>{}} color="#ccc" />
             </div>
         </div>
      </div>

      {/* Right: Results */}
      <div className="w-full md:w-1/2 bg-slate-900 min-h-[500px]">
         <ResultadosPanel data={results} theme={themeData} />
      </div>
    </div>
  );
}

function CalculadoraLimpieza({ isActive }) {
  const [precioLitro, setPrecioLitro] = useState(25);
  const [litrosDia, setLitrosDia] = useState("");
  const [costoServicios, setCostoServicios] = useState("");
  const [costoRenta, setCostoRenta] = useState("");
  const [costoInsumos, setCostoInsumos] = useState("");

  const safeValue = (v) => (v === "" ? 0 : Number(v));
  const ingresosDiarios = safeValue(litrosDia) * precioLitro;
  const gastosDiarios = (safeValue(costoServicios) / 30) + (safeValue(costoRenta) / 30) + safeValue(costoInsumos); // Asumiendo insumos es costo diario por litro o global mensual? El original lo suma directo. Asumiremos mensual para mantener lógica anterior
  // Corrección lógica original: En el código original sumaba costoInsumos directo a gastosDiarios. Si el input dice "Mensual", deberíamos dividir entre 30. 
  // Si el input es costo por litro (insumo variable), sería diferente. 
  // Mantendré la lógica "input mensual" -> dividir entre 30 para consistencia.
  const gastosDiariosCalculados = (safeValue(costoServicios) / 30) + (safeValue(costoRenta) / 30) + (safeValue(costoInsumos) / 30);
  
  const utilidadDiaria = ingresosDiarios - gastosDiariosCalculados;

  const themeData = {
      color: THEME.limpieza.primary,
      gradient: THEME.limpieza.gradient
  };

  const results = {
      ingresosDiarios,
      gastosDiarios: gastosDiariosCalculados,
      utilidadDiaria,
      utilidadMensual: utilidadDiaria * 30,
      utilidadAnual: utilidadDiaria * 365
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col md:flex-row h-full animate-fade-in">
      {/* Left: Inputs */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
         <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Configuración Productos</h3>
            <p className="text-xs text-slate-400">Venta de químicos a granel.</p>
         </div>

         <CustomSlider 
            label="Precio Promedio (Litro)"
            value={precioLitro} 
            min={10} 
            max={100} 
            onChange={(e) => setPrecioLitro(Number(e.target.value))}
            color={THEME.limpieza.primary}
         />

         <div className="grid grid-cols-1 gap-5">
             <StyledInput label="Ventas Diarias (Litros Totales)" value={litrosDia} setValue={setLitrosDia} color={THEME.limpieza.primary} />
             <div className="grid grid-cols-2 gap-4">
                <StyledInput label="Servicios (Mes)" value={costoServicios} setValue={setCostoServicios} color={THEME.limpieza.primary} />
                <StyledInput label="Renta (Mes)" value={costoRenta} setValue={setCostoRenta} color={THEME.limpieza.primary} />
             </div>
             <StyledInput label="Costo Insumos (Mes)" value={costoInsumos} setValue={setCostoInsumos} color={THEME.limpieza.primary} />
         </div>
      </div>

      {/* Right: Results */}
      <div className="w-full md:w-1/2 bg-slate-900 min-h-[500px]">
         <ResultadosPanel data={results} theme={themeData} />
      </div>
    </div>
  );
}

/* =========================
   COMPONENTE PRINCIPAL
========================= */
export default function CalculadoraNegocio() {
  const [tipo, setTipo] = useState("agua");

  return (
    <section className="min-h-screen bg-[#Fbfbfd] flex flex-col items-center justify-center w-full p-4 md:p-8 font-sans selection:bg-[#24d4da] selection:text-white">
      
      {/* Header Section */}
      <div className="text-center mb-10 max-w-2xl">
        <span className="text-[#24d4da] font-bold tracking-widest text-xs uppercase mb-3 block animate-pulse">
            Herramienta de Inversión
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Calculadora de <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24d4da] to-blue-500">Rentabilidad</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
            Proyecta tus ganancias mensuales y anuales basándote en costos reales y tráfico estimado.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Navigation Tabs (Estilo Cápsula Flotante) */}
        <div className="flex justify-center pt-8 bg-white">
            <div className="bg-slate-100 p-1.5 rounded-full flex relative">
                {/* Background Pill Animation */}
                <div 
                    className={`absolute top-1.5 bottom-1.5 w-[140px] rounded-full bg-white shadow-md transition-all duration-300 ease-out`}
                    style={{ left: tipo === "agua" ? "6px" : "150px" }} 
                />

                <button
                    onClick={() => setTipo("agua")}
                    className={`relative z-10 w-[140px] py-2.5 text-sm font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2 ${tipo === "agua" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <span>{THEME.agua.icon}</span> Agua
                </button>
                <button
                    onClick={() => setTipo("limpieza")}
                    className={`relative z-10 w-[140px] py-2.5 text-sm font-bold rounded-full transition-colors duration-300 flex items-center justify-center gap-2 ${tipo === "limpieza" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                >
                    <span>{THEME.limpieza.icon}</span> Limpieza
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="relative">
            <CalculadoraAgua isActive={tipo === "agua"} />
            <CalculadoraLimpieza isActive={tipo === "limpieza"} />
        </div>

      </div>
    </section>
  );
}