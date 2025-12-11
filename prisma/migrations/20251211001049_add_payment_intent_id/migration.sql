/*
  Warnings:

  - A unique constraint covering the columns `[paymentIntentId]` on the table `Pedido` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "paymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_paymentIntentId_key" ON "Pedido"("paymentIntentId");

-- CreateIndex
CREATE INDEX "Pedido_paymentIntentId_idx" ON "Pedido"("paymentIntentId");
