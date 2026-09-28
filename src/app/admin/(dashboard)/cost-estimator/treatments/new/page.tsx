import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostTreatmentForm } from "../../treatment-form";
import { createCostTreatment } from "../../actions";

export default async function NewCostTreatmentPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const categories = await prisma.costCategory.findMany({
    select: { id: true, name: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return (
    <AdminFormShell title="New Treatment" backHref="/admin/cost-estimator">
      <CostTreatmentForm
        action={createCostTreatment}
        categories={categories}
        defaultCategoryId={categories.some((c) => c.id === category) ? category : undefined}
      />
    </AdminFormShell>
  );
}
