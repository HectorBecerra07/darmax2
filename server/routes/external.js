import express from "express";
import prisma from "../prisma.js";
import externalAuthMiddleware from "../middleware/externalAuth.js";
import { sendEmail } from "../utils/mailer.js";
import { getCotizacionEmailTemplate } from "../utils/templates/cotizacionEmailTemplate.js";

const router = express.Router();

// Aplica autenticacion de Bearer Token / API Key a todos los endpoints de este router
router.use(externalAuthMiddleware);

const EXTERNAL_COTIZACIONES_URL =
  process.env.COTIZACIONES_API_URL ||
  "https://ventas-darmax-gestion.vercel.app/api/external/cotizaciones";

/**
 * GET /api/external/productos
 * Permite a la IA consultar catalogo de productos con filtros de busqueda
 */
router.get("/productos", async (req, res) => {
  try {
    const { q, categoriaId, limit = 50, page = 1 } = req.query;

    const take = Math.min(Math.max(Number(limit) || 50, 1), 100);
    const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

    const where = {};

    if (categoriaId) {
      where.categoriaId = Number(categoriaId);
    }

    if (q && typeof q === "string") {
      where.OR = [
        { nombre: { contains: q.trim(), mode: "insensitive" } },
        { descripcion: { contains: q.trim(), mode: "insensitive" } },
      ];
    }

    const [total, productos] = await Promise.all([
      prisma.producto.count({ where }),
      prisma.producto.findMany({
        where,
        take,
        skip,
        include: {
          categoria: {
            select: { id: true, nombre: true },
          },
          imagenes: {
            select: { id: true, url: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      success: true,
      data: productos,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("Error al consultar productos para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener productos.",
      error: error.message,
    });
  }
});

/**
 * GET /api/external/productos/:id
 * Consulta detalle de un producto individual
 */
router.get("/productos/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID de producto invalido." });
    }

    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: { id: true, nombre: true },
        },
        imagenes: {
          select: { id: true, url: true },
        },
      },
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado." });
    }

    res.json({ success: true, data: producto });
  } catch (error) {
    console.error("Error al obtener detalle de producto para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor al obtener producto.",
      error: error.message,
    });
  }
});

/**
 * GET /api/external/configurador/modelos
 * Consulta modelos de maquinas de agua y sus extras disponibles
 */
