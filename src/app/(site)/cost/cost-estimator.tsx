"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EstimatorTreatment = {
  id: string;
  name: string;
  medicalName: string | null;
  descriptors: { label: string; value: string }[];
  estimate: string;
  priced: boolean;
  complexity: string | null;
};

export type EstimatorCategory = { id: string; name: string; treatments: EstimatorTreatment[] };

/** The client's recommended 2-step flow: category → treatment → indicative estimate. */
export function CostEstimator({ categories, disclaimer }: { categories: EstimatorCategory[]; disclaimer: string }) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [treatmentId, setTreatmentId] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId) ?? null;
  const treatment = category?.treatments.find((t) => t.id === treatmentId) ?? null;

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="step-1">
        <h2 id="step-1" className="font-heading text-xl font-semibold text-forest-900">
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta-700">Step 1 · </span>
          Select the condition or treatment category
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const active = c.id === categoryId;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategoryId(c.id);
                  setTreatmentId(null);
                }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium shadow-soft-sm transition-all",
                  active
                    ? "border-forest-600 bg-forest-50 text-forest-900 ring-2 ring-forest-600/20"
                    : "border-border bg-card text-card-foreground hover:border-forest-300"
                )}
              >
                {c.name}
                {active && <Check className="size-4 shrink-0 text-forest-700" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="step-2">
        <h2 id="step-2" className="font-heading text-xl font-semibold text-forest-900">
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta-700">Step 2 · </span>
          Select the preferred surgery or treatment
        </h2>
        {!category ? (
          <p className="mt-4 rounded-xl border border-dashed border-border bg-card/60 p-5 text-sm text-muted-foreground">
            Choose a category in step 1 to see the available treatments.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {category.treatments.map((t) => {
              const active = t.id === treatmentId;
              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex flex-col rounded-2xl border bg-card p-5 shadow-soft-sm transition-all",
                    active ? "border-forest-600 ring-2 ring-forest-600/20" : "border-border"
                  )}
                >
                  <p className="font-heading font-semibold uppercase tracking-wide text-forest-900">{t.name}</p>
                  {t.medicalName && <p className="mt-0.5 text-sm text-muted-foreground">{t.medicalName}</p>}
                  {t.descriptors.length > 0 && (
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      {t.descriptors.map((d) => (
                        <div key={d.label} className="flex gap-1">
                          <dt className="text-muted-foreground">{d.label}:</dt>
                          <dd className="font-medium text-card-foreground">{d.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <p className="mt-4 font-heading text-lg font-semibold text-terracotta-800">
                    {t.estimate}
                    {t.priced && "*"}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.priced ? "Estimated Treatment Cost" : "Pricing"}</p>
                  <Button
                    type="button"
                    variant={active ? "default" : "outline"}
                    aria-pressed={active}
                    onClick={() => setTreatmentId(t.id)}
                    className={cn(
                      "mt-4 w-full",
                      active
                        ? "bg-forest-700 text-white hover:bg-forest-800"
                        : "border-forest-300 text-forest-800 hover:bg-forest-50"
                    )}
                  >
                    {active ? "Selected" : "Select This Treatment"} <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section aria-live="polite" aria-label="Your estimate">
        {treatment && (
          <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-terracotta-700">{category?.name}</p>
            <p className="mt-1 font-heading text-lg font-semibold text-terracotta-950">{treatment.name}</p>
            {treatment.priced ? (
              <p className="mt-2 text-terracotta-950">
                Estimated Treatment Cost: <strong className="text-xl">{treatment.estimate}*</strong>{" "}
                depending on procedure complexity
                {treatment.complexity && <span className="text-sm"> ({treatment.complexity.toLowerCase()})</span>}.
              </p>
            ) : (
              <p className="mt-2 text-terracotta-950">
                Pricing for this option is given <strong>{treatment.estimate.toLowerCase()}</strong>. Book a visit and our
                coordinator will share the estimate after your evaluation.
              </p>
            )}
            {treatment.priced && <p className="mt-3 text-xs leading-relaxed text-terracotta-900/80">*{disclaimer}</p>}
            <Button
              size="xl"
              render={<Link href={`/book?treatment=${treatment.id}`} />}
              className="mt-5 bg-brand text-brand-foreground hover:bg-terracotta-700"
            >
              Book This Treatment <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
