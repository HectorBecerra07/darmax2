import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useCarrito } from "../context/CarritoContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeCheckoutPage = () => {
  const { carrito, totalEnCentavos } = useCarrito(); 
  // 👆 adapta estos nombres a cómo se llaman en tu contexto

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/payments/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalEnCentavos }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error(err));
  }, [totalEnCentavos]);

  if (!clientSecret) return <p>Cargando pago...</p>;

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <CheckoutForm amount={totalEnCentavos} cartItems={carrito} />
    </Elements>
  );
};

export default StripeCheckoutPage;
