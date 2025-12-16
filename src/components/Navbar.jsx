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
      { href: "/promociones", text: "PROMOCIONES" },
      { href: "/proyectos-empresariales", text: "PROYECTOS" },
  
    ];
  
    const baseLinkClass = "font-semibold transition-colors duration-200";
    const hoverLinkClass = "hover:text-[#24d4da]";
    const activeLinkClass = "text-[#24d4da]";
    const inactiveLinkClass = "text-white";
  
    return (
      <>
        {/* NAVBAR */}
        <nav
          className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 bg-gray-900/95 backdrop-blur-lg`}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-3 items-center h-20 px-4 sm:px-6 nav:px-8 md:flex md:justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={scrollToTop}
              className="shrink-0 flex items-center"
            >
              <img
                src="/img/logo_darmaxnav.png"
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
            <div className="hidden nav:flex items-center justify-center gap-6 nav:gap-10 flex-1">
              {navLinks.map((link) => {
                const isActive =
                  location.pathname === link.href &&
                  (!link.scrollTarget ||
                    location.state?.scrollTo === link.scrollTarget);
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
                      className={`${baseLinkClass} ${
                        isActive ? activeLinkClass : inactiveLinkClass
                      } hover:bg-[#24d4da]/20 hover:rounded-md px-2 py-1 text-sm`}
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
                    className={`${baseLinkClass} ${
                      location.pathname.startsWith(link.href)
                        ? activeLinkClass
                        : inactiveLinkClass
                    } hover:bg-[#24d4da]/20 hover:rounded-md px-2 py-1 text-sm`}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </div>
            {/* Usuario + carrito */}{" "}
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

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`relative text-white ${hoverLinkClass}`}
                  aria-label="Menú de usuario"
                >
                  <UserIcon className="w-7 h-7" />
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
            <div className="flex items-center justify-end nav:hidden col-span-2 gap-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative text-white hover:text-[#24d4da]"
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
                {navOpen ? (
                  <XMarkIcon className="w-8 h-8" />
                ) : (
                  <Bars3Icon className="w-8 h-8" />
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
          <nav className="flex flex-col p-5 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-white text-base font-semibold p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname.startsWith(link.href)
                    ? "bg-gray-700"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  setNavOpen(false);
                  scrollToTop();
                }}
              >
                {link.text}
              </Link>
            ))}
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
