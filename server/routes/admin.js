import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

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
