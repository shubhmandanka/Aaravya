import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { CostDisclaimer } from "@/components/site/cost-disclaimer";
import { legacyAsset } from "@/lib/assets";
import { getAllProcedureSlugs, getProcedureBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, medicalProcedureSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const slugs = await getAllProcedureSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);
  if (!procedure) return {};
  return {
    title: procedure.name,
    description: procedure.description.slice(0, 155),
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);
  if (!procedure) notFound();

  const facts = [
    { label: "Duration", value: procedure.duration },
    { label: "Anesthesia", value: procedure.anesthesiaType },
    { label: "Hospital Stay", value: procedure.hospitalStay },
    { label: "Success Rate", value: procedure.successRate },
  ].filter((f) => f.value);

  const image = legacyAsset(procedure.imageUrl);
  const schema = medicalProcedureSchema({
    name: procedure.name,
    description: procedure.description,
    url: absoluteUrl(`/treatments/${procedure.slug}`),
    image,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/conditions/${procedure.condition.slug}`} className="hover:text-forest-800">
          {procedure.condition.name}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{procedure.name}</span>
      </nav>

      <h1 className="mt-4 text-balance font-heading text-4xl font-semibold text-forest-900">{procedure.name}</h1>

      {image && (
        <div className="relative mt-6 h-64 overflow-hidden rounded-2xl border border-border bg-forest-50 sm:h-80">
          <Image
            src={image}
            alt={procedure.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain p-6"
            priority
          />
        </div>
      )}

      <p className="mt-4 text-muted-foreground">{procedure.description}</p>

      {facts.length > 0 ? (
        <Reveal className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-border bg-card p-4 text-center shadow-soft-sm">
              <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </p>
              <p className="mt-1 font-heading font-semibold text-forest-900">{f.value}</p>
            </div>
          ))}
        </Reveal>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-forest-50/60 p-5 text-sm text-muted-foreground">
          Duration, anesthesia type, hospital stay, and success-rate figures for
          this procedure will be published here once confirmed by our
          clinical team — call us for exact details for your case.
        </div>
      )}

      {(procedure.costMin || procedure.costMax) && (
        <div className="mt-6 rounded-xl bg-terracotta-50 p-5 text-terracotta-950">
          <p className="font-heading font-semibold">
            Estimated Treatment Cost:{" "}
            {[procedure.costMin, procedure.costMax]
              .filter((n): n is number => n !== null)
              .map((n) => `₹${n.toLocaleString("en-IN")}`)
              .join("–")}
            *
          </p>
          <CostDisclaimer className="mt-2 text-terracotta-900/80" />
          <Link href="/cost" className="mt-2 inline-block text-sm underline">
            See the full cost estimator
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button
          size="xl"
          render={<Link href={`/book?condition=${procedure.condition.slug}`} />}
          className="bg-brand text-brand-foreground hover:bg-terracotta-700"
        >
          Book This Procedure
        </Button>
        <Button
          size="xl"
          variant="outline"
          render={<Link href={`/conditions/${procedure.condition.slug}`} />}
          className="border-forest-300 text-forest-800 hover:bg-forest-50"
        >
          Back to {procedure.condition.name}
        </Button>
      </div>
    </div>
  );
}
