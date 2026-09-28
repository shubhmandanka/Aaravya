import Image from "next/image";
import Link from "next/link";
import { Pencil, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { legacyAsset } from "@/lib/assets";
import { AdminListHeader, AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaCategory } from "@/generated/prisma";
import { deleteMediaItem } from "./actions";
import { MEDIA_CATEGORY_LABELS } from "./labels";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category = Object.values(MediaCategory).includes(rawCategory as MediaCategory)
    ? (rawCategory as MediaCategory)
    : undefined;

  const [items, counts] = await Promise.all([
    prisma.mediaItem.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.mediaItem.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);
  const countFor = (c: MediaCategory) => counts.find((row) => row.category === c)?._count._all ?? 0;
  const total = counts.reduce((sum, row) => sum + row._count._all, 0);

  const filters: { label: string; href: string; active: boolean }[] = [
    { label: `All (${total})`, href: "/admin/gallery", active: !category },
    ...Object.values(MediaCategory).map((c) => ({
      label: `${MEDIA_CATEGORY_LABELS[c]} (${countFor(c)})`,
      href: `/admin/gallery?category=${c}`,
      active: category === c,
    })),
  ];

  return (
    <div>
      <AdminListHeader title="Gallery" newHref="/admin/gallery/new" newLabel="New Media Item" />

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter by category">
        {filters.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            aria-current={f.active ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              f.active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <AdminTable
        columns={["Preview", "Category", "Type", "Caption", "Order", ""]}
        rows={items.map((item) => {
          const src = legacyAsset(item.url);
          return [
            <Link key="preview" href={`/admin/gallery/${item.id}`} className="block">
              {item.type === "IMAGE" && src ? (
                <span className="relative block size-12 overflow-hidden rounded-md bg-muted">
                  <Image src={src} alt={item.caption ?? ""} fill sizes="48px" className="object-cover" />
                </span>
              ) : (
                <span className="flex size-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <PlayCircle className="size-5" />
                </span>
              )}
            </Link>,
            MEDIA_CATEGORY_LABELS[item.category],
            item.type === "IMAGE" ? "Photo" : "Video",
            <span key="caption" className="line-clamp-1 text-muted-foreground">
              {item.caption ?? "—"}
            </span>,
            item.sortOrder,
            <div key="actions" className="flex justify-end gap-1">
              <Link
                href={`/admin/gallery/${item.id}`}
                aria-label="Edit"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Pencil className="size-4" />
              </Link>
              <DeleteButton action={deleteMediaItem.bind(null, item.id)} confirmText="Delete this media item?" />
            </div>,
          ];
        })}
      />
    </div>
  );
}
