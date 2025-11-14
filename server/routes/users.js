import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/me - Obtener perfil del usuario autenticado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: "Error del servidor al obtener el perfil." });
  }
});

// PUT /api/users/me - Actualizar perfil del usuario autenticado
router.put("/me", authMiddleware, async (req, res) => {
  const { calle, colonia, codigoPostal, ciudad, estadoEnvio, pais } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        calle,
        colonia,
        codigoPostal,
        ciudad,
        estadoEnvio,
        pais,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: "Error del servidor al actualizar el perfil." });
  }
});


// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password, telefono } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios." });
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "El correo electrónico ya está registrado." });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        telefono,
      },
    });

    // No devolver el hash de la contraseña
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error del servidor al registrar el usuario." });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });
  }

  try {
    // Encontrar al usuario
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // Verificar que el usuario tenga contraseña (no fue creado por admin o como invitado)
    if (!user.passwordHash) {
        return res.status(401).json({ message: "Esta cuenta no tiene una contraseña configurada." });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    // Crear y firmar el token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 24 horas
    );

    // No devolver el hash de la contraseña
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error del servidor al iniciar sesión." });
  }
});

export default router;
