// server/controllers/zoomController.js
import { zoomRequest } from "../utils/zoomClient.js";

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
    const { userId = "me", topic, start_time, duration } = req.body;

    if (!topic || !start_time || !duration) {
      return res.status(400).json({
        message: "Faltan campos requeridos: topic, start_time, duration",
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

    return res.json(r.data);
  } catch (e) {
    console.error(e); // Log the full error to the console
    return res.status(500).json({
      message: "Error creando meeting Zoom",
      error: e?.response?.data || e.message,
    });
  }
}
