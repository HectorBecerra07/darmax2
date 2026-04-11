import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBagIcon,
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const userMenuRef = useRef(null);

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

  // Estilos dinámicos premium
  const textClass = isDarkTheme ? "text-white" : "text-slate-900";
  const iconClass = isDarkTheme ? "text-white" : "text-slate-900";
  const bgClass = isDarkTheme ? "bg-slate-950" : "bg-white";
  const borderClass = isDarkTheme ? "border-white/10" : "border-[#24d4da]/20";
  
  const accentText = isClean 
    ? (isDarkTheme ? "text-pink-400" : "text-pink-600")
    : (isDarkTheme ? "text-cyan-400" : "text-[#168387]");

  const badgeBg = isClean 
    ? "bg-pink-500" 
    : (isDarkTheme ? "bg-cyan-500" : "bg-[#168387]");

  const activeLinkBg = isClean
    ? "bg-pink-500/10"
    : "bg-[#168387]/10";

  const logoSrc = localMode === 'agua' 
    ? (isDarkTheme ? "/img/darmaxfoto3.png" : "/img/darmaxfoto.png")
    : "/img/LogoClean.png";

  const isHome = location.pathname === "/";

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 w-full flex items-center h-[72px]
          transition-all duration-500 border-b-[1.5px]
          ${bgClass} ${borderClass}
          ${isScrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.05)]' : ''}
        `}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-6 lg:px-10">
          
          {/* Logo con Animación de entrada recuperada */}
          <div className="shrink-0 flex items-center">
            <Link 
              to="/" 
              onClick={scrollToTop} 
              className={`
                transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)
                ${isScrolled || !isHome
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-90 blur-md pointer-events-none'
                }
              `}
            >
              <img src={logoSrc} alt="Logo Darmax" className="h-9 md:h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Menú Desktop */}
          <div className={`hidden nav:flex items-center justify-center gap-2 flex-1 px-8 transition-colors duration-500 ${textClass}`}>
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl font-black transition-all duration-300 text-[10px] tracking-[0.15em] uppercase whitespace-nowrap ${
                    isActive ? `${activeLinkBg} ${accentText}` : `hover:bg-slate-100/50 opacity-70 hover:opacity-100`
                  }`}
                >
                  {link.text}
                </Link>
              );
            })}
          </div>

          {/* Acciones */}
          <div className={`hidden nav:flex items-center gap-6 transition-colors duration-500 ${iconClass}`}>
            <button onClick={() => setShowCart(true)} className="relative transition-transform hover:scale-110 active:scale-90">
              <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${badgeBg} shadow-sm`}>
                  {totalItems}
                </span>
              )}
            </button>
            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform hover:scale-110 active:scale-90 cursor-pointer" />
          </div>

          {/* Menú móvil trigger */}
          <div className={`flex items-center justify-end nav:hidden gap-x-5 transition-colors duration-500 ${iconClass}`}>
            <button onClick={() => setShowCart(true)} className="relative">
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${badgeBg}`}>
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setNavOpen(!navOpen)} className="p-1">
              {navOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Lateral Móvil */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-950 z-[60] transform transition-transform duration-500 ease-in-out shadow-2xl ${navOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center px-6 h-20 border-b border-white/5">
          <img src="/img/darmaxfoto3.png" alt="Logo Darmax" className="h-8 w-auto object-contain" />
          <button onClick={() => setNavOpen(false)} className="text-white hover:rotate-90 transition-transform duration-300">
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>
        <nav className="flex flex-col p-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href} 
                to={link.href} 
                className={`px-5 py-4 rounded-2xl font-black text-xs tracking-widest transition-all duration-200 uppercase ${isActive ? "bg-white/10 text-white shadow-inner" : "text-slate-400 hover:bg-white/5 hover:text-white"}`} 
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
