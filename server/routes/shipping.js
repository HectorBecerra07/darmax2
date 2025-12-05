// server/routes/shipping.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { skydropxProRequest } from "../utils/skydropx.js";

const prisma = new PrismaClient();
const router = express.Router();

// Paqueterías que SÍ quieres mostrar en el front
const MAIN_PROVIDERS = [
  "Paquetexpress",
  "FedEx",
  "Estafeta",
  "99minutos.com",
  "DHL",
];

// Helper para límite de 30 caracteres (Skydropx)
const truncate30 = (value) => {
  if (!value) return "";
  const str = value.toString();
  return str.length > 30 ? str.slice(0, 30) : str;
};

// GET /api/shipping/test  -> para verificar que el router está montado
router.get("/test", (req, res) => {
  res.json({ ok: true, msg: "shipping router OK" });
});

/**
 * 🔹 POST /api/shipping/cotizar
 * Recibe: { address_to, parcels }
 * Responde: { quotationId, rates, rawCount }
 */
router.post("/cotizar", async (req, res) => {
  console.log("ENTERING /cotizar handler");

  try {
    // Dirección de ORIGEN (tus datos) desde variables de entorno
    const address_from = {
      country_code: process.env.SKYDROPX_SHIPPER_COUNTRY,
      postal_code: process.env.SKYDROPX_SHIPPER_POSTAL_CODE,
      area_level1: process.env.SKYDROPX_SHIPPER_STATE,
      area_level2: process.env.SKYDROPX_SHIPPER_CITY,
      area_level3: process.env.SKYDROPX_SHIPPER_SECTOR,
    };

    const { address_to, parcels } = req.body;

    if (!address_from.postal_code || !address_from.area_level1) {
      console.error("❌ Faltan variables de origen (address_from)");
      return res.status(500).json({
        error:
          "La dirección de origen no está configurada en el servidor. Revisa las variables de entorno.",
      });
    }

    if (!address_to || !parcels) {
      return res
        .status(400)
        .json({ error: "Faltan datos: address_to o parcels no fueron enviados" });
    }

    const requestBody = {
      quotation: {
        address_from,
        address_to,
        parcels,
      },
    };

    console.log(
      "📦 Enviando cotización a Skydropx PRO:",
      JSON.stringify(requestBody, null, 2)
    );

    const data = await skydropxProRequest(
      "POST",
      "/api/v1/quotations",
      requestBody
    );

    console.log(
      "📨 Respuesta cruda PRO /quotations:",
      JSON.stringify(data, null, 2)
    );

    const quotationId = data.id || null;

    // Normalizamos las rates
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

    // Filtrar rates con precio > 0
    rates = rates.filter((r) => r.total > 0);
    // Filtrar solo las paqueterías que quieres mostrar
    rates = rates.filter((r) => MAIN_PROVIDERS.includes(r.provider));
    // Ordenar de más barato a más caro
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
 * 🔹 POST /api/shipping/create-label
 * Crea el shipment en Skydropx PRO a partir del rateId guardado en Envio
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

    // Traemos el pedido con su registro de envío y los productos asociados
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        envio: true,
        productos: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }
    if (!pedido.envio) {
      return res
        .status(404)
        .json({ error: "No hay registro de envío asociado a este pedido" });
    }
    if (!pedido.productos || pedido.productos.length === 0) {
      return res.status(400).json({
        error: "El pedido no tiene productos para calcular el paquete.",
      });
    }

    const envio = pedido.envio;

    // Si ya tiene guía, no vuelvas a crear otra
    if (envio.etiquetaUrl) {
      return res.status(400).json({
        error: "Este pedido ya tiene una guía generada",
        envio,
      });
    }

    // --- VALIDACIÓN rateId ---
    if (!envio.rateId || typeof envio.rateId !== "string" || !envio.rateId.trim()) {
      return res.status(400).json({
        error:
          "El envío no tiene un ID de tarifa (rateId) válido almacenado. No se puede generar la guía.",
      });
    }

    // --- VALIDAR que existan consignment_note y package_type en env ---
    if (!process.env.SKYDROPX_CONSIGNMENT_NOTE) {
      return res.status(500).json({
        error:
          "Falta SKYDROPX_CONSIGNMENT_NOTE en las variables de entorno del servidor.",
      });
    }

    if (!process.env.SKYDROPX_PACKAGE_TYPE) {
      return res.status(500).json({
        error:
          "Falta SKYDROPX_PACKAGE_TYPE en las variables de entorno del servidor.",
      });
    }

    console.log("🎫 Creando shipment en Skydropx PRO para rateId:", envio.rateId);

    // 2. Dirección de ORIGEN (remitente) - COMPLETA con fallbacks y truncate30
    const address_from = {
      country_code: process.env.SKYDROPX_SHIPPER_COUNTRY || "MX",
      postal_code: process.env.SKYDROPX_SHIPPER_POSTAL_CODE || "00000",
      area_level1: process.env.SKYDROPX_SHIPPER_STATE || "Ciudad de México", // Estado
      area_level2: process.env.SKYDROPX_SHIPPER_CITY || "Cuauhtémoc", // Ciudad
      street1: process.env.SKYDROPX_SHIPPER_STREET1 || "Calle Origen 123", // Calle y número
      street2: process.env.SKYDROPX_SHIPPER_SECTOR || "Colonia Origen", // Colonia
      name: truncate30(process.env.SKYDROPX_SHIPPER_NAME || "Mi Empresa"),
      phone: process.env.SKYDROPX_SHIPPER_PHONE || "5551234567",
      email: process.env.SKYDROPX_SHIPPER_EMAIL || "ventas@miempresa.com",
      reference: truncate30(
        process.env.SKYDROPX_SHIPPER_REFERENCE || "Sin referencias"
      ),
    };

    // 3. Dirección de DESTINO (cliente) desde el pedido - COMPLETA y truncada
    const address_to = {
      country_code: "MX",
      postal_code: pedido.codigoPostal,
      area_level1: pedido.estadoEnvio, // Estado
      area_level2: pedido.ciudad, // Ciudad
      street1: pedido.direccion, // Calle y número
      street2: pedido.colonia, // Colonia
      name: truncate30(pedido.clienteNombre),
      phone: pedido.clienteTelefono || "00000000",
      email: pedido.clienteEmail,
      reference: truncate30(`Orden ${pedido.orden || pedido.id}`),
    };

    // 4. Construir el array 'packages' con la estructura que espera /shipments
    const packages = [
      {
        package_number: 1,
        package_protected: false,
        declared_value: Number(pedido.total || 0),
        // Códigos que vienen de tu .env, elegidos según tus catálogos
        consignment_note: process.env.SKYDROPX_CONSIGNMENT_NOTE, // ej. "48101716"
        package_type: process.env.SKYDROPX_PACKAGE_TYPE, // ej. "4G"
      },
    ];

    // 5. Body FINAL para Skydropx con la ESTRUCTURA ANIDADA
    const shipmentBody = {
      shipment: {
        rate_id: envio.rateId,
        printing_format: "standard",
        external_order_id: pedido.orden?.toString?.() || String(pedido.id),
        address_from,
        address_to,
        packages,
      },
    };

    console.log(
      "📦 Body enviado a PRO /shipments:",
      JSON.stringify(shipmentBody, null, 2)
    );

    const shipmentResponse = await skydropxProRequest(
      "POST",
      "/api/v1/shipments/",
      shipmentBody
    );

    console.log(
      "📨 Respuesta cruda PRO /shipments:",
      JSON.stringify(shipmentResponse, null, 2)
    );

    const shipmentData = shipmentResponse.data || shipmentResponse;
    const attrs = shipmentData.attributes || shipmentData;

    const updatedEnvio = await prisma.envio.update({
      where: { id: envio.id },
      data: {
        skydropxShipmentId: String(shipmentData.id),
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

    console.error(
      "❌ Error creando shipment/label en Skydropx PRO:",
      status,
      detail
    );

    return res.status(status).json({
      error: "Error al crear la guía en Skydropx",
      detail,
    });
  }
});

/**
 * 🔹 GET /api/shipping/shipments
 * Obtiene todos los envíos desde Skydropx PRO
 */
router.get("/shipments", async (req, res) => {
  try {
    console.log("📦 Obteniendo todos los shipments de Skydropx PRO...");

    const response = await skydropxProRequest("GET", "/api/v1/shipments");

    console.log(
      "📨 Respuesta cruda PRO /shipments:",
      JSON.stringify(response, null, 2)
    );

    // Normalizamos los datos para que sean más fáciles de usar en el frontend
    const shipments = (response.data || []).map((shipment) => {
      const attrs = shipment.attributes;
      return {
        id: shipment.id,
        status: attrs.status,
        trackingNumber: attrs.tracking_number,
        labelUrl: attrs.label_url,
        trackingUrl: attrs.tracking_url_provider,
        externalOrderId: attrs.external_order_id,
        createdAt: attrs.created_at,
        provider: attrs.provider,
        service: attrs.service_name,
        addressTo: {
          name: attrs.address_to?.name,
          street1: attrs.address_to?.street1,
          city: attrs.address_to?.city,
          postalCode: attrs.address_to?.postal_code,
        },
      };
    });

    return res.json({
      ok: true,
      shipments,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);

    console.error(
      "❌ Error obteniendo shipments de Skydropx PRO:",
      status,
      detail
    );

    return res.status(status).json({
      error: "Error al obtener los envíos de Skydropx",
      detail,
    });
  }
});

export default router;
