// server/routes/shipping.js
import express from "express";
import { skydropxProRequest, skydropxApiRequest } from "../utils/skydropx.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

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

// ---------- POST /api/shipping/cotizar ----------
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

    if (!address_from.postal_code || !address_from.area_level1) {
      console.error(
        "❌ Error: Faltan variables de entorno críticas para address_from."
      );
      return res.status(500).json({
        error:
          "La dirección de origen no está configurada en el servidor. Revisa las variables de entorno.",
      });
    }

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
      "📦 Enviando cotización a Skydropx PRO con:",
      JSON.stringify(requestBody, null, 2)
    );

    // 👉 API PRO (OAuth)
    const data = await skydropxProRequest(
      "POST",
      "/api/v1/quotations",
      requestBody
    );

    console.log(
      "📨 Respuesta cruda de Skydropx (quotations):",
      JSON.stringify(data, null, 2)
    );

    const quotationId = data.id || null;

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

    rates = rates.filter((r) => r.total > 0);
    rates = rates.filter((r) => MAIN_PROVIDERS.includes(r.provider));
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
      rawCount: (data.rates || []).length,
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

// ---------- POST /api/shipping/create-label ----------
/**
 * Body: { pedidoId: number }
 */
router.post("/create-label", async (req, res) => {
  try {
    const { pedidoId } = req.body;

    if (!pedidoId) {
      return res.status(400).json({ error: "Falta pedidoId" });
    }

    const id = Number(pedidoId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "pedidoId inválido" });
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: { envio: true },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    if (!pedido.envio) {
      return res
        .status(404)
        .json({ error: "No hay registro de envío asociado a este pedido" });
    }

    const envio = pedido.envio;

    if (envio.etiquetaUrl) {
      return res.status(400).json({
        error: "Este pedido ya tiene una guía generada",
        envio,
      });
    }

    if (!envio.rateId) {
      return res.status(400).json({
        error: "El envío no tiene rateId almacenado",
      });
    }

    console.log("🎫 Creando label en Skydropx (API clásica) para rateId:", envio.rateId);

    // 👉 API CLÁSICA (api.skydropx.com)
    const labelResponse = await skydropxApiRequest("POST", "/v1/labels", {
      rate_id: envio.rateId,
      label_format: "pdf",
    });

    console.log(
      "📨 Respuesta cruda de Skydropx /v1/labels:",
      JSON.stringify(labelResponse, null, 2)
    );

    const labelData = labelResponse.data || labelResponse;
    const attrs = labelData.attributes || labelData;

    const updatedEnvio = await prisma.envio.update({
      where: { id: envio.id },
      data: {
        labelId: labelData.id ? String(labelData.id) : envio.labelId,
        skydropxShipmentId: envio.skydropxShipmentId,
        trackingNumber: attrs.tracking_number || attrs.tracking || null,
        trackingUrl:
          attrs.tracking_url_provider ||
          attrs.tracking_url ||
          attrs.tracking_view_url ||
          null,
        etiquetaUrl:
          attrs.label_url || attrs.label_pdf_url || attrs.label || null,
      },
    });

    return res.json({
      ok: true,
      envio: updatedEnvio,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);

    console.error("❌ Error creando label en Skydropx:", status, detail);

    return res.status(status).json({
      error: "Error al crear la guía en Skydropx",
      detail,
    });
  }
});

export default router;
