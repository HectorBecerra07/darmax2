// server/utils/templates/orderEmailTemplate.js
export const getOrderEmailTemplate = ({
  name,
  orderId,
  date,
  total,
  product,
  url,
}) => {
  const year = new Date().getFullYear();

  let html = `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Pedido #{{ORDER_ID}} - Darmax</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;">
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
        
        <!-- Header -->
        <div style="background:#111827;color:#ffffff;padding:20px 30px;font-size:20px;font-weight:700;">
          Darmax
        </div>

        <!-- Body -->
        <div style="padding:30px;color:#111827;font-size:15px;line-height:1.7;">
          <h2 style="margin-top:0;font-size:22px;font-weight:700;">
            ¡Hola {{NAME}}! 👋
          </h2>

          <p>
            Gracias por usar <strong>Darmax</strong>. Hemos recibido tu pedido y ya estamos procesándolo.
            Aquí tienes un resumen:
          </p>

          <div style="margin:20px 0;padding:15px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;">
            <p style="margin:5px 0;"><strong>Pedido:</strong> #{{ORDER_ID}}</p>
            <p style="margin:5px 0;"><strong>Fecha:</strong> {{DATE}}</p>
            <p style="margin:5px 0;"><strong>Total:</strong> {{TOTAL}}</p>
            <p style="margin:5px 0;"><strong>Producto/servicio:</strong> {{PRODUCT}}</p>
          </div>

          <div style="text-align:center;margin-top:25px;">
            <a href="{{CTA_URL}}" style="
              display:inline-block;
              background:#4f46e5;
              color:#ffffff;
              text-decoration:none;
              padding:12px 24px;
              border-radius:8px;
              font-weight:600;
              box-shadow:0 4px 14px rgba(79,70,229,.25);
            ">
              Ver estado del pedido
            </a>
          </div>

          <p style="margin-top:25px;font-size:13px;color:#6b7280;">
            Si tienes dudas puedes responder a este correo.  
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:15px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;">
          © {{YEAR}} Darmax — Todos los derechos reservados
        </div>

      </div>
    </div>
  </body>
</html>
  `;

  // reemplazos
  html = html.replace(/{{NAME}}/g, name || "");
  html = html.replace(/{{ORDER_ID}}/g, String(orderId || ""));
  html = html.replace(/{{DATE}}/g, date || "");
  html = html.replace(/{{TOTAL}}/g, String(total || ""));
  html = html.replace(/{{PRODUCT}}/g, product || "");
  html = html.replace(/{{CTA_URL}}/g, url || "#");
  html = html.replace(/{{YEAR}}/g, String(year));

  return html;
};
