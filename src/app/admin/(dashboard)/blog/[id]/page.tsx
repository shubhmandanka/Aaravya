import { DOCTOR_ORDER } from "@/lib/queries";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { BlogForm } from "../blog-form";
import { updateBlogPost } from "../actions";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, doctors] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);
  if (!post) notFound();

  return (
    <AdminFormShell title="Edit Article" backHref="/admin/blog">
      <BlogForm action={updateBlogPost.bind(null, post.id)} post={post} doctors={doctors} />
    </AdminFormShell>
  );
}
