// server/routes/shipping.js
import express from "express";
import { skydropxRequest } from "../utils/skydropx.js";

const router = express.Router();

// Paqueterías que SÍ quieres mostrar
const MAIN_PROVIDERS = [
  "Paquetexpress",
  "FedEx",
  "Estafeta",
  "99minutos.com",
  "DHL",
];

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
        error:
          "Faltan datos: address_from, address_to o parcels no fueron enviados",
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

    const data = await skydropxRequest(
      "POST",
      "/api/v1/quotations",
      requestBody
    );

    const quotationId = data.id || null;

    // 1) Normalizamos las rates que vienen de Skydropx
    let rates = (data.rates || []).map((r) => {
      const total = Number(r.total || r.amount || 0);

      return {
        id: r.id,
        provider: r.provider_display_name || r.provider_name,
        service: r.provider_service_name,
        days: r.days,
        total,
        currency: r.currency_code || "MXN",
      };
    });

    // 2) Filtramos: solo rates con precio > 0
    rates = rates.filter((r) => r.total > 0);

    // 3) (Opcional) Solo ciertas paqueterías “principales”
    rates = rates.filter((r) => MAIN_PROVIDERS.includes(r.provider));

    // 4) (Opcional) Ordenar por precio menor a mayor
    rates.sort((a, b) => a.total - b.total);

    console.log(
      "✅ Cotización PROCESADA. quotationId:",
      quotationId,
      "rates filtradas:",
      rates.length
    );

    return res.json({
      quotationId,
      rates,
      rawCount: (data.rates || []).length, // para debug
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);

    return res.status(status).json({
      error: "Error al cotizar envío",
      detail: detail,
    });
  }
});

export default router;
