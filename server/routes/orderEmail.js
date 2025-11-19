// server/routes/orderEmail.js
import express from "express";
import { sendOrderEmail } from "../utils/mailer.js";

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
      correo,
      telefono,
      direccion,
      colonia,
      ciudad,
      estadoDireccion,
      codigoPostal,
      productos,
      total,
    } = order;

    const adminEmail = process.env.GMAIL_USER;

    const htmlCliente = `
      <h2>Gracias por tu compra, ${cliente || ""}!</h2>
      <p>Tu número de orden es <strong>#${orden}</strong>.</p>
      <p><strong>Total:</strong> $${total} MXN</p>
      <p><strong>Productos:</strong></p>
      <ul>
        ${(productos || []).map((p) => `<li>${p}</li>`).join("")}
      </ul>
      <p><strong>Envío a:</strong><br/>
        ${direccion || ""}<br/>
        ${colonia || ""}<br/>
        ${ciudad || ""}, ${estadoDireccion || ""}<br/>
        CP: ${codigoPostal || ""}
      </p>
      <p>Teléfono de contacto: ${telefono || "N/A"}</p>
    `;

    const htmlAdmin = `
      <h2>Nuevo pedido recibido</h2>
      <p><strong>Orden:</strong> #${orden}</p>
      <p><strong>Cliente:</strong> ${cliente || ""}</p>
      <p><strong>Email cliente:</strong> ${correo}</p>
      <p><strong>Total:</strong> $${total} MXN</p>
      <p><strong>Productos:</strong></p>
      <ul>
        ${(productos || []).map((p) => `<li>${p}</li>`).join("")}
      </ul>
      <p><strong>Dirección de envío:</strong><br/>
        ${direccion || ""}<br/>
        ${colonia || ""}<br/>
        ${ciudad || ""}, ${estadoDireccion || ""}<br/>
        CP: ${codigoPostal || ""}
      </p>
    `;

    // Cliente
    await sendOrderEmail({
      to: emailCliente,
      subject: `Confirmación de pedido #${orden}`,
      html: htmlCliente,
    });

    // Admin
    await sendOrderEmail({
      to: adminEmail,
      subject: `Nuevo pedido #${orden}`,
      html: htmlAdmin,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "Error enviando correo" });
  }
});

export default router;
