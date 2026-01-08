// server/controllers/zoomController.js
import { zoomRequest } from "../utils/zoomClient.js";
import { sendEmail } from "../utils/mailer.js";
import prisma from '../prisma.js'; // Import prisma
import { getZoomMeetingEmailTemplate } from "../utils/templates/zoomEmailTemplate.js";
import { getAdminMeetingNotificationEmailTemplate } from "../utils/templates/adminMeetingNotificationTemplate.js"; // Import admin template
import { verifyRecaptcha } from "../utils/recaptcha.js";

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

// New endpoint to get meetings by date
export async function getMeetingsByDate(req, res) {
  try {
    const { date } = req.query; // Expects YYYY-MM-DD format

    if (!date) {
      return res.status(400).json({ message: "Se requiere la fecha (YYYY-MM-DD)." });
    }

    // A safer way to create a date object that is timezone-agnostic (parses as UTC).
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const meetings = await prisma.meeting.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        startTime: true,
        duration: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(meetings);
  } catch (e) {
    console.error("Error obteniendo reuniones por fecha:", e);
    res.status(500).json({ message: "Error del servidor al obtener reuniones." });
  }
}


export async function createMeeting(req, res) {
  try {
    const {
      userId = "me",
      topic,
      start_time_local, // Changed from start_time
      timezone, // Added timezone
      duration,
      email,
      nombre,
      telefono,
      captchaToken,
    } = req.body;

    if (!topic || !start_time_local || !timezone || !duration || !email || !nombre || !telefono) {
      return res.status(400).json({
        message:
          "Faltan campos requeridos: topic, start_time_local, timezone, duration, email, nombre, telefono",
      });
    }

    // Verify reCAPTCHA
    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
      return res.status(400).json({ message: "Verificación de reCAPTCHA fallida. Por favor intenta de nuevo." });
    }

    const r = await zoomRequest({
      method: "POST",
      url: `/users/${encodeURIComponent(userId)}/meetings`,
      data: {
        topic,
        type: 2,
        start_time: start_time_local, // Use local time
        timezone, // And specify timezone
        duration,
        settings: { join_before_host: false },
      },
    });

    const meeting = r.data;
    const meetingStartTime = new Date(meeting.start_time);

    // Save meeting to database
    await prisma.meeting.create({
      data: {
        topic: meeting.topic,
        startTime: meetingStartTime,
        duration: Number(duration),
        joinUrl: meeting.join_url,
        participantName: nombre,
        participantEmail: email,
        participantPhone: telefono,
      },
    });

    // Formatear la fecha y hora para los correos
    const formattedDate = meetingStartTime.toLocaleDateString("es-MX", {
      dateStyle: "full",
      timeZone: "America/Mexico_City",
    });
    const formattedTime = meetingStartTime.toLocaleTimeString("es-MX", {
      timeStyle: "short",
      hour12: true,
      timeZone: "America/Mexico_City",
    });

    // 1. Enviar correo de confirmación al usuario
    const userEmailHtml = getZoomMeetingEmailTemplate({
      name: nombre,
      topic: meeting.topic,
      startDate: formattedDate,
      startTime: formattedTime,
      joinUrl: meeting.join_url,
      telefono: telefono,
    });

    await sendEmail({
      to: email,
      subject: `Confirmación de tu reunión: ${meeting.topic}`,
      html: userEmailHtml,
    });

    // 2. Enviar correo de notificación al admin
    const adminEmailHtml = getAdminMeetingNotificationEmailTemplate({
      name: nombre,
      email: email,
      phone: telefono,
      topic: meeting.topic,
      startDate: formattedDate,
      startTime: formattedTime,
      joinUrl: meeting.join_url,
    });

    await sendEmail({
      to: "darmaxaguameli@gmail.com", // Admin email address
      subject: `NUEVA CITA AGENDADA: ${meeting.topic} con ${nombre}`,
      html: adminEmailHtml,
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
