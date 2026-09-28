"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FunnelStage } from "@/generated/prisma";
import {
  adminAction,
  enumValue,
  linesToArray,
  requiredString,
  revalidatePublicSite,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { deleteImage, keyFromUrl, saveWithImage } from "@/lib/storage";

function readBlogForm(formData: FormData) {
  return {
    slug: requiredString(formData, "slug", "Slug"),
    title: requiredString(formData, "title", "Title"),
    funnelStage: enumValue(FunnelStage, formData.get("funnelStage"), "funnel stage"),
    body: requiredString(formData, "body", "Body"),
    excerpt: toStringOrNull(formData.get("excerpt")),
    tags: linesToArray(formData.get("tags")),
    reviewedByDoctorId: toStringOrNull(formData.get("reviewedByDoctorId")),
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createBlogPost(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readBlogForm(formData);
    await saveWithImage(formData, "heroImageUrl", "blog", null, async (heroImageUrl) => {
      await prisma.blogPost.create({ data: { ...data, heroImageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    const data = readBlogForm(formData);
    const existing = await prisma.blogPost.findUniqueOrThrow({ where: { id }, select: { heroImageUrl: true } });
    await saveWithImage(formData, "heroImageUrl", "blog", existing.heroImageUrl, async (heroImageUrl) => {
      await prisma.blogPost.update({ where: { id }, data: { ...data, heroImageUrl } });
    });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<FormState> {
  return adminAction(async () => {
    const existing = await prisma.blogPost.findUniqueOrThrow({ where: { id }, select: { heroImageUrl: true } });
    await prisma.blogPost.delete({ where: { id } });
    await deleteImage(keyFromUrl(existing.heroImageUrl));
    revalidatePublicSite();
  });
}
