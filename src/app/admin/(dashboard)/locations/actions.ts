"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  AdminFormError,
  adminAction,
  requiredString,
  revalidatePublicSite,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { validEmail, validMapEmbedUrl, validPhone, validUrl, validWhatsapp } from "@/lib/admin/validate";

function optional<T>(value: string | null, check: (v: string) => T): T | null {
  return value === null ? null : check(value);
}

function readLocationForm(formData: FormData) {
  return {
    name: requiredString(formData, "name", "Name"),
    address: requiredString(formData, "address", "Address"),
    phone: validPhone(requiredString(formData, "phone", "Phone")),
    whatsapp: optional(toStringOrNull(formData.get("whatsapp")), (v) => validWhatsapp(v)),
    email: optional(toStringOrNull(formData.get("email")), (v) => validEmail(v)),
    mapEmbedUrl: optional(toStringOrNull(formData.get("mapEmbedUrl")), validMapEmbedUrl),
    hours: toStringOrNull(formData.get("hours")),
    googleBusinessUrl: optional(toStringOrNull(formData.get("googleBusinessUrl")), (v) =>
      validUrl(v, "Google Business Profile URL")
    ),
    isPrimary: formData.get("isPrimary") === "on",
  };
}

const NEEDS_PRIMARY =
  "The site needs one primary location for the footer, About and Contact pages — mark another location as primary first.";

export async function createLocation(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readLocationForm(formData);
    const hasPrimary = (await prisma.location.count({ where: { isPrimary: true } })) > 0;
    // The first location is always primary; a new primary replaces the old one.
    const isPrimary = data.isPrimary || !hasPrimary;
    await prisma.$transaction(async (tx) => {
      if (isPrimary) await tx.location.updateMany({ where: { isPrimary: true }, data: { isPrimary: false } });
      await tx.location.create({ data: { ...data, isPrimary } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/locations");
}

export async function updateLocation(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readLocationForm(formData);
    const existing = await prisma.location.findUniqueOrThrow({ where: { id }, select: { isPrimary: true } });
    if (existing.isPrimary && !data.isPrimary) throw new AdminFormError(NEEDS_PRIMARY);
    await prisma.$transaction(async (tx) => {
      if (data.isPrimary) {
        await tx.location.updateMany({ where: { isPrimary: true, NOT: { id } }, data: { isPrimary: false } });
      }
      await tx.location.update({ where: { id }, data });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/locations");
}

export async function deleteLocation(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.location.findUniqueOrThrow({ where: { id }, select: { isPrimary: true } });
    if (existing.isPrimary) throw new AdminFormError(NEEDS_PRIMARY);
    await prisma.location.delete({ where: { id } });
    revalidatePublicSite();
  });
}
