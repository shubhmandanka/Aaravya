"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CostBand } from "@/generated/prisma";
import {
  AdminFormError,
  adminAction,
  enumValue,
  requiredString,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readCategoryForm(formData: FormData) {
  const name = requiredString(formData, "name", "Category name");
  const slug = slugify(name);
  if (!slug) throw new AdminFormError("Category name needs at least one letter or number.");
  return {
    name,
    slug,
    conditionId: toStringOrNull(formData.get("conditionId")),
    sortOrder: toIntOrNull(formData.get("sortOrder")) ?? 0,
  };
}

async function assertCategoryNameFree(slug: string, exceptId?: string) {
  const clash = await prisma.costCategory.findFirst({ where: { slug, NOT: exceptId ? { id: exceptId } : undefined } });
  if (clash) throw new AdminFormError(`A category called "${clash.name}" already exists.`);
}

export async function createCostCategory(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readCategoryForm(formData);
    await assertCategoryNameFree(data.slug);
    await prisma.costCategory.create({ data });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-estimator");
}

export async function updateCostCategory(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readCategoryForm(formData);
    await assertCategoryNameFree(data.slug, id);
    await prisma.costCategory.update({ where: { id }, data });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-estimator");
}

export async function deleteCostCategory(id: string): Promise<FormState> {
  return adminAction(async () => {
    const category = await prisma.costCategory.findUniqueOrThrow({
      where: { id },
      select: { name: true, _count: { select: { treatments: true } } },
    });
    const n = category._count.treatments;
    if (n) {
      throw new AdminFormError(
        `${category.name} still has ${n} treatment${n === 1 ? "" : "s"}. Delete or move ${n === 1 ? "it" : "them"} first.`
      );
    }
    await prisma.costCategory.delete({ where: { id } });
    revalidatePublicSite();
  });
}

function readTreatmentForm(formData: FormData) {
  return {
    categoryId: requiredString(formData, "categoryId", "Category"),
    name: requiredString(formData, "name", "Treatment name"),
    medicalName: toStringOrNull(formData.get("medicalName")),
    effectiveness: toStringOrNull(formData.get("effectiveness")),
    costLevel: toStringOrNull(formData.get("costLevel")),
    discomfort: toStringOrNull(formData.get("discomfort")),
    recovery: toStringOrNull(formData.get("recovery")),
    band: enumValue(CostBand, formData.get("band"), "estimate band"),
    sortOrder: toIntOrNull(formData.get("sortOrder")) ?? 0,
  };
}

async function assertTreatmentNameFree(categoryId: string, name: string, exceptId?: string) {
  const clash = await prisma.costTreatment.findFirst({
    where: { categoryId, name: { equals: name, mode: "insensitive" }, NOT: exceptId ? { id: exceptId } : undefined },
  });
  if (clash) throw new AdminFormError(`"${clash.name}" already exists in this category.`);
}

export async function createCostTreatment(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readTreatmentForm(formData);
    await assertTreatmentNameFree(data.categoryId, data.name);
    await prisma.costTreatment.create({ data });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-estimator");
}

export async function updateCostTreatment(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readTreatmentForm(formData);
    await assertTreatmentNameFree(data.categoryId, data.name, id);
    await prisma.costTreatment.update({ where: { id }, data });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/cost-estimator");
}

export async function deleteCostTreatment(id: string): Promise<FormState> {
  return adminAction(async () => {
    await prisma.costTreatment.delete({ where: { id } });
    revalidatePublicSite();
  });
}
