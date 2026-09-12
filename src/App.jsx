// src/App.jsx
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import React, { useEffect, lazy, Suspense } from "react";

// Layout general con Navbar y Footer
import Layout from "./layouts/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Cargando componentes de forma perezosa (Lazy Loading) para optimizar SEO/Performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Nosotros = lazy(() => import("./pages/Nosotros"));

const ProyectosEmpresariales = lazy(() => import("./pages/ProyectosEmpresariales"));
const Productos = lazy(() => import("./pages/Productos"));
const ProductView = lazy(() => import("./pages/ProductView"));
const Carrito = lazy(() => import("./pages/Carrito"));
const Login = lazy(() => import("./pages/logins/Login"));
const Register = lazy(() => import("./pages/logins/Register"));
const ForgotPassword = lazy(() => import("./pages/logins/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/logins/VerifyEmail"));
const ResetPassword = lazy(() => import("./pages/logins/ResetPassword"));
const Configurar = lazy(() => import("./pages/configurar/Configurar"));
const WizardGeneral = lazy(() => import("./pages/WizardGeneral"));
const BundleWizard = lazy(() => import("./pages/BundleWizard"));
const PerfilCliente = lazy(() => import("./pages/PerfilCliente"));
const VendingInfo = lazy(() => import("./pages/VendingInfo"));
const PurificadoraInfo = lazy(() => import("./pages/PurificadoraInfo"));
const VendingLimpiezaInfo = lazy(() => import("./pages/VendingLimpiezaInfo"));
const DuoEmprendedorInfo = lazy(() => import("./pages/DuoEmprendedorInfo"));
const TridenteInfo = lazy(() => import("./pages/TridenteInfo"));
const MegalodonInfo = lazy(() => import("./pages/MegalodonInfo"));
const Videos = lazy(() => import("./pages/Videos"));
const VideoDetalle = lazy(() => import("./pages/VideoDetalle"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PurificadoresCaseros = lazy(() => import("./components/PurificadoresCaseros"));
const Checkout = lazy(() => import("./pages/StripeCheckoutPage"));
const GraciasCompra = lazy(() => import("./pages/GraciasCompra"));
const TerminosCondiciones = lazy(() => import("./pages/TerminosCondiciones"));
const PoliticaPrivacidad = lazy(() => import("./pages/PoliticaPrivacidad"));

// Admin Lazy
const LoginAdmin = lazy(() => import("./administrador/LoginAdmin"));
const DashboardAdmin = lazy(() => import("./administrador/DashboardAdmin"));
const ProductosAdmin = lazy(() => import("./administrador/pages/ProductosAdmin"));
const PedidosAdmin = lazy(() => import("./administrador/pages/PedidosAdmin"));
const EnviosAdmin = lazy(() => import("./administrador/pages/EnviosAdmin"));
const ReportesAdmin = lazy(() => import("./administrador/pages/ReportesAdmin"));
const ClientesAdmin = lazy(() => import("./administrador/pages/ClientesAdmin"));
const CategoriasAdmin = lazy(() => import("./administrador/pages/CategoriasAdmin"));
const ModelsConfigAdmin = lazy(() => import("./administrador/pages/ModelsConfigAdmin"));
const ExtrasAdmin = lazy(() => import("./administrador/pages/ExtrasAdmin"));
const DetalleModeloAdmin = lazy(() => import("./administrador/pages/DetalleModeloAdmin"));
const ChatbotAdmin = lazy(() => import("./administrador/pages/ChatbotAdmin"));

// Fallback de carga simple
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-[#24d4da] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const PageWrapper = ({ children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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

const Contacto = lazy(() => import("./pages/Contacto"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

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
      <AnimatePresence>
        <Suspense fallback={<PageLoader />}>
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
                      path="/terminos-y-condiciones"
                      element={
                        <PageWrapper>
                          <TerminosCondiciones />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/politica-de-privacidad"
                      element={
                        <PageWrapper>
                          <PoliticaPrivacidad />
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
                      path="/contacto"
                      element={
                        <PageWrapper>
                          <Contacto />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/blog"
                      element={
                        <PageWrapper>
                          <Blog />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/blog/:slug"
                      element={
                        <PageWrapper>
                          <BlogPost />
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
        </Suspense>
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
      <SettingsProvider>
        <MotionConfig reducedMotion="never">
          <AppContent />
        </MotionConfig>
      </SettingsProvider>
    </HelmetProvider>
  );
}