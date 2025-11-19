// src/components/CheckoutForm.jsx
import React, { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// 🔹 Recibe centavos y devuelve string formateado con miles y 2 decimales
const currencyFixed = (cents) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(cents || 0) / 100);

const CheckoutForm = ({
  shippingAddress, // Dirección unificada desde Carrito.jsx
  amount,
  cartItems = [],
  paymentIntentId,
  quotationId,
  rateId,
  shippingTotal,
  totalConEnvio,
}) => {
  const { vaciarCarrito } = useCarrito();
  const { user } = useUser();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const guardarPedidoLocal = (paymentId) => {
    let numeroOrden = Number(localStorage.getItem("numeroOrden")) || 1;

    const emailDestino = user?.email || shippingAddress.email;

    const nuevoPedido = {
      id: Date.now(),
      orden: numeroOrden,
      paymentId: paymentId,
      cliente: shippingAddress.nombre || user?.name || "",
      correo: emailDestino,
      telefono: shippingAddress.telefono,
      direccion: shippingAddress.calle,
      colonia: shippingAddress.colonia,
      ciudad: shippingAddress.ciudad,
      estadoDireccion: shippingAddress.estado,
      codigoPostal: shippingAddress.codigoPostal,
      productos: cartItems.map((p) => p.nombre),
      envio: shippingTotal,
      total: totalConEnvio,
      estadoPedido: "Pendiente",
      creadoEn: new Date().toISOString(),
      quotationId: quotationId || null,
      rateId: rateId || null,
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
    localStorage.setItem("ultimoPedido", JSON.stringify(nuevoPedido));

    return nuevoPedido;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe no está listo todavía. Intenta de nuevo en unos segundos.");
      return;
    }
     if (!shippingAddress.nombre || !shippingAddress.email || !shippingAddress.calle || !shippingAddress.codigoPostal) {
      alert("Por favor, completa todos los campos de dirección en el Paso 2 antes de pagar.");
      return;
    }


    setLoading(true);

    const emailToUse = user?.email || shippingAddress.email;

    // 1) Actualizar PaymentIntent con email si es de invitado
    if (paymentIntentId && !user && emailToUse) {
      try {
        await fetch(`${API_URL}/api/payments/update-payment-intent-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            email: emailToUse,
          }),
        });
      } catch (err) {
        console.error("Error actualizando email del PaymentIntent:", err);
      }
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

      // 4) Enviar correo de pedido
      try {
        if (emailToUse) {
          await fetch(`${API_URL}/api/orders/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order: nuevoPedido,
              emailCliente: emailToUse,
            }),
          });
        }
      } catch (err) {
        console.error("Error enviando correo de pedido:", err);
      }

      // 5) Limpiar carrito y redirigir
      vaciarCarrito();
      navigate("/gracias-compra", { state: { order: nuevoPedido } });
    } else {
      alert("No se pudo completar el pago.");
    }

    setLoading(false);
  };

  // 👉 Cálculos para mostrar resumen
  const envioEnCentavos = Math.round((shippingTotal || 0) * 100);
  const subtotalCents = amount - envioEnCentavos;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        {/* Resumen de compra */}
        <div className="border border-gray-100 rounded-2xl bg-white p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Resumen de tu pedido
            </h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-sm">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No tienes productos en tu carrito.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.nombre}</p>
                      <p className="text-xs text-gray-500">
                        Cant: {item.cantidad}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-700 whitespace-nowrap">
                      ${currencyFixed(item.precio * 100 * item.cantidad)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${currencyFixed(subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>${shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-bold text-gray-800 mt-1">
                <span>Total</span>
                <span>${totalConEnvio.toFixed(2)} MXN</span>
              </div>
            </div>
        </div>


        {/* Elemento de pago de Stripe */}
        <div className="bg-white p-4 sm:p-5">
            <div className="mb-4">
              <PaymentElement />
            </div>
            <button
              type="submit"
              disabled={loading || !stripe || !elements}
              className="w-full mt-2 inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando pago..." : `Pagar $${totalConEnvio.toFixed(2)}`}
            </button>
            <p className="mt-2 text-[11px] text-gray-500 text-center">
              Tu pago es procesado de forma segura con Stripe.
            </p>
        </div>
    </form>
  );
};

export default CheckoutForm;
