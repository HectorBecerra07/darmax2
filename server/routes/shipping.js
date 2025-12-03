// server/routes/shipping.js
import express from "express";
import { skydropxProRequest } from "../utils/skydropx.js"; // 👈 OJO: ahora usamos skydropxProRequest
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Paqueterías que SÍ quieres mostrar en el checkout
const MAIN_PROVIDERS = [
  "Paquetexpress",
  "FedEx",
  "Estafeta",
  "99minutos.com",
  "DHL",
];

// GET /api/shipping/test
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "shipping router OK" });
});

/**
 * POST /api/shipping/cotizar
 * Cotiza el envío usando Skydropx PRO (OAuth) -> /api/v1/quotations
 */
router.post("/cotizar", async (req, res) => {
  console.log("ENTERING /api/shipping/cotizar");

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
        "❌ Error: Faltan variables de entorno críticas para address_from."
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
      "📦 Enviando cotización a Skydropx PRO /api/v1/quotations con:",
      JSON.stringify(requestBody, null, 2)
    );

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

    // Normalizamos las tarifas
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

    // Filtrar por precio > 0
    rates = rates.filter((r) => r.total > 0);

    // Filtrar por paqueterías permitidas
    rates = rates.filter((r) => MAIN_PROVIDERS.includes(r.provider));

    // Ordenar por precio (menor a mayor)
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

/**
 * POST /api/shipping/create-label
 * Genera la guía en Skydropx usando el rateId guardado en Envio
 * y guarda tracking + url de la etiqueta en la BD.
 *
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

    // Traemos el pedido con su envío
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

    // Si ya tiene guía generada, no volvemos a crear
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

    console.log("🎫 Creando shipment en Skydropx para rateId:", envio.rateId);

    // API PRO: POST /api/v1/shipments
    const shipmentResponse = await skydropxProRequest(
      "POST",
      "/api/v1/shipments",
      {
        shipment: {
          rate_id: envio.rateId,
          label_format: "pdf",
        },
      }
    );

    console.log(
      "📨 Respuesta cruda de Skydropx /shipments:",
      JSON.stringify(shipmentResponse, null, 2)
    );

    // Estructura esperada: { data: { id, attributes: { ... } } }
    const shipmentData = shipmentResponse.data || shipmentResponse;
    const attrs = shipmentData.attributes || shipmentData;

    const updatedEnvio = await prisma.envio.update({
      where: { id: envio.id },
      data: {
        labelId: shipmentData.id
          ? String(shipmentData.id)
          : envio.labelId,
        skydropxShipmentId: shipmentData.id
          ? String(shipmentData.id)
          : envio.skydropxShipmentId,
        trackingNumber: attrs.tracking_number || attrs.tracking || null,
        trackingUrl:
          attrs.tracking_url_provider ||
          attrs.tracking_view_url ||
          attrs.tracking_url ||
          null,
        etiquetaUrl:
          attrs.label_url ||
          attrs.label_pdf_url ||
          attrs.label ||
          null,
      },
    });

    return res.json({
      ok: true,
      envio: updatedEnvio,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);

    console.error("❌ Error creando shipment/label en Skydropx:", status, detail);

    return res.status(status).json({
      error: "Error al crear la guía en Skydropx",
      detail,
    });
  }
});

export default router;
