import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ConditionCategory, InsuranceType, type Prisma } from "@/generated/prisma";

export const INSURANCE_LABELS: Record<InsuranceType, string> = {
  CASHLESS: "Cashless insurance",
  REIMBURSEMENT: "Insurance reimbursement",
  NONE: "Without insurance",
};

export const CATEGORY_LABELS: Record<ConditionCategory, string> = {
  PROCTOLOGY: "Proctology",
  GENERAL_SURGERY: "General Surgery",
  UROLOGY: "Urology",
  PERIPHERAL_VASCULAR: "Peripheral Vascular Diseases",
};

export const CATEGORY_ORDER: ConditionCategory[] = [
  "PROCTOLOGY",
  "GENERAL_SURGERY",
  "UROLOGY",
  "PERIPHERAL_VASCULAR",
];

export async function getConditionsGroupedByCategory() {
  const conditions = await prisma.condition.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, category: true, heroImageUrl: true },
  });

  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    conditions: conditions.filter((c) => c.category === category),
  })).filter((group) => group.conditions.length > 0);
}

export async function getAllConditionSlugs() {
  const conditions = await prisma.condition.findMany({ select: { slug: true } });
  return conditions.map((c) => c.slug);
}

/**
 * Wrapped in React's `cache()` because this is called once from
 * `generateMetadata` and once from the page component for the same request —
 * without this, every visit to a condition page ran the (fairly heavy)
 * query, with its `procedures`/`faqs`/`reviewedByDoctor` includes, twice.
 * `cache()` dedupes calls with the same arguments within a single render.
 */
export const getConditionBySlug = cache(async (slug: string) => {
  return prisma.condition.findUnique({
    where: { slug },
    include: {
      reviewedByDoctor: true,
      procedures: true,
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
});

/** The one display order for doctors everywhere they're listed. */
export const DOCTOR_ORDER = [{ sortOrder: "asc" }, { createdAt: "asc" }] satisfies Prisma.DoctorOrderByWithRelationInput[];

export async function getAllDoctors() {
  return prisma.doctor.findMany({ orderBy: DOCTOR_ORDER });
}

/** See `getConditionBySlug` — same generateMetadata + page double-fetch fix. */
export const getDoctorBySlug = cache(async (slug: string) => {
  return prisma.doctor.findUnique({
    where: { slug },
    include: { reviewedConditions: true, procedures: true },
  });
});

/** Every procedure grouped by its condition's specialty, for the Surgical Techniques page. */
export async function getProceduresGroupedByCategory() {
  const procedures = await prisma.procedure.findMany({
    orderBy: [{ condition: { name: "asc" } }, { name: "asc" }],
    select: {
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      condition: { select: { slug: true, name: true, category: true, heroImageUrl: true } },
    },
  });
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    procedures: procedures.filter((p) => p.condition.category === category),
  })).filter((group) => group.procedures.length > 0);
}

export async function getAllProcedureSlugs() {
  const procedures = await prisma.procedure.findMany({ select: { slug: true } });
  return procedures.map((p) => p.slug);
}

/** See `getConditionBySlug` — same generateMetadata + page double-fetch fix. */
export const getProcedureBySlug = cache(async (slug: string) => {
  return prisma.procedure.findUnique({
    where: { slug },
    include: { condition: true, doctor: true },
  });
});

export async function getFaqs(pageContext?: string) {
  return prisma.faq.findMany({
    where: pageContext ? { pageContext } : undefined,
    orderBy: [{ pageContext: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getMediaByCategory(category: "HAPPY_FACES" | "INTERIOR" | "SURGERY" | "TESTIMONIAL") {
  return prisma.mediaItem.findMany({
    where: { category },
    orderBy: { sortOrder: "asc" },
  });
}

/** Cost estimator step 1 → step 2 data, in display order. */
export const getCostEstimator = cache(async () => {
  return prisma.costCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      condition: { select: { slug: true } },
      treatments: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
    },
  });
});

export type CostEstimatorData = Awaited<ReturnType<typeof getCostEstimator>>;

/** Approved entries that have something to show (a quote, photo, or video). */
export async function getApprovedTestimonials(opts: { featuredOnly?: boolean; limit?: number } = {}) {
  return prisma.testimonial.findMany({
    where: {
      isApproved: true,
      ...(opts.featuredOnly ? { isFeatured: true } : {}),
      OR: [{ quote: { not: null } }, { imageUrl: { not: null } }, { videoUrl: { not: null } }],
    },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: opts.limit,
    include: { condition: { select: { slug: true, name: true } } },
  });
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: { slug: true, title: true, excerpt: true, heroImageUrl: true, tags: true, createdAt: true },
  });
}

export async function getPublishedBlogSlugs() {
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true } });
  return posts.map((p) => p.slug);
}

/** See `getConditionBySlug` — same generateMetadata + page double-fetch fix.
 * Unpublished posts resolve to `null`, so drafts 404 publicly. */
export const getPublishedBlogPostBySlug = cache(async (slug: string) => {
  return prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    include: { reviewedByDoctor: { select: { name: true, slug: true, qualifications: true, photoUrl: true } } },
  });
});

/** Cached per request: the layout, header, footer and page all read it. */
export const getPrimaryLocation = cache(async () => {
  return prisma.location.findFirst({ where: { isPrimary: true }, orderBy: { createdAt: "asc" } });
});

/**
 * Wrapped in `cache()` too: this is fetched independently in
 * `(site)/layout.tsx` (for the org JSON-LD + analytics IDs + header/footer)
 * and, previously, again inside the chat widget's data loader — the widget
 * has since been changed to receive settings as a prop instead of
 * re-fetching, but `cache()` is kept here as a safety net for any future
 * caller that also needs settings within the same request.
 */
export const getSiteSettings = cache(async () => {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
});

const DEFAULT_PHONE = "+91 87338 89957";
const DEFAULT_WHATSAPP = "918733889957";
const DEFAULT_EMAIL = "aaravyahospital@gmail.com";

export type ContactDetails = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  whatsappHref: (message?: string) => string;
};

/** Hospital contact details from the primary Location (the single source of
 * truth for phone/WhatsApp/email), with the original numbers as fallback —
 * the one place public pages should get a phone/WhatsApp link from. */
export async function getContactDetails(): Promise<ContactDetails> {
  const location = await getPrimaryLocation();
  const phone = location?.phone?.trim() || DEFAULT_PHONE;
  const whatsapp = location?.whatsapp?.trim() || DEFAULT_WHATSAPP;
  return {
    phone,
    phoneHref: `tel:${phone.replace(/[^\d+]/g, "")}`,
    whatsapp,
    email: location?.email?.trim() || DEFAULT_EMAIL,
    whatsappHref: (message?: string) =>
      `https://wa.me/${whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`,
  };
}
