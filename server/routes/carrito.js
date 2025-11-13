import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware para validar el token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: "No autorizado. Token no proporcionado." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido o expirado." });
    }
    req.user = user; // El payload del token (ej: { userId, email, name })
    next();
  });
};

// Aplicar el middleware de autenticación a todas las rutas del carrito
router.use(authenticateToken);

// GET /api/carrito
// Obtener todos los items del carrito del usuario actual
router.get("/", async (req, res) => {
  try {
    const carritoItems = await prisma.carritoItem.findMany({
      where: { userId: req.user.userId },
      include: { producto: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(carritoItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/carrito
// Añadir un producto al carrito o actualizar su cantidad
router.post("/", async (req, res) => {
  const { productoId, cantidad } = req.body;

  if (!productoId || !cantidad || cantidad <= 0) {
    return res.status(400).json({ message: "ID del producto y cantidad (mayor a 0) son obligatorios." });
  }

  try {
    const itemActualizado = await prisma.carritoItem.upsert({
      where: {
        userId_productoId: {
          userId: req.user.userId,
          productoId: parseInt(productoId),
        },
      },
      update: {
        cantidad: {
          increment: parseInt(cantidad),
        },
      },
      create: {
        userId: req.user.userId,
        productoId: parseInt(productoId),
        cantidad: parseInt(cantidad),
      },
      include: {
        producto: true,
      }
    });
    res.status(200).json(itemActualizado);
  } catch (error) {
    console.error("Error upserting cart item:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/carrito/:productoId
// Actualizar la cantidad de un producto específico en el carrito
router.put("/:productoId", async (req, res) => {
    const { productoId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número mayor a 0." });
    }

    try {
        const itemActualizado = await prisma.carritoItem.update({
            where: {
                userId_productoId: {
                    userId: req.user.userId,
                    productoId: parseInt(productoId),
                },
            },
            data: {
                cantidad: parseInt(cantidad),
            },
        });
        res.json(itemActualizado);
    } catch (error) {
        res.status(404).json({ message: "El producto no se encontró en el carrito." });
    }
});


// DELETE /api/carrito/:productoId
// Eliminar un producto del carrito
router.delete("/:productoId", async (req, res) => {
  const { productoId } = req.params;
  try {
    await prisma.carritoItem.delete({
      where: {
        userId_productoId: {
          userId: req.user.userId,
          productoId: parseInt(productoId),
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "El producto no se encontró en el carrito." });
  }
});

// DELETE /api/carrito
// Limpiar todo el carrito del usuario
router.delete("/", async (req, res) => {
    try {
        await prisma.carritoItem.deleteMany({
            where: { userId: req.user.userId },
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});

export default router;
