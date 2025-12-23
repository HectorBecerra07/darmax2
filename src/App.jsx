// src/App.jsx
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// Layout general con Navbar y Footer
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Páginas cliente
import LandingPage from "./components/LandingPage";
import Nosotros from "./pages/Nosotros";
import IniciaNegocio from "./pages/IniciaNegocio";
import ProyectosEmpresariales from "./pages/ProyectosEmpresariales";
import Productos from "./pages/Productos";
import ProductView from "./pages/ProductView";
import Carrito from "./pages/Carrito";
import Login from "./pages/logins/Login";
import Register from "./pages/logins/Register";
import ForgotPassword from "./pages/logins/ForgotPassword";
import VerifyEmail from "./pages/logins/VerifyEmail"; // Add this import
import ResetPassword from "./pages/logins/ResetPassword";
import Configurar from "./pages/configurar/Configurar";
import WizardGeneral from "./pages/WizardGeneral";
import BundleWizard from "./pages/BundleWizard"; // Importar BundleWizard
import PerfilCliente from "./pages/PerfilCliente";
import VendingInfo from "./pages/VendingInfo";
import PurificadoraInfo from "./pages/PurificadoraInfo";
import VendingLimpiezaInfo from "./pages/VendingLimpiezaInfo";
import DuoEmprendedorInfo from "./pages/DuoEmprendedorInfo";
import TridenteInfo from "./pages/TridenteInfo";
import MegalodonInfo from "./pages/MegalodonInfo";
import Videos from "./pages/Videos";
import VideoDetalle from "./pages/VideoDetalle";
import NotFound from "./pages/NotFound";
import PurificadoresCaseros from "./components/PurificadoresCaseros";
import Checkout from "./pages/StripeCheckoutPage";
import GraciasCompra from "./pages/GraciasCompra"; // 👈 NUEVA PÁGINA

// Admin
import LoginAdmin from "./administrador/LoginAdmin";
import DashboardAdmin from "./administrador/DashboardAdmin";
import ProductosAdmin from "./administrador/pages/ProductosAdmin";
import PedidosAdmin from "./administrador/pages/PedidosAdmin";
import EnviosAdmin from "./administrador/pages/EnviosAdmin";
import ReportesAdmin from "./administrador/pages/ReportesAdmin";
import ClientesAdmin from "./administrador/pages/ClientesAdmin";
import CategoriasAdmin from "./administrador/pages/CategoriasAdmin";
import ModelsConfigAdmin from "./administrador/pages/ModelsConfigAdmin";
import ExtrasAdmin from "./administrador/pages/ExtrasAdmin";
import DetalleModeloAdmin from "./administrador/pages/DetalleModeloAdmin"; // Nueva página de detalle
import ChatbotAdmin from "./administrador/pages/ChatbotAdmin";

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
import { Toaster } from "react-hot-toast"; // Importar Toaster
import WhatsAppButton from "./components/WhatsAppButton";
import ChatbotWidget from "./components/ChatbotWidget";
import { SettingsProvider, useSettings } from "./context/SettingsContext"; // Importar SettingsProvider y useSettings

function AppContent() {
  const location = useLocation();
  const { isLoggingOut, loggedOutUserName } = useUser();
  const { isChatbotActive, isLoadingSettings } = useSettings(); // Usar el hook de configuración

  // Determinar si los widgets de chat deben ocultarse en la ruta actual
  const hideChatWidgets = 
    location.pathname.startsWith('/admin') || 
    location.pathname.includes('/login') ||
    location.pathname.includes('/register') ||
    location.pathname.includes('/forgot-password') ||
    location.pathname.includes('/reset-password') ||
    location.pathname.includes('/verify-email');

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
            <Route path="envios" element={<EnviosAdmin />} />
            <Route path="configurador" element={<ModelsConfigAdmin />} />
            <Route path="configurador/model/:slug" element={<DetalleModeloAdmin />} />
            <Route path="extras" element={<ExtrasAdmin />} />
            <Route path="reportes" element={<ReportesAdmin />} />
            <Route path="clientes" element={<ClientesAdmin />} />
            <Route path="chatbot" element={<ChatbotAdmin />} />
          </Route>

          {/* TODAS LAS DEMÁS RUTAS CON LAYOUT */}
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PageWrapper>
                        <LandingPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/nosotros"
                    element={
                      <PageWrapper>
                        <Nosotros />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/productos"
                    element={
                      <PageWrapper>
                        <Productos />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/producto/:id"
                    element={
                      <PageWrapper>
                        <ProductView />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/inicia-tu-negocio"
                    element={
                      <PageWrapper>
                        <IniciaNegocio />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/vending-info"
                    element={
                      <PageWrapper>
                        <VendingInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/purificadora-info"
                    element={
                      <PageWrapper>
                        <PurificadoraInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/vending-limpieza-info"
                    element={
                      <PageWrapper>
                        <VendingLimpiezaInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/duo-emprendedor-info"
                    element={
                      <PageWrapper>
                        <DuoEmprendedorInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/tridente-info"
                    element={
                      <PageWrapper>
                        <TridenteInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/megalodon-info"
                    element={
                      <PageWrapper>
                        <MegalodonInfo />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/proyectos-empresariales"
                    element={
                      <PageWrapper>
                        <ProyectosEmpresariales />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/perfil"
                    element={
                      <PageWrapper>
                        <PerfilCliente />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PageWrapper>
                        <Login />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PageWrapper>
                        <Register />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PageWrapper>
                        <ForgotPassword />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/verify-email"
                    element={
                      <PageWrapper>
                        <VerifyEmail />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PageWrapper>
                        <ResetPassword />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/videos"
                    element={
                      <PageWrapper>
                        <Videos />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/videos/:id"
                    element={
                      <PageWrapper>
                        <VideoDetalle />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/configurar/:id"
                    element={
                      <PageWrapper>
                        <Configurar />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/configurar-maquina/:id"
                    element={
                      <PageWrapper>
                        <WizardGeneral />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/configurar-paquete/:id"
                    element={
                      <PageWrapper>
                        <BundleWizard />
                      </PageWrapper>
                    }
                  />

                  {/* Checkout independiente (si lo sigues usando) */}
                  <Route
                    path="/checkout"
                    element={
                      <PageWrapper>
                        <Checkout />
                      </PageWrapper>
                    }
                  />

                  {/* Carrito: Stripe se maneja dentro de Carrito.jsx */}
                  <Route
                    path="/carrito"
                    element={
                      <PageWrapper>
                        <Carrito />
                      </PageWrapper>
                    }
                  />

                  {/* ✅ Página de gracias/confirmación de compra */}
                  <Route
                    path="/gracias-compra"
                    element={
                      <PageWrapper>
                        <GraciasCompra />
                      </PageWrapper>
                    }
                  />

                  <Route
                    path="/purificadores-caseros"
                    element={
                      <PageWrapper>
                        <PurificadoresCaseros />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <PageWrapper>
                        <NotFound />
                      </PageWrapper>
                    }
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AnimatePresence>
      <Toaster position="bottom-right" /> {/* Toaster para notificaciones */}
      {!hideChatWidgets && <WhatsAppButton />}
      {!hideChatWidgets && !isLoadingSettings && isChatbotActive && <ChatbotWidget />} {/* Renderizar condicionalmente */}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <SettingsProvider> {/* Envolver con SettingsProvider */}
        <AppContent />
      </SettingsProvider>
    </HelmetProvider>
  );
}