"use client";

import { useState } from "react";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import { AdminForm } from "@/components/admin/admin-form";
import type { FormState } from "@/lib/admin/actions";
import type { MediaCategory, MediaItem, MediaType } from "@/generated/prisma";
import { MEDIA_CATEGORY_HELP, MEDIA_CATEGORY_LABELS } from "./labels";

export function GalleryForm({
  action,
  item,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  item?: MediaItem;
}) {
  const [type, setType] = useState<MediaType>(item?.type ?? "IMAGE");
  const [category, setCategory] = useState<MediaCategory>(item?.category ?? "HAPPY_FACES");

  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Type" htmlFor="type">
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as MediaType)}
            className={ADMIN_INPUT_CLASS}
          >
            <option value="IMAGE">Photo</option>
            <option value="VIDEO">YouTube video</option>
          </select>
        </Field>
        <Field label="Category" htmlFor="category" help={MEDIA_CATEGORY_HELP[category]}>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as MediaCategory)}
            className={ADMIN_INPUT_CLASS}
          >
            {Object.entries(MEDIA_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {type === "IMAGE" ? (
        <ImageUploadField name="url" label="Photo" currentImageUrl={item?.url} />
      ) : (
        <Field label="YouTube Video" htmlFor="youtubeId" help="Paste the video link or its 11-character ID">
          <input
            id="youtubeId"
            name="youtubeId"
            required
            defaultValue={item?.youtubeId ?? ""}
            placeholder="https://www.youtube.com/watch?v=…"
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
        <Field label="Caption (optional)" htmlFor="caption" help="Also used as the image's alt text">
          <input id="caption" name="caption" defaultValue={item?.caption ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Sort Order" htmlFor="sortOrder" help="Lower shows first">
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={item?.sortOrder ?? 0}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
      </div>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Media Item
      </AdminSubmitButton>
    </AdminForm>
  );
}
