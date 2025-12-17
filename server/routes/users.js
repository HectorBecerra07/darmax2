import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --- USER PROFILE ROUTES ---

// GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor al obtener el perfil." });
  }
});

// PUT /api/users/me
router.put("/me", authMiddleware, async (req, res) => {
  const { calle, colonia, codigoPostal, ciudad, estadoEnvio, pais } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { calle, colonia, codigoPostal, ciudad, estadoEnvio, pais },
    });
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor al actualizar el perfil." });
  }
});

// --- AUTHENTICATION FLOW ---

// POST /api/users/register
router.post("/register", async (req, res) => {
  const { name, email, password, telefono } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nombre, email y contraseña son obligatorios." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.emailVerified) {
      return res.status(409).json({ message: "El correo electrónico ya está registrado y verificado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    
    let user;
    if (existingUser) { // User exists but is not verified
      user = await prisma.user.update({
        where: { email },
        data: { name, passwordHash, telefono, verificationToken },
      });
    } else { // New user
      user = await prisma.user.create({
        data: { name, email, passwordHash, telefono, verificationToken },
      });
    }

    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h1>¡Bienvenido a Darmax!</h1>
      <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>Si no te registraste, por favor ignora este correo.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: "Verifica tu correo electrónico en Darmax",
      html: emailHtml,
    });

    res.status(201).json({ message: "Registro casi completo. Por favor, revisa tu correo para verificar tu cuenta." });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error del servidor al registrar el usuario." });
  }
});

// GET /api/users/verify-email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token de verificación no proporcionado." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: String(token) },
    });

    if (!user) {
      return res.status(404).json({ message: "Token de verificación inválido o ya utilizado." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Clear the token after use
      },
    });

    res.status(200).json({ message: "¡Correo verificado exitosamente!" });
  } catch (error) {
    console.error("Error al verificar correo:", error);
    res.status(500).json({ message: "Error del servidor al verificar el correo." });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son obligatorios." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }
    
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Por favor, verifica tu correo electrónico antes de iniciar sesión." });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error del servidor al iniciar sesión." });
  }
});

// --- PASSWORD RESET FLOW ---

// POST /api/users/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "El correo es obligatorio." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return a success message to prevent user enumeration attacks
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      await prisma.user.update({
        where: { email },
        data: { resetToken, resetTokenExpiry },
      });

      const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
      const emailHtml = `
        <h1>Solicitud de recuperación de contraseña</h1>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>El enlace expirará en 1 hora. Si no solicitaste esto, puedes ignorar este correo.</p>
      `;

      await sendEmail({
        to: user.email,
        subject: "Recuperación de contraseña de Darmax",
        html: emailHtml,
      });
    }

    res.status(200).json({ message: "Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación." });

  } catch (error) {
    console.error("Error en forgot-password:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

// POST /api/users/reset-password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "El token y la nueva contraseña son obligatorios." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: String(token),
        resetTokenExpiry: { gt: new Date() }, // Check if token is not expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ message: "Contraseña actualizada exitosamente." });

  } catch (error) {
    console.error("Error en reset-password:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});


export default router;
