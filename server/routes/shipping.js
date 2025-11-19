// server/routes/shipping.js
import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const router = express.Router();

const SKYDROPX_API_KEY = process.env.SKYDROPX_API_KEY;

if (!SKYDROPX_API_KEY) {
  console.error("❌ Falta SKYDROPX_API_KEY en server/.env");
  // no hacemos throw para no tumbar todo, pero las peticiones fallarán con 500
}

// GET de prueba para ver si el router está montado
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "shipping router OK" });
});

// POST /api/shipping/cotizar
router.post("/cotizar", async (req, res) => {
  try {
    console.log("ENTERING /cotizar handler"); // 👈 DIAGNOSTIC LOG
    const { address_from, address_to, parcels } = req.body;

    if (!address_from || !address_to || !parcels) {
      return res.status(400).json({
        error:
          "Faltan datos: address_from, address_to o parcels no fueron enviados",
      });
    }

    if (!SKYDROPX_API_KEY) {
      return res.status(500).json({
        error:
          "SKYDROPX_API_KEY no está configurada en el servidor (server/.env)",
      });
    }

    const requestBody = {
      quotation: {
        address_from,
        address_to,
        parcels,
      },
    };

    console.log(
      "📦 Enviando cotización a Skydropx con:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch("https://pro.skydropx.com/api/v1/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SKYDROPX_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error(
        "❌ Error desde Skydropx:",
        response.status,
        JSON.stringify(data, null, 2)
      );
      return res.status(response.status).json({
        error: "Error desde Skydropx",
        detail: data,
        status: response.status,
      });
    }

    // NUEVA LÓGICA PARA LA API PRO
    const quotationId = data.id || null;
    const rates = (data.rates || []).map((r) => ({
      id: r.id,
      provider: r.provider_display_name || r.provider_name,
      service: r.provider_service_name,
      days: r.days,
      total: Number(r.total || r.amount || 0),
      currency: r.currency_code || "MXN",
    }));

    console.log("✅ Cotización PROCESADA. quotationId:", quotationId);
    console.log("✅ Primer rate:", rates[0]);

    return res.json({
      quotationId,
      rates,
      raw: data,
    });
  } catch (error) {
    console.error("💥 Error en /api/shipping/cotizar:", error);
    return res.status(500).json({
      error: "Error interno al cotizar envío",
      detail: String(error),
    });
  }
});

export default router;
