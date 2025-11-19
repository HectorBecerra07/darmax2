// server/routes/payments.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Crear PaymentIntent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email } = req.body; // email puede venir del usuario logueado (si hay)

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Monto inválido" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: "mxn",
      // si hay email desde el carrito, lo usamos; si no, se pondrá luego desde CheckoutForm
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, // 👈 importante para poder actualizarlo luego
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar PaymentIntent con email (para invitados / correo del formulario)
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
