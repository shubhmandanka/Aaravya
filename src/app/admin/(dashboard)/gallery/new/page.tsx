import { AdminFormShell } from "@/components/admin/form";
import { GalleryForm } from "../gallery-form";
import { createMediaItem } from "../actions";

export default function NewMediaItemPage() {
  return (
    <AdminFormShell title="New Media Item" backHref="/admin/gallery">
      <GalleryForm action={createMediaItem} />
    </AdminFormShell>
  );
}
