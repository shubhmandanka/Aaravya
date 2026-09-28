import { DOCTOR_ORDER } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { BlogForm } from "../blog-form";
import { createBlogPost } from "../actions";

export default async function NewBlogPostPage() {
  const doctors = await prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER });

  return (
    <AdminFormShell title="New Article" backHref="/admin/blog">
      <BlogForm action={createBlogPost} doctors={doctors} />
    </AdminFormShell>
  );
}
