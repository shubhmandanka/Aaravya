import { DOCTOR_ORDER } from "@/lib/queries";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { ConditionForm } from "../condition-form";
import { updateCondition } from "../actions";

export default async function EditConditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [condition, doctors] = await Promise.all([
    prisma.condition.findUnique({ where: { id } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);
  if (!condition) notFound();

  return (
    <AdminFormShell title={`Edit ${condition.name}`} backHref="/admin/conditions">
      <ConditionForm action={updateCondition.bind(null, condition.id)} condition={condition} doctors={doctors} />
    </AdminFormShell>
  );
}
