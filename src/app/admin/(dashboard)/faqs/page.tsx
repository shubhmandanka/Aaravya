import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaq } from "./actions";
import { FAQ_PAGE_CONTEXTS } from "./page-contexts";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: [{ pageContext: "asc" }, { sortOrder: "asc" }],
    select: { id: true, question: true, pageContext: true },
  });

  return (
    <div>
      <AdminListHeader title="FAQs" newHref="/admin/faqs/new" newLabel="New FAQ" />
      <AdminTable
        columns={["Question", "Page", ""]}
        rows={faqs.map((f) => [
          <Link key="q" href={`/admin/faqs/${f.id}`} className="font-medium hover:text-primary line-clamp-1">
            {f.question}
          </Link>,
          FAQ_PAGE_CONTEXTS.find((c) => c.value === f.pageContext)?.label ?? f.pageContext,
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/faqs/${f.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteFaq.bind(null, f.id)} />
          </div>,
        ])}
      />
    </div>
  );
}
