// server/utils/templates/cotizacionEmailTemplate.js

const WHATSAPP_PHONE = "525519655369";

export const getCotizacionEmailTemplate = ({
  nombre = "Cliente",
  folio = "",
  modeloNombre = "Equipo Darmax",
  precioModelo = 0,
  precioExtras = 0,
  total = 0,
  extras = [],
  telefono = "",
  cp = "",
  diasValidez = 7,
  logoUrl = "https://res.cloudinary.com/defkuaytw/image/upload/v1765489832/logo_darmax_vzpony.png",
  bannerUrl = "https://res.cloudinary.com/defkuaytw/image/upload/v1765489833/banner_klsini.png",
}) => {
  const year = new Date().getFullYear();
  const safeName = nombre || "Cliente";

  const toMoney = (n) =>
    Number(n || 0).toLocaleString("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  const extrasList = Array.isArray(extras) ? extras : [];
  const extrasHtml =
    extrasList.length > 0
      ? `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:12px;border-top:1px dashed #e2e8f0;padding-top:12px;">
          <tr>
            <td colspan="2" style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;padding-bottom:6px;">
              Extras Seleccionados (${extrasList.length})
            </td>
          </tr>
          ${extrasList
            .map((e) => {
              const name = e.name || e.extra?.name || "Componente extra";
              const price = Number(e.basePrice ?? e.priceOverride ?? e.extra?.basePrice ?? 0);
              return `
              <tr>
                <td style="font-size:13px;color:#334155;padding:4px 0;">- ${name}</td>
                <td align="right" style="font-size:13px;font-weight:600;color:#0f172a;padding:4px 0;">$${toMoney(price)} MXN</td>
              </tr>`;
            })
            .join("")}
        </table>`
      : "";

  const whatsappMessage = encodeURIComponent(
    `¡Hola DARMAX! Quisiera dar seguimiento a mi cotización #${folio} (${modeloNombre}) por un total de $${toMoney(
      total
    )} MXN que generé en el sitio web.`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${whatsappMessage}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Cotización #${folio} - Darmax</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0;padding:32px 0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
    <tr>
      <td align="center">

        <!-- Contenedor Principal -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">

          <!-- BANNER SUPERIOR CON LOGO -->
          <tr>
            <td align="center"
              background="${bannerUrl}"
              style="
                padding:28px 16px;
                background-image:url('${bannerUrl}');
                background-size:cover;
                background-position:center;
                background-repeat:no-repeat;
                background-color:#0f172a;
              ">
              <img src="${logoUrl}" alt="Darmax Agua"
                style="
                  display:block;
                  max-width:96px;
                  height:auto;
                  border-radius:999px;
                  padding:6px;
                  background:#ffffff;
                  box-shadow:0 6px 16px rgba(0,0,0,0.25);
                " />
            </td>
          </tr>

          <!-- CONTENIDO DEL CORREO -->
          <tr>
            <td style="padding:32px 28px 24px 28px;">

              <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.3;color:#0f172a;font-weight:800;text-align:center;">
                Tu Cotización Darmax
              </h1>

              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#475569;text-align:center;">
                Hola <strong>${safeName}</strong>, gracias por tu interés en nuestros equipos. A continuación te compartimos el resumen detallado de tu cotización:
              </p>

              <!-- AVISO DEL NÚMERO DE COTIZACIÓN -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="background-color:#fef3c7;border:1px solid #fde68a;border-radius:14px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 18px;text-align:center;">
                    <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#92400e;display:block;margin-bottom:4px;">
                      Número de Cotización
                    </span>
                    <span style="font-size:26px;font-weight:900;color:#78350f;letter-spacing:-0.02em;display:block;">
                      #${folio}
                    </span>
                    <p style="margin:6px 0 0 0;font-size:12px;color:#92400e;line-height:1.4;">
                      Guarda este número para cualquier consulta o para dar seguimiento directo con tu asesor.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- TABLA DE DESGLOSE DE COTIZACIÓN -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;margin-bottom:24px;padding:18px;">
                <tr>
                  <td style="padding-bottom:12px;">
                    <span style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;display:block;margin-bottom:4px;">
                      Equipo Seleccionado
                    </span>
                    <span style="font-size:16px;font-weight:800;color:#0f172a;display:block;">
                      ${modeloNombre}
                    </span>
                  </td>
                  <td align="right" style="padding-bottom:12px;vertical-align:bottom;">
                    <span style="font-size:15px;font-weight:800;color:#0f172a;">
                      $${toMoney(precioModelo)} MXN
                    </span>
                  </td>
                </tr>

                ${extrasHtml}

                <tr>
                  <td colspan="2" style="border-top:2px solid #cbd5e1;padding-top:14px;margin-top:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td>
                          <span style="font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">
                            Inversión Total Estimada:
                          </span>
                        </td>
                        <td align="right">
                          <span style="font-size:20px;font-weight:900;color:#168387;">
                            $${toMoney(total)} MXN
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- DATOS DE REGISTRO Y VIGENCIA -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                style="margin-bottom:28px;font-size:12px;color:#64748b;line-height:1.6;">
                <tr>
                  <td style="padding:3px 0;"><strong>Teléfono de contacto:</strong> ${telefono || "No especificado"}</td>
                </tr>
                <tr>
                  <td style="padding:3px 0;"><strong>Código Postal de entrega:</strong> ${cp || "No especificado"}</td>
                </tr>
                <tr>
                  <td style="padding:3px 0;"><strong>Vigencia estimada:</strong> ${diasValidez} días naturales</td>
                </tr>
                <tr>
                  <td style="padding:3px 0;font-size:11px;color:#94a3b8;">
                    *Los costos no contemplan flete ni viáticos de instalación (se cotizan según tu ubicación exacta).
                  </td>
                </tr>
              </table>

              <!-- BOTÓN DE SEGUIMIENTO POR WHATSAPP -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer"
                      style="
                        display:inline-block;
                        padding:14px 32px;
                        font-size:14px;
                        font-weight:800;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:12px;
                        background-color:#25D366;
                        text-transform:uppercase;
                        letter-spacing:0.05em;
                        box-shadow:0 4px 12px rgba(37,211,102,0.3);
                      ">
                      Dar Seguimiento por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 24px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#475569;">
                Darmax Agua &copy; ${year}
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
                Plantas purificadoras de agua y máquinas vending para emprendedores en todo México.<br />
                Este es un correo automático generado al realizar tu cotización en nuestro sitio web.
              </p>
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
