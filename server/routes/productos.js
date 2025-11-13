import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/productos
router.get("/", async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true, // Incluye la categoría relacionada
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(productos);
  } catch (error) {
    console.error("Error fetching productos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/productos
router.post("/", async (req, res) => {
  const { nombre, precio, descripcion, stock, imagen, categoriaId, pesoKg, largoCm, anchoCm, altoCm } = req.body;

  if (!nombre || !precio || !categoriaId) {
    return res.status(400).json({ message: "Nombre, precio y ID de categoría son obligatorios" });
  }

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        descripcion,
        stock,
        imagen,
        pesoKg,
        largoCm,
        anchoCm,
        altoCm,
        categoria: {
          connect: { id: parseInt(categoriaId) },
        },
      },
    });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("Error creating producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/productos/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, stock, imagen, categoriaId, pesoKg, largoCm, anchoCm, altoCm } = req.body;

  if (!nombre || !precio || !categoriaId) {
    return res.status(400).json({ message: "Nombre, precio y ID de categoría son obligatorios" });
  }

  try {
    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        precio,
        descripcion,
        stock,
        imagen,
        pesoKg,
        largoCm,
        anchoCm,
        altoCm,
        categoria: {
          connect: { id: parseInt(categoriaId) },
        },
      },
    });
    res.json(productoActualizado);
  } catch (error) {
    console.error("Error updating producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/productos/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.producto.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting producto:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
