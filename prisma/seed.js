import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admins = [
    {
      email: "admin@tutienda.com",
      name: "Maximiliano de la Torre",
      password: "admin123",
    },
    {
      email: "e.axel12@gmail.com",
      name: "Axel",
      password: "administrador123",
    },
    {
      email: "rivehect5@gmail.com",
      name: "Hector",
      password: "admin123",
    },
  ];

  for (const admin of admins) {
    const hash = await bcrypt.hash(admin.password, 10);
    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        name: admin.name,
        passwordHash: hash,
      },
    });
    console.log(`Admin ${admin.email} creado/actualizado`);
  }

  // Crear un usuario de prueba para el carrito
  const testUserPasswordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: 'test@user.com' },
    update: {
      passwordHash: testUserPasswordHash,
    },
    create: {
      email: 'test@user.com',
      name: 'Usuario de Prueba',
      passwordHash: testUserPasswordHash,
    },
  });
  console.log("Usuario de prueba 'test@user.com' creado/actualizado.");
}



main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
