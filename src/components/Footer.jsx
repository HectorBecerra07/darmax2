import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleRandomBundleClick = (e) => {
    e.preventDefault();
    const bundleRoutes = ["/duo-emprendedor-info", "/megalodon-info", "/tridente-info"];
    const randomRoute = bundleRoutes[Math.floor(Math.random() * bundleRoutes.length)];
    navigate(randomRoute);
  };

  const socialLinks = [
    { href: "https://www.facebook.com/Darmaxagua/", Icon: FaFacebookF, label: "Facebook", hoverColor: "hover:bg-blue-600 hover:border-blue-600" },
    { href: "https://www.instagram.com/darmaxagua/", Icon: FaInstagram, label: "Instagram", hoverColor: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 hover:border-transparent" },
    { href: "https://wa.me/525519655369", Icon: FaWhatsapp, label: "WhatsApp", hoverColor: "hover:bg-green-500 hover:border-green-500" },
    { href: "https://www.tiktok.com/@darmax_agua", Icon: FaTiktok, label: "TikTok", hoverColor: "hover:bg-slate-900 hover:border-slate-900" },
  ];

  return (
    <footer className="relative bg-[#172a38] text-white font-montserrat not-italic overflow-hidden font-light">
      {/* Linea decorativa superior con identidad dual */}
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        <div className="flex-1 bg-gradient-to-r from-transparent via-[#168387] to-transparent" />
        <div className="flex-1 bg-gradient-to-r from-transparent via-[#e7b341] to-transparent" />
      </div>

      {/* Brillos sutiles de fondo */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#168387]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#e7b341]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* CUERPO PRINCIPAL DEL FOOTER */}
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-12 sm:pb-14 relative z-10">
        
        {/* VISTA MÓVIL (2 COLUMNAS SEGÚN DISEÑO) */}
        <div className="grid grid-cols-2 gap-x-4 min-[380px]:gap-x-5 gap-y-6 sm:hidden">
          {/* COLUMNA IZQUIERDA MÓVIL: Logo, Frases, Iconos y Frase Izquierda */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Logo y frase debajo */}
              <div className="space-y-1 w-fit">
                <Link to="/" className="inline-block">
                  <img src="/img/logos/logoblanco.png" alt="Darmax Logo" className="h-[48px] min-[380px]:h-[54px] w-auto object-contain block" />
                </Link>
                <p className="text-white font-light text-[6.5px] min-[380px]:text-[7.5px] tracking-[0.16em] font-montserrat not-italic uppercase leading-tight">
                  CALIDAD AL BEBER, RETORNO AL INVERTIR
                </p>
              </div>

              {/* Segunda frase */}
              <p className="text-white/90 font-light text-[9px] min-[380px]:text-[10px] leading-snug font-montserrat not-italic mt-2.5">
                Soluciones en agua para tu hogar, tu negocio y un mejor mañana.
              </p>

              {/* Iconos de redes sociales */}
              <div className="flex items-center gap-1.5 min-[380px]:gap-2 pt-2.5">
                {socialLinks.map(({ href, Icon, label, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-7 h-7 min-[380px]:w-8 min-[380px]:h-8 rounded-full border border-white flex items-center justify-center text-white transition-all duration-300 ${hoverColor} hover:scale-110 shadow-md shadow-black/20`}
                  >
                    <Icon className="text-xs min-[380px]:text-sm" />
                  </a>
                ))}
              </div>
            </div>

            {/* Frase de lado izquierdo */}
            <div className="relative inline-flex flex-col items-start pt-2 pb-2">
              <span className="text-white font-light text-[7.5px] min-[380px]:text-[8px] tracking-[0.2em] uppercase leading-tight">
                AGUA PARA
              </span>
              <p className="text-white font-light text-[7.5px] min-[380px]:text-[8px] tracking-[0.2em] uppercase leading-tight">
                UN MEJOR MAÑANA
              </p>
              {/* Línea decorativa: sale del lado izquierdo y más larga */}
              <span className="absolute bottom-0 left-0 w-10 min-[380px]:w-12 h-[2px] bg-[#24d4da] rounded-full" />
            </div>
          </div>

          {/* COLUMNA DERECHA MÓVIL: Contáctanos y Mapa */}
          <div className="flex flex-col space-y-4">
            {/* Contáctanos */}
            <div>
              <h3 className="text-white font-light uppercase tracking-[0.2em] text-[10px] min-[380px]:text-[11px]">
                CONTACTANOS
              </h3>
              <div className="w-5 h-[2px] bg-[#24d4da] mt-1.5 mb-2.5 rounded-full" />
              <ul className="space-y-2 text-[9px] min-[380px]:text-[10px] font-extralight text-white leading-snug">
                <li className="flex items-start gap-1.5 leading-snug">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0 mt-0.5" />
                  <span className="leading-snug text-white">Blvd. de los Continentes 85, Bosques de Aragón, Nezahualcóyotl, Méx.</span>
                </li>
                <li>
                  <a href="tel:+525653751129" className="flex items-center gap-1.5 hover:text-[#24d4da] transition-colors text-white">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0" />
                    <span>+52 56 5375 1129</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:ventas@darmaxagua.com.mx" className="flex items-center gap-1.5 hover:text-[#24d4da] transition-colors break-all text-white">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0" />
                    <span>ventas@darmaxagua.com.mx</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Mapa Ubicación */}
            <div>
              <h3 className="text-white font-light uppercase tracking-[0.2em] text-[10px] min-[380px]:text-[11px]">
                UBICACIÓN
              </h3>
              <div className="w-5 h-[2px] bg-[#24d4da] mt-1.5 mb-2 rounded-full" />
              <div className="relative group overflow-hidden rounded-xl border border-white/10 shadow-lg">
                <iframe
                  title="Mapa Darmax Móvil"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.537503078147!2d-99.0543406!3d19.4687422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fb77a5cc739b%3A0x67aef19c3c1e2d65!2sPurificadora%20De%20Agua%20Darmax%20Agua!5e0!3m2!1ses!2smx!4v1720137621960!5m2!1ses!2smx"
                  width="100%"
                  height="105"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* ENLACES RÁPIDOS MÓVIL (Para navegación de usuarios e indexación de rastreadores) */}
        <div className="mt-6 pt-5 border-t border-white/10 sm:hidden">
          <p className="text-white font-light uppercase tracking-[0.2em] text-[9.5px] mb-3 text-center">
            SOLUCIONES Y MODELOS
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[9px] font-extralight text-white/90">
            <Link to="/vending-info" className="hover:text-[#24d4da] transition-colors">Vending de Agua</Link>
            <Link to="/vending-limpieza-info" className="hover:text-[#24d4da] transition-colors">Vending de Limpieza</Link>
            <Link to="/purificadora-info" className="hover:text-[#24d4da] transition-colors">Plantas Purificadoras</Link>
            <Link to="/duo-emprendedor-info" className="hover:text-[#24d4da] transition-colors">Dúo Emprendedor</Link>
            <Link to="/tridente-info" className="hover:text-[#24d4da] transition-colors">Paquete Tridente</Link>
            <Link to="/megalodon-info" className="hover:text-[#24d4da] transition-colors">Paquete Megalodon</Link>
            <Link to="/proyectos-empresariales" className="hover:text-[#24d4da] transition-colors">Proyectos Empresariales</Link>
            <Link to="/videos" className="hover:text-[#24d4da] transition-colors">Videos y Tutoriales</Link>
            <Link to="/nosotros" className="hover:text-[#24d4da] transition-colors">Sobre Nosotros</Link>
            <Link to="/terminos-y-condiciones" className="hover:text-[#24d4da] transition-colors">Términos y Condiciones</Link>
          </div>
        </div>

        {/* VISTA ESCRITORIO / TABLET (sm en adelante: 6 columnas) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr_1.2fr_0.8fr] gap-8 lg:gap-5 xl:gap-7">
          
          {/* Columna 1: Marca, Eslogan, Subtexto y Redes Sociales */}
          <div className="space-y-6 sm:space-y-7 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="space-y-1.5 w-fit">
              <Link to="/" className="inline-block">
                <img src="/img/logos/logoblanco.png" alt="Darmax Logo" className="h-[72px] sm:h-[80px] lg:h-[86px] w-auto object-contain block" />
              </Link>
              <p className="text-white font-light text-[8px] sm:text-[8.5px] tracking-[0.25em] font-montserrat not-italic uppercase leading-relaxed">
                CALIDAD AL BEBER, RETORNO AL INVERTIR
              </p>
            </div>

            <h3 className="text-white font-light text-[11px] sm:text-xs leading-loose font-montserrat not-italic max-w-sm">
              Soluciones en agua para tu hogar, tu negocio y un mejor mañana.
            </h3>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-3">
              {socialLinks.map(({ href, Icon, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white flex items-center justify-center text-white transition-all duration-300 ${hoverColor} hover:scale-110 shadow-md shadow-black/20`}
                >
                  <Icon className="text-sm sm:text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Nuestros Equipos y Paquetes */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-white font-light uppercase tracking-[0.22em] text-[10px] sm:text-[11px]">
              EQUIPOS Y MODELOS
            </h3>
            <div className="w-5 h-[2px] bg-[#24d4da] mt-2 mb-4 sm:mb-5 rounded-full" />
            <ul className="space-y-2.5 sm:space-y-3 text-[11px] sm:text-xs font-extralight sm:font-light text-white leading-relaxed">
              <li>
                <Link to="/vending-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Vending de Agua
                </Link>
              </li>
              <li>
                <Link to="/vending-limpieza-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Vending de Limpieza
                </Link>
              </li>
              <li>
                <Link to="/purificadora-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Plantas Purificadoras
                </Link>
              </li>
              <li>
                <Link to="/duo-emprendedor-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Dúo Emprendedor
                </Link>
              </li>
              <li>
                <Link to="/tridente-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Paquete Tridente
                </Link>
              </li>
              <li>
                <Link to="/megalodon-info" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Paquete Megalodon
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Sobre Darmax y Soluciones */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-white font-light uppercase tracking-[0.22em] text-[10px] sm:text-[11px]">
              EMPRESA Y RECURSOS
            </h3>
            <div className="w-5 h-[2px] bg-[#24d4da] mt-2 mb-4 sm:mb-5 rounded-full" />
            <ul className="space-y-2.5 sm:space-y-3 text-[11px] sm:text-xs font-extralight sm:font-light text-white leading-relaxed">
              <li>
                <Link to="/nosotros" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/proyectos-empresariales" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Proyectos Empresariales
                </Link>
              </li>
              <li>
                <Link to="/purificadores-caseros" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Purificadores Caseros
                </Link>
              </li>
              <li>
                <Link to="/videos" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Videos y Capacitación
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/terminos-y-condiciones" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/politica-de-privacidad" className="hover:text-[#24d4da] hover:translate-x-1 transition-all inline-block">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contáctanos */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-white font-light uppercase tracking-[0.22em] text-[10px] sm:text-[11px]">
              CONTACTANOS
            </h3>
            <div className="w-5 h-[2px] bg-[#24d4da] mt-2 mb-5 sm:mb-6 rounded-full" />
            <ul className="space-y-3.5 sm:space-y-4.5 text-[11px] sm:text-xs font-extralight sm:font-light text-white leading-relaxed">
              <li className="flex items-start gap-2.5 leading-relaxed">
                <MapPinIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-white">Blvd. de los Continentes 85, Bosques de Aragón, Nezahualcóyotl, Méx.</span>
              </li>
              <li>
                <a href="tel:+525653751129" className="flex items-center gap-2.5 hover:text-[#24d4da] transition-colors text-white">
                  <PhoneIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0" />
                  <span>+52 56 5375 1129</span>
                </a>
              </li>
              <li>
                <a href="mailto:ventas@darmaxagua.com.mx" className="flex items-center gap-2.5 hover:text-[#24d4da] transition-colors break-all text-white">
                  <EnvelopeIcon className="w-3.5 h-3.5 text-[#24d4da] shrink-0" />
                  <span>ventas@darmaxagua.com.mx</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 5: Ubicación con Mapa */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <h3 className="text-white font-light uppercase tracking-[0.22em] text-[10px] sm:text-[11px]">
              UBICACIÓN
            </h3>
            <div className="w-5 h-[2px] bg-[#24d4da] mt-2 mb-5 sm:mb-6 rounded-full" />
            <div className="relative group overflow-hidden rounded-xl border border-white/10 shadow-lg">
              <iframe
                title="Mapa Darmax"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.537503078147!2d-99.0543406!3d19.4687422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fb77a5cc739b%3A0x67aef19c3c1e2d65!2sPurificadora%20De%20Agua%20Darmax%20Agua!5e0!3m2!1ses!2smx!4v1720137621960!5m2!1ses!2smx"
                width="100%"
                height="125"
                style={{ border: 0 }}
                loading="lazy"
                className="transition-all duration-700 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
            </div>
          </div>

          {/* Columna 6: Frase en la esquina inferior */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 flex flex-col justify-end items-end text-right h-full pt-4 sm:pt-5 lg:pt-0">
            <div className="relative inline-flex flex-col items-end space-y-0.5 pb-2.5">
              <span className="text-white font-light text-[8px] sm:text-[8.5px] xl:text-[9px] tracking-[0.2em] uppercase leading-tight">
                AGUA PARA
              </span>
              <p className="text-white font-light text-[8px] sm:text-[8.5px] xl:text-[9px] tracking-[0.2em] uppercase leading-tight">
                UN MEJOR MAÑANA
              </p>
              {/* Línea decorativa saliendo del lado derecho en escritorio */}
              <span className="absolute bottom-0 right-0 w-8 lg:w-10 h-[2px] bg-[#24d4da] rounded-full" />
            </div>
          </div>

        </div>
      </div>

      {/* BARRA INFERIOR ADICIONAL (#0f172a, adaptada a móvil y escritorio) */}
      <div className="w-full bg-[#0f172a] py-5 sm:py-7 px-3 sm:px-8 lg:px-12 border-t border-white/10 font-montserrat not-italic overflow-hidden">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 text-[10px] sm:text-[11px] font-light leading-relaxed">
          
          {/* Métodos de pago en una sola línea compacta sin generar scroll horizontal */}
          <div className="flex flex-row items-center justify-center gap-1 min-[360px]:gap-1.5 sm:gap-4 text-white font-light order-1 md:order-3 w-full md:w-auto flex-nowrap whitespace-nowrap overflow-hidden py-0.5">
            <span className="text-[7px] min-[360px]:text-[7.5px] min-[390px]:text-[8.5px] sm:text-[11px] font-medium uppercase tracking-[0.1em] sm:tracking-[0.16em] text-white/80 shrink-0">
              MÉTODOS DE PAGO:
            </span>
            <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 flex-nowrap shrink-0">
              <span className="inline-flex items-center gap-0.5 min-[360px]:gap-1 text-[7px] min-[360px]:text-[7.5px] min-[390px]:text-[8.5px] sm:text-[11px] text-white bg-white/5 sm:bg-transparent px-1 min-[360px]:px-1.5 py-0.5 sm:p-0 rounded-md sm:rounded-none border border-white/10 sm:border-0 shrink-0">
                <BanknotesIcon className="w-2.5 h-2.5 min-[380px]:w-3 min-[380px]:h-3 sm:w-5 sm:h-5 text-white shrink-0" />
                <span>Efectivo</span>
              </span>
              <span className="inline-flex items-center gap-0.5 min-[360px]:gap-1 text-[7px] min-[360px]:text-[7.5px] min-[390px]:text-[8.5px] sm:text-[11px] text-white bg-white/5 sm:bg-transparent px-1 min-[360px]:px-1.5 py-0.5 sm:p-0 rounded-md sm:rounded-none border border-white/10 sm:border-0 shrink-0">
                <ArrowsRightLeftIcon className="w-2.5 h-2.5 min-[380px]:w-3 min-[380px]:h-3 sm:w-5 sm:h-5 text-white shrink-0" />
                <span>Transferencia</span>
              </span>
              <span className="inline-flex items-center gap-0.5 min-[360px]:gap-1 text-[7px] min-[360px]:text-[7.5px] min-[390px]:text-[8.5px] sm:text-[11px] text-white bg-white/5 sm:bg-transparent px-1 min-[360px]:px-1.5 py-0.5 sm:p-0 rounded-md sm:rounded-none border border-white/10 sm:border-0 shrink-0">
                <CreditCardIcon className="w-2.5 h-2.5 min-[380px]:w-3 min-[380px]:h-3 sm:w-5 sm:h-5 text-white shrink-0" />
                <span>Tarjeta</span>
              </span>
            </div>
          </div>

          {/* Lema central (oculto en móvil, visible en escritorio) */}
          <p className="hidden sm:block text-white/80 font-light text-center tracking-wider text-[10px] sm:text-[11px] order-2 md:order-2">
            Innovación <span className="text-white/40 mx-1.5">|</span> Calidad <span className="text-white/40 mx-1.5">|</span> Confianza
          </p>

          {/* Copyright dinámico */}
          <p className="text-white/70 text-center md:text-left text-[10px] sm:text-[11px] font-light order-3 md:order-1">
            &copy; {currentYear} Darmax Agua. Todos los derechos reservados.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
