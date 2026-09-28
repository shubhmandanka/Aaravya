import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostCategoryForm } from "../../category-form";
import { createCostCategory } from "../../actions";

export default async function NewCostCategoryPage() {
  const conditions = await prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <AdminFormShell title="New Cost Category" backHref="/admin/cost-estimator">
      <CostCategoryForm action={createCostCategory} conditions={conditions} />
    </AdminFormShell>
  );
}
