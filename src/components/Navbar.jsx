import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  ShoppingBagIcon,
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useCarrito } from "../context/CarritoContext";
import { useUser } from "../context/UserContext";
import { useSettings } from "../context/SettingsContext";
import CarritoLateral from "./CarritoLateral";
import ShatterLogo from "./ShatterLogo";

/* --- Temas Dinámicos por Ruta --- */
const PATH_THEMES = {
  "/vending-info": { accent: "#5188C9", bg: "bg-[#5188C9]/10", hover: "bg-[#5188C9]/5" },
  "/purificadora-info": { accent: "#7DD3FC", bg: "bg-[#7DD3FC]/10", hover: "bg-[#7DD3FC]/5" },
  "/vending-limpieza-info": { accent: "#e7b341", bg: "bg-[#e7b341]/10", hover: "bg-[#e7b341]/5" },
  "/duo-emprendedor-info": { accent: "#73cdbd", bg: "bg-[#73cdbd]/10", hover: "bg-[#73cdbd]/5" },
  "/tridente-info": { accent: "#4d79bf", bg: "bg-[#4d79bf]/10", hover: "bg-[#4d79bf]/5" },
  "/megalodon-info": { accent: "#2f7384", bg: "bg-[#2f7384]/10", hover: "bg-[#2f7384]/5" },
};

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const { brandingMode: globalMode } = useSettings();
  const [localMode, setLocalMode] = useState(globalMode);
  
  const { carrito } = useCarrito();
  const { user } = useUser();
  const location = useLocation();
  const navRef = useRef(null);

  // Determinar tema actual basado en la ruta
  const currentTheme = PATH_THEMES[location.pathname] || null;

  // Animación de entrada GSAP optimizada
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".nav-link-item", 
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
          clearProps: "all"
        }
      );
    });
    return () => ctx.revert();
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  useEffect(() => {
    setLocalMode(globalMode);
  }, [globalMode]);

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const darkSections = ["/purificadores-caseros"];
      if (location.pathname === "/") {
        setIsDarkTheme(scrollY > 600);
      } else if (darkSections.includes(location.pathname)) {
        setIsDarkTheme(true);
      } else {
        setIsDarkTheme(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", text: "INICIA TU NEGOCIO" },
    { href: "/nosotros", text: "NOSOTROS" },
    { href: "/proyectos-empresariales", text: "PROYECTOS" },
    { href: "/blog", text: "BLOG" },
    { href: "/contacto", text: "CONTACTO" },
  ];

  const isClean = localMode === 'clean';

  // Estilos dinámicos premium
  const bgClass = isDarkTheme 
    ? "bg-slate-950/80 backdrop-blur-xl border-white/5" 
    : "bg-white/80 backdrop-blur-xl border-slate-200/50";
  
  const textClass = isDarkTheme ? "text-white" : "text-slate-900";
  
  // Logica de color de acento y gradiente activo (Negocio de Agua vs Darmax Clean)
  let accentStyle = { color: isDarkTheme ? "#24d4da" : "#168387" };
  let activeBgClass = "bg-gradient-to-r from-[#288EB9]/15 to-[#1DB3BA]/15 border border-[#288EB9]/25 shadow-sm";
  let activeTextClass = "bg-gradient-to-r from-[#288EB9] to-[#1DB3BA] bg-clip-text text-transparent";
  let hoverLineColor = "#288EB9";

  if (currentTheme) {
    accentStyle = { color: currentTheme.accent };
    activeBgClass = currentTheme.bg;
    activeTextClass = "";
    hoverLineColor = currentTheme.accent;
  } else if (isClean) {
    accentStyle = { color: "#7FB32A" };
    activeBgClass = "bg-gradient-to-r from-[#7FB32A]/15 to-[#F3AD13]/15 border border-[#7FB32A]/25 shadow-sm";
    activeTextClass = "bg-gradient-to-r from-[#7FB32A] to-[#F3AD13] bg-clip-text text-transparent";
    hoverLineColor = "#7FB32A";
  }

  const normalLogoSrc = isDarkTheme 
    ? "/img/logos/logoblanco.png" 
    : "/img/logos/logonegro.png";

  const isCleanActive = isHome && !isScrolled && globalMode === "clean";
  const currentLogoSrc = isCleanActive ? "/img/LogoClean.png" : normalLogoSrc;

  return (
    <>
      <nav
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-50 w-full flex items-center h-[72px]
          transition-all duration-700 border-b font-montserrat not-italic
          ${bgClass}
          ${isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.08)]' : ''}
        `}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-6 lg:px-10">
          
          <div className="shrink-0 flex items-center min-w-[125px] sm:min-w-[135px]">
            <Link 
              to="/" 
              onClick={scrollToTop} 
              className="inline-flex items-center transition-transform duration-300 hover:scale-105 active:scale-95"
              aria-label="Darmax Home"
            >
              <ShatterLogo currentSrc={currentLogoSrc} alt="Logo Darmax" className="h-10 md:h-11" />
            </Link>
          </div>

          <div className={`hidden nav:flex items-center justify-center gap-2 flex-1 px-8 ${textClass}`}>
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link-item px-4 lg:px-5 py-2 rounded-full font-bold transition-all duration-500 text-[10.5px] lg:text-[11px] tracking-[0.16em] uppercase whitespace-nowrap relative group ${
                    isActive ? activeBgClass : `hover:opacity-100 opacity-70`
                  }`}
                  style={isActive && currentTheme ? accentStyle : {}}
                >
                  <span className={isActive && !currentTheme ? activeTextClass : ""}>
                    {link.text}
                  </span>
                  {!isActive && (
                    <span 
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-500 group-hover:w-1/2 opacity-50" 
                      style={{ backgroundColor: hoverLineColor }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Seccion de usuario y carrito (oculto temporalmente sin borrar) */}
          {false && (
            <div className={`hidden nav:flex items-center gap-6 ${textClass}`}>
              <Link to={user ? "/perfil" : "/login"} className="group">
                <UserIcon 
                  className="w-5 h-5 transition-all group-hover:scale-110 cursor-pointer" 
                  style={location.pathname === "/perfil" ? accentStyle : {}}
                />
              </Link>
              <button 
                onClick={() => setShowCart(true)} 
                className="relative group"
              >
                <ShoppingBagIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg"
                    style={{ backgroundColor: hoverLineColor }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className={`flex items-center justify-end nav:hidden gap-x-5 ${textClass}`}>
            {/* Login movil (oculto temporalmente sin borrar) */}
            {false && (
              <Link to={user ? "/perfil" : "/login"}>
                <UserIcon className="w-6 h-6 active:scale-90" />
              </Link>
            )}
            <button onClick={() => setNavOpen(!navOpen)} className="p-1 transition-colors">
              {navOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Lateral Móvil */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-950/95 backdrop-blur-2xl z-[60] transform transition-transform duration-700 ease-in-out shadow-2xl border-l border-white/5 font-montserrat not-italic ${navOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center px-8 h-20 border-b border-white/5">
          <img src="/img/logos/logoblanco.png" alt="Logo Darmax" className="h-9 w-auto object-contain" />
          <button onClick={() => setNavOpen(false)} className="text-white/50 hover:text-white hover:rotate-90 transition-all duration-500">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
        <nav className="flex flex-col p-8 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`px-6 py-4 rounded-2xl font-bold text-xs tracking-[0.18em] transition-all duration-300 uppercase ${isActive ? `${activeBgClass}` : "text-slate-400 hover:text-white hover:bg-white/5"}`} 
                style={isActive && currentTheme ? accentStyle : {}}
                onClick={() => setNavOpen(false)}
              >
                <span className={isActive && !currentTheme ? activeTextClass : ""}>
                  {link.text}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <CarritoLateral isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
