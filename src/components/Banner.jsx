import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <div className="w-full py-2.5 font-medium text-sm text-white bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600">
          <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-3 text-center">
            <p>🎯 Asesoría sin compromiso</p>
            <span className="hidden sm:inline opacity-70">|</span>
            <p className="hidden sm:block">📍 Te ayudamos a elegir ubicación + configuración</p>
            <span className="hidden sm:inline opacity-70">|</span>
            <p>
              <strong className="font-extrabold hidden sm:inline">DarmaxAgua.com.mx</strong>
              <a
                  href="https://wa.me/525519655369?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar."
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center justify-center rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold hover:bg-white/25 transition border border-white/20"
                >
                  Contactar
                </a>
            </p>
          </div>    </div>
  );
}
