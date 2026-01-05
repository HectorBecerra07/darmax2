// server/utils/templates/zoomEmailTemplate.js
import { getBaseEmailHtml } from './baseEmailTemplate.js';

export const getZoomMeetingEmailTemplate = ({
  name,
  topic,
  startTime,
  startDate,
  joinUrl,
}) => {
  const safeName = name || "participante";
  
  // Custom message with meeting details, without a main CTA button in the base template
  const mainMessage = `
    Tu reunión ha sido confirmada con éxito.
    <br/><br/>
    <strong>Tema:</strong> ${topic}<br/>
    <strong>Fecha:</strong> ${startDate}<br/>
    <strong>Hora:</strong> ${startTime}
  `;

  return getBaseEmailHtml({
    subject: `Confirmación de tu reunión: ${topic}`,
    mainTitle: `¡Hola, ${safeName}!`,
    mainMessage,
    ctaText: "Unirse a la Reunión",
    ctaUrl: joinUrl,
    footerMessage: `Si no solicitaste esta reunión, por favor ignora este correo. Para cualquier pregunta, `,
  });
};
