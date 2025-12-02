-- CreateTable
CREATE TABLE "Envio" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pedidoId" INTEGER NOT NULL,
    "quotationId" TEXT NOT NULL,
    "rateId" TEXT NOT NULL,
    "provider" TEXT,
    "service" TEXT,
    "days" INTEGER,
    "costoEnvio" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "skydropxShipmentId" TEXT,
    "trackingNumber" TEXT,
    "trackingUrl" TEXT,
    "etiquetaUrl" TEXT,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Envio_pedidoId_key" ON "Envio"("pedidoId");

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
