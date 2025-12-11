// server/routes/orderEmail.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { sendOrderEmail } from "../utils/mailer.js";
import { getOrderEmailTemplate } from "../utils/templates/orderEmailTemplate.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * 🔹 Exportable: sendOrderConfirmationEmail
 * Envía el correo de confirmación de pedido al cliente y al admin.
 * @param {string} orderId - El ID/número de la orden.
 */
export async function sendOrderConfirmationEmail(orderId) {
  try {
    if (!orderId) {
      throw new Error("Se requiere el ID de la orden para enviar el correo.");
    }

    // 1. Obtener todos los datos de la base de datos
    const pedido = await prisma.pedido.findUnique({
      where: { orden: orderId },
      include: {
        productos: { include: { producto: true } },
        envio: true,
      },
    });

    if (!pedido) {
      throw new Error(`Pedido con orden #${orderId} no encontrado.`);
    }

    const { clienteNombre, total, clienteEmail, envio } = pedido;
    const adminEmail = process.env.GMAIL_USER;
    const productosList = pedido.productos.map(p => `${p.producto.nombre} (x${p.cantidad})`);

    // 2. Preparar los datos para la plantilla
    const templateData = {
      name: clienteNombre,
      orderId: orderId,
      paymentId: pedido.paymentIntentId,
      date: pedido.createdAt.toLocaleDateString('es-MX'),
      total: `$${total.toFixed(2)} MXN`,
      product: productosList.join(", "),
      url: `https://darmax.mx/perfil`, // URL al perfil del cliente
      // Nuevos datos de envío
      trackingNumber: envio?.trackingNumber,
      trackingUrl: envio?.trackingUrl,
      provider: envio?.provider
    };

    // 3. Generar y enviar correos
    const htmlCliente = getOrderEmailTemplate(templateData);
    const adminTemplateData = { ...templateData, name: `Admin (Pedido de ${clienteNombre})` };
    const htmlAdmin = getOrderEmailTemplate(adminTemplateData);

    // Enviar a cliente
    await sendOrderEmail({
      to: clienteEmail,
      subject: `Confirmación de tu pedido #${orderId}`,
      html: htmlCliente,
    });
    console.log(`📧 Correo de confirmación enviado a ${clienteEmail} para el pedido #${orderId}.`);

    // Enviar a admin
    await sendOrderEmail({
      to: adminEmail,
      subject: `Nuevo pedido #${orderId} de ${clienteNombre}`,
      html: htmlAdmin,
    });
    console.log(`📧 Correo de notificación enviado al admin para el pedido #${orderId}.`);

    return { success: true };

  } catch (error) {
    console.error(`❌ Error fatal enviando correo para pedido #${orderId}:`, error);
    // No lanzamos error para no detener el flujo principal del pedido, solo logueamos.
    return { success: false, error: error.message };
  }
}

/**
 * 🔹 POST /api/orderEmail/resend-confirmation
 * Permite reenviar manualmente un correo de confirmación desde el admin.
 */
router.post("/resend-confirmation", async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({ error: "Falta el ID de la orden (orderId)." });
      }
  
      const result = await sendOrderConfirmationEmail(orderId);
  
      if (result.success) {
        return res.json({ success: true, message: `Correo para la orden #${orderId} reenviado.` });
      } else {
        return res.status(500).json({ error: result.error });
      }
  
    } catch (error) {
      console.error("Error en el endpoint de reenvío:", error);
      res.status(500).json({ error: "Error interno al intentar reenviar el correo." });
    }
});


export default router;
