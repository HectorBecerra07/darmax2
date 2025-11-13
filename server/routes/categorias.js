import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/categorias
// Obtener todas las categorías
router.get("/", async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(categorias);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/categorias
// Crear una nueva categoría
router.post("/", async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }
  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    // Prisma error code for unique constraint violation
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe una categoría con este nombre.' });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// PUT /api/categorias/:id
// Actualizar una categoría existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }
  try {
    const categoriaActualizada = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { nombre },
    });
    res.json(categoriaActualizada);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Ya existe una categoría con este nombre.' });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// DELETE /api/categorias/:id
// Eliminar una categoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Opcional: verificar si la categoría está en uso antes de borrar.
    const productos = await prisma.producto.count({
        where: { categoriaId: parseInt(id) }
    });

    if (productos > 0) {
        return res.status(400).json({ message: `No se puede eliminar. La categoría está en uso por ${productos} producto(s).` });
    }

    await prisma.categoria.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;
