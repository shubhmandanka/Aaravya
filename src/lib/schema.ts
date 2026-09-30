import { legacyAsset } from "@/lib/assets";

/** The live site's primary host (the bare domain 308-redirects here on Vercel). */
export const PRODUCTION_SITE_URL = "https://www.aaravyahospital.com";

/**
 * Origin for the sitemap, robots.txt, canonical tags and JSON-LD. Every
 * Vercel build (production and previews) uses the production domain, so
 * previews and the aaravya.vercel.app alias canonicalise to the real site,
 * and no deploy can publish the uploaded .env's localhost value or a
 * staging host. Elsewhere (local dev, local production builds)
 * NEXT_PUBLIC_SITE_URL still points it at the local server.
 */
export const SITE_URL = process.env.VERCEL
  ? PRODUCTION_SITE_URL
  : (process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_SITE_URL);

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema(opts: {
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: "Aaravya Hospital",
    url: SITE_URL,
    telephone: opts.phone,
    email: opts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: opts.address,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    sameAs: [opts.facebookUrl, opts.instagramUrl].filter((v): v is string => Boolean(v)),
  };
}

export function physicianSchema(doctor: {
  name: string;
  slug: string;
  qualifications: string;
  designation: string;
  photoUrl?: string | null;
  registrationNumber?: string | null;
}) {
  const image = absoluteImage(legacyAsset(doctor.photoUrl));
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: absoluteUrl(`/doctors/${doctor.slug}`),
    ...(image ? { image } : {}),
    medicalSpecialty: doctor.designation,
    honorificSuffix: doctor.qualifications,
    ...(doctor.registrationNumber ? { identifier: doctor.registrationNumber } : {}),
    worksFor: { "@type": "Hospital", name: "Aaravya Hospital", url: SITE_URL },
  };
}

export function medicalWebPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  lastReviewed: Date;
  reviewedByName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    lastReviewed: opts.lastReviewed.toISOString(),
    ...(opts.reviewedByName
      ? { reviewedBy: { "@type": "Physician", name: opts.reviewedByName } }
      : {}),
  };
}

/** `image` accepts a root-relative path or an absolute URL, as returned by `legacyAsset`. */
function absoluteImage(image: string | null | undefined) {
  if (!image) return undefined;
  return /^https?:\/\//.test(image) ? image : absoluteUrl(image);
}

export function medicalProcedureSchema(opts: {
  name: string;
  description: string;
  url: string;
  image?: string | null;
}) {
  const image = absoluteImage(opts.image);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(image ? { image } : {}),
  };
}

export function blogPostingSchema(opts: {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished: Date;
  dateModified: Date;
  reviewedByName?: string | null;
}) {
  const image = absoluteImage(opts.image);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    ...(image ? { image } : {}),
    datePublished: opts.datePublished.toISOString(),
    dateModified: opts.dateModified.toISOString(),
    author: { "@type": "Organization", name: "Aaravya Hospital", url: SITE_URL },
    publisher: { "@type": "Hospital", name: "Aaravya Hospital", url: SITE_URL },
    ...(opts.reviewedByName
      ? { reviewedBy: { "@type": "Physician", name: opts.reviewedByName } }
      : {}),
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
