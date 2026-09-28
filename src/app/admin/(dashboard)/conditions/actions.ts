"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConditionCategory } from "@/generated/prisma";
import {
  AdminFormError,
  adminAction,
  enumValue,
  linesToArray,
  requiredString,
  revalidatePublicSite,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { deleteImage, keyFromUrl, saveWithImage } from "@/lib/storage";

/** Encodes as "Title | Description" per line, matching the format shown in the form's help text. */
function parseTreatmentOptions(value: FormDataEntryValue | null) {
  return linesToArray(value)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title?.trim() ?? "", description: rest.join("|").trim() };
    })
    .filter((o) => o.title);
}

function readConditionForm(formData: FormData) {
  return {
    slug: requiredString(formData, "slug", "Slug"),
    name: requiredString(formData, "name", "Name"),
    category: enumValue(ConditionCategory, formData.get("category"), "category"),
    seoTitle: toStringOrNull(formData.get("seoTitle")),
    metaDescription: toStringOrNull(formData.get("metaDescription")),
    directAnswer: requiredString(formData, "directAnswer", "Direct answer"),
    introText: toStringOrNull(formData.get("introText")),
    definitionHeading: toStringOrNull(formData.get("definitionHeading")),
    definitionText: toStringOrNull(formData.get("definitionText")),
    symptoms: linesToArray(formData.get("symptoms")),
    causes: toStringOrNull(formData.get("causes")),
    treatmentOptions: parseTreatmentOptions(formData.get("treatmentOptions")),
    whyChooseUsPoints: linesToArray(formData.get("whyChooseUsPoints")),
    closingHeading: toStringOrNull(formData.get("closingHeading")),
    closingText: toStringOrNull(formData.get("closingText")),
    reviewedByDoctorId: toStringOrNull(formData.get("reviewedByDoctorId")),
  };
}

export async function createCondition(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readConditionForm(formData);
    await saveWithImage(formData, "heroImageUrl", "conditions", null, async (heroImageUrl) => {
      await prisma.condition.create({ data: { ...data, heroImageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/conditions");
}

export async function updateCondition(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readConditionForm(formData);
    const existing = await prisma.condition.findUniqueOrThrow({ where: { id }, select: { heroImageUrl: true } });
    await saveWithImage(formData, "heroImageUrl", "conditions", existing.heroImageUrl, async (heroImageUrl) => {
      await prisma.condition.update({ where: { id }, data: { ...data, heroImageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/conditions");
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export async function deleteCondition(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.condition.findUniqueOrThrow({
      where: { id },
      select: { name: true, heroImageUrl: true, _count: { select: { procedures: true, locationPages: true } } },
    });
    // Procedures and location pages reference Condition with ON DELETE RESTRICT.
    const { procedures, locationPages } = existing._count;
    if (procedures || locationPages) {
      const blockers = [procedures && plural(procedures, "procedure"), locationPages && plural(locationPages, "location page")]
        .filter(Boolean)
        .join(" and ");
      const them = procedures + locationPages === 1 ? "it" : "them";
      throw new AdminFormError(
        `${existing.name} still has ${blockers}. Reassign ${them} to another condition or delete ${them} first, then delete this condition.`
      );
    }
    await prisma.condition.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.heroImageUrl));
    revalidatePublicSite();
  });
}
