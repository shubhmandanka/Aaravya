"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { adminAction, revalidatePublicSite, type FormState } from "@/lib/admin/actions";
import { SETTINGS_KEYS } from "./config";

export async function updateSettings(_state: FormState, formData: FormData): Promise<FormState> {
  return adminAction(async () => {
    // Validate everything before writing anything, so one bad field saves nothing.
    const entries = SETTINGS_KEYS.map(({ key, validate }) => {
      const raw = String(formData.get(key) ?? "").trim();
      return { key, value: raw ? validate(raw) : null };
    });

    await prisma.$transaction(
      entries.map(({ key, value }) =>
        // A blank field removes the setting so the site's built-in fallback
        // applies, rather than rendering an empty phone link or GA snippet.
        value === null
          ? prisma.siteSetting.deleteMany({ where: { key } })
          : prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
      )
    );
    revalidatePath("/admin/settings");
    revalidatePublicSite();
    return { success: "Settings saved — the public site will show the changes on the next page load." };
  });
}
