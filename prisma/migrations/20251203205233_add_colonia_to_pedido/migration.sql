-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "colonia" TEXT,
ALTER COLUMN "ciudad" DROP NOT NULL,
ALTER COLUMN "estadoEnvio" DROP NOT NULL,
ALTER COLUMN "codigoPostal" DROP NOT NULL;
