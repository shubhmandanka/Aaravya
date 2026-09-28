import type { PrismaClient } from "@/generated/prisma";
import { COST_ESTIMATOR_SEED } from "@/content/cost-estimator";

/**
 * Creates any missing cost-estimator categories/treatments from the brief.
 * Create-only (`update: {}`): re-running never overwrites prices edited in
 * the admin and never deletes anything, so it's safe against a live database.
 */
export async function seedCostEstimator(prisma: PrismaClient) {
  let created = 0;
  for (const [ci, category] of COST_ESTIMATOR_SEED.entries()) {
    const condition = category.conditionSlug
      ? await prisma.condition.findUnique({ where: { slug: category.conditionSlug }, select: { id: true } })
      : null;
    const before = await prisma.costCategory.count({ where: { slug: category.slug } });
    const row = await prisma.costCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: { slug: category.slug, name: category.name, conditionId: condition?.id ?? null, sortOrder: ci },
    });
    created += before ? 0 : 1;

    for (const [ti, t] of category.treatments.entries()) {
      const exists = await prisma.costTreatment.count({ where: { categoryId: row.id, name: t.name } });
      await prisma.costTreatment.upsert({
        where: { categoryId_name: { categoryId: row.id, name: t.name } },
        update: {},
        create: { ...t, categoryId: row.id, sortOrder: ti },
      });
      created += exists ? 0 : 1;
    }
  }
  return created;
}
