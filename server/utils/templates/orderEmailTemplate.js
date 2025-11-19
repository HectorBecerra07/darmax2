// server/utils/templates/orderEmailTemplate.js
export const getOrderEmailTemplate = ({
  name = "",
  orderId = "",
  paymentId = "", // 👈 Recibir paymentId
  date = "",
  total = "",
  product = "",
  url = "#",
  logoUrl = "",
}) => {
  const year = new Date().getFullYear();
  const safeName = name || "cliente";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Pedido #${orderId} - Darmax</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; padding: 0; background-color: #f8f8f8; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
    .header { padding: 30px; text-align: center; border-bottom: 1px solid #e5e5e5; }
    .header img { max-height: 40px; }
    .header .logo-text { font-size: 24px; font-weight: 600; color: #1d1d1f; }
    .content { padding: 40px 40px 20px 40px; color: #1d1d1f; }
    .content h1 { font-size: 28px; font-weight: 600; margin: 0 0 20px 0; color: #1d1d1f; }
    .content p { font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #515154; }
    .order-summary { margin: 30px 0; padding: 20px; background-color: #f5f5f7; border-radius: 8px; }
    .order-summary h2 { font-size: 18px; margin: 0 0 15px 0; color: #1d1d1f; }
    .order-summary p { margin: 5px 0; font-size: 14px; }
    .cta-button { display: inline-block; background-color: #007aff; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500; font-size: 16px; margin: 20px 0; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #86868b; }
    .footer a { color: #007aff; text-decoration: none; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#f8f8f8;">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" alt="Darmax" />` : `<span class="logo-text">Darmax</span>`}
          </div>
          <div class="content">
            <h1>Gracias por tu pedido, ${safeName}.</h1>
            <p>Hemos recibido tu pedido #${orderId} y lo estamos preparando para ti. Te enviaremos una notificación cuando haya sido enviado.</p>
            
            <div class="order-summary">
              <h2>Resumen del Pedido</h2>
              <p><strong>Número de Pedido:</strong> #${orderId}</p>
              ${paymentId ? `<p><strong>ID de Pago:</strong> ${paymentId}</p>` : ''}
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Producto(s):</strong> ${product}</p>
              <p><strong>Total:</strong> ${total}</p>
            </div>

            <p>Puedes ver los detalles completos de tu pedido y seguir su estado en cualquier momento.</p>
            <a href="${url}" class="cta-button">Ver tu pedido</a>
          </div>
          <div class="footer">
            <p>Este es un correo electrónico de confirmación de pedido. Si tienes alguna pregunta, por favor <a href="mailto:${process.env.GMAIL_USER}">contacta con nosotros</a>.</p>
            <p>© ${year} Darmax. Todos los derechos reservados.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
