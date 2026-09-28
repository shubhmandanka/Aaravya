import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { GalleryForm } from "../gallery-form";
import { updateMediaItem } from "../actions";

export default async function EditMediaItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <AdminFormShell title="Edit Media Item" backHref="/admin/gallery">
      <GalleryForm action={updateMediaItem.bind(null, item.id)} item={item} />
    </AdminFormShell>
  );
}
