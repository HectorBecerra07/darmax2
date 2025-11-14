import React, { useState, useEffect } from "react";
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
  const { carrito } = useCarrito();
  const { user, logout } = useUser(); // Assuming logout is available in context
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  const firstName = (user?.name || "").split(" ")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/inicia-tu-negocio", text: "INICIA TU NEGOCIO" },
    { href: "/productos", text: "PRODUCTOS" },
    { href: "/purificadores-caseros", text: "PURIFICADORES CASEROS" },
    { href: "/promociones", text: "PROMOCIONES" },
    { href: "/proyectos-empresariales", text: "PROYECTOS" },
    { href: "/nosotros", text: "NOSOTROS" },
  ];

  const baseLinkClass = "font-semibold transition-colors duration-200";
  const hoverLinkClass = "hover:text-[#24d4da]";
  const activeLinkClass = "text-[#24d4da]";
  const inactiveLinkClass = "text-white";

  return (
    <>
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center h-20 px-4 sm:px-6 nav:px-8 md:flex md:justify-between">
          
          {/* Elemento vacío para la columna izquierda en móvil, si no hay nada */}
          <div className="md:hidden"></div>

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center justify-center">
            <img
              src="/img/logo4.png"
              alt="Logo Darmax"
              className="h-20 md:h-20 nav:h-24 w-auto object-contain"
            />
          </Link>

          {/* Menú escritorio */}
          <div className="hidden nav:flex items-center justify-center gap-6 nav:gap-10 flex-1">
            {navLinks.map(link => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className={`${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass} hover:bg-[#24d4da]/20 hover:rounded-md px-2 py-1 text-sm`}
                >
                  {link.text}
                </Link>
              );
            })}
          </div>

          {/* Usuario + carrito */}
          <div className="hidden nav:flex items-center gap-4 nav:gap-8">
            <button
              onClick={() => setShowCart(true)}
              className={`relative text-white ${hoverLinkClass}`}
              aria-label="Abrir carrito"
            >
              <ShoppingBagIcon className="w-7 h-7" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 group">
                <span className="text-white font-medium max-w-[120px] truncate">
                  Hola, {firstName}
                </span>
                <button
                  onClick={() => navigate("/perfil")}
                  className={`font-medium text-white ${hoverLinkClass}`}
                >
                  Mi Perfil
                </button>
              </div>
            ) : (
              <Link to="/login" className={`text-white ${hoverLinkClass}`} aria-label="Iniciar sesión">
                <UserIcon className="w-7 h-7" />
              </Link>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="flex items-center justify-end nav:hidden">
            <button
              onClick={() => setShowCart(true)}
              className="relative text-white hover:text-[#ccff00] mr-4"
              aria-label="Abrir carrito"
            >
              <ShoppingBagIcon className="w-7 h-7" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="text-white"
              aria-label="Abrir menú"
            >
              {navOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil (Slide-in from right) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-gray-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out ${
          navOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-5 h-20">
           <button onClick={() => setNavOpen(false)} aria-label="Cerrar menú">
              <XMarkIcon className="w-8 h-8 text-white" />
            </button>
        </div>
        <nav className="flex flex-col p-5 space-y-4">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              to={link.href} 
              className={`text-white text-base font-semibold p-3 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(link.href) ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              onClick={() => setNavOpen(false)}
            >
              {link.text}
            </Link>
          ))}
          <div className="border-t border-gray-700 my-4"></div>
          {user ? (
            <>
              <Link to="/perfil" className="text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800" onClick={() => setNavOpen(false)}>
                Hola, {firstName} (Mi Perfil)
              </Link>
              <button onClick={() => { logout(); setNavOpen(false); }} className="text-left text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800" onClick={() => setNavOpen(false)}>
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>

      <CarritoLateral isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
}
