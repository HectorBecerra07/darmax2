import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaCreditCard,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";
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

  return (
    <footer className="relative bg-[#0f172a] text-slate-400 pt-20 pb-8 px-6 overflow-hidden">
      {/* Línea decorativa superior con identidad dual */}
      <div className="absolute top-0 left-0 right-0 h-[2px] flex">
        <div className="flex-1 bg-gradient-to-r from-transparent via-[#168387] to-transparent" />
        <div className="flex-1 bg-gradient-to-r from-transparent via-[#e7b341] to-transparent" />
      </div>

      {/* Brillos sutiles de fondo */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#168387]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#e7b341]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Columna 1: Marca y Propósito */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src="/img/logos/logoblanco.png" alt="Darmax Logo" className="h-14 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Líderes en ingeniería de purificación y sistemas vending 24/7. 
              Impulsamos emprendedores con tecnología de vanguardia y modelos de negocio altamente rentables.
            </p>
            <div className="flex space-x-3">
              {[
                { href: "https://www.facebook.com/Darmaxagua/", Icon: FaFacebookF, label: "Facebook", color: "hover:bg-blue-600" },
                { href: "https://www.instagram.com/darmaxagua/", Icon: FaInstagram, label: "Instagram", color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600" },
                { href: "https://wa.me/525519655369", Icon: FaWhatsapp, label: "WhatsApp", color: "hover:bg-green-500" },
                { href: "https://www.tiktok.com/@darmax_agua", Icon: FaTiktok, label: "TikTok", color: "hover:bg-slate-800" },
              ].map(({ href, Icon, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-lg transition-all duration-300 hover:border-transparent hover:text-white ${color} hover:-translate-y-1 shadow-lg hover:shadow-black/20`}
                >
                  <Icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Modelos de Negocio */}
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#168387]" /> Modelos de Negocio
            </h3>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <Link to="/vending-info" className="hover:text-[#168387] transition-colors flex items-center gap-2 group">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#168387]/40 group-hover:scale-150 transition-transform" />
                   Vending de Agua
                </Link>
              </li>
              <li>
                <Link to="/vending-limpieza-info" className="hover:text-[#e7b341] transition-colors flex items-center gap-2 group">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#e7b341]/40 group-hover:scale-150 transition-transform" />
                   Vending de Limpieza
                </Link>
              </li>
              <li>
                <Link to="/purificadora-info" className="hover:text-[#168387] transition-colors flex items-center gap-2 group">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#168387]/40 group-hover:scale-150 transition-transform" />
                   Plantas Purificadoras
                </Link>
              </li>
              <li>
                <a href="#" onClick={handleRandomBundleClick} className="hover:text-white transition-colors flex items-center gap-2 group">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:scale-150 transition-transform" />
                   Paquetes de Inversión
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Horarios */}
          <div>
            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#e7b341]" /> Atención al Cliente
            </h3>
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed">
                <span className="text-white block mb-1">Sucursal Bosques</span>
                Blvd. de los Continentes 85, Bosques de Aragón, Nezahualcóyotl, Méx.
              </p>
              <div className="space-y-2">
                <a href="tel:+525653751129" className="block hover:text-white transition-colors">
                  <span className="text-slate-500 mr-2 uppercase text-[10px] font-black">Tel:</span> 
                  +52 56 5375 1129
                </a>
                <a href="mailto:ventas@darmaxagua.com.mx" className="block hover:text-white transition-colors">
                  <span className="text-slate-500 mr-2 uppercase text-[10px] font-black">Email:</span> 
                  ventas@darmaxagua.com.mx
                </a>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Horario de Operación</p>
                <p className="text-white font-bold">Lunes a Viernes: 9:00 am - 6:00 pm</p>
              </div>
            </div>
          </div>

          {/* Columna 4: Ubicación (Mapa Compacto) */}
          <div className="space-y-6">
            <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-2">
              <span className="w-4 h-[2px] bg-[#168387]" /> Ubicación
            </h3>
            <div className="relative group overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <iframe
                title="Mapa Darmax"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.537503078147!2d-99.0543406!3d19.4687422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fb77a5cc739b%3A0x67aef19c3c1e2d65!2sPurificadora%20De%20Agua%20Darmax%20Agua!5e0!3m2!1ses!2smx!4v1720137621960!5m2!1ses!2smx"
                width="100%"
                height="150"
                style={{ border: 0 }}
                loading="lazy"
                className="transition-all duration-700 scale-110 group-hover:scale-100"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl" />
            </div>
            
            <div className="space-y-3">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Pagos Seguros</p>
               <div className="flex items-center gap-4 text-2xl text-slate-500 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                  <FaMoneyCheckAlt title="Transferencia" />
                  <SiMercadopago title="Mercado Pago" />
                  <FaCreditCard title="Tarjetas" />
               </div>
            </div>
          </div>
        </div>

        {/* Línea inferior final */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">&copy; {currentYear}</span>
            <span className="text-white">Darmax Agua Purificada</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-700" />
            <span className="text-slate-600 font-medium lowercase">Ingeniería que fluye.</span>
          </div>
          
          <div className="flex gap-6">
            <Link to="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos</Link>
            <Link to="/politica-de-privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-slate-600 opacity-50 hover:opacity-100 transition-opacity">reCAPTCHA</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
