"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  AdminFormError,
  adminAction,
  requiredString,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { validUrl } from "@/lib/admin/validate";
import { deleteImage, keyFromUrl, saveWithImage } from "@/lib/storage";

function readProcedureForm(formData: FormData) {
  const costMin = toIntOrNull(formData.get("costMin"));
  const costMax = toIntOrNull(formData.get("costMax"));
  if ((costMin !== null && costMin < 0) || (costMax !== null && costMax < 0)) {
    throw new AdminFormError("Costs must be whole rupee amounts, 0 or more.");
  }
  if (costMin !== null && costMax !== null && costMin > costMax) {
    throw new AdminFormError("Cost Min can't be higher than Cost Max.");
  }
  const pdf = toStringOrNull(formData.get("downloadablePdfUrl"));
  return {
    slug: requiredString(formData, "slug", "Slug"),
    name: requiredString(formData, "name", "Name"),
    conditionId: requiredString(formData, "conditionId", "Condition"),
    doctorId: toStringOrNull(formData.get("doctorId")),
    description: requiredString(formData, "description", "Description"),
    duration: toStringOrNull(formData.get("duration")),
    anesthesiaType: toStringOrNull(formData.get("anesthesiaType")),
    hospitalStay: toStringOrNull(formData.get("hospitalStay")),
    successRate: toStringOrNull(formData.get("successRate")),
    costMin,
    costMax,
    downloadablePdfUrl: pdf === null ? null : validUrl(pdf, "Downloadable PDF URL"),
  };
}

export async function createProcedure(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readProcedureForm(formData);
    await saveWithImage(formData, "imageUrl", "procedures", null, async (imageUrl) => {
      await prisma.procedure.create({ data: { ...data, imageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/procedures");
}

export async function updateProcedure(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readProcedureForm(formData);
    const existing = await prisma.procedure.findUniqueOrThrow({ where: { id }, select: { imageUrl: true } });
    await saveWithImage(formData, "imageUrl", "procedures", existing.imageUrl, async (imageUrl) => {
      await prisma.procedure.update({ where: { id }, data: { ...data, imageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/procedures");
}

export async function deleteProcedure(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.procedure.findUniqueOrThrow({
      where: { id },
      select: { name: true, imageUrl: true, _count: { select: { costEstimatorRules: true } } },
    });
    // Legacy CostEstimatorRule rows (superseded by the Cost Estimator's categories and
    // treatments, no longer editable) reference Procedure with ON DELETE RESTRICT.
    const rules = existing._count.costEstimatorRules;
    if (rules) {
      throw new AdminFormError(
        `${existing.name} is still referenced by ${rules} legacy cost rule${rules === 1 ? "" : "s"} from the old estimator, so it can't be deleted yet.`
      );
    }
    await prisma.procedure.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.imageUrl));
    revalidatePublicSite();
  });
}
