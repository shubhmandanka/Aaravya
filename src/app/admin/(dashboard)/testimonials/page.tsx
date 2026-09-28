import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable, BooleanBadge } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonial } from "./actions";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, patientName: true, initials: true, quote: true, isApproved: true },
  });

  return (
    <div>
      <AdminListHeader title="Testimonials" newHref="/admin/testimonials/new" newLabel="New Testimonial" />
      <AdminTable
        columns={["Name / Initials", "Quote", "Approved", ""]}
        rows={testimonials.map((t) => [
          <Link key="name" href={`/admin/testimonials/${t.id}`} className="font-medium hover:text-primary">
            {t.patientName ?? t.initials ?? "Anonymous"}
          </Link>,
          <span key="quote" className="line-clamp-1 text-muted-foreground">
            {t.quote ?? "—"}
          </span>,
          <BooleanBadge key="approved" value={t.isApproved} />,
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/testimonials/${t.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteTestimonial.bind(null, t.id)} />
          </div>,
        ])}
      />
    </div>
  );
}
