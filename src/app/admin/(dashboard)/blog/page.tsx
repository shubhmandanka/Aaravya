import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminListHeader, AdminTable, BooleanBadge } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlogPost } from "./actions";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, funnelStage: true, isPublished: true },
  });

  return (
    <div>
      <AdminListHeader title="Health Library" newHref="/admin/blog/new" newLabel="New Article" />
      <AdminTable
        columns={["Title", "Funnel Stage", "Published", ""]}
        rows={posts.map((p) => [
          <Link key="title" href={`/admin/blog/${p.id}`} className="font-medium hover:text-primary">
            {p.title}
          </Link>,
          p.funnelStage,
          <BooleanBadge key="published" value={p.isPublished} />,
          <div key="actions" className="flex justify-end gap-1">
            <Link href={`/admin/blog/${p.id}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
              <Pencil className="size-4" />
            </Link>
            <DeleteButton action={deleteBlogPost.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
          </div>,
        ])}
      />
    </div>
  );
}
