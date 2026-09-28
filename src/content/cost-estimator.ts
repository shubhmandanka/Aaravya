import type { CostBand } from "@/generated/prisma";

/**
 * Initial cost-estimator data, transcribed from the client's
 * "Aaravya Hospital — Patient-Friendly Cost Estimator: Proctology Treatments"
 * brief (standardised ranges version). After seeding, the data is managed in
 * /admin/cost-estimator; this file only seeds empty environments.
 *
 * The brief notes that the effectiveness / discomfort / recovery descriptors
 * are proposed patient-facing labels, not figures from the tariff.
 */
type SeedTreatment = {
  name: string;
  medicalName?: string;
  effectiveness?: string;
  costLevel?: string;
  discomfort?: string;
  recovery?: string;
  band: CostBand;
};

type SeedCategory = { slug: string; name: string; conditionSlug?: string; treatments: SeedTreatment[] };

export const COST_ESTIMATOR_SEED: SeedCategory[] = [
  {
    slug: "piles",
    name: "Piles / Hemorrhoids",
    conditionSlug: "piles",
    treatments: [
      { name: "Laser Piles Surgery", medicalName: "LHP", effectiveness: "High", costLevel: "₹₹₹", discomfort: "Low", recovery: "Fast", band: "ADVANCED" },
      { name: "Laser Piles Removal", medicalName: "Laser Hemorrhoidectomy", effectiveness: "High", costLevel: "₹₹₹", discomfort: "Low–Moderate", recovery: "Fast–Moderate", band: "ADVANCED" },
      { name: "Stapler Piles Surgery", medicalName: "PPH / MIPH", effectiveness: "High", costLevel: "₹₹₹", discomfort: "Low–Moderate", recovery: "Fast", band: "ADVANCED" },
      { name: "Piles Artery Ligation", medicalName: "FG-HAL", effectiveness: "High", costLevel: "₹₹₹", discomfort: "Low", recovery: "Fast", band: "ADVANCED" },
    ],
  },
  {
    slug: "anal-fissure",
    name: "Anal Fissure",
    conditionSlug: "fissure",
    treatments: [
      { name: "Laser Fissure Surgery", medicalName: "Laser Fissurectomy + LIS", effectiveness: "High", costLevel: "₹₹", discomfort: "Low–Moderate", recovery: "Fast", band: "ADVANCED" },
      { name: "Fissure Surgery", medicalName: "LIS", effectiveness: "High", costLevel: "₹₹", discomfort: "Low–Moderate", recovery: "Fast", band: "LOWER" },
      { name: "Fissure Removal Surgery", medicalName: "Fissurectomy", effectiveness: "High", costLevel: "₹₹", discomfort: "Moderate", recovery: "Moderate", band: "LOWER" },
    ],
  },
  {
    slug: "anal-fistula",
    name: "Anal Fistula",
    conditionSlug: "fistula",
    treatments: [
      { name: "Laser Fistula Surgery", medicalName: "FiLaC", effectiveness: "Variable", costLevel: "₹₹₹", discomfort: "Low–Moderate", recovery: "Fast", band: "ADVANCED" },
      { name: "LIFT Fistula Surgery", medicalName: "LIFT", effectiveness: "Variable", costLevel: "₹₹₹", discomfort: "Low–Moderate", recovery: "Moderate", band: "ADVANCED" },
      { name: "Fistula Opening Surgery", medicalName: "Fistulotomy", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate", recovery: "Moderate", band: "MODERATE" },
      { name: "Fistula Removal Surgery", medicalName: "Fistulectomy", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate–High", recovery: "Moderate", band: "HIGHER" },
    ],
  },
  {
    slug: "pilonidal-sinus",
    name: "Pilonidal Sinus",
    conditionSlug: "pns",
    treatments: [
      { name: "Laser Pilonidal Sinus Surgery", effectiveness: "Variable", costLevel: "₹₹₹", discomfort: "Low–Moderate", recovery: "Fast", band: "ADVANCED" },
      { name: "Pilonidal Sinus Removal Surgery", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate", recovery: "Moderate", band: "HIGHER" },
    ],
  },
  {
    slug: "perianal-abscess",
    name: "Perianal Abscess",
    conditionSlug: "perianal",
    treatments: [
      { name: "Anal Abscess Drainage", medicalName: "Incision & Drainage", effectiveness: "High for appropriate drainage", costLevel: "₹₹", discomfort: "Moderate", recovery: "Fast–Moderate", band: "LOWER" },
    ],
  },
  {
    slug: "ksharsutra-wing",
    name: "Ksharsutra Wing",
    treatments: [
      { name: "Ksharsutra for Fistula", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate", recovery: "Gradual", band: "LOWER" },
      { name: "Ksharsutra for Pilonidal Sinus", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate", recovery: "Gradual", band: "LOWER" },
      { name: "Ksharsutra Treatment", effectiveness: "Variable", costLevel: "₹₹", discomfort: "Moderate", recovery: "Gradual", band: "LOWER" },
      { name: "Ksharsutra Consultation", band: "CONSULTATION" },
    ],
  },
  {
    slug: "other-anal-rectal",
    name: "Other Anal / Rectal Conditions",
    conditionSlug: "ano-rectal-diseases",
    treatments: [
      { name: "Anal Skin Tag Removal", medicalName: "Skin Tag Excision", effectiveness: "High", costLevel: "₹", discomfort: "Low–Moderate", recovery: "Fast", band: "LOWER" },
      { name: "Anal Polyp Removal", medicalName: "Anal Papillectomy / Polypectomy", effectiveness: "High", costLevel: "₹", discomfort: "Low–Moderate", recovery: "Fast", band: "LOWER" },
      { name: "Other / Not Sure", band: "AFTER_CONSULTATION" },
    ],
  },
];

/** Shown visibly next to every displayed estimate (page, cards, PDF, treatment pages). */
export const COST_DISCLAIMER =
  "Estimated Treatment Cost only, not a guaranteed package price. OT charges, laser surcharge, anaesthesia, room/nursing, investigations and other applicable services may be additionally applicable. The final estimate is confirmed after clinical evaluation.";

/** "Important Estimator Note" from the brief, reworded for patients; the figures are the brief's own. */
export const COST_ESTIMATOR_NOTE = [
  "These are indicative estimates. The final bill may vary according to the actual procedure performed, clinical requirements, anaesthesia, room category, duration of stay, investigations, additional procedures and other applicable services.",
  "As per the hospital tariff, the following may be additionally applicable: a one-time OT charge of 30% of the primary surgeon's tariff, a ₹8,000 single-session laser surcharge when laser arrays are used, anaesthesia charges of ₹3,000 (local/sedation) or ₹5,000 (general/spinal), and room/nursing charges by room category.",
];
