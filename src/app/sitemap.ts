import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/schema";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [conditions, doctors, procedures, blogPosts] = await Promise.all([
    prisma.condition.findMany({ select: { slug: true, lastUpdatedAt: true } }),
    prisma.doctor.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.procedure.findMany({ select: { slug: true, lastUpdatedAt: true } }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, lastUpdatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/cost",
    "/blog",
    "/faqs",
    "/gallery",
    "/testimonials",
    "/doctors",
    "/conditions",
    "/treatments",
    "/book",
    "/symptom-checker",
    "/anonymous-consultation",
    "/privacy",
  ].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));

  const conditionRoutes: MetadataRoute.Sitemap = conditions.map((c) => ({
    url: `${SITE_URL}/conditions/${c.slug}`,
    lastModified: c.lastUpdatedAt,
  }));
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${SITE_URL}/doctors/${d.slug}`,
    lastModified: d.updatedAt,
  }));
  const procedureRoutes: MetadataRoute.Sitemap = procedures.map((p) => ({
    url: `${SITE_URL}/treatments/${p.slug}`,
    lastModified: p.lastUpdatedAt,
  }));
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.lastUpdatedAt,
  }));
  const anonymousRoutes: MetadataRoute.Sitemap = ANONYMOUS_CATEGORIES.map((c) => ({
    url: `${SITE_URL}/anonymous-consultation/${c.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...conditionRoutes,
    ...doctorRoutes,
    ...procedureRoutes,
    ...blogRoutes,
    ...anonymousRoutes,
  ];
}
