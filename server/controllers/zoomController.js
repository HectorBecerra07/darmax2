// server/controllers/zoomController.js
import { zoomRequest } from "../utils/zoomClient.js";
import { sendEmail } from "../utils/mailer.js";

export async function listUsers(req, res) {
  try {
    const r = await zoomRequest({ method: "GET", url: "/users" });
    return res.json(r.data);
  } catch (e) {
    return res.status(500).json({
      message: "Error listando usuarios Zoom",
      error: e?.response?.data || e.message,
    });
  }
}

export async function createMeeting(req, res) {
  try {
    const {
      userId = "me",
      topic,
      start_time,
      duration,
      email,
      nombre,
    } = req.body;

    if (!topic || !start_time || !duration || !email || !nombre) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: topic, start_time, duration, email, nombre",
      });
    }

    const r = await zoomRequest({
      method: "POST",
      url: `/users/${encodeURIComponent(userId)}/meetings`,
      data: {
        topic,
        type: 2,
        start_time,
        duration,
        settings: { join_before_host: false },
      },
    });

    const meeting = r.data;

    // Formatear la fecha y hora para el correo
    const meetingStartTime = new Date(meeting.start_time);
    const formattedDate = meetingStartTime.toLocaleDateString("es-MX", {
      dateStyle: "full",
    });
    const formattedTime = meetingStartTime.toLocaleTimeString("es-MX", {
      timeStyle: "short",
      hour12: true,
    });

    // Enviar correo de confirmación
    await sendEmail({
      to: email,
      subject: `Confirmación de tu reunión: ${meeting.topic}`,
      html: `
        <h1>¡Hola, ${nombre}!</h1>
        <p>Tu reunión ha sido confirmada con éxito.</p>
        <p><strong>Tema:</strong> ${meeting.topic}</p>
        <p><strong>Fecha:</strong> ${formattedDate}</p>
        <p><strong>Hora:</strong> ${formattedTime}</p>
        <p>Puedes unirte a la reunión haciendo clic en el siguiente enlace:</p>
        <a href="${meeting.join_url}">${meeting.join_url}</a>
        <p>¡Esperamos verte!</p>
      `,
    });

    return res.json(meeting);
  } catch (e) {
    console.error(e); // Log the full error to the console
    return res.status(500).json({
      message: "Error creando meeting Zoom",
      error: e?.response?.data || e.message,
    });
  }
}
