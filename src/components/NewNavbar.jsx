import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NewNavbar() {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { href: "/", text: "INICIA TU NEGOCIO" },
    { href: "/nosotros", text: "NOSOTROS" },
    { href: "/productos", text: "PRODUCTOS" },
    { href: "/purificadores-caseros", text: "PURIFICADORES CASEROS" },
    { href: "/promociones", text: "PROMOCIONES" },
    { href: "/proyectos-empresariales", text: "PROYECTOS" },
  ];
  
  const baseLinkClass = "font-semibold transition-colors duration-200 text-sm";
  const hoverLinkClass = "hover:text-[#24d4da]";
  const activeLinkClass = "text-[#24d4da]";
  const inactiveLinkClass = "text-white";

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 h-20 bg-gray-900/95 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={scrollToTop}>
              <img
                src="/img/logo_darmaxnav.png"
                alt="Logo Darmax"
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={scrollToTop}
                className={`${baseLinkClass} ${location.pathname === link.href ? activeLinkClass : inactiveLinkClass} ${hoverLinkClass}`}
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Right side icons (placeholder for now) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User and Cart icons will be added here */}
          </div>

          {/* Mobile menu button (placeholder for now) */}
          <div className="md:hidden">
            <button className="text-white">
              {/* Hamburger icon will be added here */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
