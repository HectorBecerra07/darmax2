// server/routes/orders.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * POST /api/orders/confirm
 * Se llama DESPUÉS de que Stripe confirma el pago.
 */
router.post("/confirm", async (req, res) => {
  try {
    const {
      paymentIntentId,
      shippingAddress,    // addressTo del front
      cartItems,          // items del carrito (id, nombre, precio, cantidad, etc.)
      quotationId,
      rateId,
      shippingTotal,
      totalConEnvio,
      userId,             // opcional (null para invitados)
      rateInfo,           // opcional: { provider, service, days }
    } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Falta paymentIntentId." });
    }
    if (!shippingAddress || !cartItems?.length) {
      return res
        .status(400)
        .json({ error: "Faltan datos de envío o carrito vacío." });
    }

    // Asegurar que userId sea número si viene como string
    const userIdInt = userId ? Number(userId) : null;

    // Recalcular subtotal productos por seguridad
    const subtotalProductos = cartItems.reduce(
      (acc, item) =>
        acc +
        Number(item.precio || item.price || 0) *
          (item.cantidad || item.quantity || 1),
      0
    );

    const totalEsperado = subtotalProductos + Number(shippingTotal || 0);

    // (Opcional) validar que coincida con totalConEnvio que usaste para Stripe
    // if (Math.round(totalEsperado * 100) !== Math.round(totalConEnvio * 100)) {
    //   return res.status(400).json({ error: "Los totales no coinciden." });
    // }

    // Construir dirección en una sola línea para el pedido
    const direccionCompleta = shippingAddress.calle || "";

    // Crear el pedido + productos + envío
    const pedido = await prisma.pedido.create({
      data: {
        total: totalConEnvio, // productos + envío
        estado: "PAGADO",
        clienteNombre: shippingAddress.nombre,
        clienteEmail: shippingAddress.email,
        clienteTelefono: shippingAddress.telefono || null,

        direccion: direccionCompleta,
        colonia: shippingAddress.colonia || null,
        ciudad: shippingAddress.ciudad,
        estadoEnvio: shippingAddress.estado,
        codigoPostal: shippingAddress.codigoPostal,

        // Relación con usuario (si existe)
        user: userIdInt ? { connect: { id: userIdInt } } : undefined,

        // Crear líneas de productos
        productos: {
          create: cartItems.map((item) => ({
            productoId: item.id, // ID real del producto
            cantidad: item.cantidad,
            precioAlComprar: Number(item.precio),
          })),
        },

        // Crear registro de envío
        envio: {
          create: {
            quotationId: quotationId || "",
            rateId: rateId || "",
            provider: rateInfo?.provider || null,
            service: rateInfo?.service || null,
            days: rateInfo?.days ?? null,
            costoEnvio: Number(shippingTotal || 0),
            moneda: "MXN",
            // shipment, tracking, etiqueta se llenan después cuando creas la guía en Skydropx
          },
        },
      },
      include: {
        productos: {
          include: { producto: true },
        },
        envio: true,
      },
    });

    // Vaciar carrito del usuario si hay userId
    if (userIdInt) {
      await prisma.carritoItem.deleteMany({
        where: { userId: userIdInt },
      });
    }

    return res.json({
      ok: true,
      pedido,
    });
  } catch (error) {
    console.error("❌ Error al confirmar pedido:", error);
    return res.status(500).json({
      error: "Error al confirmar el pedido",
      detail: String(error),
    });
  }
});

/**
 * GET /api/orders
 * Listar todos los pedidos (para panel admin)
 */
router.get("/", async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        productos: { include: { producto: true } },
        envio: true,
        user: true,
      },
    });

    return res.json(pedidos);
  } catch (error) {
    console.error("❌ Error listando pedidos:", error);
    return res.status(500).json({ error: "Error al listar pedidos" });
  }
});

/**
 * GET /api/orders/:id
 * Obtener un pedido por ID
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        productos: { include: { producto: true } },
        envio: true,
        user: true,
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    return res.json(pedido);
  } catch (error) {
    console.error("❌ Error obteniendo pedido:", error);
    return res.status(500).json({ error: "Error al obtener pedido" });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Actualizar estado de un pedido (PENDIENTE, PAGADO, ENVIADO, ENTREGADO, CANCELADO)
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    if (!estado) {
      return res.status(400).json({ error: "Falta estado" });
    }

    // (Opcional) podrías validar que estado esté dentro del enum
    // const validStates = ["PENDIENTE", "PAGADO", "ENVIADO", "ENTREGADO", "CANCELADO"];
    // if (!validStates.includes(estado)) { ... }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { estado },
    });

    return res.json(pedido);
  } catch (error) {
    console.error("❌ Error actualizando estado de pedido:", error);
    return res.status(500).json({ error: "Error al actualizar estado" });
  }
});

export default router;
