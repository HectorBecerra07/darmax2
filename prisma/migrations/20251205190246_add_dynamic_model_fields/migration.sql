-- CreateEnum
CREATE TYPE "VendingType" AS ENUM ('TRADICIONAL', 'TOUCH', 'NONE');

-- AlterEnum
ALTER TYPE "ImageContext" ADD VALUE 'CAROUSEL';

-- AlterTable
ALTER TABLE "MachineModel" ADD COLUMN     "basePrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "vendingType" "VendingType" NOT NULL DEFAULT 'NONE';
