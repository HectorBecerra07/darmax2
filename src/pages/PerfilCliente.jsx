import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useUser } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DocumentTextIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const WHATSAPP_PHONE = "525519655369";

const currency = (n) =>
  Number(n || 0).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  });

const formatDate = (dateStr) => {
  if (!dateStr) return "Fecha no disponible";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isExpired = (createdAt, diasValidez = 7) => {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const expiration = new Date(created.getTime() + diasValidez * 24 * 60 * 60 * 1000);
  return new Date() > expiration;
};

export default function PerfilCliente() {
  const { user, logout, token } = useUser();
  const navigate = useNavigate();

  // Estados de Cotizaciones y Folios de Seguimiento
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loadingCotizaciones, setLoadingCotizaciones] = useState(false);
  const [cuotaCotizaciones, setCuotaCotizaciones] = useState({
    limiteMensual: 3,
    usadasEsteMes: 0,
    restantesEsteMes: 3,
  });

  /*
  // SECCION DE PEDIDOS Y PRODUCTOS COMPRADOS (Comentado temporalmente hasta completar integracion)
  // const [pedidos, setPedidos] = useState([]);
  // const [filtro, setFiltro] = useState("Todos");
  // const syncPedidosUsuario = () => {
  //   if (!user?.email) return;
  //   const pedidosAdmin = JSON.parse(localStorage.getItem("pedidos")) || [];
  //   const delUsuario = pedidosAdmin.filter((p) => p.correo === user.email);
  //   const keyUsuario = `pedidos-${user.email}`;
  //   const pedidosUsuario = JSON.parse(localStorage.getItem(keyUsuario)) || [];
  //   const map = new Map();
  //   [...pedidosUsuario, ...delUsuario].forEach((p) => map.set(p.id, p));
  //   const result = Array.from(map.values()).sort((a, b) => b.id - a.id);
  //   localStorage.setItem(keyUsuario, JSON.stringify(result));
  //   setPedidos(result);
  // };
  */

  // Cargar cotizaciones y folios desde el servidor Darmax
  const fetchCotizaciones = async () => {
    if (!token) return;
    setLoadingCotizaciones(true);
    try {
      const res = await fetch("/api/cotizaciones/mis-cotizaciones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCotizaciones(data.cotizaciones || []);
        setCuotaCotizaciones({
          limiteMensual: data.limiteMensual || 3,
          usadasEsteMes: data.usadasEsteMes || 0,
          restantesEsteMes: data.restantesEsteMes ?? 3,
        });
      } else {
        console.warn("No se pudieron cargar las cotizaciones:", res.status);
      }
    } catch (err) {
      console.error("Error al cargar cotizaciones:", err);
    } finally {
      setLoadingCotizaciones(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCotizaciones();
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Contactar asesor para seguimiento con el numero de cotizacion
  const handleWhatsAppFollowUp = (cotizacion) => {
    const folioText = cotizacion.folio ? `#${cotizacion.folio}` : "";
    const mensaje = [
      "¡Hola DARMAX!",
      `Quisiera dar seguimiento a mi cotización ${folioText} (${cotizacion.modeloNombre}) por un total de $${Number(
        cotizacion.total || 0
      ).toLocaleString("es-MX")} MXN que generé en el sitio web.`,
      "¿Me podrían brindar información sobre los siguientes pasos?",
    ].join("\n\n");

    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Debes iniciar sesión</h2>
        <p className="text-slate-500 mt-2">Para consultar tus folios de seguimiento y cotizaciones.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-sm font-bold"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 space-y-8">
      <Helmet>
        <title>Mis Cotizaciones - Darmax</title>
        <meta
          name="description"
          content="Consulta tus cotizaciones, números de seguimiento y vigencia en Darmax."
        />
      </Helmet>

      {/* Header del Perfil de Cliente */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#24d4da] to-[#168387] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/20">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ¡Hola, {user.name || "Cliente"}!
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[#168387] text-[11px] font-black uppercase tracking-wider">
                Portal Clientes
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <span>{user.email}</span>
              {user.telefono && (
                <>
                  <span>•</span>
                  <span>{user.telefono}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              fetchCotizaciones();
              toast.success("Cotizaciones actualizadas.");
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
            title="Actualizar cotizaciones"
          >
            <ArrowPathIcon className="w-4 h-4 text-slate-500" />
            <span>Actualizar</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition text-xs font-bold"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL: CONSULTA DE FOLIOS Y COTIZACIONES */}
      <div className="space-y-6">
        
        {/* Banner de Cuota Mensual y Límite de 3 Cotizaciones */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-50/80 via-teal-50/50 to-white border border-cyan-200/90 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#168387] block">
                Números de Cotización
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cuota Mensual: {cuotaCotizaciones.usadasEsteMes} de {cuotaCotizaciones.limiteMensual} cotizaciones realizadas
              </h3>
            </div>

            {/* Píldoras de cuota 1, 2 y 3 */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((num) => {
                const usada = num <= cuotaCotizaciones.usadasEsteMes;
                return (
                  <div
                    key={num}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      usada
                        ? "bg-[#168387] text-white shadow-sm"
                        : "bg-white border border-slate-200 text-slate-400"
                    }`}
                  >
                    <span>Cotización {num}</span>
                    {usada && <span>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-3xl">
            Cada cliente puede generar hasta <strong>3 cotizaciones por mes</strong> desde el configurador web. Esto nos permite garantizar la vigencia de los precios de equipos y componentes, así como asegurar el seguimiento técnico directo de nuestros asesores por WhatsApp o llamada.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-cyan-100">
            <span className="text-xs font-bold text-slate-700">
              {cuotaCotizaciones.restantesEsteMes > 0 ? (
                <span className="text-[#168387]">
                  Te quedan {cuotaCotizaciones.restantesEsteMes} cotización(es) disponible(s) este mes.
                </span>
              ) : (
                <span className="text-amber-700 font-bold">
                  Has utilizado tus 3 cotizaciones de este mes. Si requieres asesoría adicional, contáctanos por WhatsApp.
                </span>
              )}
            </span>

            <Link
              to="/inicia-tu-negocio"
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                cuotaCotizaciones.restantesEsteMes > 0
                  ? "bg-[#168387] text-white hover:bg-[#11696c] shadow-md shadow-cyan-600/20"
                  : "bg-slate-200 text-slate-500 pointer-events-none"
              }`}
            >
              <SparklesIcon className="w-4 h-4" />
              <span>Cotizar Otro Equipo</span>
            </Link>
          </div>
        </div>

        {/* Listado de Folios del Cliente */}
        {loadingCotizaciones ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 space-y-3">
            <div className="w-8 h-8 border-3 border-[#168387] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">Cargando tus folios de seguimiento...</p>
          </div>
        ) : cotizaciones.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-[#168387] flex items-center justify-center mx-auto">
              <DocumentTextIcon className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-lg font-black text-slate-900">Aún no tienes cotizaciones registradas</h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Al cotizar una planta purificadora o máquina vending en nuestro configurador, se generará tu número de cotización para que puedas guardarlo y darle seguimiento aquí.
              </p>
            </div>
            <Link
              to="/inicia-tu-negocio"
              className="inline-flex px-6 py-3 bg-[#168387] text-white font-black rounded-xl text-xs uppercase tracking-wider hover:bg-[#11696c] transition-all shadow-md shadow-cyan-600/20"
            >
              Ir al Configurador de Equipos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
              <h3 className="text-lg font-black text-slate-900">
                Tus Cotizaciones ({cotizaciones.length})
              </h3>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/80">
                Guarda tu número de cotización para darle seguimiento
              </span>
            </div>

            {cotizaciones.map((cot) => {
              const vencida = isExpired(cot.createdAt, cot.diasValidez || 7);
              const extras = Array.isArray(cot.extras) ? cot.extras : [];

              return (
                <div
                  key={cot.id || cot.folio}
                  className="p-6 sm:p-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-5"
                >
                  {/* Encabezado de la Tarjeta con Número de Cotización */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200/80 text-[#168387] font-black text-base tracking-tight flex items-center gap-2 shadow-sm">
                        <span className="text-xs uppercase tracking-widest text-slate-400">COTIZACIÓN</span>
                        <span className="text-lg text-slate-950 font-black">#{cot.folio}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {formatDate(cot.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {vencida ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                          <ExclamationCircleIcon className="w-3.5 h-3.5" />
                          Vigencia concluida
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                          <CheckBadgeIcon className="w-3.5 h-3.5" />
                          Cotización Activa ({cot.diasValidez || 7} días)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Detalle del Modelo y Precios */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="md:col-span-2 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                        Modelo Configurado
                      </span>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">
                        {cot.modeloNombre}
                      </h4>

                      {/* Extras Seleccionados */}
                      {extras.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                            Extras seleccionados ({extras.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {extras.map((extra, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                              >
                                {extra.name || extra.extra?.name || "Componente extra"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 text-xs text-slate-500 space-y-0.5">
                        <p>
                          <strong>Cliente:</strong> {cot.nombreCliente} (CP {cot.cp})
                        </p>
                        <p>
                          <strong>Contacto:</strong> {cot.telefono} • {cot.correo}
                        </p>
                      </div>
                    </div>

                    {/* Inversión Total Estimada */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-left md:text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                        Inversión Estimada
                      </span>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {currency(cot.total)}
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        *No incluye flete ni viáticos de instalación
                      </span>
                    </div>
                  </div>

                  {/* Botones de Accion: Seguimiento por WhatsApp con Folio (Boton PDF comentado temporalmente) */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
                    {/*
                    {cot.publicUrl && (
                      <a
                        href={cot.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <DocumentTextIcon className="w-4 h-4 text-slate-500" />
                        <span>Ver Cotización Digital</span>
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    )}
                    */}

                    <button
                      onClick={() => handleWhatsAppFollowUp(cot)}
                      className="px-6 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-black uppercase tracking-wider hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-sm shadow-green-600/20"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      <span>Dar Seguimiento por WhatsApp (Cotización #{cot.folio})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/*
      // =========================================================
      // SECCION DE PEDIDOS Y PRODUCTOS (Comentado temporalmente)
      // =========================================================
      // <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      //   ...
      // </div>
      */}
    </div>
  );
}
