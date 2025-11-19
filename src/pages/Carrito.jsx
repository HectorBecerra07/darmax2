// src/pages/Carrito.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// 🔹 Helper para formatear precios
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

  // Total SOLO productos
  const totalProductos = useMemo(
    () =>
      carrito.reduce(
        (acc, p) => acc + Number(p.precio || 0) * (p.cantidad || 0),
        0
      ),
    [carrito]
  );

  // 👉 Dirección destino (Skydropx)
  const [addressTo, setAddressTo] = useState({
    postal_code: "",
    estado: "",
    ciudad: "",
    colonia: "",
  });

  const [shippingRates, setShippingRates] = useState([]);
  const [quotationId, setQuotationId] = useState(null);
  const [selectedRateIndex, setSelectedRateIndex] = useState(null);
  const [shippingTotal, setShippingTotal] = useState(0);

  const [loadingShipping, setLoadingShipping] = useState(false);
  const [errorShipping, setErrorShipping] = useState(null);

  const selectedRate = useMemo(() => {
    if (selectedRateIndex == null) return null;
    return shippingRates[selectedRateIndex] || null;
  }, [shippingRates, selectedRateIndex]);

  // Total con envío
  const totalConEnvio = useMemo(
    () => totalProductos + (shippingTotal || 0),
    [totalProductos, shippingTotal]
  );

  // Total en centavos para Stripe
  const amountInCents = useMemo(
    () => Math.round(totalConEnvio * 100),
    [totalConEnvio]
  );

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [loadingPI, setLoadingPI] = useState(false);
  const [errorPI, setErrorPI] = useState(null);

  // 👉 Inputs de dirección
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressTo((prev) => ({ ...prev, [name]: value }));
  };

  // 👉 Seleccionar paquetería (card)
  const handleRateClick = (idx) => {
    setSelectedRateIndex(idx);
    const rate = shippingRates[idx];
    setShippingTotal(rate ? rate.total : 0);

    // Reiniciamos Stripe si cambia el envío
    setClientSecret(null);
    setPaymentIntentId(null);
  };

  // 👉 Cotizar envío
  const calcularEnvio = async () => {
    try {
      setLoadingShipping(true);
      setErrorShipping(null);

      const address_from = {
        country_code: "MX",
        postal_code: "64000",
        area_level1: "Nuevo León",
        area_level2: "Monterrey",
        area_level3: "Centro",
      };

      const address_to = {
        country_code: "MX",
        postal_code: addressTo.postal_code,
        area_level1: addressTo.estado,
        area_level2: addressTo.ciudad,
        area_level3: addressTo.colonia,
      };

      const parcels = [
        {
          length: 10,
          width: 10,
          height: 10,
          weight: 2,
        },
      ];

      const res = await fetch(`${API_URL}/api/shipping/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_from, address_to, parcels }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cotizar");

      setQuotationId(data.quotationId || null);
      setShippingRates(data.rates || []);

      if (data.rates?.length > 0) {
        setSelectedRateIndex(0);
        setShippingTotal(data.rates[0].total || 0);
      } else {
        setSelectedRateIndex(null);
        setShippingTotal(0);
      }

      setClientSecret(null);
      setPaymentIntentId(null);
    } catch (err) {
      setErrorShipping(err.message);
      setQuotationId(null);
      setShippingRates([]);
      setShippingTotal(0);
    } finally {
      setLoadingShipping(false);
    }
  };

  // 👉 Crear PaymentIntent (Stripe)
  useEffect(() => {
    if (
      carrito.length === 0 ||
      !quotationId ||
      !selectedRate ||
      !amountInCents ||
      amountInCents <= 0
    ) {
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
              email: user?.email || null,
              quotationId,
              rateId: selectedRate.id,
              shippingTotal,
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        setErrorPI(err.message);
      } finally {
        setLoadingPI(false);
      }
    };

    crearPaymentIntent();
  }, [
    amountInCents,
    carrito.length,
    quotationId,
    selectedRate,
    shippingTotal,
    user?.email,
  ]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">
              Carrito de compra
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Tu Carrito
            </h1>

            {carrito.length > 0 && (
              <p className="text-sm text-gray-500">
                Revisa productos, calcula el envío y paga.
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">Productos</p>
            <p className="text-2xl font-extrabold text-cyan-600">
              ${formatCurrency(totalProductos)} MXN
            </p>
            <p className="text-xs text-gray-500">
              Total con envío:{" "}
              <span className="font-semibold">
                ${formatCurrency(totalConEnvio)} MXN
              </span>
            </p>

            {carrito.length > 0 && (
              <button
                onClick={vaciarCarrito}
                className="mt-2 text-xs px-4 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition"
              >
                Vaciar carrito
              </button>
            )}
          </div>
        </header>

        {/* Carrito vacío */}
        {carrito.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-8 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              Tu carrito está vacío
            </h2>
            <p className="text-sm text-gray-500">
              Agrega productos desde el catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT - Productos */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Productos en tu carrito
              </h2>

              <div className="divide-y max-h-[340px] overflow-y-auto">
                {carrito.map((p) => (
                  <div key={p.id} className="py-4 flex justify-between">
                    <div>
                      <p className="font-medium">{p.nombre}</p>
                      <p className="text-sm text-gray-500">
                        ${formatCurrency(p.precio)} MXN × {p.cantidad}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">
                        ${formatCurrency(p.precio * p.cantidad)}
                      </p>

                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => disminuirCantidad(p.id)}
                          className="px-3 py-1 border rounded"
                        >
                          -
                        </button>
                        <button
                          onClick={() => incrementarCantidad(p.id)}
                          className="px-3 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarProducto(p.id)}
                        className="text-xs text-red-500 mt-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT - Envío + Pago */}
            <div className="flex flex-col gap-4">
              {/* ENVÍO */}
              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Datos de envío</h2>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="postal_code"
                    placeholder="CP"
                    value={addressTo.postal_code}
                    onChange={handleAddressChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="estado"
                    placeholder="Estado"
                    value={addressTo.estado}
                    onChange={handleAddressChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="ciudad"
                    placeholder="Ciudad"
                    value={addressTo.ciudad}
                    onChange={handleAddressChange}
                    className="border p-2 rounded"
                  />
                  <input
                    name="colonia"
                    placeholder="Colonia"
                    value={addressTo.colonia}
                    onChange={handleAddressChange}
                    className="border p-2 rounded"
                  />
                </div>

                <button
                  onClick={calcularEnvio}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-full"
                >
                  {loadingShipping ? "Calculando..." : "Calcular envío"}
                </button>

                {errorShipping && (
                  <p className="text-sm text-red-500">{errorShipping}</p>
                )}

                {shippingRates.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Elige la paquetería para tu envío:
                    </p>

                    {shippingRates.map((r, i) => {
                      const isSelected = selectedRateIndex === i;
                      return (
                        <button
                          key={r.id || i}
                          type="button"
                          onClick={() => handleRateClick(i)}
                          className={`w-full text-left border rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition
                            ${
                              isSelected
                                ? "border-cyan-500 bg-cyan-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-cyan-400 hover:bg-gray-50"
                            }`}
                        >
                          {/* Izquierda: info del servicio */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-800">
                                {r.provider || "Paquetería"}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold uppercase bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
                                  Seleccionado
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-gray-500">
                              {r.service || "Servicio estándar"}
                            </p>

                            <p className="text-xs text-gray-500">
                              Entrega estimada:{" "}
                              <span className="font-medium text-gray-700">
                                {r.days != null
                                  ? `${r.days} día${
                                      r.days === 1 ? "" : "s"
                                    }`
                                  : "N/D"}
                              </span>
                            </p>
                          </div>

                          {/* Derecha: precio */}
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">
                              ${formatCurrency(r.total)} MXN
                            </p>
                            <p className="text-[11px] text-gray-400">Envío</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="font-bold">
                  Envío: ${formatCurrency(shippingTotal)} MXN
                </p>
              </div>

              {/* STRIPE PAYMENT */}
              {clientSecret && paymentIntentId ? (
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
                    quotationId={quotationId}
                    rateId={selectedRate?.id}
                    shippingTotal={shippingTotal}
                    totalConEnvio={totalConEnvio}
                  />
                </Elements>
              ) : (
                <div className="bg-yellow-100 p-4 rounded-xl text-sm">
                  Calcula tu envío para continuar con el pago.
                </div>
              )}

              {errorPI && (
                <p className="text-sm text-red-500">{errorPI}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Carrito;
