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
  RocketLaunchIcon,
  TruckIcon,
  CalendarDaysIcon,
  WifiIcon,
  HandThumbUpIcon,
  ChartPieIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";
import { FaCoins } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

const IniciaNegocio = lazy(() => import("../components/IniciaNegocio"));
import TestimoniosSection from "../components/TestimoniosSection";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

/* Icono de camión cisterna / pipa de agua */
const PipaTruckIcon = React.memo((props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="2" y="6" width="11" height="8.5" rx="4" />
    <path d="M5.5 6V4.5h4V6" />
    <path d="M13 9.5h3.2a1.5 1.5 0 0 1 1.2.6l2.3 3a1.5 1.5 0 0 1 .3.9v3.5a.5.5 0 0 1-.5.5h-1" />
    <path d="M13.5 13.5H20" />
    <path d="M2 17.5h1" />
    <path d="M7 17.5h8" />
    <circle cx="5" cy="17.5" r="2" />
    <circle cx="17.5" cy="17.5" r="2" />
  </svg>
));

/* Icono de dos montones de monedas en puro trazo outline (sin relleno) */
const TwoCoinStacksOutlineIcon = React.memo((props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {/* Pila izquierda */}
    <ellipse cx="7.5" cy="7" rx="4.5" ry="2" />
    <path d="M3 7v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2V7" />
    <path d="M3 10v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3" />
    <path d="M3 13v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3" />
    
    {/* Pila derecha (segundo montón de monedas) */}
    <path d="M12 7.3c.7-.8 1.9-1.3 3.5-1.3 2.5 0 4.5.9 4.5 2s-1.8 1.9-4 2" />
    <path d="M12 10.3c.7.4 1.8.7 3.5.7 2.5 0 4.5-.9 4.5-2v-2" />
    <path d="M12 13.3c.7.4 1.8.7 3.5.7 2.5 0 4.5-.9 4.5-2v-2" />
    <path d="M12 16.3c.7.4 1.8.7 3.5.7 2.5 0 4.5-.9 4.5-2v-2" />
    <path d="M20 17v-8" />
  </svg>
));

/* Icono de tapa de garrafón con estrías y precinto de seguridad */
const BottleCapIcon = React.memo((props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <ellipse cx="12" cy="7.5" rx="7.5" ry="3" />
    <ellipse cx="12" cy="7.5" rx="4" ry="1.6" />
    <path d="M4.5 7.5v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V7.5" />
    <path d="M7 9v6" />
    <path d="M9.5 9.8v6.4" />
    <path d="M12 10.2v6.6" />
    <path d="M14.5 9.8v6.4" />
    <path d="M17 9v6" />
    <path d="M5.5 16.5v1.2c0 1.2 2.9 2.3 6.5 2.3s6.5-1.1 6.5-2.3v-1.2" />
  </svg>
));

/* =========================================
   ANIMATION & PREMIUM HELPERS
========================================= */
const revealUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.08 },
  transition: { duration: 0.42, delay: d, ease: [0.16, 1, 0.3, 1] }
});

