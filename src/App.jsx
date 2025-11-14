import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

// Layout general con Navbar y Footer
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Páginas cliente
import LandingPage from "./components/LandingPage";
import Nosotros from "./pages/Nosotros";
import IniciaNegocio from "./pages/IniciaNegocio";
import Promociones from "./pages/Promociones";
import ProyectosEmpresariales from "./pages/ProyectosEmpresariales";
import Productos from "./pages/Productos";
import ProductPage from "./pages/ProductPage";
import Carrito from "./pages/Carrito";
import Login from "./pages/logins/Login";
import Register from "./pages/logins/Register";
import ForgotPassword from "./pages/logins/ForgotPassword";
import ResetPassword from "./pages/logins/ResetPassword";
import Configurar from "./pages/configurar/Configurar";
import WizardGeneral from "./pages/WizardGeneral";
import PerfilCliente from "./pages/PerfilCliente";
import VendingInfo from "./pages/VendingInfo";
import PurificadoraInfo from "./pages/PurificadoraInfo";
import VendingLimpiezaInfo from "./pages/VendingLimpiezaInfo";
import Videos from "./pages/Videos";
import VideoDetalle from "./pages/VideoDetalle";
import NotFound from "./pages/NotFound";
import PurificadoresCaseros from "./components/PurificadoresCaseros";

// Admin
import LoginAdmin from "./administrador/LoginAdmin";
import DashboardAdmin from "./administrador/DashboardAdmin";
import ProductosAdmin from "./administrador/pages/ProductosAdmin";
import PedidosAdmin from "./administrador/pages/PedidosAdmin";
import ReportesAdmin from "./administrador/pages/ReportesAdmin";
import ClientesAdmin from "./administrador/pages/ClientesAdmin";
import CategoriasAdmin from "./administrador/pages/CategoriasAdmin";

const stripePromise = loadStripe("TU_CLAVE_PUBLICA_DE_STRIPE");

const PageWrapper = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

import { useUser } from "./context/UserContext";
import GoodbyeScreen from "./components/GoodbyeScreen";

function AppContent() {
  const location = useLocation();
  const { isLoggingOut, loggedOutUserName } = useUser();

  return (
    <>
      <AnimatePresence>
        {isLoggingOut && <GoodbyeScreen name={loggedOutUserName} />}
      </AnimatePresence>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* ADMIN SIN LAYOUT */}
          <Route path="/admin/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />}>
            <Route path="productos" element={<ProductosAdmin />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="pedidos" element={<PedidosAdmin />} />
            <Route path="reportes" element={<ReportesAdmin />} />
            <Route path="clientes" element={<ClientesAdmin />} />
          </Route>

          {/* TODAS LAS DEMÁS RUTAS CON LAYOUT */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
                  <Route path="/nosotros" element={<PageWrapper><Nosotros /></PageWrapper>} />
                  <Route path="/productos" element={<PageWrapper><Productos /></PageWrapper>} />
                  <Route path="/productos/:id" element={<PageWrapper><ProductPage /></PageWrapper>} />
                  <Route path="/inicia-tu-negocio" element={<PageWrapper><IniciaNegocio /></PageWrapper>} />
                  <Route path="/vending-info" element={<PageWrapper><VendingInfo /></PageWrapper>} />
                  <Route path="/purificadora-info" element={<PageWrapper><PurificadoraInfo /></PageWrapper>} />
                  <Route path="/vending-limpieza-info" element={<PageWrapper><VendingLimpiezaInfo /></PageWrapper>} />
                  <Route path="/promociones" element={<PageWrapper><Promociones /></PageWrapper>} />
                  <Route path="/proyectos-empresariales" element={<PageWrapper><ProyectosEmpresariales /></PageWrapper>} />
                  <Route path="/perfil" element={<PageWrapper><PerfilCliente /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                  <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
                  <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
                  <Route path="/videos" element={<PageWrapper><Videos /></PageWrapper>} />
                  <Route path="/videos/:id" element={<PageWrapper><VideoDetalle /></PageWrapper>} />
                  <Route path="/configurar/:id" element={<PageWrapper><Configurar /></PageWrapper>} />
                  <Route path="/configurar-maquina/:id" element={<PageWrapper><WizardGeneral /></PageWrapper>} />
                  <Route
                    path="/carrito"
                    element={
                      <Elements stripe={stripePromise}>
                        <PageWrapper><Carrito /></PageWrapper>
                      </Elements>
                    }
                  />
                  <Route path="/purificadores-caseros" element={<PageWrapper><PurificadoresCaseros /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  );
}
