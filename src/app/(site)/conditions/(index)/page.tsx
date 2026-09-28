import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { legacyAsset } from "@/lib/assets";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getConditionsGroupedByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Conditions & Treatments",
  description:
    "Proctology, general surgery, urology, and peripheral vascular conditions treated at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function ConditionsPage() {
  const groups = await getConditionsGroupedByCategory();

  return (
    <div>
      <PageHero
        eyebrow="Specialties"
        title="Conditions & Treatments"
        description="From non-surgical management to laser and surgical care — browse by specialty to find the right treatment page."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <div key={group.category}>
              <Reveal>
                <h2 className="font-heading text-2xl font-semibold text-forest-900">{group.label}</h2>
              </Reveal>
              <RevealGroup className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {group.conditions.map((c) => (
                  <RevealItem key={c.slug}>
                    <Link
                      href={`/conditions/${c.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                    >
                      <div className="relative aspect-[4/3] bg-forest-50">
                        {legacyAsset(c.heroImageUrl) && (
                          <Image
                            src={legacyAsset(c.heroImageUrl)!}
                            alt={c.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <p className="px-5 pt-4 font-heading font-medium text-card-foreground">{c.name}</p>
                      <span className="mx-5 mb-4 mt-2 inline-flex items-center gap-1 text-xs text-terracotta-700 opacity-0 transition-opacity group-hover:opacity-100">
                        View treatment <ArrowRight className="size-3" />
                      </span>
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
