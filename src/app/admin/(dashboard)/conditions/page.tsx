import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { CATEGORY_LABELS } from "@/lib/queries";
import { deleteCondition } from "./actions";

export default async function AdminConditionsPage() {
  const conditions = await prisma.condition.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true },
  });

  return (
    <div>
      <AdminListHeader title="Conditions" newHref="/admin/conditions/new" newLabel="New Condition" />
      <AdminTable
        columns={["Name", "Category", ""]}
        rows={conditions.map((c) => [
          <Link key="name" href={`/admin/conditions/${c.id}`} className="font-medium hover:text-primary">
            {c.name}
          </Link>,
          CATEGORY_LABELS[c.category],
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/conditions/${c.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteCondition.bind(null, c.id)} confirmText={`Delete ${c.name}?`} />
          </div>,
        ])}
      />
    </div>
  );
}
