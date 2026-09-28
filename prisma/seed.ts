import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ConditionCategory, MediaCategory, MediaType } from "../src/generated/prisma";

import conditionsData from "./seed-data/conditions.json";
import doctorsData from "./seed-data/doctors.json";
import locationData from "./seed-data/location.json";
import faqsData from "./seed-data/faqs.json";
import mediaVideosData from "./seed-data/media-videos.json";
import { seedCostEstimator } from "../src/lib/cost-estimator-seed";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type TreatmentOption = { title: string; description: string };

type ConditionSeed = {
  slug: string;
  name: string;
  category: keyof typeof ConditionCategory;
  heroImageUrl: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  directAnswer: string;
  introText: string | null;
  definitionHeading: string | null;
  definitionText: string | null;
  symptoms: string[];
  causes: string | null;
  treatmentOptions: TreatmentOption[];
  whyChooseUsPoints: string[];
  closingHeading: string | null;
  closingText: string | null;
};

/**
 * The static site never captured procedure-specific operational data (duration,
 * anesthesia, hospital stay, success rate) — those are new fields the client
 * still needs to supply via /admin. Rather than invent numbers, we derive one
 * flagship Procedure per condition directly from its own treatmentOptions text
 * (preferring a "laser" option, else the last/most-invasive option per the
 * site's own conservative → surgical ordering), leaving operational fields null.
 */
