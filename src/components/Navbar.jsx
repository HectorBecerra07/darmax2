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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target) && navOpen) {
        setNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navOpen]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

    const navLinks = [
      { href: "/", text: "INICIA TU NEGOCIO", scrollTarget: "inicioRef" },
      { href: "/nosotros", text: "NOSOTROS" },
      { href: "/productos", text: "PRODUCTOS" },
      { href: "/purificadores-caseros", text: "PURIFICADORES CASEROS" },
      { href: "/proyectos-empresariales", text: "PROYECTOS" },
  
    ];
  
    const baseLinkClass = "px-4 py-2 rounded-full font-medium italic transition-all duration-300 text-[13px] tracking-wide whitespace-nowrap";
    const hoverLinkClass = "hover:text-[#24d4da] transition-colors duration-200";
    const activeLinkClass = "bg-[#24d4da]/20 text-[#24d4da] border border-[#24d4da]/20";
    const inactiveLinkClass = "text-white hover:bg-white/5 hover:text-[#24d4da]";
  
    return (
      <>
        {/* NAVBAR */}
        <nav
          className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
            isScrolled ? 'bg-slate-800/70 backdrop-blur-lg' : 'bg-gray-900'
          }`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 items-center h-20 px-4 sm:px-6 nav:px-8 md:flex md:justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={scrollToTop}
              className="shrink-0 flex items-center"
            >
              <img
                src="/img/darmaxfoto.png"
                alt="Logo Darmax"
                className="
                        h-14 md:h-16
                        w-auto object-contain
                        transition-transform duration-300
                        hover:scale-[1.03]
                      "
              />
            </Link>
            {/* Menú escritorio */}
            <div className="hidden nav:flex items-center justify-center gap-2 nav:gap-4 flex-1">
              {navLinks.map((link) => {
                const isActive = link.href === "/" 
                  ? location.pathname === "/" 
                  : location.pathname.startsWith(link.href);

                const finalClass = `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;

                if (link.scrollTarget) {
                  return (
                    <button
                      key={link.text}
                      onClick={() => {
                        navigate(link.href, {
                          state: { scrollTo: link.scrollTarget },
                        });
                        scrollToTop();
                      }}
                      className={finalClass}
                    >
                      {link.text}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={scrollToTop}
                    className={finalClass}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>
            {/* Usuario + carrito */}{" "}
            <div className="hidden nav:flex items-center gap-4 nav:gap-6 h-full">
              <button
                onClick={() => setShowCart(true)}
                className={`relative flex items-center justify-center text-white ${hoverLinkClass}`}
                aria-label="Abrir carrito"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-900">
                    {totalItems}
                  </span>
                )}
              </button>

              <div className="relative flex items-center" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center justify-center text-white ${hoverLinkClass}`}
                  aria-label="Menú de usuario"
                >
                  <UserIcon className="w-6 h-6" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-black">
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          Hola,{" "}
                          <span className="font-semibold">{firstName}</span>
                        </div>
                        <Link
                          to="/perfil"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setUserMenuOpen(false);
                            scrollToTop();
                          }}
                        >
                          Mi Perfil
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setUserMenuOpen(false);
                            scrollToTop();
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setUserMenuOpen(false);
                            scrollToTop();
                          }}
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setUserMenuOpen(false);
                            scrollToTop();
                          }}
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Botón menú móvil */}
            <div className="flex items-center justify-end nav:hidden col-span-2 gap-x-5">
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center justify-center text-white hover:text-[#24d4da]"
                aria-label="Abrir carrito"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-900">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setNavOpen(!navOpen)}
                className="flex items-center justify-center text-white"
                aria-label="Abrir menú"
              >
                {navOpen ? (
                  <XMarkIcon className="w-7 h-7" />
                ) : (
                  <Bars3Icon className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Menú móvil (Slide-in from right) */}
        <div
          ref={navMenuRef}
          className={`fixed top-0 right-0 h-full w-full max-w-xs bg-gray-900/95 backdrop-blur-lg z-40 transform transition-transform duration-300 ease-in-out ${
            navOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-5 h-20">
            <button onClick={() => setNavOpen(false)} aria-label="Cerrar menú">
              <XMarkIcon className="w-8 h-8 text-white" />
            </button>
          </div>
          <nav className="flex flex-col p-5 space-y-3">
            {navLinks.map((link) => {
              const isActive = link.href === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-5 py-3 rounded-2xl font-medium italic transition-all duration-200 ${
                    isActive
                      ? "bg-[#24d4da]/20 text-[#24d4da] border border-[#24d4da]/20"
                      : "text-white hover:bg-white/5"
                  }`}
                  onClick={() => {
                    setNavOpen(false);
                    scrollToTop();
                  }}
                >
                  {link.text}
                </Link>
              );
            })}
            <div className="border-t border-gray-700 my-4"></div>
            {user ? (
              <>
                <div className="px-3 py-2 text-white">
                  Hola, <span className="font-semibold">{firstName}</span>
                </div>
                <Link
                  to="/perfil"
                  className="text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800"
                  onClick={() => {
                    setNavOpen(false);
                    scrollToTop();
                  }}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                    setNavOpen(false);
                    scrollToTop();
                  }}
                  className="text-left text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800"
                  onClick={() => {
                    setNavOpen(false);
                    scrollToTop();
                  }}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="text-white text-base font-semibold p-3 rounded-lg hover:bg-gray-800"
                  onClick={() => {
                    setNavOpen(false);
                    scrollToTop();
                  }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>

        <CarritoLateral isOpen={showCart} onClose={() => setShowCart(false)} />
      </>
    );
}
