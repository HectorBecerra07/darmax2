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

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const { brandingMode: globalMode } = useSettings();
  const [localMode, setLocalMode] = useState(globalMode);
  
  const { carrito } = useCarrito();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const linksRef = useRef([]);

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
          clearProps: "all" // Limpia los estilos de GSAP al terminar para evitar conflictos
        }
      );
    });
    return () => ctx.revert();
  }, [location.pathname]); // Se dispara al cambiar de ruta para asegurar visibilidad

  useEffect(() => {
    if (!isScrolled) {
      setLocalMode(globalMode);
    }
  }, [globalMode, isScrolled]);

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);

      const darkSections = ["/purificadores-caseros", "/proyectos-empresariales"];
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
    { href: "/contacto", text: "CONTACTO" },
  ];

  const isClean = localMode === 'clean';

  // Estilos dinámicos premium con Glassmorphism
  const bgClass = isDarkTheme 
    ? "bg-slate-950/80 backdrop-blur-xl border-white/5" 
    : "bg-white/80 backdrop-blur-xl border-cyan-500/10";
  
  const textClass = isDarkTheme ? "text-white" : "text-slate-900";
  
  const accentText = isClean 
    ? (isDarkTheme ? "text-pink-400" : "text-pink-600")
    : (isDarkTheme ? "text-cyan-400" : "text-[#168387]");

  const activeLinkBg = isClean
    ? "bg-pink-500/10"
    : "bg-cyan-500/10";

  const logoSrc = isDarkTheme 
    ? "/img/logos/logoblanco.png" 
    : "/img/logos/logonegro.png";

  const isHome = location.pathname === "/";

  return (
    <>
      <nav
        ref={navRef}
        className={`
          fixed top-0 left-0 right-0 z-50 w-full flex items-center h-[72px]
          transition-all duration-700 border-b
          ${bgClass}
          ${isScrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.08)]' : ''}
        `}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-6 lg:px-10">
          
          {/* Logo con Animación refinada */}
          <div className="shrink-0 flex items-center">
            <Link 
              to="/" 
              onClick={scrollToTop} 
              className={`
                transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
                ${isScrolled || !isHome
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-95 blur-md pointer-events-none'
                }
              `}
            >
              <img src={logoSrc} alt="Logo Darmax" className="h-10 md:h-11 w-auto object-contain hover:brightness-110 transition-all" />
            </Link>
          </div>

          {/* Menú Desktop con GSAP Stagger */}
          <div className={`hidden nav:flex items-center justify-center gap-2 flex-1 px-8 ${textClass}`}>
            {navLinks.map((link, idx) => {
              const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link-item px-5 py-2 rounded-full font-black transition-all duration-500 text-[10px] tracking-[0.2em] uppercase whitespace-nowrap relative group ${
                    isActive ? `${activeLinkBg} ${accentText}` : `hover:opacity-100 opacity-60`
                  }`}
                >
                  {link.text}
                  {/* Indicador de hover minimalista */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-500 transition-all duration-500 group-hover:w-1/2 opacity-50" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Acciones */}
          <div className={`hidden nav:flex items-center gap-6 ${textClass}`}>
            {/* Carrito oculto por petición del usuario */}
            <button 
              onClick={() => setShowCart(true)} 
              className="hidden relative group"
            >
              <ShoppingBagIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-lg border border-white/20">
                  {totalItems}
                </span>
              )}
            </button>
            <Link to={user ? "/perfil" : "/login"} className="group">
              <UserIcon className="w-5 h-5 transition-all group-hover:scale-110 group-hover:text-cyan-500 cursor-pointer" />
            </Link>
          </div>

          {/* Menú móvil trigger */}
          <div className={`flex items-center justify-end nav:hidden gap-x-5 ${textClass}`}>
             {/* Carrito oculto en móvil también */}
            <button onClick={() => setShowCart(true)} className="hidden relative">
              <ShoppingBagIcon className="w-6 h-6" />
            </button>
            <Link to={user ? "/perfil" : "/login"}>
              <UserIcon className="w-6 h-6 active:scale-90" />
            </Link>
            <button onClick={() => setNavOpen(!navOpen)} className="p-1 hover:text-cyan-500 transition-colors">
              {navOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Lateral Móvil con estética Glass Dark */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-950/95 backdrop-blur-2xl z-[60] transform transition-transform duration-700 ease-in-out shadow-2xl border-l border-white/5 ${navOpen ? "translate-x-0" : "translate-x-full"}`}>
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
                className={`px-6 py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] transition-all duration-300 uppercase ${isActive ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:text-white hover:bg-white/5"}`} 
                onClick={() => setNavOpen(false)}
              >
                {link.text}
              </Link>
            );
          })}
        </nav>
      </div>

      <CarritoLateral isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
