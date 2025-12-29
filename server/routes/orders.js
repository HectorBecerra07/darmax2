// server/routes/orders.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { createSkydropxLabel } from "./shipping.js"; // Importar
import { sendOrderConfirmationEmail } from "./orderEmail.js"; // Importar

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
      shippingAddress,
      cartItems,
      quotationId,
      rateId,
      shippingTotal,
      totalConEnvio,
      userId,
      rateInfo,
    } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Falta paymentIntentId." });
    }
    if (!shippingAddress || !cartItems?.length) {
      return res.status(400).json({ error: "Faltan datos de envío o carrito vacío." });
    }

    const userIdInt = userId ? Number(userId) : null;
    const subtotalProductos = cartItems.reduce(
      (acc, item) => acc + Number(item.precio || 0) * (item.cantidad || 1),
      0
    );

    const direccionCompleta = shippingAddress.calle || "";

    // 1. Crear el Pedido, Productos y Envío en la BD dentro de una transacción para descontar stock
    const pedido = await prisma.$transaction(async (tx) => {
      // 1.1 Crear el pedido
      const nuevoPedido = await tx.pedido.create({
        data: {
          total: totalConEnvio,
          estado: "PAGADO",
          clienteNombre: shippingAddress.nombre,
          clienteEmail: shippingAddress.email,
          clienteTelefono: shippingAddress.telefono || null,
          direccion: direccionCompleta,
          colonia: shippingAddress.colonia || null,
          ciudad: shippingAddress.ciudad,
          estadoEnvio: shippingAddress.estado,
          codigoPostal: shippingAddress.codigoPostal,
          paymentIntentId: paymentIntentId, // Guardar el ID de pago
          user: userIdInt ? { connect: { id: userIdInt } } : undefined,
          productos: {
            create: cartItems.map((item) => ({
              productoId: item.id,
              cantidad: item.cantidad,
              precioAlComprar: Number(item.precio),
            })),
          },
          envio: {
            create: {
              quotationId: quotationId || "",
              rateId: rateId || "",
              provider: rateInfo?.provider || null,
              service: rateInfo?.service || null,
              days: rateInfo?.days ?? null,
              costoEnvio: Number(shippingTotal || 0),
              moneda: "MXN",
            },
          },
        },
        include: { envio: true },
      });

      // 1.2 Descontar stock de cada producto
      for (const item of cartItems) {
        await tx.producto.update({
          where: { id: Number(item.id) },
          data: {
            stock: { decrement: Number(item.cantidad) },
          },
        });
      }

      return nuevoPedido;
    });

    // 2. Responder inmediatamente al frontend para que no espere.
    res.status(201).json({
      ok: true,
      message: "Pedido recibido. El procesamiento de la guía y el correo se hará en segundo plano.",
      pedido: {
        id: pedido.id,
        orden: pedido.orden,
      },
    });

    // 3. Ejecutar tareas largas (guía y correo) en segundo plano.
    // Usamos un setTimeout de 0 para liberar el ciclo de eventos de Node.js
    setTimeout(async () => {
      try {
        console.log(`[BG-TASK] Iniciando proceso para pedido #${pedido.orden}...`);
        
        // 3.1. Crear la guía en Skydropx y esperar a que esté lista
        await createSkydropxLabel(pedido.id);
        
        // 3.2. Enviar el correo de confirmación con la info de la guía ya actualizada
        await sendOrderConfirmationEmail(pedido.orden);
        
        console.log(`[BG-TASK] Proceso para pedido #${pedido.orden} completado.`);
      } catch (backgroundError) {
        console.error(
          `[BG-TASK] ❌ Error en el proceso de fondo para el pedido #${pedido.orden}:`,
          backgroundError
        );
      }
    }, 0);

    // Vaciar carrito del usuario si está logueado
    if (userIdInt) {
      await prisma.carritoItem.deleteMany({
        where: { userId: userIdInt },
      });
    }

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
