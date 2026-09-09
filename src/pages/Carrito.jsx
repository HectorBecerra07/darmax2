// src/pages/Carrito.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCarrito } from "../context/CarritoContext";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "../context/UserContext";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getProductos, getCachedProductos } from "../services/productosService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Wishlist = ({ items, loading, onAddToCart, onRemoveFromWishlist }) => {
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Wishlist</h2>
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-12 bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Tu wishlist está vacía</h2>
        <p className="text-sm text-gray-500 mt-2">
          Haz clic en el corazón de tus productos favoritos para guardarlos aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col">
            <Link to={`/producto/${p.id}`}>
              <img src={p.imagen || "https://via.placeholder.com/150"} alt={p.nombre} className="w-full h-40 object-cover rounded-lg mb-4"/>
            </Link>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">{p.nombre}</h3>
              <p className="text-cyan-600 font-bold mt-1">${formatCurrency(p.precio)}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => { onAddToCart(p, 1); onRemoveFromWishlist(p.id); }}
                className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700"
              >
                Mover al carrito
              </button>
              <button
                onClick={() => onRemoveFromWishlist(p.id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    agregarProducto,
  } = useCarrito();

  const { user } = useUser();
  const { favorites, toggleFavorite } = useFavorites();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const cached = getCachedProductos();
    if (cached && favorites.length > 0) {
      return cached.filter(p => favorites.includes(p.id));
    }
    return [];
  });
  const [loadingWishlist, setLoadingWishlist] = useState(() => {
    return favorites.length > 0 && !getCachedProductos();
  });

  useEffect(() => {
    let isMounted = true;
    const fetchWishlistProducts = async () => {
      if (favorites.length === 0) {
        setWishlistItems([]);
        setLoadingWishlist(false);
        return;
      }
      try {
        const allProducts = await getProductos();
        if (isMounted) {
          const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));
          setWishlistItems(favoriteProducts);
        }
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        if (isMounted) {
          setLoadingWishlist(false);
        }
      }
    };

    fetchWishlistProducts();
    return () => {
      isMounted = false;
    };
  }, [favorites]);

  // Total SOLO productos
  const totalProductos = useMemo(
    () =>
      carrito.reduce(
        (acc, p) => acc + Number(p.precio || 0) * (p.cantidad || 0),
        0
      ),
    [carrito]
  );

  // 👉 Estado unificado para la dirección de envío
  const [addressTo, setAddressTo] = useState({
    nombre: "",
    email: "",
    calle: "",
    codigoPostal: "",
    colonia: "",
    ciudad: "",
    estado: "",
    telefono: "",
  });

  // Estado para la API de CP
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [coloniasOptions, setColoniasOptions] = useState([]);

  // 👉 Efecto para autocompletar la dirección si el usuario está logueado
  useEffect(() => {
    if (user) {
      setAddressTo((prev) => ({
        ...prev,
        nombre: user.name || "",
        email: user.email || "",
        calle: user.calle || "",
        codigoPostal: user.codigoPostal || "",
        colonia: user.colonia || "",
        ciudad: user.ciudad || "",
        estado: user.estadoEnvio || "", // Mapea estadoEnvio a estado
        telefono: user.telefono || "",
      }));

      // Si el usuario tiene un código postal, lo buscamos para autocompletar colonias y otros campos
      if (user.codigoPostal && user.codigoPostal.length === 5) {
        buscarPorCP(user.codigoPostal);
      }
    }
  }, [user]); // Nota: buscarPorCP no está en las dependencias porque es una función interna y no cambia entre renders

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

  // 👉 Lógica para buscar por Código Postal
  const buscarPorCP = async (cp) => {
    setCpError("");
    setColoniasOptions([]);
    if (cp.length !== 5) return;

    setCpLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/postalcode/${cp}`); // Llama al proxy del backend
      const data = await res.json();

      if (!res.ok || data.error || !data.codigo_postal) {
        throw new Error(
          data.error ||
            data.message ||
            "No se encontraron datos para este código postal."
        );
      }

      const { codigo_postal } = data;

      let coloniasList = [];
      if (
        Array.isArray(codigo_postal.colonias) &&
        codigo_postal.colonias.length > 0
      ) {
        // Checa si el primer elemento es un string u objeto para manejar ambos formatos de respuesta
        if (typeof codigo_postal.colonias[0] === "string") {
          coloniasList = [...new Set(codigo_postal.colonias)];
        } else if (
          typeof codigo_postal.colonias[0] === "object" &&
          codigo_postal.colonias[0] !== null
        ) {
          coloniasList = [
            ...new Set(
              codigo_postal.colonias.map((c) => c.colonia).filter(Boolean)
            ),
          ];
        }
      }

      setColoniasOptions(coloniasList);

      setAddressTo((prev) => ({
        ...prev,
        estado: codigo_postal.estado,
        ciudad: codigo_postal.municipio,
        colonia: coloniasList.length > 0 ? coloniasList[0] : "",
      }));
    } catch (err) {
      setCpError(err.message);
    } finally {
      setCpLoading(false);
    }
  };

  // 👉 Inputs de dirección
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressTo((prev) => ({ ...prev, [name]: value }));

    if (name === "codigoPostal" && value.length === 5) {
      buscarPorCP(value);
    } else if (name === "codigoPostal") {
      setColoniasOptions([]);
      setCpError("");
    }
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

      // Validaciones mínimas
      if (!addressTo.codigoPostal || addressTo.codigoPostal.length !== 5) {
        setErrorShipping("Ingresa un código postal válido de 5 dígitos.");
        setLoadingShipping(false);
        return;
      }

      if (!addressTo.estado || !addressTo.ciudad || !addressTo.colonia) {
        setErrorShipping(
          "Completa estado, ciudad y colonia para cotizar el envío."
        );
        setLoadingShipping(false);
        return;
      }

      const address_to = {
        country_code: "MX",
        postal_code: addressTo.codigoPostal,
        area_level1: addressTo.estado,
        area_level2: addressTo.ciudad,
        area_level3: addressTo.colonia,
      };

      // 🔹 IMPORTANTE: incluir unidades de medida
      const parcels = [
        {
          length: 10,
          width: 10,
          height: 10,
          distance_unit: "cm", // o "in" si usas pulgadas
          weight: 2,
          mass_unit: "kg", // o "lb" si usas libras
        },
      ];

      const res = await fetch(`${API_URL}/api/shipping/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_to, parcels }),
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
              email: user?.email || addressTo.email, // Usa el email del formulario para invitados
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
    addressTo.email, // Dependencia añadida
  ]);

  const pasoActual = useMemo(() => {
    if (carrito.length === 0) return 0;
    if (clientSecret && paymentIntentId) return 3;
    if (quotationId) return 2;
    return 1;
  }, [carrito.length, clientSecret, paymentIntentId, quotationId]);

  return (
    <section className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6">
      <Helmet>
        <title>Carrito de Compra - Darmax</title>
        <meta name="description" content="Revisa tu carrito de compra y completa tu pedido de forma segura." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Carrito de Compra
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Sigue los pasos para completar tu pedido de forma segura.
          </p>
        </header>

        {/* Carrito vacío */}
        {carrito.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700">
              Tu carrito está vacío
            </h2>
            <p className="text-sm text-gray-500">
              Agrega productos desde el catálogo para continuar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* --- PASO 1: RESUMEN DEL PEDIDO --- */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                    pasoActual >= 1
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {pasoActual > 1 ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    "1"
                  )}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Resumen de tu pedido
                </h2>
              </div>

              <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto pr-2">
                {carrito.map((p) => (
                  <div
                    key={p.id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={p.imagen || "https://via.placeholder.com/80"}
                        alt={p.nombre}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {p.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${formatCurrency(p.precio)} MXN × {p.cantidad}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-800">
                        ${formatCurrency(p.precio * p.cantidad)}
                      </p>
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => disminuirCantidad(p.id)}
                          className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <button
                          onClick={() => incrementarCantidad(p.id)}
                          className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => eliminarProducto(p.id)}
                        className="text-xs text-red-500 hover:underline mt-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 mt-4 border-t-2 border-dashed">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-gray-600">
                    Subtotal:
                  </p>
                  <p className="text-2xl font-bold text-cyan-600">
                    ${formatCurrency(totalProductos)} MXN
                  </p>
                </div>
                <button
                  onClick={vaciarCarrito}
                  className="mt-4 text-xs px-4 py-2 rounded-full border border-red-300 text-red-500 hover:bg-red-50 transition"
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* --- PASO 2: DIRECCIÓN Y ENVÍO --- */}
            <div
              className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-opacity duration-500 ${
                pasoActual >= 1
                  ? "opacity-100"
                  : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                    pasoActual >= 2
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {pasoActual > 2 ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    "2"
                  )}
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Tus Datos
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  name="nombre"
                  placeholder="Nombre de quien recibe"
                  value={addressTo.nombre}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md w-full"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={addressTo.email}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md w-full disabled:bg-gray-100"
                  disabled={!!user}
                />
                <input
                  name="calle"
                  placeholder="Calle y Número"
                  value={addressTo.calle}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md w-full md:col-span-2"
                />
                <div>
                  <input
                    name="codigoPostal"
                    placeholder="Código Postal"
                    value={addressTo.codigoPostal}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full"
                  />
                  {cpLoading && (
                    <p className="text-xs text-gray-500 mt-1">Buscando...</p>
                  )}
                  {cpError && (
                    <p className="text-xs text-red-500 mt-1">{cpError}</p>
                  )}
                </div>
                {coloniasOptions.length > 1 ? (
                  <select
                    name="colonia"
                    value={addressTo.colonia}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full bg-white"
                  >
                    {coloniasOptions.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="colonia"
                    placeholder="Colonia"
                    value={addressTo.colonia}
                    onChange={handleAddressChange}
                    className="border p-2 rounded-md w-full"
                  />
                )}
                <input
                  name="ciudad"
                  placeholder="Ciudad / Municipio"
                  value={addressTo.ciudad}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                />
                <input
                  name="estado"
                  placeholder="Estado"
                  value={addressTo.estado}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md"
                />
                <input
                  name="telefono"
                  placeholder="Teléfono de contacto"
                  value={addressTo.telefono}
                  onChange={handleAddressChange}
                  className="border p-2 rounded-md w-full md:col-span-2"
                />
              </div>

              <button
                onClick={calcularEnvio}
                disabled={loadingShipping}
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-cyan-400"
              >
                {loadingShipping ? "Calculando..." : "Calcular Tipos de Envío"}
              </button>
              {errorShipping && (
                <p className="text-sm text-red-500 mt-2">{errorShipping}</p>
              )}

              {shippingRates.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Elige la paquetería:
                  </h3>
                  {shippingRates.map((r, i) => {
                    const isSelected = selectedRateIndex === i;
                    return (
                      <button
                        key={r.id || i}
                        type="button"
                        onClick={() => handleRateClick(i)}
                        className={`w-full text-left border rounded-xl p-4 flex items-center justify-between gap-3 transition ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-300"
                            : "border-gray-200 bg-white hover:border-cyan-400"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {r.provider || "Paquetería"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {r.service || "Servicio estándar"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Entrega estimada:{" "}
                            <span className="font-medium">
                              {r.days != null ? `${r.days} día(s)` : "N/D"}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            ${formatCurrency(r.total)}
                          </p>
                          <p className="text-xs text-gray-500">MXN</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* --- PASO 3: PAGO --- */}
            <div
              className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-opacity duration-500 ${
                pasoActual >= 2
                  ? "opacity-100"
                  : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                    pasoActual >= 3
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Método de Pago
                </h2>
              </div>

              {loadingPI && <p>Cargando formulario de pago...</p>}
              {errorPI && (
                <p className="text-sm text-red-500">{errorPI}</p>
              )}

              {clientSecret && paymentIntentId ? (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: "stripe" } }}
                >
                  <CheckoutForm
                    shippingAddress={addressTo} // Pasando la dirección unificada
                    amount={amountInCents}
                    cartItems={carrito}
                    paymentIntentId={paymentIntentId}
                    quotationId={quotationId}
                    rateId={selectedRate?.id}
                    shippingTotal={shippingTotal}
                    totalConEnvio={totalConEnvio}
                    // Info extra de la rate seleccionada (para guardar en Envio)
                    rateInfo={
                      selectedRate
                        ? {
                            provider: selectedRate.provider,
                            service: selectedRate.service,
                            days: selectedRate.days,
                          }
                        : null
                    }
                    userId={user?.id || null}
                  />
                </Elements>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
                  <p>
                    Por favor, calcula tu envío para poder continuar con el
                    pago.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
         <Wishlist
          items={wishlistItems}
          loading={loadingWishlist}
          onAddToCart={agregarProducto}
          onRemoveFromWishlist={toggleFavorite}
        />
      </div>
    </section>
  );
};

export default Carrito;
