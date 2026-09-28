import { DOCTOR_ORDER } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { ProcedureForm } from "../procedure-form";
import { createProcedure } from "../actions";

export default async function NewProcedurePage() {
  const [conditions, doctors] = await Promise.all([
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);

  return (
    <AdminFormShell title="New Procedure" backHref="/admin/procedures">
      <ProcedureForm action={createProcedure} conditions={conditions} doctors={doctors} />
    </AdminFormShell>
  );
}
