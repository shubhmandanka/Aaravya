"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnonymousCategory } from "@/generated/prisma";
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

function readTestimonialForm(formData: FormData) {
  const rating = toIntOrNull(formData.get("rating"));
  if (rating !== null && (rating < 1 || rating > 5)) throw new AdminFormError("Rating must be between 1 and 5.");
  const videoUrl = toStringOrNull(formData.get("videoUrl"));
  if (videoUrl !== null && !/^[A-Za-z0-9_-]{11}$/.test(videoUrl)) {
    throw new AdminFormError("YouTube Video ID must be the 11-character ID from the video link (the part after v=).");
  }
  const category = toStringOrNull(formData.get("anonymousCategory"));
  return {
    patientName: toStringOrNull(formData.get("patientName")),
    initials: toStringOrNull(formData.get("initials")),
    quote: toStringOrNull(formData.get("quote")),
    rating,
    videoUrl,
    conditionId: toStringOrNull(formData.get("conditionId")),
    doctorId: toStringOrNull(formData.get("doctorId")),
    anonymousCategory: category === null ? null : enumValue(AnonymousCategory, category, "anonymous category"),
    isFeatured: formData.get("isFeatured") === "on",
    isApproved: formData.get("isApproved") === "on",
  };
}

export async function createTestimonial(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readTestimonialForm(formData);
    await saveWithImage(formData, "imageUrl", "testimonials", null, async (imageUrl) => {
      await prisma.testimonial.create({ data: { ...data, imageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readTestimonialForm(formData);
    const existing = await prisma.testimonial.findUniqueOrThrow({ where: { id }, select: { imageUrl: true } });
    await saveWithImage(formData, "imageUrl", "testimonials", existing.imageUrl, async (imageUrl) => {
      await prisma.testimonial.update({ where: { id }, data: { ...data, imageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.testimonial.findUniqueOrThrow({ where: { id }, select: { imageUrl: true } });
    await prisma.testimonial.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.imageUrl));
    revalidatePublicSite();
  });
}
