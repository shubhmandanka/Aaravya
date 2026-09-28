import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { CostTreatmentForm } from "../../treatment-form";
import { updateCostTreatment } from "../../actions";

export default async function EditCostTreatmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [treatment, categories] = await Promise.all([
    prisma.costTreatment.findUnique({ where: { id } }),
    prisma.costCategory.findMany({ select: { id: true, name: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  if (!treatment) notFound();
  return (
    <AdminFormShell title={`Edit ${treatment.name}`} backHref="/admin/cost-estimator">
      <CostTreatmentForm action={updateCostTreatment.bind(null, treatment.id)} treatment={treatment} categories={categories} />
    </AdminFormShell>
  );
}
