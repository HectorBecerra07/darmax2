-- CreateEnum
CREATE TYPE "ImageContext" AS ENUM ('MODEL_BASE', 'MODEL_BASE_ALCALINA', 'TINACO', 'TINACO_ALCALINA', 'SECONDARY', 'SECONDARY_ALCALINA');

-- CreateTable
CREATE TABLE "MachineModel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "supportsTinacos" BOOLEAN NOT NULL DEFAULT true,
    "isAtlantis" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MachineModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Extra" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "isTinaco" BOOLEAN NOT NULL DEFAULT false,
    "tinacoKey" TEXT,
    "tinacoCapacityLiters" INTEGER,

    CONSTRAINT "Extra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelExtra" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "extraId" TEXT NOT NULL,
    "priceOverride" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ModelExtra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfigurationImage" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "tinacoExtraId" TEXT,
    "context" "ImageContext" NOT NULL,
    "onlyWhenAlcalina" BOOLEAN NOT NULL DEFAULT false,
    "isSecondary" BOOLEAN NOT NULL DEFAULT false,
    "secondaryVariantKey" TEXT,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ConfigurationImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MachineModel_slug_key" ON "MachineModel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Extra_code_key" ON "Extra"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ModelExtra_modelId_extraId_key" ON "ModelExtra"("modelId", "extraId");

-- CreateIndex
CREATE INDEX "ConfigurationImage_modelId_idx" ON "ConfigurationImage"("modelId");

-- CreateIndex
CREATE INDEX "ConfigurationImage_tinacoExtraId_idx" ON "ConfigurationImage"("tinacoExtraId");

-- CreateIndex
CREATE INDEX "ConfigurationImage_context_idx" ON "ConfigurationImage"("context");

-- AddForeignKey
ALTER TABLE "ModelExtra" ADD CONSTRAINT "ModelExtra_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "MachineModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelExtra" ADD CONSTRAINT "ModelExtra_extraId_fkey" FOREIGN KEY ("extraId") REFERENCES "Extra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationImage" ADD CONSTRAINT "ConfigurationImage_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "MachineModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationImage" ADD CONSTRAINT "ConfigurationImage_tinacoExtraId_fkey" FOREIGN KEY ("tinacoExtraId") REFERENCES "Extra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
