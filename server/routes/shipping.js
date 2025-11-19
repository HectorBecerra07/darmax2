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

    console.log("📦 Enviando cotización a Skydropx con:", {
      address_from,
      address_to,
      parcels,
    });

    const response = await fetch("https://api.skydropx.com/v1/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token token=${SKYDROPX_API_KEY}`,
      },
      body: JSON.stringify({
        address_from,
        address_to,
        parcels,
      }),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // Si Skydropx respondió con error (401, 422, etc), devolvemos eso al front
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

    // Intentamos extraer quotationId y rates de forma SEGURA (sin romper nada)
    let quotationId = null;
    let rates = [];

    if (Array.isArray(data?.data) && data.data.length > 0) {
      // Forma típica: data.data es un array de quotes
      rates = data.data.map((r) => ({
        id: r.id,
        provider:
          r.attributes?.provider ||
          r.attributes?.carrier ||
          "Proveedor desconocido",
        service:
          r.attributes?.service_level_name ||
          r.attributes?.service_level_code ||
          "Servicio",
        days:
          r.attributes?.delivery_time_days ||
          r.attributes?.days ||
          r.attributes?.estimated_delivery_days ||
          null,
        total: Number(r.attributes?.total_pricing || 0),
        currency: r.attributes?.currency || "MXN",
      }));

      // Distintas formas posibles de traer el quotation id
      quotationId =
        data?.data?.[0]?.relationships?.quotation?.data?.id ||
        data?.data?.[0]?.attributes?.quotation_id ||
        null;
    } else if (Array.isArray(data?.rates)) {
      // Otra forma posible: data.rates ya viene armado
      rates = data.rates.map((r) => ({
        id: r.id,
        provider: r.provider,
        service: r.service,
        days: r.days,
        total: Number(r.total),
        currency: r.currency || "MXN",
      }));
      quotationId = data.quotationId || null;
    }

    console.log("✅ Cotización procesada. quotationId:", quotationId);
    console.log("✅ Primer rate:", rates[0]);

    return res.json({
      quotationId,
      rates,
      raw: data, // opcional: si no quieres mandar todo, puedes quitar esta línea
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
