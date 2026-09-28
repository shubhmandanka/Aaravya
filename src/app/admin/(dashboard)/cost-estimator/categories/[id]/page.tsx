import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostCategoryForm } from "../../category-form";
import { updateCostCategory } from "../../actions";

export default async function EditCostCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, conditions] = await Promise.all([
    prisma.costCategory.findUnique({ where: { id } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!category) notFound();
  return (
    <AdminFormShell title={`Edit ${category.name}`} backHref="/admin/cost-estimator">
      <CostCategoryForm action={updateCostCategory.bind(null, category.id)} category={category} conditions={conditions} />
    </AdminFormShell>
  );
}
