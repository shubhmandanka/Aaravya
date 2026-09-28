"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MediaCategory, MediaType } from "@/generated/prisma";
import {
  AdminFormError,
  adminAction,
  enumValue,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { deleteImage, keyFromUrl, saveWithImage } from "@/lib/storage";

/** Accepts a bare 11-character ID or any common YouTube URL form. */
function parseYoutubeId(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  const match = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function readMediaForm(formData: FormData) {
  return {
    type: enumValue(MediaType, formData.get("type"), "media type"),
    category: enumValue(MediaCategory, formData.get("category"), "category"),
    caption: toStringOrNull(formData.get("caption")),
    sortOrder: toIntOrNull(formData.get("sortOrder")) ?? 0,
  };
}

/** Writes the item with its photo or video. Validation runs before any
 * upload, and an old photo is only deleted once the new state is saved. */
async function saveMedia(
  formData: FormData,
  data: ReturnType<typeof readMediaForm>,
  previousUrl: string | null,
  write: (media: { url: string | null; youtubeId: string | null }) => Promise<void>
) {
  if (data.type === "VIDEO") {
    const youtubeId = parseYoutubeId(formData.get("youtubeId"));
    if (!youtubeId) throw new AdminFormError("Enter a YouTube video ID or link for video items.");
    await write({ url: null, youtubeId });
    // Switching a photo item to a video drops its image.
    await deleteImage(keyFromUrl(previousUrl));
    return;
  }

  const file = formData.get("url");
  const hasNewFile = file instanceof File && file.size > 0;
  const removeRequested = formData.get("url__remove") === "1";
  if (!hasNewFile && (!previousUrl || removeRequested)) {
    throw new AdminFormError("Choose an image for photo items.");
  }
  await saveWithImage(formData, "url", "gallery", previousUrl, (url) => write({ url, youtubeId: null }));
}

export async function createMediaItem(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readMediaForm(formData);
    await saveMedia(formData, data, null, async (media) => {
      await prisma.mediaItem.create({ data: { ...data, ...media } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/gallery");
}

export async function updateMediaItem(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readMediaForm(formData);
    const existing = await prisma.mediaItem.findUniqueOrThrow({ where: { id }, select: { url: true } });
    await saveMedia(formData, data, existing.url, async (media) => {
      await prisma.mediaItem.update({ where: { id }, data: { ...data, ...media } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/gallery");
}

export async function deleteMediaItem(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.mediaItem.findUniqueOrThrow({ where: { id }, select: { url: true } });
    await prisma.mediaItem.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.url));
    revalidatePublicSite();
  });
}
