// server/routes/shipping.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { skydropxProRequest } from "../utils/skydropx.js";

const prisma = new PrismaClient();
const router = express.Router();

// Helper para límite de 30 caracteres (Skydropx)
const truncate30 = (value) => {
  if (!value) return "";
  const str = value.toString();
  return str.length > 30 ? str.slice(0, 30) : str;
};

/**
 * 헬퍼 Parsea la compleja respuesta JSON:API de Skydropx a un objeto simple y útil.
 * @param {object} response - El cuerpo de la respuesta completa de la API de Skydropx.
 * @returns {object} Un objeto aplanado con los datos clave del envío.
 */
function parseSkydropxShipment(response) {
  const shipment = response.data;
  const included = response.included || [];

  const findIncluded = (type, id) => included.find(item => item.type === type && item.id === id);

  let packageInfo = null;
  if (shipment.relationships?.packages?.data?.length > 0) {
    const packageRelationship = shipment.relationships.packages.data[0];
    packageInfo = findIncluded(packageRelationship.type, packageRelationship.id);
  }

  let addressToInfo = null;
  if (shipment.relationships?.address_to?.data) {
    const addrToRelationship = shipment.relationships.address_to.data;
    addressToInfo = findIncluded(addrToRelationship.type, addrToRelationship.id);
  }
  
  const attrs = shipment.attributes;

  return {
    skydropxId: shipment.id,
    status: attrs.workflow_status || attrs.status, // workflow_status es el más nuevo
    provider: attrs.carrier_name || attrs.provider,
    createdAt: attrs.created_at,
    externalOrderId: attrs.external_order_id,
    labelUrl: packageInfo?.attributes?.label_url || null,
    trackingNumber: packageInfo?.attributes?.tracking_number || null,
    trackingUrl: packageInfo?.attributes?.tracking_url_provider || null,
    addressTo: {
      name: addressToInfo?.attributes?.name,
      street1: addressToInfo?.attributes?.street1,
      street2: addressToInfo?.attributes?.area_level3, // Colonia
      city: addressToInfo?.attributes?.area_level2,   // Ciudad
      state: addressToInfo?.attributes?.area_level1,  // Estado
      postalCode: addressToInfo?.attributes?.postal_code,
    },
  };
}


// --- RUTAS ---

/**
 * 🔹 POST /api/shipping/create-label
 * Crea el shipment en Skydropx PRO y guarda el skydropxId en la BD local.
 */
router.post("/create-label", async (req, res) => {
  try {
    const { pedidoId } = req.body;
    if (!pedidoId) return res.status(400).json({ error: "Falta pedidoId" });

    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(pedidoId) },
      include: { envio: true },
    });

    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    if (!pedido.envio) return res.status(404).json({ error: "No hay registro de envío asociado" });
    if (pedido.envio.skydropxShipmentId) {
      return res.status(400).json({ error: "Este pedido ya tiene un envío creado en Skydropx", envio: pedido.envio });
    }
    if (!pedido.envio.rateId) return res.status(400).json({ error: "El envío no tiene un rateId válido." });

    const address_from = {
      country_code: process.env.SKYDROPX_SHIPPER_COUNTRY || "MX",
      postal_code: process.env.SKYDROPX_SHIPPER_POSTAL_CODE,
      area_level1: process.env.SKYDROPX_SHIPPER_STATE,
      area_level2: process.env.SKYDROPX_SHIPPER_CITY,
      street1: process.env.SKYDROPX_SHIPPER_STREET1,
      street2: process.env.SKYDROPX_SHIPPER_SECTOR,
      name: truncate30(process.env.SKYDROPX_SHIPPER_NAME),
      phone: process.env.SKYDROPX_SHIPPER_PHONE,
      email: process.env.SKYDROPX_SHIPPER_EMAIL,
      reference: truncate30(process.env.SKYDROPX_SHIPPER_REFERENCE),
    };

    const address_to = {
      country_code: "MX",
      postal_code: pedido.codigoPostal,
      area_level1: pedido.estadoEnvio,
      area_level2: pedido.ciudad,
      street1: pedido.direccion,
      street2: pedido.colonia,
      name: truncate30(pedido.clienteNombre),
      phone: pedido.clienteTelefono || "00000000",
      email: pedido.clienteEmail,
      reference: truncate30(`Orden ${pedido.orden || pedido.id}`),
    };

    const packages = [{
      package_number: 1,
      package_protected: false,
      declared_value: Number(pedido.total || 0),
      consignment_note: process.env.SKYDROPX_CONSIGNMENT_NOTE,
      package_type: process.env.SKYDROPX_PACKAGE_TYPE,
    }];

    const shipmentBody = {
      shipment: {
        rate_id: pedido.envio.rateId,
        printing_format: "standard",
        external_order_id: pedido.orden?.toString?.() || String(pedido.id),
        address_from,
        address_to,
        packages,
      },
    };

    console.log("📦 Body enviado a PRO /shipments:", JSON.stringify(shipmentBody, null, 2));
    const shipmentResponse = await skydropxProRequest("POST", "/api/v1/shipments/", shipmentBody);
    console.log("📨 Respuesta cruda PRO /shipments:", JSON.stringify(shipmentResponse, null, 2));

    // Usamos el parser para extraer los datos correctamente
    const parsedData = parseSkydropxShipment(shipmentResponse);

    const updatedEnvio = await prisma.envio.update({
      where: { id: pedido.envio.id },
      data: {
        skydropxShipmentId: parsedData.skydropxId,
        status: parsedData.status,
        trackingNumber: parsedData.trackingNumber, // será null al inicio
        trackingUrl: parsedData.trackingUrl,       // será null al inicio
        etiquetaUrl: parsedData.labelUrl,         // será null al inicio
      },
    });

    return res.json({ ok: true, envio: updatedEnvio });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);
    console.error("❌ Error creando shipment/label en Skydropx PRO:", status, detail);
    return res.status(status).json({ error: "Error al crear la guía en Skydropx", detail });
  }
});

