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
import CarritoLateral from "./CarritoLateral";

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const { carrito } = useCarrito();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const navMenuRef = useRef(null);

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const firstName = (user?.name || "").split(" ")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // LÓGICA DE TEMA INTELIGENTE POR RUTA Y SCROLL
      const darkSections = ["/purificadores-caseros", "/proyectos-empresariales"];
      
      if (location.pathname === "/") {
        // En Inicio: Claro arriba (Hero), Oscuro abajo (Landing)
        setIsDarkTheme(scrollY > 600);
      } else if (darkSections.includes(location.pathname)) {
        // En estas páginas: Siempre Oscuro (Hero oscuro)
        setIsDarkTheme(true);
      } else {
        // En el resto de páginas: Siempre Claro
        setIsDarkTheme(false); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "/", text: "INICIA TU NEGOCIO", scrollTarget: "inicioRef" },
    { href: "/nosotros", text: "NOSOTROS" },
    // { href: "/purificadores-caseros", text: "PURIFICADORES CASEROS" },
    { href: "/proyectos-empresariales", text: "PROYECTOS" },
  ];

  const isHome = location.pathname === "/";
  
  // CONFIGURACIÓN DE COLORES DINÁMICOS
  const textClass = isDarkTheme ? "text-white" : "text-slate-900";
  const iconClass = isDarkTheme ? "text-white" : "text-slate-900";
  const accentText = isDarkTheme ? "text-cyan-400" : "text-[#168387]";
  const badgeBg = isDarkTheme ? "bg-cyan-500" : "bg-[#168387]";
  const navBg = isScrolled 
    ? (isDarkTheme ? 'bg-slate-900/40' : 'bg-white/30') 
    : 'bg-transparent';

  // LOGO DINÁMICO SEGÚN EL TEMA
  const logoSrc = isDarkTheme ? "/img/darmaxfoto3.png" : "/img/darmaxfoto.png";

  return (
    <>
      <style>{`
        @keyframes lineFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .navbar-line-flow {
          height: 1px;
          width: 100%;
          background: linear-gradient(to right, transparent, ${isDarkTheme ? 'rgba(34,211,238,0.4)' : 'rgba(22,131,135,0.4)'}, transparent);
          position: absolute;
          bottom: 0;
          left: 0;
          animation: lineFlow 3s linear infinite;
          opacity: ${isScrolled ? '1' : '0'};
          transition: opacity 0.5s ease;
        }
      `}</style>

      {/* NAVBAR ADAPTATIVA */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 h-20 overflow-hidden ${navBg} backdrop-blur-2xl ${isScrolled ? 'border-b border-white/10 shadow-xl' : ''}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 relative">
          
          {/* Logo Viajero / Dinámico */}
          <div className="shrink-0 flex items-center relative h-14 w-32">
            <Link
              to="/"
              onClick={scrollToTop}
              className={`
                transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1)
                ${isScrolled || !isHome
                  ? 'opacity-100 scale-100 blur-0 pointer-events-auto' 
                  : 'opacity-0 scale-90 blur-md pointer-events-none'
                }
              `}
            >
              <img
                src={logoSrc}
                alt="Logo Darmax"
                className="h-12 md:h-14 w-auto object-contain transition-all duration-500 hover:scale-105"
              />
            </Link>
          </div>

          {/* Menú escritorio */}
          <div className={`hidden nav:flex items-center justify-center gap-1 flex-1 px-8 transition-colors duration-500 ${textClass}`}>
            {navLinks.map((link) => {
              const isActive = link.href === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-full font-bold transition-all duration-300 text-[12px] tracking-widest whitespace-nowrap ${
                    isActive 
                      ? `bg-white/10 ${accentText} border border-white/10` 
                      : `hover:bg-white/5 ${textClass} opacity-80 hover:opacity-100`
                  }`}
                >
                  <span className={isActive ? accentText : ""}>{link.text}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario + carrito */}
          <div className={`hidden nav:flex items-center gap-5 transition-colors duration-500 ${iconClass}`}>
            <button
              onClick={() => setShowCart(true)}
              className="relative flex items-center justify-center transition-transform hover:scale-110"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${badgeBg} shadow-lg transition-colors duration-500`}>
                  {totalItems}
                </span>
              )}
            </button>

            <div className="relative flex items-center">
              <UserIcon className="w-6 h-6 transition-transform hover:scale-110 cursor-pointer" />
            </div>
          </div>

          {/* Menú móvil */}
          <div className={`flex items-center justify-end nav:hidden gap-x-4 transition-colors duration-500 ${iconClass}`}>
            <button onClick={() => setShowCart(true)} className="relative flex items-center justify-center">
              <ShoppingBagIcon className="w-6 h-6" />
              {totalItems > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${badgeBg} transition-colors duration-500`}>
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setNavOpen(!navOpen)}>
              {navOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* LÍNEA DE ENERGÍA DINÁMICA */}
        <div className="navbar-line-flow" />
      </nav>

      {/* Sidebar móvil */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-900/95 backdrop-blur-xl z-[60] transform transition-transform duration-500 ease-in-out shadow-2xl ${
          navOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 h-20 border-b border-white/5">
          <img src="/img/darmaxfoto3.png" alt="Logo Darmax" className="h-10 w-auto object-contain italic" />
          <button onClick={() => setNavOpen(false)}><XMarkIcon className="w-8 h-8 text-white" /></button>
        </div>
        <nav className="flex flex-col p-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`px-5 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all duration-200 ${
                  isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
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
