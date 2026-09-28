-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Doctor_sortOrder_idx" ON "Doctor"("sortOrder");


-- Fixed display order: Dr. Deep Prajapati first, Dr. Dipti Prajapati second;
-- any other existing doctors follow in the order they were added.
UPDATE "Doctor" SET "sortOrder" = 1 WHERE "slug" = 'dr-deep-prajapati';
UPDATE "Doctor" SET "sortOrder" = 2 WHERE "slug" = 'dr-dipti-prajapati';
UPDATE "Doctor" d SET "sortOrder" = 2 + r.rn
FROM (SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt", "id") AS rn FROM "Doctor" WHERE "slug" NOT IN ('dr-deep-prajapati', 'dr-dipti-prajapati')) r
WHERE d."id" = r."id";
