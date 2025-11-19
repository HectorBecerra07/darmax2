// server/utils/mailer.js
import nodemailer from "nodemailer";

console.log("GMAIL_USER:", process.env.GMAIL_USER); // 👈 esto debe mostrarse en consola

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOrderEmail({ order, emailCliente }) {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <div style="background: #0d6efd; padding: 20px; color: white; text-align: center;">
        <h2 style="margin: 0;">¡Gracias por tu compra! 💧</h2>
      </div>

      <div style="padding: 20px;">
        <p style="font-size: 16px; color: #333;">
          Hola <strong>${order.nombreCliente ?? "Cliente"}</strong>,
        </p>

        <p style="font-size: 15px; color: #555;">
          Hemos recibido tu orden correctamente. Aquí tienes los detalles de tu compra:
        </p>

        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:8px;
          padding:15px;
          margin-top:10px;">
          
          <p><strong>ID de orden:</strong> #${order.id}</p>
          <p><strong>Total pagado:</strong> <span style="color:#0d6efd;">$${order.total} MXN</span></p>
          <p><strong>Método de pago:</strong> Stripe</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <h3 style="margin-top: 25px; color: #111;">Productos</h3>
        <ul style="padding-left: 20px; color:#333;">
          ${order.items
            .map(
              (item) =>
                `<li>${item.name} — <strong>$${item.price} MXN</strong> x ${item.quantity}</li>`
            )
            .join("")}
        </ul>

        <div style="text-align:center; margin:30px 0;">
          <a href="https://tusitio.com/orden/${order.id}" 
            style="
              display:inline-block;
              background:#0d6efd;
              color:white;
              padding:12px 22px;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              font-size:15px;">
            Ver detalles de la orden
          </a>
        </div>

        <p style="font-size:14px; color:#777; text-align:center;">
          Si tienes dudas, responde directamente a este correo.  
        </p>
      </div>

      <div style="background:#eee; text-align:center; padding:10px; font-size:12px; color:#555;">
        © ${new Date().getFullYear()} Darmax Agua. Todos los derechos reservados.
      </div>

    </div>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"Darmax Agua" <${process.env.GMAIL_USER}>`,
    to: emailCliente,
    subject: `Confirmación de compra #${order.id}`,
    html: htmlContent,
  });

  console.log("📧 Correo enviado:", info.messageId);
}

