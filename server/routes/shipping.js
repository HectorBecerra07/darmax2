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

// GET de prueba
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "shipping router OK" });
});

// POST /api/shipping/cotizar
router.post("/cotizar", async (req, res) => {
  console.log("ENTERING /cotizar handler");

  try {
    const address_from = {
      country_code: process.env.SKYDROPX_SHIPPER_COUNTRY,
      postal_code: process.env.SKYDROPX_SHIPPER_POSTAL_CODE,
      area_level1: process.env.SKYDROPX_SHIPPER_STATE,
      area_level2: process.env.SKYDROPX_SHIPPER_CITY,
      area_level3: process.env.SKYDROPX_SHIPPER_SECTOR,
    };

    const { address_to, parcels } = req.body;

    // Validar origen
    if (!address_from.postal_code || !address_from.area_level1) {
      console.error(
        "❌ Error: Faltan variables de entorno críticas del servidor para la dirección de origen."
      );
      return res.status(500).json({
        error:
          "La dirección de origen no está configurada en el servidor. Revisa las variables de entorno.",
      });
    }

    // Validar payload
    if (!address_to || !parcels) {
      return res.status(400).json({
        error: "Faltan datos: address_to o parcels no fueron enviados",
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

    console.log("📨 Respuesta cruda de Skydropx:", JSON.stringify(data, null, 2));

    const quotationId = data.id || null;

    // 1) Normalizamos las rates
    let rates = (data.rates || []).map((r) => {
      const total = Number(r.total || r.amount || 0);
      return {
        id: r.id,
        providerRaw: {
          provider_display_name: r.provider_display_name,
          provider_name: r.provider_name,
        },
        provider: r.provider_display_name || r.provider_name,
        service: r.provider_service_name,
        days: r.days,
        total,
        currency: r.currency_code || "MXN",
      };
    });

    console.log(
      "🔍 Providers antes de filtrar:",
      rates.map((r) => r.providerRaw)
    );

    // 2) Filtrar por precio > 0
    rates = rates.filter((r) => r.total > 0);

    // 3) Filtrar solo MAIN_PROVIDERS (puedes comentar esta línea para probar todo)
    rates = rates.filter((r) => MAIN_PROVIDERS.includes(r.provider));

    // 4) Ordenar por precio (menor a mayor)
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

    console.error("❌ Error al cotizar envío:", status, detail);

    return res.status(status).json({
      error: "Error al cotizar envío",
      detail,
    });
  }
});

export default router;