/**
 * 🔹 GET /api/shipping/shipments
 * Implementa la Estrategia B (Polling).
 * 1. Obtiene los envíos de la BD local.
 * 2. Para los que no tienen guía, consulta su estado en Skydropx.
 * 3. Si la guía ya está lista, actualiza la BD local.
 * 4. Devuelve la lista completa y actualizada desde la BD.
 */
router.get("/shipments", async (req, res) => {
  try {
    // 1. Obtener envíos de la BD que podrían necesitar actualización
    const localEnvíos = await prisma.envio.findMany({
      where: { skydropxShipmentId: { not: null } },
      include: { pedido: { select: { orden: true } } },
    });
    
    const enviosToUpdate = localEnvíos.filter(e => !e.etiquetaUrl);

    console.log(`📦 Encontrados ${localEnvíos.length} envíos locales. ${enviosToUpdate.length} serán verificados.`);

    // 2. Iterar y actualizar
    for (const envio of enviosToUpdate) {
      try {
        console.log(`🔍 Verificando estado del envío ${envio.skydropxShipmentId}...`);
        const response = await skydropxProRequest("GET", `/api/v1/shipments/${envio.skydropxShipmentId}`);
        const parsed = parseSkydropxShipment(response);

        // 3. Si la guía ya está disponible, actualizar la BD
        if (parsed.labelUrl && parsed.labelUrl !== envio.etiquetaUrl) {
          console.log(`✅ ¡Guía encontrada para ${envio.skydropxShipmentId}! Actualizando BD...`);
          await prisma.envio.update({
            where: { id: envio.id },
            data: {
              etiquetaUrl: parsed.labelUrl,
              trackingNumber: parsed.trackingNumber,
              trackingUrl: parsed.trackingUrl,
              status: parsed.status,
            },
          });
        }
      } catch (updateError) {
        // Si falla la actualización de un envío, solo lo logueamos pero no detenemos el proceso
        console.error(`⚠️ Error actualizando el envío ${envio.skydropxShipmentId}:`, updateError.message);
      }
    }

    // 4. Volver a leer TODOS los envíos de la BD para tener la data más fresca
    const finalEnvios = await prisma.envio.findMany({
      where: { skydropxShipmentId: { not: null } },
      include: { pedido: true }, // Incluir todo el pedido para tener la dirección
      orderBy: { createdAt: 'desc' }
    });

    // 5. Mapear al formato que el frontend espera
    const formattedShipments = finalEnvios.map(envio => ({
      id: envio.skydropxShipmentId,
      status: envio.status,
      trackingNumber: envio.trackingNumber,
      labelUrl: envio.etiquetaUrl,
      trackingUrl: envio.trackingUrl,
      externalOrderId: envio.pedido?.orden || String(envio.pedidoId),
      createdAt: envio.createdAt,
      provider: envio.proveedor, // El proveedor se guarda al seleccionar la tarifa
      service: envio.servicio,   // El servicio también
      addressTo: {
        name: envio.pedido?.clienteNombre,
        street1: envio.pedido?.direccion,
        street2: envio.pedido?.colonia,
        city: envio.pedido?.ciudad,
        state: envio.pedido?.estadoEnvio,
        postalCode: envio.pedido?.codigoPostal,
      },
    }));

    return res.json({ ok: true, shipments: formattedShipments });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);
    console.error("❌ Error obteniendo la lista de envíos:", status, detail);
    return res.status(status).json({ error: "Error al obtener los envíos", detail });
  }
});

// Mantengo la ruta de cotizar por si se usa en otra parte.
router.post("/cotizar", async (req, res) => {
  try {
    const MAIN_PROVIDERS = ["Paquetexpress", "FedEx", "Estafeta", "99minutos.com", "DHL"];
    const address_from = {
      country_code: process.env.SKYDROPX_SHIPPER_COUNTRY,
      postal_code: process.env.SKYDROPX_SHIPPER_POSTAL_CODE,
      area_level1: process.env.SKYDROPX_SHIPPER_STATE,
      area_level2: process.env.SKYDROPX_SHIPPER_CITY,
      area_level3: process.env.SKYDROPX_SHIPPER_SECTOR,
    };
    const { address_to, parcels } = req.body;
    if (!address_from.postal_code || !address_to || !parcels) {
      return res.status(400).json({ error: "Faltan datos de origen, destino o paquetes." });
    }
    const requestBody = { quotation: { address_from, address_to, parcels } };
    const data = await skydropxProRequest("POST", "/api/v1/quotations", requestBody);
    let rates = (data.rates || []).map((r) => ({
      id: r.id,
      provider: r.provider_display_name || r.provider_name,
      service: r.provider_service_name,
      days: r.days,
      total: Number(r.total || r.amount || 0),
      currency: r.currency_code || "MXN",
    }));
    rates = rates.filter((r) => r.total > 0 && MAIN_PROVIDERS.includes(r.provider)).sort((a, b) => a.total - b.total);
    return res.json({ quotationId: data.id || null, rates, rawCount: (data.rates || []).length });
  } catch (error) {
    const status = error.response?.status || 500;
    const detail = error.response?.data || String(error);
    console.error("❌ Error al cotizar envío:", status, detail);
    return res.status(status).json({ error: "Error al cotizar envío", detail });
  }
});

export default router;
