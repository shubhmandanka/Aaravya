import type { CostBand } from "@/generated/prisma";

type PricedBand = { kind: "range"; min: number; max: number; complexity: string };
type TextBand = { kind: "text"; text: string };

/**
 * The client's standardised ₹5,000 website bands ("Standardized Website
 * Pricing Bands" in the cost estimator brief). Every displayed estimate comes
 * from here, so a price can only ever be one of these ranges.
 */
export const COST_BANDS: Record<CostBand, PricedBand | TextBand> = {
  LOWER: { kind: "range", min: 29999, max: 34999, complexity: "Lower complexity" },
  MODERATE: { kind: "range", min: 34999, max: 39999, complexity: "Moderate complexity" },
  HIGHER: { kind: "range", min: 39999, max: 44999, complexity: "Higher complexity" },
  ADVANCED: { kind: "range", min: 44999, max: 49999, complexity: "Advanced / higher complexity" },
  CONSULTATION: { kind: "text", text: "Consultation" },
  AFTER_CONSULTATION: { kind: "text", text: "After consultation" },
};

export const PRICED_BANDS = (Object.keys(COST_BANDS) as CostBand[]).filter((b) => COST_BANDS[b].kind === "range");

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** "₹44,999–₹49,999", or "Consultation" / "After consultation". */
export function formatBand(band: CostBand) {
  const b = COST_BANDS[band];
  return b.kind === "range" ? `${inr(b.min)}–${inr(b.max)}` : b.text;
}

export function isPricedBand(band: CostBand) {
  return COST_BANDS[band].kind === "range";
}

/** Label for admin dropdowns, e.g. "₹44,999–₹49,999 — Advanced / higher complexity". */
export function bandOptionLabel(band: CostBand) {
  const b = COST_BANDS[band];
  return b.kind === "range" ? `${formatBand(band)} — ${b.complexity}` : b.text;
}