router.get("/configurador/modelos", async (req, res) => {
  try {
    const modelos = await prisma.machineModel.findMany({
      include: {
        extras: {
          include: {
            extra: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const formatted = modelos.map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      basePrice: m.basePrice,
      description: m.description,
      features: m.features,
      isAtlantis: m.isAtlantis,
      vendingType: m.vendingType,
      extrasDisponibles: m.extras.map((me) => ({
        id: me.extra.id,
        code: me.extra.code,
        name: me.extra.name,
        description: me.extra.description,
        price: me.priceOverride ?? me.extra.basePrice,
        isDefault: me.isDefault,
        isRequired: me.isRequired,
        isTinaco: me.extra.isTinaco,
      })),
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error al consultar configurador para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener modelos del configurador.",
      error: error.message,
    });
  }
});

/**
 * GET /api/external/cotizaciones
 * Permite a la IA buscar cotizaciones existentes por folio, correo o telefono
 */
router.get("/cotizaciones", async (req, res) => {
  try {
    const { folio, correo, telefono, limit = 20 } = req.query;

    const where = {};
    if (folio) {
      where.folio = Number(folio);
    }
    if (correo && typeof correo === "string") {
      where.correo = { contains: correo.trim().toLowerCase(), mode: "insensitive" };
    }
    if (telefono && typeof telefono === "string") {
      const cleanPhone = telefono.replace(/\D/g, "");
      where.telefono = { contains: cleanPhone.slice(-8) };
    }

    const cotizaciones = await prisma.cotizacion.findMany({
      where,
      take: Math.min(Math.max(Number(limit) || 20, 1), 50),
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, total: cotizaciones.length, data: cotizaciones });
  } catch (error) {
    console.error("Error al consultar cotizaciones para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error al consultar cotizaciones.",
      error: error.message,
    });
  }
});

/**
 * POST /api/external/cotizaciones
 * Permite a la IA registrar una cotizacion directamente
 */
router.post("/cotizaciones", async (req, res) => {
  try {
    const {
      cliente,
      costos,
      extrasSeleccionados = [],
      diasValidez = 7,
      nombreAsesor = "Asistente IA",
    } = req.body;

    if (!cliente || !cliente.nombre || !cliente.telefono || !cliente.correo || !cliente.cp) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos del cliente (nombre, telefono, correo o cp).",
      });
    }

    if (!costos || !costos.modeloNombre) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos del modelo a cotizar (costos.modeloNombre).",
      });
    }

    // Vincular al usuario si ya existe por correo
    let resolvedUserId = null;
    const existingUser = await prisma.user.findUnique({
      where: { email: cliente.correo.trim().toLowerCase() },
      select: { id: true },
    });
    if (existingUser) {
      resolvedUserId = existingUser.id;
    }

    // Enviar peticion al sistema de gestion de ventas externo (ventas-darmax-gestion)
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
        id: String(e.id || ""),
        name: String(e.name || "Componente extra"),
        basePrice: Number(e.basePrice ?? e.priceOverride ?? 0),
      })),
      diasValidez: Number(diasValidez) || 7,
      nombreAsesor,
    };

    let externalData = null;
    try {
      const response = await fetch(EXTERNAL_COTIZACIONES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(externalPayload),
      });
      externalData = await response.json();
    } catch (extError) {
      console.warn("Fallo conexion con API de ventas-darmax-gestion:", extError.message);
    }

    const folioAsignado =
      externalData && externalData.folio
        ? Number(externalData.folio)
        : Math.floor(1000 + (Date.now() % 90000));

    const publicUrlAsignada =
      externalData && externalData.publicUrl
        ? externalData.publicUrl
        : `https://ventas-darmax-gestion.vercel.app/cotizacion/${folioAsignado}`;

    const precioModelo = Number(costos.modelo) || 0;
    const precioExtras = (extrasSeleccionados || []).reduce(
      (acc, curr) => acc + Number(curr.basePrice ?? curr.priceOverride ?? 0),
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
        userId: resolvedUserId,
      },
    });

    if (nuevaCotizacion.correo) {
      try {
        const emailHtml = getCotizacionEmailTemplate({
          nombre: nuevaCotizacion.nombreCliente,
          folio: nuevaCotizacion.folio,
          modeloNombre: nuevaCotizacion.modeloNombre,
          precioModelo: nuevaCotizacion.precioModelo,
          precioExtras: nuevaCotizacion.precioExtras,
          total: nuevaCotizacion.total,
          diasValidez: nuevaCotizacion.diasValidez,
          extras: nuevaCotizacion.extras,
          publicUrl: nuevaCotizacion.publicUrl,
        });

        await sendEmail({
          to: nuevaCotizacion.correo,
          subject: `Cotización #${nuevaCotizacion.folio} - Darmax`,
          html: emailHtml,
        });
      } catch (mailErr) {
        console.error("Error al enviar correo de cotizacion externa:", mailErr);
      }
    }

    res.status(201).json({
      success: true,
      message: "Cotizacion creada exitosamente.",
      data: nuevaCotizacion,
    });
  } catch (error) {
    console.error("Error al crear cotizacion para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error al procesar la cotizacion.",
      error: error.message,
    });
  }
});

/**
 * GET /api/external/pedidos
 * Permite a la IA consultar el estado de pedidos por orden, email o telefono
 */
router.get("/pedidos", async (req, res) => {
  try {
    const { orden, email, telefono, limit = 20 } = req.query;

    const where = {};
    if (orden && typeof orden === "string") {
      where.orden = orden.trim();
    }
    if (email && typeof email === "string") {
      where.clienteEmail = { contains: email.trim().toLowerCase(), mode: "insensitive" };
    }
    if (telefono && typeof telefono === "string") {
      const cleanPhone = telefono.replace(/\D/g, "");
      where.clienteTelefono = { contains: cleanPhone.slice(-8) };
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      take: Math.min(Math.max(Number(limit) || 20, 1), 50),
      include: {
        productos: {
          include: {
            producto: {
              select: { id: true, nombre: true, precio: true },
            },
          },
        },
        envio: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, total: pedidos.length, data: pedidos });
  } catch (error) {
    console.error("Error al consultar pedidos para externos:", error);
    res.status(500).json({
      success: false,
      message: "Error al consultar pedidos.",
      error: error.message,
    });
  }
});

export default router;
