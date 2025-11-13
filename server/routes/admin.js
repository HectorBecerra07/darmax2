import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

// Ruta de prueba
router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "Admin API OK" });
});

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validación rápida
  if (!email || !password) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
  }

  try {
    // Buscar admin en la BD
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Comparar contraseña con el hash
    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si todo bien, devolvemos datos básicos
    return res.json({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error en /api/admin/login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;
