-- CreateEnum
CREATE TYPE "CostBand" AS ENUM ('LOWER', 'MODERATE', 'HIGHER', 'ADVANCED', 'CONSULTATION', 'AFTER_CONSULTATION');

-- CreateTable
CREATE TABLE "CostCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conditionId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostTreatment" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "medicalName" TEXT,
    "effectiveness" TEXT,
    "costLevel" TEXT,
    "discomfort" TEXT,
    "recovery" TEXT,
    "band" "CostBand" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostTreatment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostCategory_slug_key" ON "CostCategory"("slug");

-- CreateIndex
CREATE INDEX "CostCategory_sortOrder_idx" ON "CostCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "CostCategory_conditionId_idx" ON "CostCategory"("conditionId");

-- CreateIndex
CREATE INDEX "CostTreatment_categoryId_sortOrder_idx" ON "CostTreatment"("categoryId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CostTreatment_categoryId_name_key" ON "CostTreatment"("categoryId", "name");

-- AddForeignKey
ALTER TABLE "CostCategory" ADD CONSTRAINT "CostCategory_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostTreatment" ADD CONSTRAINT "CostTreatment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CostCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

