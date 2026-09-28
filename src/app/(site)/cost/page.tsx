import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { CostDisclaimer } from "@/components/site/cost-disclaimer";
import { COST_DISCLAIMER, COST_ESTIMATOR_NOTE } from "@/content/cost-estimator";
import { COST_BANDS, PRICED_BANDS, formatBand, isPricedBand } from "@/lib/cost-bands";
import { getContactDetails, getCostEstimator } from "@/lib/queries";
import { CostEstimator, type EstimatorCategory } from "./cost-estimator";

export const metadata: Metadata = {
  title: "Treatment Cost Estimator",
  description:
    "Estimated treatment costs for piles, fissure, fistula, pilonidal sinus and other proctology treatments at Aaravya Hospital, Ahmedabad.",
};

export default async function CostPage() {
  const [categories, contact] = await Promise.all([getCostEstimator(), getContactDetails()]);

  const estimatorData: EstimatorCategory[] = categories
    .filter((c) => c.treatments.length > 0)
    .map((c) => ({
      id: c.id,
      name: c.name,
      treatments: c.treatments.map((t) => {
        const band = COST_BANDS[t.band];
        return {
          id: t.id,
          name: t.name,
          medicalName: t.medicalName,
          descriptors: [
            { label: "Effectiveness", value: t.effectiveness },
            { label: "Cost", value: t.costLevel },
            { label: "Discomfort", value: t.discomfort },
            { label: "Recovery", value: t.recovery },
          ].filter((d): d is { label: string; value: string } => Boolean(d.value)),
          estimate: formatBand(t.band),
          priced: band.kind === "range",
          complexity: band.kind === "range" ? band.complexity : null,
        };
      }),
    }));

  return (
    <div>
      <PageHero
        eyebrow="Transparent Pricing"
        title="Treatment Cost Estimator"
        description="Pick your condition and preferred treatment to see an indicative estimated treatment cost — no surprises before your procedure."
      >
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<a href={contact.phoneHref} />}
            className="border-forest-300 text-forest-800 hover:bg-forest-50"
          >
            <Phone className="mr-1.5 size-4" /> Call for a personal estimate
          </Button>
        </div>
      </PageHero>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        {estimatorData.length > 0 ? (
          <CostEstimator categories={estimatorData} disclaimer={COST_DISCLAIMER} />
        ) : (
          <div className="rounded-2xl border border-dashed border-forest-200 bg-forest-50/60 p-8 text-center">
            <p className="font-heading font-semibold text-forest-900">Cost estimator launching soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Call our coordinator for a personalized estimate before your visit.
            </p>
          </div>
        )}

        {estimatorData.length > 0 && (
          <Reveal as="section" className="mt-16">
            <h2 id="price-list" className="font-heading text-2xl font-semibold text-forest-900">
              Full Price List
            </h2>
            <div className="mt-5 flex flex-col gap-6">
              {categories
                .filter((c) => c.treatments.length > 0)
                .map((c) => (
                  <div key={c.id} className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft-sm">
                    <table className="w-full text-sm">
                      <caption className="border-b border-border bg-forest-50 px-4 py-2.5 text-left font-heading font-semibold text-forest-900">
                        {c.name}
                      </caption>
                      <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-4 py-2 font-medium">Treatment</th>
                          <th scope="col" className="px-4 py-2 font-medium">Medical name</th>
                          <th scope="col" className="px-4 py-2 text-right font-medium">Estimated Treatment Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {c.treatments.map((t) => (
                          <tr key={t.id} className="border-t border-border/70">
                            <td className="px-4 py-2.5 font-medium text-card-foreground">{t.name}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{t.medicalName ?? "—"}</td>
                            <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium text-terracotta-800">
                              {formatBand(t.band)}
                              {isPricedBand(t.band) && "*"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
            <CostDisclaimer className="mt-4" />
          </Reveal>
        )}

        <Reveal as="section" className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
            <h2 className="font-heading font-semibold text-forest-900">How estimates are banded</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every estimate uses a standardized ₹5,000 band; the band depends on procedure complexity.
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {PRICED_BANDS.map((b) => {
                const band = COST_BANDS[b];
                return (
                  <li key={b} className="flex justify-between gap-4">
                    <span className="font-medium text-terracotta-800">{formatBand(b)}</span>
                    <span className="text-muted-foreground">{band.kind === "range" ? band.complexity : ""}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
            <h2 className="font-heading font-semibold text-forest-900">What else may be applicable</h2>
            {COST_ESTIMATOR_NOTE.map((p) => (
              <p key={p.slice(0, 24)} className="mt-2 text-sm text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 rounded-2xl bg-sage-100 p-6 text-sage-900">
          <p className="font-heading font-semibold">Cashless &amp; EMI</p>
          <p className="mt-2 text-sm text-sage-800/90">
            Our insurance desk can verify your policy&rsquo;s cashless eligibility
            before your procedure, and EMI options are available for approved
            treatment plans. Confirm details with our coordinator when you book.
          </p>
          <Button
            variant="outline"
            render={<Link href="/book" />}
            className="mt-4 border-sage-400 text-sage-900 hover:bg-sage-200"
          >
            Book a Consultation
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
