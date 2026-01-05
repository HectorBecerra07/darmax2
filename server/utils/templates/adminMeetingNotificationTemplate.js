// server/utils/templates/adminMeetingNotificationTemplate.js
import { getBaseEmailHtml } from './baseEmailTemplate.js';

export const getAdminMeetingNotificationEmailTemplate = ({
  name,
  email,
  phone,
  topic,
  startDate,
  startTime,
  joinUrl,
}) => {
  // Custom message with meeting details for the admin
  const mainMessage = `
    Se ha agendado una nueva reunión de Zoom.
    <br/><br/>
    <strong>Detalles del Participante:</strong><br/>
    Nombre: ${name}<br/>
    Email: ${email}<br/>
    Teléfono: ${phone}<br/>
    <br/>
    <strong>Detalles de la Reunión:</strong><br/>
    Tema: ${topic}<br/>
    Fecha: ${startDate}<br/>
    Hora: ${startTime}<br/>
    Enlace para unirse: <a href="${joinUrl}">${joinUrl}</a>
  `;

  return getBaseEmailHtml({
    subject: `NUEVA CITA AGENDADA: ${topic} con ${name}`,
    mainTitle: `¡Nueva Reunión Agendada!`,
    mainMessage,
    // No CTA button needed for admin notification, so set ctaUrl to '#' and text to empty or similar
    ctaText: "Ver Detalles de la Reunión",
    ctaUrl: joinUrl, // Link directly to the meeting in case admin needs to join
    footerMessage: `Revisar en el panel de administración o contactar al cliente.`,
  });
};
