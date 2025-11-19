// server/routes/shipping.js
import express from "express";
import { skydropxRequest } from '../utils/skydropx.js';

const router = express.Router();

// GET de prueba para ver si el router está montado
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "shipping router OK" });
});

// POST /api/shipping/cotizar
router.post("/cotizar", async (req, res) => {
  console.log("ENTERING /cotizar handler");
  try {
    const { address_from, address_to, parcels } = req.body;

    if (!address_from || !address_to || !parcels) {
      return res.status(400).json({
        error: "Faltan datos: address_from, address_to o parcels no fueron enviados",
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

    // Usamos la nueva utilidad que maneja la autenticación de forma automática
    const data = await skydropxRequest('POST', '/api/v1/quotations', requestBody);
    
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
    
    return res.json({
      quotationId,
      rates,
      raw: data,
    });

  } catch (error) {
    // El error ya se loguea en skydropxRequest, aquí solo respondemos al cliente
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);

    return res.status(status).json({
      error: "Error al cotizar envío",
      detail: detail,
    });
  }
});

export default router;
