import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProcedure } from "./actions";

export default async function AdminProceduresPage() {
  const procedures = await prisma.procedure.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      costMin: true,
      costMax: true,
      condition: { select: { name: true } },
    },
  });

  return (
    <div>
      <AdminListHeader title="Procedures" newHref="/admin/procedures/new" newLabel="New Procedure" />
      <AdminTable
        columns={["Name", "Condition", "Cost Range", ""]}
        rows={procedures.map((p) => [
          <Link key="name" href={`/admin/procedures/${p.id}`} className="font-medium hover:text-primary">
            {p.name}
          </Link>,
          p.condition.name,
          p.costMin ? `₹${p.costMin.toLocaleString("en-IN")}–₹${p.costMax?.toLocaleString("en-IN")}` : "—",
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/procedures/${p.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteProcedure.bind(null, p.id)} confirmText={`Delete ${p.name}?`} />
          </div>,
        ])}
      />
    </div>
  );
}
