// server/utils/templates/orderEmailTemplate.js
export const getOrderEmailTemplate = ({
  name = "",
  orderId = "",
  paymentId = "",
  date = "",
  total = "",
  product = "",
  url = "#",
  logoUrl = "https://res.cloudinary.com/defkuaytw/image/upload/v1765489832/logo_darmax_vzpony.png",
  trackingNumber,
  trackingUrl,
  provider,
}) => {
  const year = new Date().getFullYear();
  const safeName = name || "cliente";
  const bannerUrl =
    "https://res.cloudinary.com/defkuaytw/image/upload/v1765489833/banner_klsini.png";

  const shippingInfoHtml =
    trackingNumber && trackingUrl && provider
      ? `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:24px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;background-color:#f7f7f7;border-radius:24px;">
              <tr>
                <td style="padding:28px 20px 24px 20px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                  <h2 style="margin:0 0 16px 0;font-size:19px;color:#111827;font-weight:700;">Información de envío</h2>

                  <p style="margin:4px 0;font-size:14px;color:#111827;">
                    <strong>Paquetería:</strong> ${provider}
                  </p>
                  <p style="margin:4px 0 20px 0;font-size:14px;color:#111827;">
                    <strong>Número de rastreo:</strong> ${trackingNumber}
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                    <tr>
                      <td align="center" bgcolor="#d3ff00" style="border-radius:999px;">
                        <a href="${trackingUrl}"
                          style="
                            display:inline-block;
                            padding:12px 28px;
                            font-size:14px;
                            font-weight:600;
                            color:#111827;
                            text-decoration:none;
                            border-radius:8px;
                            background-color:#d3ff00;
                            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
                          ">
                          Rastrear mi paquete
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`
      : `
      <p style="margin:20px 0 0 0;font-size:14px;color:#6b7280;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        Te enviaremos una notificación cuando tu pedido haya sido enviado.
      </p>
    `;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Pedido #${orderId} - Darmax</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:40px 0;background-color:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    <tr>
      <td align="center">

        <!-- Contenedor principal más angosto -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:520px;background-color:#ffffff;border-radius:18px;overflow:hidden;">

          <!-- HEADER con banner reducido -->
          <tr>
            <td align="center"
              background="${bannerUrl}"
              style="
                padding:0px 16px 0px 16px;
                background-image:url('${bannerUrl}');
                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
              ">
              <img src="${logoUrl}" alt="Darmax Agua"
                style="
                  display:block;
                  max-width:100px;
                  height:auto;
                  border-radius:999px;
                  padding:8px;
                  box-shadow:0 6px 18px rgba(0,0,0,0.35);
                " />
            </td>
          </tr>

          <!-- CONTENIDO PRINCIPAL REDUCIDO -->
          <tr>
            <td align="center" style="padding:0 28px 44px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">
                <tr>
                  <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;">

                    <h1 style="margin:24px 0 10px 0;font-size:24px;line-height:1.3;color:#111827;font-weight:700;">
                      Gracias por tu pedido, ${safeName}.
                    </h1>

                    <p style="margin:0 0 24px 0;font-size:14px;line-height:1.6;color:#4b5563;">
                      Hemos recibido tu pedido #${orderId} y lo estamos preparando para ti.<br />
                      Te enviaremos una notificación cuando haya sido enviado.
                    </p>

                    <!-- Tarjeta: Resumen -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                      style="max-width:480px;background-color:#f7f7f7;border-radius:22px;">
                      <tr>
                        <td style="padding:28px 20px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

                          <h2 style="margin:0 0 14px 0;font-size:19px;color:#111827;font-weight:700;">
                            Resumen del pedido
                          </h2>

                          <p style="margin:4px 0;font-size:14px;color:#111827;">
                            <strong>Número de Pedido:</strong> #${orderId}
                          </p>

                          ${
                            paymentId
                              ? `<p style="margin:4px 0;font-size:14px;color:#111827;">
                                  <strong>ID de Pago:</strong> ${paymentId}
                                </p>`
                              : ""
                          }

                          <p style="margin:4px 0;font-size:14px;color:#111827;">
                            <strong>Fecha:</strong> ${date}
                          </p>
                          <p style="margin:4px 0;font-size:14px;color:#111827;">
                            <strong>Producto(s):</strong> ${product}
                          </p>
                          <p style="margin:4px 0;font-size:14px;color:#111827;">
                            <strong>Total:</strong> ${total}
                          </p>

                        </td>
                      </tr>
                    </table>

                    ${shippingInfoHtml}

                    <p style="margin:28px 0 16px 0;font-size:14px;color:#4b5563;line-height:1.6;">
                      Puedes ver los detalles completos y el historial de tus pedidos en tu perfil.
                    </p>

                    <!-- Botón degradado -->
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin-bottom:8px;">
                      <tr>
                        <td align="center" style="border-radius:999px;overflow:hidden;">
                          <a href="${url}"
                            style="
                              display:inline-block;
                              padding:12px 36px;
                              font-size:14px;
                              font-weight:600;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:8px;
                              background-color:#004aad;
                              background-image:linear-gradient(90deg,#5de0e6 0%,#004aad 100%);
                              font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
                            ">
                            Ver mis pedidos
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:22px 0 4px 0;font-size:11px;color:#9ca3af;">
                      Si tienes alguna pregunta, por favor 
                      <a href="mailto:${process.env.GMAIL_USER ||
                        "soporte@darmax.mx"}"
                        style="color:#004aad;text-decoration:none;">
                        contacta con nosotros
                      </a>.
                    </p>

                    <p style="margin:0;font-size:11px;color:#9ca3af;">
                      © ${year} Darmax, Todos los derechos reservados.
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
