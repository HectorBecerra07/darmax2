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
        imagenes: true, // Incluye la galería de imágenes
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(productos);
  } catch (error) {
    console.error("Error fetching productos:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// GET /api/productos/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        imagenes: true,
      },
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// POST /api/productos
router.post("/", async (req, res) => {
  const { nombre, precio, descripcion, stock, imagen, categoriaId, pesoKg, largoCm, anchoCm, altoCm, imagenes } = req.body;

  if (!nombre || !precio || !categoriaId) {
    return res.status(400).json({ message: "Nombre, precio y ID de categoría son obligatorios" });
  }

  try {
    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        descripcion,
        stock: Number(stock),
        imagen: imagen || null, // Allow null for main image
        pesoKg: pesoKg ? Number(pesoKg) : null,
        largoCm: largoCm ? Number(largoCm) : null,
        anchoCm: anchoCm ? Number(anchoCm) : null,
        altoCm: altoCm ? Number(altoCm) : null,
        categoria: {
          connect: { id: parseInt(categoriaId) },
        },
        imagenes: {
          create: imagenes?.map(img => ({ url: img.url })) || [],
        },
      },
      include: {
        imagenes: true, // Include the new images in the response
      }
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
  const { nombre, precio, descripcion, stock, imagen, categoriaId, pesoKg, largoCm, anchoCm, altoCm, imagenes } = req.body;

  if (!nombre || !precio || !categoriaId) {
    return res.status(400).json({ message: "Nombre, precio y ID de categoría son obligatorios" });
  }

  try {
    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        precio: Number(precio),
        descripcion,
        stock: Number(stock),
        imagen: imagen || null,
        pesoKg: pesoKg ? Number(pesoKg) : null,
        largoCm: largoCm ? Number(largoCm) : null,
        anchoCm: anchoCm ? Number(anchoCm) : null,
        altoCm: altoCm ? Number(altoCm) : null,
        categoria: {
          connect: { id: parseInt(categoriaId) },
        },
        imagenes: {
          deleteMany: {}, // Delete all existing related images
          create: imagenes?.map(img => ({ url: img.url })) || [], // Create new ones
        },
      },
      include: {
        imagenes: true,
        categoria: true,
      },
    });

    res.status(200).json(productoActualizado);
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

// POST /api/productos/validate
router.post("/validate", async (req, res) => {
    const { productIds } = req.body;
  
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ message: "Se esperaba un array de productIds." });
    }
  
    if (productIds.length === 0) {
      return res.json({ validProducts: [] });
    }
  
    try {
      const availableProducts = await prisma.producto.findMany({
        where: {
          id: {
            in: productIds,
          },
          stock: {
            gt: 0,
          },
        },
        select: {
          id: true,
          nombre: true,
          stock: true,
        },
      });
  
      res.json({ validProducts: availableProducts });
    } catch (error) {
      console.error("Error validating products:", error);
      res.status(500).json({ message: "Error del servidor al validar productos." });
    }
  });

export default router;
