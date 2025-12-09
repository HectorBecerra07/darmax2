import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaCreditCard,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { SiMercadopago } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900/95 text-gray-300 pt-12 pb-6 px-6">
      {/* Degradado superior sutil */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/60 to-sky-500/0" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Ubicación */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white tracking-wide">
            Ubicación
          </h3>
          <p className="text-sm mb-3 text-gray-400">
            Visítanos en nuestra sucursal y conoce nuestro proceso de purificación.
          </p>
          <div className="overflow-hidden rounded-xl border border-white/5 shadow-lg shadow-sky-900/30">
            <iframe
              title="Mapa Darmax"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.537503078147!2d-99.0543406!3d19.4687422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1fb77a5cc739b%3A0x67aef19c3c1e2d65!2sPurificadora%20De%20Agua%20Darmax%20Agua!5e0!3m2!1ses!2smx!4v1720137621960!5m2!1ses!2smx"
              width="100%"
              height="210"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white tracking-wide">
            Contáctanos
          </h3>
          <p className="text-sm text-sky-400 font-medium mb-2">
            Purificadora de Agua Darmax
          </p>
          <p className="text-sm mb-2 leading-relaxed">
            Blvd. de los Continentes 85, Bosques de Aragón,
            <br />
            57170 Cdad. Nezahualcóyotl, Méx.
          </p>
          <p className="text-sm mb-2">
            Tel:{" "}
            <a
              href="tel:+525653751129"
              className="hover:text-sky-400 transition-colors"
            >
              +52 56 5375 1129
            </a>
          </p>
          <p className="text-sm mb-1">
            Email:{" "}
            <a
              href="mailto:ventas1@darmaxagua.com.mx"
              className="hover:text-sky-400 transition-colors"
            >
              ventas1@darmaxagua.com.mx
            </a>
          </p>
          <p className="text-sm mb-4">
            Email:{" "}
            <a
              href="mailto:ventas2@darmaxagua.com.mx"
              className="hover:text-sky-400 transition-colors"
            >
              ventas2@darmaxagua.com.mx
            </a>
          </p>

          <div className="mt-4 space-y-1 text-xs text-gray-500">
            <p className="font-semibold text-gray-400">
              Horario de atención:
            </p>
            <p>Lunes a Viernes: 9:00 am - 6:00 pm</p>
          </div>
        </div>

        {/* Redes + Métodos de pago */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white tracking-wide">
              Síguenos
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Conoce promociones, novedades y contenido sobre calidad del agua.
            </p>
            <div className="flex space-x-4 mb-6">
              {[
                {
                  href: "https://www.facebook.com/Darmaxagua/",
                  Icon: FaFacebookF,
                  label: "Facebook",
                },
                {
                  href: "https://www.instagram.com/darmaxagua/",
                  Icon: FaInstagram,
                  label: "Instagram",
                },
                {
                  href: "https://wa.me/525512345678",
                  Icon: FaWhatsapp,
                  label: "WhatsApp",
                },
                {
                  href: "https://www.tiktok.com/@darmax_agua",
                  Icon: FaTiktok,
                  label: "TikTok",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-xl
                             hover:text-sky-400 hover:border-sky-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-900/40
                             transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-white tracking-wide">
              Aceptamos
            </h3>
            <div className="flex items-center space-x-5 text-3xl">
              <div className="group">
                <FaMoneyCheckAlt
                  title="Transferencia Bancaria"
                  className="group-hover:text-sky-400 transition-colors"
                />
              </div>
              <div className="group">
                <SiMercadopago
                  title="Mercado Pago"
                  className="group-hover:text-sky-400 transition-colors"
                />
              </div>
              <div className="group">
                <FaCreditCard
                  title="Tarjetas de Crédito/Débito"
                  className="group-hover:text-sky-400 transition-colors"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Pagos seguros y fáciles para tus pedidos de agua.
            </p>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-white/10 mt-10 pt-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()}{" "}
        <span className="text-sky-400 font-semibold">Darmax</span>. Todos los
        derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