function pickFlagshipOption(options: TreatmentOption[]): TreatmentOption | null {
  if (options.length === 0) return null;
  const laser = options.find((o) => /laser/i.test(o.title));
  return laser ?? options[options.length - 1];
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding location...");
  await prisma.location.deleteMany({});
  await prisma.location.create({ data: locationData });

  console.log("Seeding site settings...");
  const siteSettings: Record<string, string> = {
    phone: locationData.phone,
    whatsapp: locationData.whatsapp,
    email: locationData.email,
    instagram_url: "https://www.instagram.com/aaravyahospital1/",
    facebook_url:
      "https://www.facebook.com/profile.php?id=61561559725258",
    ga4_id: "G-CKF6RLLS27",
    gtm_id: "GTM-PZ8M7LVZ",
  };
  for (const [key, value] of Object.entries(siteSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log(`Seeding ${doctorsData.length} doctors...`);
  const doctorIdBySlug = new Map<string, string>();
  for (const [i, raw] of (doctorsData as Array<Record<string, unknown>>).entries()) {
    // doctors.json is in display order: Dr. Deep Prajapati, then Dr. Dipti Prajapati.
    const doctor = { ...raw, sortOrder: i + 1 };
    const created = await prisma.doctor.upsert({
      where: { slug: raw.slug as string },
      update: doctor as never,
      create: doctor as never,
    });
    doctorIdBySlug.set(created.slug, created.id);
  }
  const primaryDoctorId =
    doctorIdBySlug.get("dr-deep-prajapati") ?? [...doctorIdBySlug.values()][0];

  console.log(`Seeding ${conditionsData.length} conditions...`);
  const conditionIdBySlug = new Map<string, string>();
  for (const condition of conditionsData as ConditionSeed[]) {
    const created = await prisma.condition.upsert({
      where: { slug: condition.slug },
      update: {
        name: condition.name,
        category: ConditionCategory[condition.category],
        heroImageUrl: condition.heroImageUrl,
        seoTitle: condition.seoTitle,
        metaDescription: condition.metaDescription,
        directAnswer: condition.directAnswer,
        introText: condition.introText,
        definitionHeading: condition.definitionHeading,
        definitionText: condition.definitionText,
        symptoms: condition.symptoms,
        causes: condition.causes,
        treatmentOptions: condition.treatmentOptions,
        whyChooseUsPoints: condition.whyChooseUsPoints,
        closingHeading: condition.closingHeading,
        closingText: condition.closingText,
        reviewedByDoctorId: primaryDoctorId,
      },
      create: {
        slug: condition.slug,
        name: condition.name,
        category: ConditionCategory[condition.category],
        heroImageUrl: condition.heroImageUrl,
        seoTitle: condition.seoTitle,
        metaDescription: condition.metaDescription,
        directAnswer: condition.directAnswer,
        introText: condition.introText,
        definitionHeading: condition.definitionHeading,
        definitionText: condition.definitionText,
        symptoms: condition.symptoms,
        causes: condition.causes,
        treatmentOptions: condition.treatmentOptions,
        whyChooseUsPoints: condition.whyChooseUsPoints,
        closingHeading: condition.closingHeading,
        closingText: condition.closingText,
        reviewedByDoctorId: primaryDoctorId,
      },
    });
    conditionIdBySlug.set(created.slug, created.id);
  }

  console.log("Deriving one flagship procedure per condition...");
  let procedureCount = 0;
  for (const condition of conditionsData as ConditionSeed[]) {
    const flagship = pickFlagshipOption(condition.treatmentOptions);
    if (!flagship) continue;
    const conditionId = conditionIdBySlug.get(condition.slug)!;
    const procedureSlug = `${condition.slug}-${slugify(flagship.title)}`;
    await prisma.procedure.upsert({
      where: { slug: procedureSlug },
      update: {
        name: `${flagship.title} for ${condition.name}`,
        description: flagship.description,
        conditionId,
      },
      create: {
        slug: procedureSlug,
        name: `${flagship.title} for ${condition.name}`,
        description: flagship.description,
        conditionId,
      },
    });
    procedureCount++;
  }
  console.log(`Created/updated ${procedureCount} procedures.`);

  console.log(`Seeding ${faqsData.length} FAQs...`);
  await prisma.faq.deleteMany({});
  let sortOrder = 0;
  for (const faq of faqsData as Array<{
    question: string;
    answer: string;
    pageContext: string;
    topic: string | null;
  }>) {
    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        pageContext: faq.pageContext,
        topic: faq.topic,
        conditionId: faq.topic ? conditionIdBySlug.get(faq.topic) ?? null : null,
        sortOrder: sortOrder++,
      },
    });
  }

  console.log("Seeding gallery/testimonial media...");
  await prisma.mediaItem.deleteMany({});
  const mediaItems: Array<{
    type: keyof typeof MediaType;
    category: keyof typeof MediaCategory;
    url?: string;
    youtubeId?: string;
    sortOrder: number;
  }> = [];

  for (let i = 1; i <= 16; i++) {
    mediaItems.push({
      type: "IMAGE",
      category: "HAPPY_FACES",
      url: `/assets/img/happy-faces/h${i}.jpg`,
      sortOrder: i,
    });
  }
  for (let i = 1; i <= 8; i++) {
    mediaItems.push({
      type: "IMAGE",
      category: "INTERIOR",
      url: `/assets/img/interior/i${i}.jpg`,
      sortOrder: i,
    });
  }
  for (let i = 1; i <= 10; i++) {
    mediaItems.push({
      type: "IMAGE",
      category: "SURGERY",
      url: `/assets/img/surgery/s${i}.jpg`,
      sortOrder: i,
    });
  }
  mediaItems.push({
    type: "IMAGE",
    category: "SURGERY",
    url: `/assets/img/surgery/s11.png`,
    sortOrder: 11,
  });
  for (let i = 1; i <= 11; i++) {
    mediaItems.push({
      type: "IMAGE",
      category: "TESTIMONIAL",
      url: `/assets/img/testimonials/testimonial${i}.png`,
      sortOrder: i,
    });
  }
  (mediaVideosData.surgeryVideoIds as string[]).forEach((youtubeId, i) => {
    mediaItems.push({ type: "VIDEO", category: "SURGERY", youtubeId, sortOrder: 100 + i });
  });
  (mediaVideosData.testimonialVideoIds as string[]).forEach((youtubeId, i) => {
    mediaItems.push({ type: "VIDEO", category: "TESTIMONIAL", youtubeId, sortOrder: 100 + i });
  });

  for (const item of mediaItems) {
    await prisma.mediaItem.create({
      data: {
        type: MediaType[item.type],
        category: MediaCategory[item.category],
        url: item.url,
        youtubeId: item.youtubeId,
        sortOrder: item.sortOrder,
      },
    });
  }
  console.log(`Created ${mediaItems.length} media items.`);

  console.log("Seeding cost estimator (create-only)...");
  console.log(`Created ${await seedCostEstimator(prisma)} cost estimator rows.`);

  console.log(
    "\nNote: patient testimonial quotes/captions were never captured in the legacy site's markup " +
      "(images/videos have no attached patient names or quote text there), so the Testimonial table " +
      "is intentionally left empty here — add real ones via /admin rather than inventing quotes.\n"
  );

  console.log("Seed complete.");
  console.log(
    "Admin login is provisioned separately via Supabase Auth — run " +
      "`npx tsx scripts/create-admin-user.ts <email> <password>` to create it."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
