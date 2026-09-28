import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable, BooleanBadge } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLocation } from "./actions";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, address: true, isPrimary: true },
  });

  return (
    <div>
      <AdminListHeader title="Locations" newHref="/admin/locations/new" newLabel="New Location" />
      <AdminTable
        columns={["Name", "Address", "Primary", ""]}
        rows={locations.map((l) => [
          <Link key="name" href={`/admin/locations/${l.id}`} className="font-medium hover:text-primary">
            {l.name}
          </Link>,
          <span key="addr" className="line-clamp-1 text-muted-foreground">
            {l.address}
          </span>,
          <BooleanBadge key="primary" value={l.isPrimary} />,
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/locations/${l.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteLocation.bind(null, l.id)} />
          </div>,
        ])}
      />
    </div>
  );
}
