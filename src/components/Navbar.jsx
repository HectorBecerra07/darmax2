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

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const firstName = (user?.name || "").split(" ")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

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
    { href: "/proyectos-empresariales", text: "PROYECTOS" },
  ];

  const isHome = location.pathname === "/";
  const textClass = isDarkTheme ? "text-white" : "text-slate-900";
  const iconClass = isDarkTheme ? "text-white" : "text-slate-900";
  const accentText = isDarkTheme ? "text-cyan-400" : "text-[#168387]";
  const badgeBg = isDarkTheme ? "bg-cyan-500" : "bg-[#168387]";
  const logoSrc = isDarkTheme ? "/img/darmaxfoto3.png" : "/img/darmaxfoto.png";

  return (
    <>
      {/* WRAPPER CON TRANSICIÓN BIDIRECCIONAL */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1)">
        <nav
          className={`
            pointer-events-auto
            relative overflow-hidden transition-all duration-700 cubic-bezier(0.22, 1, 0.36, 1)
            w-[94%] md:w-[90%] lg:w-[85%] max-w-6xl rounded-b-[2rem] flex items-center
            ${isScrolled 
              ? `h-[70px] shadow-2xl ${isDarkTheme ? 'bg-slate-900/60' : 'bg-white/40'} border-x border-b border-white/10 backdrop-blur-2xl` 
              : 'h-20 bg-transparent border-x border-b border-transparent shadow-none'
            }
          `}
        >
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-8 lg:px-12 relative z-10">
            
            {/* Logo: Viaje de ida y vuelta sincronizado */}
            <div className="shrink-0 flex items-center relative h-14 w-32">
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
                <img src={logoSrc} alt="Logo Darmax" className="h-10 md:h-11 w-auto object-contain transition-all duration-1000 ease-in-out" />
              </Link>
            </div>

            {/* Menú: Cambio de color suave bidireccional */}
            <div className={`hidden nav:flex items-center justify-center gap-1 flex-1 px-8 transition-colors duration-1000 ${textClass}`}>
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 rounded-full font-bold transition-all duration-1000 text-[11px] tracking-widest whitespace-nowrap ${
                      isActive ? `bg-[#168387]/10 ${accentText}` : `hover:bg-white/5 opacity-80 hover:opacity-100`
                    }`}
                  >
                    <span className={isActive ? accentText : ""}>{link.text}</span>
                  </Link>
                );
              })}
            </div>

            {/* Usuario + carrito */}
            <div className={`hidden nav:flex items-center gap-5 transition-colors duration-1000 ${iconClass}`}>
              <button onClick={() => setShowCart(true)} className="relative flex items-center justify-center transition-transform hover:scale-110">
                <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItems > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full ${badgeBg} shadow-lg transition-colors duration-1000`}>
                    {totalItems}
                  </span>
                )}
              </button>
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform hover:scale-110 cursor-pointer" />
            </div>

            {/* Menú móvil */}
            <div className={`flex items-center justify-end nav:hidden gap-x-4 transition-colors duration-1000 ${iconClass}`}>
              <button onClick={() => setShowCart(true)} className="relative flex items-center justify-center">
                <ShoppingBagIcon className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${badgeBg} transition-colors duration-1000`}>
                    {totalItems}
                  </span>
                )}
              </button>
              <button onClick={() => setNavOpen(!navOpen)}>
                {navOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-slate-900/95 backdrop-blur-xl z-[60] transform transition-transform duration-700 ease-in-out shadow-2xl ${navOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center px-6 h-20 border-b border-white/5">
          <img src="/img/darmaxfoto3.png" alt="Logo Darmax" className="h-10 w-auto object-contain italic" />
          <button onClick={() => setNavOpen(false)}><XMarkIcon className="w-8 h-8 text-white" /></button>
        </div>
        <nav className="flex flex-col p-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? location.pathname === "/" : location.pathname.startsWith(link.href);
            return (
              <Link key={link.href} to={link.href} className={`px-5 py-4 rounded-2xl font-bold text-sm tracking-widest transition-all duration-200 ${isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`} onClick={() => setNavOpen(false)}>
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
