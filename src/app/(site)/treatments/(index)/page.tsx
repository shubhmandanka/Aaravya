import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { getProceduresGroupedByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Surgical Techniques",
  description:
    "Laser, minimally invasive and surgical techniques used at Aaravya Hospital, Chandkheda, Ahmedabad — grouped by specialty.",
};

export default async function SurgicalTechniquesPage() {
  const groups = await getProceduresGroupedByCategory();

  return (
    <div>
      <PageHero
        eyebrow="Our Procedures"
        title="Surgical Techniques"
        description="The laser, minimally invasive and surgical techniques our doctors use — each with what to expect before, during and after."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <section key={group.category}>
              <Reveal>
                <h2 className="font-heading text-2xl font-semibold text-forest-900">{group.label}</h2>
              </Reveal>
              <RevealGroup className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.procedures.map((p) => {
                  // Falls back to the condition's photo until a procedure has its own image.
                  const image = legacyAsset(p.imageUrl) ?? legacyAsset(p.condition.heroImageUrl);
                  return (
                    <RevealItem key={p.slug}>
                      <Link
                        href={`/treatments/${p.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                      >
                        <div className="relative aspect-[16/9] bg-forest-50">
                          {image && (
                            <Image
                              src={image}
                              alt={p.condition.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                              className="object-contain p-4"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="font-mono text-[0.7rem] uppercase tracking-wide text-terracotta-700">
                            {p.condition.name}
                          </p>
                          <h3 className="mt-1.5 text-balance font-heading font-semibold text-forest-900">{p.name}</h3>
                          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-terracotta-700">
                            Procedure details <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
