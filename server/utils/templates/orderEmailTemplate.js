export const getOrderEmailTemplate = ({
  name = "",
  orderId = "",
  paymentId = "",
  date = "",
  total = "",
  product = "",
  url = "#",
  logoUrl = "https://res.cloudinary.com/defkuaytw/image/upload/v1765480861/logo3_qwtfum.png",
  trackingNumber,
  trackingUrl,
  provider,
}) => {
  const year = new Date().getFullYear();
  const safeName = name || "cliente";

  const shippingInfoHtml =
    trackingNumber && trackingUrl && provider
      ? `
      <div style="background:#fafafa;padding:24px;border-radius:12px;margin:32px 0;border:1px solid #e5e7eb;">
        <h2 style="font-size:18px;color:#111827;font-weight:600;margin:0 0 18px 0;text-align:left;">
          Información de Envío
        </h2>

        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:15px;">
          <span style="color:#6b7280;">Paquetería</span>
          <span style="color:#111827;font-weight:500;">${provider}</span>
        </div>

        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e5e7eb;font-size:15px;">
          <span style="color:#6b7280;">Número de rastreo</span>
          <span style="color:#111827;font-weight:500;">${trackingNumber}</span>
        </div>

        <!-- BOTÓN SECUNDARIO (RASTREAR) -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
          <tr>
            <td align="center">
              <a href="${trackingUrl}"
                style="
                  display:inline-block;
                  background-color:#22c55e;
                  color:#ffffff;
                  text-decoration:none;
                  padding:12px 24px;
                  border-radius:999px;
                  font-weight:600;
                  font-size:15px;
                ">
                Rastrear mi paquete
              </a>
            </td>
          </tr>
        </table>
      </div>
    `
      : `
      <p style="color:#6b7280; font-size:15px; text-align:center; margin:24px 0 0 0;">
        Te enviaremos una notificación en cuanto tu pedido haya sido enviado.
      </p>
    `;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pedido #${orderId} - Darmax</title>
</head>
<body style="margin:0; padding:0; background:#f5f6f8; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; padding:40px; box-shadow:0 6px 25px rgba(0,0,0,0.06);">

    <div style="text-align:center; margin-bottom:40px;">
      <img src="${logoUrl}" alt="Darmax" style="max-width:140px; height:auto;" />
    </div>

    <h1 style="font-size:26px; color:#111827; text-align:center; margin:0 0 12px 0;">
      Gracias por tu pedido, ${safeName}.
    </h1>
    <p style="font-size:15px; color:#4b5563; line-height:1.6; text-align:center; margin:0;">
      Hemos recibido tu pedido <strong>#${orderId}</strong> y lo estamos preparando para ti.
    </p>

    <!-- RESUMEN DEL PEDIDO -->
    <div style="background:#fafafa; padding:24px; border-radius:12px; margin:32px 0; border:1px solid #e5e7eb;">
      <h2 style="font-size:18px; color:#111827; font-weight:600; margin:0 0 18px 0; text-align:left;">
        Resumen del Pedido
      </h2>

      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e7eb; font-size:15px;">
        <span style="color:#6b7280;">Número de Pedido</span>
        <span style="color:#111827; font-weight:500;">#${orderId}</span>
      </div>

      ${
        paymentId
          ? `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e7eb; font-size:15px;">
        <span style="color:#6b7280;">ID de Pago</span>
        <span style="color:#111827; font-weight:500;">${paymentId}</span>
      </div>`
          : ""
      }

      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e7eb; font-size:15px;">
        <span style="color:#6b7280;">Fecha</span>
        <span style="color:#111827; font-weight:500;">${date}</span>
      </div>

      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e7eb; font-size:15px;">
        <span style="color:#6b7280;">Producto(s)</span>
        <span style="color:#111827; font-weight:500;">${product}</span>
      </div>

      <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:15px;">
        <span style="color:#6b7280;">Total</span>
        <span style="color:#111827; font-weight:600;">${total}</span>
      </div>
    </div>

    ${shippingInfoHtml}

    <!-- BOTÓN PRINCIPAL VER MIS PEDIDOS -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:10px;">
      <tr>
        <td align="center">
          <a href="${url}"
            style="
              display:inline-block;
              background-color:#2563eb;
              color:#ffffff;
              text-decoration:none;
              padding:14px 32px;
              border-radius:999px;
              font-weight:600;
              font-size:16px;
              margin-top:10px;
            ">
            Ver mis pedidos
          </a>
        </td>
      </tr>
    </table>

    <!-- FOOTER -->
    <div style="text-align:center; padding:32px 0 10px; color:#9ca3af; font-size:13px;">
      Si tienes alguna pregunta, por favor
      <a href="mailto:${process.env.GMAIL_USER || "soporte@darmax.mx"}" style="color:#2563eb; text-decoration:none;">
        contacta con nosotros
      </a>.<br />
      © ${year} Darmax. Todos los derechos reservados.
    </div>

  </div>
</body>
</html>
`;
};
