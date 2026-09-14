import express from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma.js";
import authMiddleware from "../middleware/auth.js";
import { sendEmail } from "../utils/mailer.js";
import { getCotizacionEmailTemplate } from "../utils/templates/cotizacionEmailTemplate.js";

const router = express.Router();
const EXTERNAL_COTIZACIONES_URL =
  process.env.COTIZACIONES_API_URL ||
  "https://ventas-darmax-gestion.vercel.app/api/external/cotizaciones";
const LIMITE_COTIZACIONES_MENSUALES = 3;

// Helper para extraer el ID de usuario si viene token Bearer en la peticion
const extractUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId || null;
  } catch {
    return null;
  }
};

// Helper para calcular el rango de fechas del mes en curso
const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
};

// Helper para contar cotizaciones del mes actual para un usuario, correo o telefono
const contarCotizacionesMes = async ({ userId, correo, telefono }) => {
  const { startOfMonth, endOfMonth } = getCurrentMonthRange();
  const orConditions = [];

  if (userId) {
    orConditions.push({ userId });
  }

  if (correo && correo.trim()) {
    orConditions.push({
      correo: { equals: correo.trim().toLowerCase(), mode: "insensitive" },
    });
  }

  if (telefono && telefono.trim()) {
    const cleanPhone = telefono.replace(/\D/g, "");
    if (cleanPhone.length >= 8) {
      orConditions.push({
        telefono: { contains: cleanPhone.slice(-8) },
      });
    }
  }

  if (orConditions.length === 0) {
    return 0;
  }

  return await prisma.cotizacion.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      OR: orConditions,
    },
  });
};

// GET /api/cotizaciones/limite - Consultar cotizaciones restantes del mes
router.get("/limite", async (req, res) => {
  try {
    const userId = extractUserId(req);
    const { correo, telefono } = req.query;

    const cotizacionesMes = await contarCotizacionesMes({
      userId,
      correo: typeof correo === "string" ? correo : undefined,
      telefono: typeof telefono === "string" ? telefono : undefined,
    });

    const restantes = Math.max(0, LIMITE_COTIZACIONES_MENSUALES - cotizacionesMes);

    res.json({
      limiteMensual: LIMITE_COTIZACIONES_MENSUALES,
      usadasEsteMes: cotizacionesMes,
      restantesEsteMes: restantes,
      alcanzoLimite: cotizacionesMes >= LIMITE_COTIZACIONES_MENSUALES,
    });
  } catch (error) {
    console.error("Error al consultar limite de cotizaciones:", error);
    res.status(500).json({
      message: "Error al consultar limite de cotizaciones.",
      error: error.message,
    });
  }
});

// GET /api/cotizaciones/mis-cotizaciones - Obtener las cotizaciones del usuario logueado
router.get("/mis-cotizaciones", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, telefono: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const orConditions = [{ userId: req.userId }];
    if (user.email) {
      orConditions.push({
        correo: { equals: user.email.toLowerCase(), mode: "insensitive" },
      });
    }

    const cotizaciones = await prisma.cotizacion.findMany({
      where: {
        OR: orConditions,
      },
      orderBy: { createdAt: "desc" },
    });

    const { startOfMonth, endOfMonth } = getCurrentMonthRange();
    const usadasEsteMes = cotizaciones.filter((c) => {
      const d = new Date(c.createdAt);
      return d >= startOfMonth && d <= endOfMonth;
    }).length;

    const restantesEsteMes = Math.max(0, LIMITE_COTIZACIONES_MENSUALES - usadasEsteMes);

    res.json({
      success: true,
      cotizaciones,
      total: cotizaciones.length,
      limiteMensual: LIMITE_COTIZACIONES_MENSUALES,
      usadasEsteMes,
      restantesEsteMes,
    });
  } catch (error) {
    console.error("Error al obtener mis cotizaciones:", error);
    res.status(500).json({
      message: "Error al obtener cotizaciones del usuario.",
      error: error.message,
    });
  }
});

