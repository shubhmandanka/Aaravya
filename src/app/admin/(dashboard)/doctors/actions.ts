"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  AdminFormError,
  adminAction,
  linesToArray,
  requiredString,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { validUrl } from "@/lib/admin/validate";
import { deleteImage, keyFromUrl, saveWithImage } from "@/lib/storage";

function optionalUrl(formData: FormData, key: string, label: string) {
  const value = toStringOrNull(formData.get(key));
  return value === null ? null : validUrl(value, label);
}

function readDoctorForm(formData: FormData) {
  return {
    slug: requiredString(formData, "slug", "Slug"),
    name: requiredString(formData, "name", "Full name"),
    qualifications: requiredString(formData, "qualifications", "Qualifications"),
    designation: requiredString(formData, "designation", "Designation"),
    registrationNumber: toStringOrNull(formData.get("registrationNumber")),
    yearsExperience: toIntOrNull(formData.get("yearsExperience")),
    surgeriesCount: toIntOrNull(formData.get("surgeriesCount")),
    specializations: linesToArray(formData.get("specializations")),
    bioParagraphs: linesToArray(formData.get("bioParagraphs")),
    philosophy: toStringOrNull(formData.get("philosophy")),
    phone: toStringOrNull(formData.get("phone")),
    facebookUrl: optionalUrl(formData, "facebookUrl", "Facebook URL"),
    instagramUrl: optionalUrl(formData, "instagramUrl", "Instagram URL"),
    linkedinUrl: optionalUrl(formData, "linkedinUrl", "LinkedIn URL"),
    isFeatured: formData.get("isFeatured") === "on",
  };
}

/** Blank means "don't set": new doctors then append after the current last one. */
function readSortOrder(formData: FormData) {
  const raw = String(formData.get("sortOrder") ?? "").trim();
  if (!raw) return null;
  const n = toIntOrNull(raw);
  if (n === null || n < 0) throw new AdminFormError("Display order must be a whole number, 0 or more.");
  return n;
}

export async function createDoctor(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readDoctorForm(formData);
    const sortOrder =
      readSortOrder(formData) ?? ((await prisma.doctor.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0) + 1;
    await saveWithImage(formData, "photoUrl", "doctors", null, async (photoUrl) => {
      await prisma.doctor.create({ data: { ...data, sortOrder, photoUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/doctors");
}

export async function updateDoctor(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readDoctorForm(formData);
    const sortOrder = readSortOrder(formData);
    const existing = await prisma.doctor.findUniqueOrThrow({ where: { id }, select: { photoUrl: true } });
    await saveWithImage(formData, "photoUrl", "doctors", existing.photoUrl, async (photoUrl) => {
      await prisma.doctor.update({ where: { id }, data: { ...data, ...(sortOrder === null ? {} : { sortOrder }), photoUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/doctors");
}

export async function deleteDoctor(id: string): Promise<FormState> {
  return adminAction(async () => {
    // Every relation to Doctor is ON DELETE SET NULL, so this never blocks.
    const existing = await prisma.doctor.findUniqueOrThrow({ where: { id }, select: { photoUrl: true } });
    await prisma.doctor.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.photoUrl));
    revalidatePublicSite();
  });
}
