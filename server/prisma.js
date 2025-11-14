const { PrismaClient } = require('@prisma/client');

console.log("👉 NODE_ENV:", process.env.NODE_ENV);
console.log("👉 PRISMA_DATABASE_URL existe?:", !!process.env.PRISMA_DATABASE_URL);

let prisma;

// En producción (Vercel Serverless)
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // En desarrollo: hot-reload crea muchas conexiones
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