// POST /api/cotizaciones - Registrar cotizacion con verificacion de cupo mensual (max 3)
router.post("/", async (req, res) => {
  try {
    const {
      cliente,
      costos,
      extrasSeleccionados = [],
      diasValidez = 7,
      nombreAsesor = "Configurador Web",
    } = req.body;

    if (!cliente || !cliente.nombre || !cliente.telefono || !cliente.correo || !cliente.cp) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos del cliente (nombre, teléfono, correo o CP).",
      });
    }

    if (!costos || !costos.modeloNombre) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos del modelo a cotizar.",
      });
    }

    const authenticatedUserId = extractUserId(req);

    // Si no hay userId directo pero el correo pertenece a un usuario existente, vincularlo
    let resolvedUserId = authenticatedUserId;
    if (!resolvedUserId && cliente.correo) {
      const existingUser = await prisma.user.findUnique({
        where: { email: cliente.correo.trim().toLowerCase() },
        select: { id: true },
      });
      if (existingUser) {
        resolvedUserId = existingUser.id;
      }
    }

    // 1. Validar límite estricto de 3 cotizaciones por mes
    const cotizacionesMes = await contarCotizacionesMes({
      userId: resolvedUserId,
      correo: cliente.correo,
      telefono: cliente.telefono,
    });

    if (cotizacionesMes >= LIMITE_COTIZACIONES_MENSUALES) {
      return res.status(429).json({
        success: false,
        message: `Has alcanzado el límite de ${LIMITE_COTIZACIONES_MENSUALES} cotizaciones por mes. Si requieres más detalles o asesoría personalizada, por favor contáctanos directamente por WhatsApp.`,
        limiteMensual: LIMITE_COTIZACIONES_MENSUALES,
        usadasEsteMes: cotizacionesMes,
        restantesEsteMes: 0,
      });
    }

    // 2. Enviar peticion al sistema de gestion de ventas
    const externalPayload = {
      cliente: {
        nombre: cliente.nombre.trim(),
        telefono: cliente.telefono.trim(),
        correo: cliente.correo.trim(),
        cp: cliente.cp.trim(),
      },
      costos: {
        modeloNombre: costos.modeloNombre,
        modelo: Number(costos.modelo) || 0,
      },
      extrasSeleccionados: (extrasSeleccionados || []).map((e) => ({
        id: String(e.id || e.extra?.id || ""),
        name: String(e.name || e.extra?.name || "Componente extra"),
        basePrice: Number(e.basePrice ?? e.priceOverride ?? e.extra?.basePrice ?? 0),
      })),
      diasValidez: Number(diasValidez) || 7,
      nombreAsesor,
    };

    let externalData = null;
    try {
      const response = await fetch(EXTERNAL_COTIZACIONES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(externalPayload),
      });

      externalData = await response.json();

      if (!response.ok || !externalData.success) {
        console.warn(
          "Respuesta no exitosa de la API externa de cotizaciones:",
          externalData
        );
      }
    } catch (extError) {
      console.error("Error al conectar con la API externa de cotizaciones:", extError);
    }

    // Si la API externa no devolvio folio, generar uno local de respaldo basado en timestamp
    const folioAsignado =
      externalData && externalData.folio
        ? Number(externalData.folio)
        : Math.floor(1000 + (Date.now() % 90000));

    const publicUrlAsignada =
      externalData && externalData.publicUrl
        ? externalData.publicUrl
        : `https://ventas-darmax-gestion.vercel.app/cotizacion/${folioAsignado}`;

    // 3. Calcular totales y guardar cotizacion en la base de datos PostgreSQL
    const precioModelo = Number(costos.modelo) || 0;
    const precioExtras = (extrasSeleccionados || []).reduce(
      (acc, curr) =>
        acc + Number(curr.basePrice ?? curr.priceOverride ?? curr.extra?.basePrice ?? 0),
      0
    );
    const total = precioModelo + precioExtras;

    const nuevaCotizacion = await prisma.cotizacion.create({
      data: {
        folio: folioAsignado,
        externalId: externalData?.id ? String(externalData.id) : null,
        nombreCliente: cliente.nombre.trim(),
        telefono: cliente.telefono.trim(),
        correo: cliente.correo.trim().toLowerCase(),
        cp: cliente.cp.trim(),
        modeloNombre: costos.modeloNombre,
        precioModelo,
        precioExtras,
        total,
        diasValidez: Number(diasValidez) || 7,
        extras: extrasSeleccionados,
        publicUrl: publicUrlAsignada,
        estado: "Activa",
        userId: resolvedUserId || null,
      },
    });

    // Enviar correo al cliente con la informacion de su cotizacion
    if (nuevaCotizacion.correo) {
      try {
        const emailHtml = getCotizacionEmailTemplate({
          nombre: nuevaCotizacion.nombreCliente,
          folio: nuevaCotizacion.folio,
          modeloNombre: nuevaCotizacion.modeloNombre,
          precioModelo: nuevaCotizacion.precioModelo,
          precioExtras: nuevaCotizacion.precioExtras,
          total: nuevaCotizacion.total,
          extras: extrasSeleccionados,
          telefono: nuevaCotizacion.telefono,
          cp: nuevaCotizacion.cp,
          diasValidez: nuevaCotizacion.diasValidez,
        });

        await sendEmail({
          to: nuevaCotizacion.correo,
          subject: `Tu Cotización #${nuevaCotizacion.folio} - Darmax`,
          html: emailHtml,
        });
        console.log(`Correo de cotizacion #${nuevaCotizacion.folio} enviado a: ${nuevaCotizacion.correo}`);
      } catch (mailError) {
        console.error("Error al enviar correo de cotizacion:", mailError.message);
      }
    }

    const nuevasUsadas = cotizacionesMes + 1;
    const nuevasRestantes = Math.max(0, LIMITE_COTIZACIONES_MENSUALES - nuevasUsadas);

    return res.status(201).json({
      success: true,
      folio: nuevaCotizacion.folio,
      publicUrl: nuevaCotizacion.publicUrl,
      cotizacionId: nuevaCotizacion.id,
      limiteMensual: LIMITE_COTIZACIONES_MENSUALES,
      usadasEsteMes: nuevasUsadas,
      restantesEsteMes: nuevasRestantes,
      message: `Cotización #${nuevaCotizacion.folio} registrada exitosamente.`,
    });
  } catch (error) {
    console.error("Error en POST /api/cotizaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la cotización.",
      error: error.message,
    });
  }
});

export default router;
