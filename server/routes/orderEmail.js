// server/routes/orderEmail.js
import express from "express";
import { sendOrderEmail } from "../utils/mailer.js";
import { getOrderEmailTemplate } from "../utils/templates/orderEmailTemplate.js"; // Importar el template

const router = express.Router();

router.post("/send-email", async (req, res) => {
  try {
    const { order, emailCliente } = req.body;

    console.log("Petición /send-email:", { emailCliente, orderId: order?.orden });

    if (!order || !emailCliente) {
      return res.status(400).json({ error: "Faltan datos del pedido o email" });
    }

    const {
      orden,
      cliente,
      total,
      productos,
      paymentId, // 👈 Extraer paymentId
    } = order;

    const adminEmail = process.env.GMAIL_USER;

    // Datos para la plantilla
    const templateData = {
      name: cliente,
      orderId: orden,
      paymentId: paymentId, // 👈 Añadir a templateData
      date: new Date().toLocaleDateString('es-MX'),
      total: `$${total} MXN`,
      product: (productos || []).join(", "),
      url: `https://darmax.mx/pedidos/${orden}`, // URL de ejemplo
    };

    // Generar HTML usando la plantilla
    const htmlCliente = getOrderEmailTemplate(templateData);

    // Para el admin, podemos reutilizar la plantilla o crear una versión diferente
    // Aquí reutilizamos la misma, pero podríamos añadir más detalles si quisiéramos
    const adminTemplateData = { ...templateData, name: `Admin (Pedido de ${cliente})` };
    const htmlAdmin = getOrderEmailTemplate(adminTemplateData);


    // Cliente
    await sendOrderEmail({
      to: emailCliente,
      subject: `Confirmación de pedido #${orden}`,
      html: htmlCliente,
    });

    // Admin
    await sendOrderEmail({
      to: adminEmail,
      subject: `Nuevo pedido #${orden} de ${cliente}`,
      html: htmlAdmin,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error); // Loguear el error completo
    res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;
