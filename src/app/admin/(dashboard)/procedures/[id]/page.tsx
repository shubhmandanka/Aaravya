import { DOCTOR_ORDER } from "@/lib/queries";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { ProcedureForm } from "../procedure-form";
import { updateProcedure } from "../actions";

export default async function EditProcedurePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [procedure, conditions, doctors] = await Promise.all([
    prisma.procedure.findUnique({ where: { id } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);
  if (!procedure) notFound();

  return (
    <AdminFormShell title={`Edit ${procedure.name}`} backHref="/admin/procedures">
      <ProcedureForm
        action={updateProcedure.bind(null, procedure.id)}
        procedure={procedure}
        conditions={conditions}
        doctors={doctors}
      />
    </AdminFormShell>
  );
}
