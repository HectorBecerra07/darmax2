// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const COPOMEX_TOKEN = import.meta.env.VITE_COPOMEX_TOKEN;

// 🔹 Recibe centavos y devuelve string formateado con miles y 2 decimales
const currencyFixed = (cents) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(cents || 0) / 100);

const CheckoutForm = ({ amount, cartItems = [], paymentIntentId }) => {
  const { vaciarCarrito } = useCarrito();
  const { user } = useUser();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    correo: user?.email || "",
    telefono: "",
    direccion: "",
    colonia: "",
    ciudad: "",
    estadoDireccion: "",
    codigoPostal: "",
  });

  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [coloniasOptions, setColoniasOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // 🔎 Buscar colonia/ciudad/estado por CP usando Copomex (formato correcto)
  const buscarPorCP = async (cp) => {
    setCpError("");
    setColoniasOptions([]);

    if (!COPOMEX_TOKEN) {
      console.warn("VITE_COPOMEX_TOKEN no está definido");
      return;
    }

    // Solo buscamos cuando tiene 5 dígitos
    if (cp.length !== 5) return;

    try {
      setCpLoading(true);

      const url = `https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=${COPOMEX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("Respuesta COPOMEX:", data);

      // Si hay error desde la API
      if (!res.ok || data.error || !data.response) {
        setCpError(
          data.error || "No encontramos datos para ese código postal."
        );
        return;
      }

      const info = data.response; // 👈 es un objeto, no un array

      // Colonias: pueden venir como array o string
      let colonias = [];
      if (Array.isArray(info.asentamiento)) {
        colonias = info.asentamiento;
      } else if (info.asentamiento) {
        colonias = [info.asentamiento];
      }

      setColoniasOptions(colonias);

      setFormData((prev) => ({
        ...prev,
        colonia: colonias[0] || prev.colonia,
        ciudad: info.ciudad || info.municipio || prev.ciudad,
        estadoDireccion: info.estado || prev.estadoDireccion,
      }));

      setCpError("");
    } catch (err) {
      console.error("Error buscando CP:", err);
      setCpError("Ocurrió un error al buscar el código postal.");
    } finally {
      setCpLoading(false);
    }
  };

  const guardarPedidoLocal = (paymentId) => {
    let numeroOrden = Number(localStorage.getItem("numeroOrden")) || 1;

    const emailDestino = user?.email || formData.correo;

    const nuevoPedido = {
      id: Date.now(),
      orden: numeroOrden,
      paymentId: paymentId, // 👈 AÑADIDO
      cliente: formData.nombre || user?.name || "",
      correo: emailDestino,
      telefono: formData.telefono,
      direccion: formData.direccion,
      colonia: formData.colonia,
      ciudad: formData.ciudad,
      estadoDireccion: formData.estadoDireccion,
      codigoPostal: formData.codigoPostal,
      productos: cartItems.map((p) => p.nombre),
      total: currencyFixed(amount),
      estadoPedido: "Pendiente",
      creadoEn: new Date().toISOString(),
    };

    const pedidosAdmin = JSON.parse(localStorage.getItem("pedidos")) || [];
    localStorage.setItem(
      "pedidos",
      JSON.stringify([nuevoPedido, ...pedidosAdmin])
    );

    const keyUsuario = `pedidos-${emailDestino}`;
    const pedidosUsuario = JSON.parse(localStorage.getItem(keyUsuario)) || [];
    localStorage.setItem(
      keyUsuario,
      JSON.stringify([nuevoPedido, ...pedidosUsuario])
    );

    localStorage.setItem("numeroOrden", String(numeroOrden + 1));

    // Guardamos también el último pedido para poder mostrarlo en /gracias-compra si recarga
    localStorage.setItem("ultimoPedido", JSON.stringify(nuevoPedido));

    return nuevoPedido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe no está listo todavía. Intenta de nuevo en unos segundos.");
      return;
    }

    setLoading(true);

    // 1) Actualizar PaymentIntent con email (logueado o invitado)
    try {
      const emailToUse = user?.email || formData.correo;

      if (paymentIntentId && emailToUse) {
        await fetch(`${API_URL}/api/payments/update-payment-intent-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            email: emailToUse,
          }),
        });
      }
    } catch (err) {
      console.error("Error actualizando email del PaymentIntent:", err);
    }

    // 2) Confirmar pago con Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      console.error(error);
      alert(error.message || "Error al procesar el pago");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      // 3) Guardar pedido local, pasando el ID de pago
      const nuevoPedido = guardarPedidoLocal(paymentIntent.id);
      const emailDestino = user?.email || formData.correo;

      // 4) Enviar correo de pedido (Nodemailer + Gmail)
      try {
        if (emailDestino) {
          await fetch(`${API_URL}/api/orders/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order: nuevoPedido,
              emailCliente: emailDestino,
            }),
          });
        }
      } catch (err) {
        console.error("Error enviando correo de pedido:", err);
      }

      // 5) Limpiar carrito y redirigir a página de confirmación
      vaciarCarrito();
      navigate("/gracias-compra", { state: { order: nuevoPedido } });
    } else {
      alert("No se pudo completar el pago.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-6xl 
        bg-white/90 
        rounded-2xl 
        shadow-xl 
        border border-gray-100 
        p-6 sm:p-8 
        flex flex-col gap-8
      "
    >
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
            Paso 2 de 2
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
            Finaliza tu compra
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ingresa tus datos y método de pago para completar el pedido.
          </p>
        </div>
        <div className="mt-2 sm:mt-0 text-right">
          <p className="text-xs text-gray-400">Total a pagar</p>
          <p className="text-2xl font-extrabold text-lime-500">
            ${currencyFixed(amount)} MXN
          </p>
        </div>
      </div>

      {/* Contenido principal: responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 lg:gap-8">
        {/* Columna izquierda: Datos de envío */}
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center text-sm font-bold">
              1
            </span>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Datos de envío
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                placeholder="nombre@correo.com"
                value={formData.correo}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition disabled:bg-gray-100"
                required={!user}
                disabled={!!user}
              />
              {user && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Usaremos el correo de tu cuenta para confirmarte el pedido.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                placeholder="Ej. 55 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                name="codigoPostal"
                placeholder="Ej. 15610"
                value={formData.codigoPostal}
                onChange={(e) => {
                  handleChange(e);
                  const cp = e.target.value.trim();
                  if (cp.length === 5) {
                    buscarPorCP(cp);
                  } else {
                    setCpError("");
                    setColoniasOptions([]);
                  }
                }}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
              {cpLoading && (
                <p className="mt-1 text-[11px] text-gray-400">
                  Buscando dirección por código postal...
                </p>
              )}
              {cpError && (
                <p className="mt-1 text-[11px] text-red-500">{cpError}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle, número exterior e interior"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Colonia
              </label>

              {coloniasOptions.length > 0 ? (
                <select
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition bg-white"
                  required
                >
                  {coloniasOptions.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="colonia"
                  placeholder="Colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Estado
              </label>
              <input
                type="text"
                name="estadoDireccion"
                placeholder="Estado"
                value={formData.estadoDireccion}
                onChange={handleChange}
                className="w-full border border-gray-200 focus:border-lime-400 focus:ring-1 focus:ring-lime-300 rounded-lg px-3 py-2.5 text-sm outline-none transition"
                required
              />
            </div>
          </div>
        </div>

        {/* Columna derecha: Resumen + pago */}
        <div className="space-y-5 lg:space-y-6">
          {/* Resumen de compra */}
          <div className="border border-gray-100 rounded-2xl shadow-sm bg-gradient-to-b from-gray-50/70 to-white p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-bold">
                2
              </span>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Resumen de tu pedido
              </h3>
            </div>

            <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No tienes productos en tu carrito.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-3 border-b border-dashed border-gray-200 pb-2 last:border-none"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.nombre}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        Cantidad: {item.cantidad}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {currencyFixed(item.precio * 100 * item.cantidad)} MXN
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${currencyFixed(amount)} MXN</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>Incluido</span>
              </div>
              <div className="flex justify-between items-center text-base sm:text-lg font-bold text-gray-800 mt-1">
                <span>Total a pagar</span>
                <span className="text-lime-500">
                  ${currencyFixed(amount)} MXN
                </span>
              </div>
            </div>
          </div>

          {/* Elemento de pago de Stripe */}
          <div className="border border-gray-100 rounded-2xl shadow-sm bg-white p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Método de pago
            </h3>
            <div className="mb-4">
              <PaymentElement />
            </div>
            <button
              type="submit"
              disabled={loading || !stripe || !elements}
              className="
                w-full 
                mt-2 
                inline-flex items-center justify-center 
                bg-lime-400 hover:bg-lime-500 
                text-gray-900 
                py-3 
                rounded-xl 
                font-bold 
                text-sm sm:text-base
                shadow-md hover:shadow-lg
                transition 
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? "Procesando pago..." : "Pagar y confirmar pedido"}
            </button>
            <p className="mt-2 text-[11px] text-gray-400 text-center">
              Tu pago es procesado de forma segura con Stripe. No almacenamos
              los datos de tu tarjeta.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
