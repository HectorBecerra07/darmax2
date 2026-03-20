import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import Navbar from "../components/Navbar"; // Uncommented original Navbar
// import NewNavbar from "../components/NewNavbar"; // Commented out new Navbar
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // Rutas donde NO debe mostrarse el footer
  const rutasExactas = ["/videos", "/inicia-tu-negocio"];
  const rutasDinamicas = ["/videos/:id", "/configurar-maquina/:id"];

  const hideFooter =
    rutasExactas.includes(location.pathname) ||
    rutasDinamicas.some((ruta) =>
      matchPath({ path: ruta, end: false }, location.pathname)
    );

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 overflow-hidden">
      <Navbar /> {/* Render original Navbar */}
      {/* <NewNavbar /> */} {/* Commented out new Navbar */}
      {/* Eliminamos el padding superior para que el contenido empiece desde arriba (detrás de la Navbar transparente) */}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;

