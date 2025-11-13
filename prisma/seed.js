import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@tutienda.com" },
    update: {},
    create: {
      email: "admin@tutienda.com",
      name: "Maximiliano de la Torre",
      passwordHash: hash,
    },
  });

  console.log("Admin creado/actualizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
