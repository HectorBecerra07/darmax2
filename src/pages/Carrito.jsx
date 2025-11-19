// src/pages/Carrito.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../context/UserContext";

// URL base de la API (puedes configurar VITE_API_URL en tu .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Usa la pública desde .env: VITE_STRIPE_PUBLIC_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// 🔹 Helper para formatear precios: 1000 -> 1,000.00
const formatCurrency = (value) =>
  new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const Carrito = () => {
  const {
    carrito,
    incrementarCantidad,
    disminuirCantidad,
    eliminarProducto,
    vaciarCarrito,
  } = useCarrito();

  const { user } = useUser();

  // Total en pesos
  const total = useMemo(
    () =>
      carrito.reduce(
        (acc, p) => acc + Number(p.precio || 0) * (p.cantidad || 0),
        0
      ),
    [carrito]
  );

  // Total en centavos (lo que espera Stripe)
  const amountInCents = useMemo(() => Math.round(total * 100), [total]);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [loadingPI, setLoadingPI] = useState(false);
  const [errorPI, setErrorPI] = useState(null);

  // Crear PaymentIntent en el backend cuando haya productos y total > 0
  useEffect(() => {
    if (!amountInCents || amountInCents <= 0 || carrito.length === 0) {
      setClientSecret(null);
      setPaymentIntentId(null);
      return;
    }

    const crearPaymentIntent = async () => {
      try {
        setLoadingPI(true);
        setErrorPI(null);

        const res = await fetch(
          `${API_URL}/api/payments/create-payment-intent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: amountInCents,
              email: user?.email || null, // si está logueado, ya se manda aquí
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Error al crear PaymentIntent");
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId); // 👈 guardamos el id
      } catch (err) {
        console.error("Error creando PaymentIntent:", err);
        setErrorPI(err.message || "Error al preparar el pago");
      } finally {
        setLoadingPI(false);
      }
    };

    crearPaymentIntent();
  }, [amountInCents, carrito.length, user?.email]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Encabezado */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">
              Carrito de compra
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-3 mt-1">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-cyan-100 text-cyan-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h12l-2-9M9 21h6"
                  />
                </svg>
              </span>
              Tu Carrito
            </h1>
            {carrito.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Revisa tus productos, ajusta cantidades y completa tu pago.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total actual</p>
              <p className="text-2xl font-extrabold text-cyan-600">
                ${formatCurrency(total)} MXN
              </p>
            </div>

            {carrito.length > 0 && (
              <button
                onClick={vaciarCarrito}
                className="text-xs sm:text-sm px-4 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition font-medium"
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </header>

        {/* Estado vacío */}
        {carrito.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white/80 border border-dashed border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h12l-2-9M9 21h6"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tu carrito está vacío
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Agrega productos desde la sección de catálogo para comenzar tu
              pedido.
            </p>
          </div>
        ) : (
          <>
            {/* Grid principal: carrito + checkout */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] gap-6 lg:gap-8">
              {/* Columna izquierda: listado del carrito */}
              <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                    Productos en tu carrito
                  </h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {carrito.length} ítem
                    {carrito.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto pr-1">
                  {carrito.map((p) => {
                    const unitPrice = Number(p.precio || 0);
                    const lineTotal = unitPrice * (p.cantidad || 0);

                    return (
                      <div
                        key={p.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
                      >
                        {/* Info del producto */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm sm:text-base">
                            {p.nombre}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            Precio unitario: ${formatCurrency(unitPrice)} MXN
                          </p>
                        </div>

                        {/* Controles y total */}
                        <div className="flex flex-col items-end gap-2 sm:min-w-[210px]">
                          {/* Controles +/- */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => disminuirCantidad(p.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 text-lg leading-none"
                            >
                              −
                            </button>
                            <span className="min-w-[2.5rem] text-center font-medium text-gray-800 text-sm">
                              {p.cantidad}
                            </span>
                            <button
                              onClick={() => incrementarCantidad(p.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full border border-cyan-300 hover:bg-cyan-50 text-cyan-600 text-lg leading-none"
                            >
                              +
                            </button>
                          </div>

                          {/* Total por producto */}
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              ${formatCurrency(lineTotal)} MXN
                            </p>
                            <button
                              onClick={() => eliminarProducto(p.id)}
                              className="text-[11px] text-red-500 hover:underline mt-1"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total general resumido (extra) */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Total de productos ({carrito.length})
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    ${formatCurrency(total)} MXN
                  </p>
                </div>
              </div>

              {/* Columna derecha: Checkout */}
              <div className="flex flex-col gap-4">
                {/* Mensajes de estado del PaymentIntent */}
                {errorPI && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    {errorPI}
                  </div>
                )}

                {loadingPI && (
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3">
                    Preparando pago con Stripe...
                  </div>
                )}

                {clientSecret && paymentIntentId && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: { theme: "stripe" },
                    }}
                  >
                    <CheckoutForm
                      amount={amountInCents}
                      cartItems={carrito}
                      paymentIntentId={paymentIntentId}
                    />
                  </Elements>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Carrito;
