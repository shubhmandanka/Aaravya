/**
 * Seeds the cost estimator's categories/treatments from src/content/cost-estimator.ts.
 * Safe to re-run against a live database: create-only, never updates or deletes.
 *
 *   npx tsx scripts/seed-cost-estimator.ts
 */
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { seedCostEstimator } from "@/lib/cost-estimator-seed";

seedCostEstimator(prisma)
  .then(async (created) => {
    const [categories, treatments] = await Promise.all([prisma.costCategory.count(), prisma.costTreatment.count()]);
    console.log(`Created ${created} new rows. Now ${categories} categories, ${treatments} treatments.`);
  })
  .finally(() => prisma.$disconnect());