const fadeUp = (d = 0) => revealUp(d);
const slideInLeft = (d = 0) => revealUp(d);
const slideInRight = (d = 0) => revealUp(d);

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
  accent: "#288EB9",
  accentSecondary: "#1DB3BA",
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
const CompactInput = React.memo(({ label, value, setValue, color, suffix = "", prefix = "$", icon: Icon, help, sideIcon = false }) => {
  const handleChange = (e) => {
    const cleanValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(cleanValue);
  };

  if (sideIcon) {
    return (
      <div className="group w-full min-h-[64px] sm:min-h-[68px] bg-[#F7FAFD] border border-slate-300 rounded-lg sm:rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 shadow-xs flex items-center gap-2.5 sm:gap-3 font-montserrat not-italic transition-all duration-200 hover:border-slate-400">
        {Icon && <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#288EB9] shrink-0 stroke-[1.8]" />}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-1 gap-1">
            <label className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-slate-800 block group-focus-within:text-[#288EB9] transition-colors font-montserrat not-italic leading-tight truncate">
              {label}
            </label>
            {help && (
              <div className="relative group/help shrink-0">
                <InformationCircleIcon className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-[#288EB9] transition-colors" />
                <div className="absolute bottom-full right-0 mb-2 w-52 sm:w-56 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 pointer-events-none group-hover/help:opacity-100 transition-all z-50 shadow-xl leading-relaxed border border-white/10 font-montserrat not-italic font-normal">
                  {help}
                </div>
              </div>
            )}
          </div>
          <div className="relative font-montserrat not-italic">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-normal text-xs font-montserrat not-italic pointer-events-none">{prefix}</span>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={handleChange}
              className="w-full bg-white border border-slate-200/90 rounded-md sm:rounded-lg py-1 sm:py-1.5 pl-5 sm:pl-6 pr-2 text-slate-900 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#288EB9]/25 focus:border-[#288EB9] text-xs sm:text-[13px] font-montserrat not-italic shadow-2xs"
            />
            {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] sm:text-[11px] font-normal font-montserrat not-italic pointer-events-none">{suffix}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group w-full min-h-[64px] sm:min-h-[68px] bg-[#F7FAFD] border border-slate-300 rounded-lg sm:rounded-xl py-2 px-2.5 sm:py-2.5 sm:px-3 shadow-xs flex flex-col justify-center font-montserrat not-italic transition-all duration-200 hover:border-slate-400">
      <div className="flex items-center justify-between mb-1 gap-1 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#288EB9] shrink-0 stroke-[1.8]" />}
          <label className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-slate-800 group-focus-within:text-[#288EB9] transition-colors font-montserrat not-italic truncate">
            {label}
          </label>
        </div>
        {help && (
          <div className="relative group/help shrink-0">
            <InformationCircleIcon className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-[#288EB9] transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-52 sm:w-56 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 pointer-events-none group-hover/help:opacity-100 transition-all z-50 shadow-xl leading-relaxed border border-white/10 font-montserrat not-italic font-normal">
              {help}
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full font-montserrat not-italic">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-normal text-xs font-montserrat not-italic pointer-events-none">{prefix}</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          className="w-full bg-white border border-slate-200/90 rounded-md sm:rounded-lg py-1 sm:py-1.5 pl-5 sm:pl-5.5 pr-2 text-slate-900 font-bold transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#288EB9]/25 focus:border-[#288EB9] text-xs sm:text-[12.5px] font-montserrat not-italic shadow-2xs"
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] sm:text-[11px] font-normal font-montserrat not-italic pointer-events-none">{suffix}</span>}
      </div>
    </div>
  );
});

const CompactSlider = React.memo(({ value, min, max, onChange, color, label, icon: Icon = CircleStackIcon }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="w-full min-h-[64px] sm:min-h-[68px] flex items-center bg-[#F7FAFD] border border-slate-300 rounded-lg sm:rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 shadow-xs font-montserrat not-italic transition-all duration-200 hover:border-slate-400">
      <div className="w-full flex items-center gap-2.5 sm:gap-3.5">
        {Icon && <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#288EB9] shrink-0 stroke-[1.8]" />}
        
        {/* Columna central: Label arriba y Slider abajo */}
        <div className="min-w-0 flex-1 flex flex-col justify-center">
          <span className="text-[10px] sm:text-[11px] font-normal uppercase tracking-wider text-slate-800 font-montserrat not-italic block mb-1.5 leading-tight truncate">
            {label}
          </span>
          <div className="relative w-full h-1.5 bg-slate-200/80 rounded-full">
            <div 
              className="absolute h-full rounded-full bg-gradient-to-r from-[#288EB9] to-[#1DB3BA]" 
              style={{ width: `${percentage}%` }} 
            />
            <input 
              type="range" 
              min={min} 
              max={max} 
              value={value} 
              onChange={onChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              aria-label={label}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] bg-white rounded-full shadow-md border-2 border-[#288EB9] transition-transform active:scale-125 pointer-events-none" 
              style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }} 
            />
          </div>
        </div>

        {/* Costo encerrado en rectángulo #eef4f8 centrado verticalmente */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-[#eef4f8] border border-slate-200/80 rounded-md sm:rounded-lg px-2.5 py-1 sm:px-3 sm:py-1 min-w-[70px] sm:min-w-[80px] text-center shadow-2xs">
          <span className="text-lg sm:text-xl font-extrabold text-[#031638] font-montserrat not-italic leading-none">
            ${value}
          </span>
          <span className="text-[8px] sm:text-[8.5px] font-normal uppercase tracking-wider text-slate-600 font-montserrat not-italic leading-none mt-1 whitespace-nowrap">
            POR GARRAFÓN
          </span>
        </div>
      </div>
    </div>
  );
});

/* =========================================================
   CALCULADORA: PANEL DE RESULTADOS
========================================================= */
const DashboardCard = React.memo(({ title, amount, sub }) => {
  const count = useRef({ value: 0 });
  const el = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(count.current, {
        value: amount || 0,
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
    <div 
      style={{
        background: 'radial-gradient(circle at 15% 50%, rgba(70, 93, 117, 0.35), transparent 45%), linear-gradient(100deg, #20364c 0%, #102b43 55%, #031f39 100%)'
      }}
      className="relative overflow-hidden p-2.5 sm:p-3 rounded-xl border border-white/10 backdrop-blur-md group hover:border-[#1DB3BA]/40 transition-all duration-300 font-montserrat not-italic shadow-sm flex flex-col items-center justify-center text-center"
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
        <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white/70 mb-0.5 group-hover:text-white transition-colors font-montserrat not-italic text-center">{title}</p>
        <p className="text-sm sm:text-base md:text-[17px] font-extrabold text-white tracking-tight leading-none font-montserrat not-italic text-center">
          <span ref={el}>{formatCurrency(amount || 0)}</span>
        </p>
        {sub && <p className="text-[8.5px] sm:text-[9px] text-[#1DB3BA] uppercase font-semibold mt-0.5 tracking-wider font-montserrat not-italic text-center">{sub}</p>}
      </div>
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
    <div className="h-full bg-[#0f172a] px-4 py-4 sm:p-5 lg:py-5 lg:px-6 flex flex-col justify-between relative overflow-hidden font-montserrat not-italic">
      {/* Imagen de fondo Cloudinary directa sin capas por encima */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dunrpwsfq/image/upload/v1789698736/fondo_calc_wzkkas.png", 1920)}
          alt="Fondo Calculadora"
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <div className="relative z-10 space-y-2.5 sm:space-y-3.5 font-montserrat not-italic">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-inner border transition-transform duration-500 hover:rotate-12 bg-gradient-to-br from-[#288EB9]/25 to-[#1DB3BA]/15 text-[#1DB3BA] border-[#288EB9]/30 shrink-0 font-montserrat not-italic">
            <ArrowTrendingUpIcon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-base sm:text-lg tracking-tight leading-tight mb-0.5 font-montserrat not-italic">Utilidad Proyectada</h3>
            <p className="text-white/40 text-[9.5px] sm:text-[10.5px] uppercase tracking-widest font-semibold font-montserrat not-italic">Análisis de Retorno Mensual</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 font-montserrat not-italic">
          <DashboardCard title="Ingreso Bruto" amount={data.ingresosBrutos} sub={`${data.ventasMes} vtas/mes`} />
          <DashboardCard title="Producción" amount={data.costosProduccion} sub="Insumos" />
          <DashboardCard title="Gastos Fijos" amount={data.gastosFijos} sub="Operación" />
          <DashboardCard title="Costo x Unidad" amount={data.costoUnitario} sub="Promedio" />
          
          {/* Tarjeta de utilidad 100% transparente: borde con ligero brillo y contenido interior */}
          <div className="col-span-2 flex justify-start w-full mt-2 sm:mt-2.5">
            <div className="w-full sm:w-[68%] lg:w-[66%] sm:max-w-[328px] relative rounded-xl sm:rounded-2xl border border-[#24d4da] shadow-[0_0_12px_rgba(36,212,218,0.35)] py-3 px-3.5 sm:py-3.5 sm:px-4 flex flex-col items-center justify-center text-center font-montserrat not-italic">

              {/* SVG GARRAFON TÉCNICO (Comentado temporalmente) */}
              {/*
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1 sm:p-2">
                <svg 
                  viewBox="0 0 200 300" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-auto h-full max-h-[300px] sm:max-h-[320px] transition-all duration-1000 drop-shadow-[0_0_50px_rgba(40,142,185,0.35)] scale-[1.5] sm:scale-[1.15] translate-y-[15%] sm:translate-y-[10%]"
                >
                  <path 
                    d="M85 30 H115 V50 C160 50 195 60 195 90 v 40 q -5 0 -5 3 v 14 q 0 3 5 3 v 20 q -5 0 -5 3 v 14 q 0 3 5 3 v 20 q -5 0 -5 3 v 14 q 0 3 5 3 v 45 C195 286 186 295 175 295 H25 C14 295 5 286 5 275 v -45 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -20 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -20 q 5 0 5 -3 v -14 q 0 -3 -5 -3 v -40 C5 60 40 50 85 50 V30 Z" 
                    fill="url(#garrafonGradient)"
                    stroke="#288EB9"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                  />
                  <rect x="85" y="10" width="30" height="20" rx="3" fill="#1DB3BA" fillOpacity="0.25" stroke="#1DB3BA" strokeWidth="2" strokeOpacity="0.7" />
                  <defs>
                    <linearGradient id="garrafonGradient" x1="100" y1="30" x2="100" y2="290" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1DB3BA" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#288EB9" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              */}
              
              {/* Contenido de datos */}
              <div className="relative z-10 w-full flex flex-col items-center justify-center font-montserrat not-italic">
                {/* Fila superior: icono de manita like en círculo con degradado y a un lado el texto con su costo */}
                <div className="flex items-center justify-center gap-3 sm:gap-3.5 w-full">
                  <div 
                    style={{
                      background: 'radial-gradient(circle at 15% 50%, rgba(70, 93, 117, 0.35), transparent 45%), linear-gradient(100deg, #20364c 0%, #102b43 55%, #031f39 100%)'
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-md"
                  >
                    <HandThumbUpIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#24d4da] stroke-[2]" />
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <p className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-[0.16em] text-white drop-shadow-sm font-montserrat not-italic leading-tight">
                      Utilidad Mensual Neta
                    </p>
                    <div className="text-[28px] sm:text-[31px] lg:text-[33px] font-black italic text-white tracking-tight leading-tight drop-shadow-md font-montserrat mt-0.5">
                      <GSAPCurrencyCounter value={data.utilidadMensual} />
                    </div>
                  </div>
                </div>
                
                {/* Línea divisoria más blanca y más grande */}
                <div className="w-full max-w-[240px] sm:max-w-[260px] h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent my-2 sm:my-2.5" />

                {/* Fila inferior: Utilidad anual neta y su precio en color #b6feff */}
                <div className="font-montserrat not-italic text-center flex flex-col items-center justify-center">
                  <p className="text-[9px] sm:text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#b6feff] drop-shadow-sm font-montserrat not-italic leading-tight">
                    Utilidad Anual Neta
                  </p>
                  <div className="text-sm sm:text-base md:text-[18px] font-bold italic leading-tight drop-shadow-md font-montserrat mt-0.5 text-[#b6feff]">
                    <GSAPCurrencyCounter value={data.utilidadAnual} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-2.5 sm:mt-3.5 flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-3.5 font-montserrat not-italic">
        <div className="text-[11px] sm:text-xs text-white font-semibold uppercase tracking-wider font-montserrat not-italic">
          Margen Neto: <span className="font-extrabold ml-1.5 text-white font-montserrat not-italic">
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
    <div className="flex flex-col lg:flex-row h-full font-montserrat not-italic">
      {/* SECCIÓN CONFIGURACIÓN (IZQUIERDA) */}
      <div className="w-full lg:w-[62%] p-4 sm:p-5 lg:px-6 lg:py-5 flex flex-col justify-center space-y-2.5 sm:space-y-3.5 overflow-y-auto custom-scrollbar-thin bg-white font-montserrat not-italic font-normal">
        {/* Precio de venta sugerido (cuadro individual con el precio al lado de la barra) */}
        <CompactSlider label="Precio de Venta Sugerido" value={precioVenta} min={10} max={60} onChange={handlePrecioVentaChange} color={CALC_BRAND.accent} />
        
        {/* Ventas/dia y dias de operacion (cada uno en su propio cuadro individual con icono a la izquierda) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2.5 sm:gap-x-3 font-montserrat not-italic">
          <CompactInput label="Ventas / Día" value={ventasDia} setValue={setVentasDia} color={CALC_BRAND.accent} prefix="#" icon={CurrencyDollarIcon} help="Promedio de garrafones vendidos cada 24h." sideIcon={true} />
          <CompactInput label="Días de Operación" value={diasOp} setValue={setDiasOp} color={CALC_BRAND.accent} prefix="#" icon={CalendarDaysIcon} help="Vending: 30 días. Mostrador: 22-26 días considerando descansos semanales." sideIcon={true} />
        </div>

        {/* Producción e Insumos */}
        <div className="space-y-1 font-montserrat not-italic">
          <div className="flex items-center mb-1">
            <span className="w-4 sm:w-5 shrink-0" aria-hidden="true" />
            <p className="text-[10.5px] sm:text-[11.5px] font-normal uppercase text-slate-800 tracking-[0.18em] font-montserrat not-italic">
              Producción e Insumos
            </p>
          </div>
          
          {/* Cuadros individuales para Costo Pipa y Millar de Tapas con icono a la izquierda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2.5 sm:gap-x-3 font-montserrat not-italic">
            <CompactInput label="Costo Pipa (10k L)" value={costoPipa} setValue={setCostoPipa} color={CALC_BRAND.accent} icon={PipaTruckIcon} help="Recomendación: Pipa acero inoxidable con agua de pozo certificado ($2,700 promedio)." sideIcon={true} />
            <CompactInput label="Millar de Tapas" value={costoTapa} setValue={setCostoTapa} color={CALC_BRAND.accent} icon={BottleCapIcon} help="Insumo por garrafón: Tapa con liner de garantía ($370 el millar)." sideIcon={true} />
          </div>
        </div>

        {/* Sistema de Ósmosis Inversa (recuadro con tono azul distintivo) */}
        <div className={`w-full min-h-[64px] sm:min-h-[68px] flex flex-col justify-center rounded-lg sm:rounded-xl py-2 px-3.5 sm:py-2.5 sm:px-4 shadow-xs space-y-1 font-montserrat not-italic transition-all duration-300 bg-[#f1fbfd] ${
          osmosis 
            ? 'border border-[#288EB9]/50 shadow-[0_2px_10px_rgba(40,142,185,0.12)]' 
            : 'border border-[#288EB9]/25 hover:border-[#288EB9]/50'
        }`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10.5px] sm:text-[11.5px] font-bold uppercase text-[#288EB9] tracking-wider font-montserrat not-italic">
              Sistema de Ósmosis Inversa
            </span>
            {/* Switch interactivo */}
            <button 
              type="button"
              onClick={handleOsmosisToggle} 
              className={`w-11 h-6 p-0.5 rounded-full transition-colors duration-300 flex items-center shrink-0 cursor-pointer focus:outline-none ${
                osmosis 
                  ? 'bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] shadow-sm' 
                  : 'bg-slate-300'
              }`}
              aria-label="Alternar sistema de ósmosis inversa"
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  osmosis ? 'translate-x-5' : 'translate-x-0'
                }`} 
              />
            </button>
          </div>
          <p className="text-[9px] sm:text-[9.5px] text-[#084850] leading-snug font-normal font-montserrat not-italic">
            *Este proceso garantiza la máxima calidad, considerando un 25% de merma técnica por rechazo de sales y lavado de membranas.
          </p>
        </div>

        {/* Gastos Operativos Mensuales (cada uno en su propio cuadro individual) */}
        <div className="space-y-1 font-montserrat not-italic">
          <div className="flex items-center">
            <span className="w-4 sm:w-5 shrink-0" aria-hidden="true" />
            <p className="text-[10.5px] sm:text-[11.5px] font-normal uppercase text-slate-800 tracking-[0.18em] font-montserrat not-italic">
              Gastos Operativos Mensuales
            </p>
          </div>
          
          {/* 4 cuadros independientes para cada gasto */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-2 sm:gap-x-2.5 font-montserrat not-italic">
            <CompactInput label="Renta" value={renta} setValue={setRenta} color={CALC_BRAND.accent} icon={HomeIcon} />
            <CompactInput label="Luz" value={luz} setValue={setLuz} color={CALC_BRAND.accent} icon={LightBulbIcon} />
            <CompactInput label="Internet" value={internet} setValue={setInternet} color={CALC_BRAND.accent} icon={WifiIcon} />
            <CompactInput label="Otros" value={otros} setValue={setOtros} color={CALC_BRAND.accent} icon={WrenchScrewdriverIcon} />
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

      <div className="relative w-full bg-white selection:bg-[#24d4da] selection:text-white">
        {/* HERO SECTION */}
        <HeroBannerSlide onOpenTouchModal={handleOpenTouchModal} />

        {/* SECCIÓN DE AUTORIDAD (Conecta fluidamente con ROI) */}
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-t border-slate-200/80 relative">
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
        <section id="calculadora-negocio" className="bg-[#fbfbfd] flex flex-col items-center justify-center w-full font-montserrat not-italic overflow-hidden py-8 sm:py-12">
          
          <div className="max-w-6xl mx-auto px-0 sm:px-6 w-full flex flex-col">
            {/* Header Calculadora */}
            <motion.div 
              {...slideInRight(0, "Calcula tu rentabilidad")}
              className="w-full mb-5 sm:mb-6 flex flex-col items-center text-center px-4 sm:px-0 max-w-4xl mx-auto"
            >
              <span className="font-montserrat not-italic text-[#168387] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm uppercase mb-1.5 sm:mb-2 block text-center">
                Proyección Financiera
              </span>
              <h2 className="font-montserrat not-italic text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-2 sm:mb-3 text-center">
                <span className="text-[#031638]">Calcula tu </span>
                <span className="bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent inline-block">
                  rentabilidad
                </span>
              </h2>
              <p className="text-slate-600 font-montserrat not-italic text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl text-center mb-4">
                Ajusta los valores según tu negocio y descubre el potencial de tu inversión.
              </p>

              {/* Switch de modo con diseño HeroBannerSlide */}
              <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/5 backdrop-blur-md p-1 rounded-full border border-slate-200/90 shadow-sm font-montserrat not-italic mx-auto">
                <button
                  type="button"
                  onClick={() => setTipoCalc("agua")}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer font-montserrat not-italic ${
                    tipoCalc === "agua"
                      ? "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tipoCalc === "agua" ? "bg-white" : "bg-slate-300"}`} />
                  <span>Agua</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTipoCalc("limpieza")}
                  className={`flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer font-montserrat not-italic ${
                    tipoCalc === "limpieza"
                      ? "bg-[#e7b341] text-white shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${tipoCalc === "limpieza" ? "bg-amber-200" : "bg-slate-300"}`} />
                  <span>Limpieza</span>
                </button>
              </div>
            </motion.div>

            <motion.div 
              {...slideInRight(0.04)}
              className="w-full bg-white rounded-none sm:rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden border-y sm:border border-slate-200 flex flex-col lg:h-[540px] min-h-0"
            >
              <div className="flex-1 min-h-0">
                {/* Contenedor persistente para no perder datos al alternar de pestana */}
                <div className={tipoCalc === "agua" ? "h-full" : "hidden"}>
                  <AguaView />
                </div>
                {tipoCalc === "limpieza" && (
                  <div className="h-full flex items-center justify-center p-8 sm:p-12 text-center animate-fade-in bg-slate-50/20 font-montserrat not-italic">
                    <div className="space-y-6 sm:space-y-8 font-montserrat not-italic">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 text-amber-400 rounded-[2.5rem] flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-sm border border-amber-100">✨</div>
                      <div className="font-montserrat not-italic">
                        <h3 className="text-slate-900 font-extrabold text-2xl sm:text-3xl tracking-tight font-montserrat not-italic">Vending Limpieza</h3>
                        <p className="text-slate-500 text-base sm:text-lg max-w-[300px] mx-auto mt-3 leading-relaxed font-montserrat not-italic">Módulo de alta demanda en calibración de costos variables e insumos químicos.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              {...slideInRight(0.06)}
              className="flex items-center justify-center gap-2.5 sm:gap-4 mt-4 sm:mt-5 select-none px-4"
            >
              <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
              <p className="text-slate-500 font-montserrat not-italic text-[11px] sm:text-xs md:text-[13px] font-medium tracking-wider uppercase leading-relaxed text-center">
                VALORES SUGERIDOS BASADOS EN EL MERCADO MEXICANO ACTUAL.
              </p>
              <div className="h-[1.5px] w-6 sm:w-10 bg-slate-300/80 rounded-full shrink-0" aria-hidden="true" />
            </motion.div>
          </div>
        </section>

        {/* SECCIÓN DE TESTIMONIOS E HISTORIAS DE ÉXITO AL FINAL DE LA PÁGINA */}
        <TestimoniosSection />
      </div>
      <TouchModal isOpen={isTouchModalOpen} onClose={handleCloseTouchModal} />
    </>
  );
}

