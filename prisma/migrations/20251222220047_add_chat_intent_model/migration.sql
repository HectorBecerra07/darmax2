-- CreateTable
CREATE TABLE "ChatIntent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "trainingPhrases" TEXT[],
    "response" TEXT NOT NULL,

    CONSTRAINT "ChatIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatIntent_name_key" ON "ChatIntent"("name");
