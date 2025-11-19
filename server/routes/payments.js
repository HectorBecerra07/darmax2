// server/routes/payments.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

// ⚠️ Cargar el .env correcto (el que está dentro de /server)
dotenv.config({ path: "./server/.env" });

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error(
    "❌ STRIPE_SECRET_KEY no está definido. Revisa server/.env o el path en dotenv.config()."
  );
  // Opcional: salir del proceso para que sea obvio el problema
  throw new Error("Falta STRIPE_SECRET_KEY en las variables de entorno");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

// Crear PaymentIntent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email, quotationId, rateId, shippingTotal } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // centavos
      currency: "mxn",
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
      metadata: {
        quotationId: quotationId || "",
        rateId: rateId || "",
        shippingTotal: shippingTotal != null ? String(shippingTotal) : "",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar PaymentIntent con email
router.post("/update-payment-intent-email", async (req, res) => {
  try {
    const { paymentIntentId, email } = req.body;

    if (!paymentIntentId || !email) {
      return res
        .status(400)
        .json({ error: "Faltan paymentIntentId o email" });
    }

    const updated = await stripe.paymentIntents.update(paymentIntentId, {
      receipt_email: email,
    });

    res.json({ success: true, status: updated.status });
  } catch (error) {
    console.log("Error actualizando email del PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
