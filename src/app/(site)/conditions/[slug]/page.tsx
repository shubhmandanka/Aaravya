import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, faqPageSchema, medicalWebPageSchema } from "@/lib/schema";
import {
  CATEGORY_LABELS,
  getAllConditionSlugs,
  getConditionBySlug,
  getConditionsGroupedByCategory,
  getContactDetails,
} from "@/lib/queries";

type TreatmentOption = { title: string; description: string };

export async function generateStaticParams() {
  const slugs = await getAllConditionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const condition = await getConditionBySlug(slug);
  if (!condition) return {};
  return {
    title: { absolute: condition.seoTitle ?? `${condition.name} | Aaravya Hospital` },
    description: condition.metaDescription ?? condition.directAnswer,
  };
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [condition, groups, contact] = await Promise.all([
    getConditionBySlug(slug),
    getConditionsGroupedByCategory(),
    getContactDetails(),
  ]);

  if (!condition) notFound();

  const treatmentOptions = (condition.treatmentOptions as TreatmentOption[] | null) ?? [];
  const sameCategory = groups.find((g) => g.category === condition.category);
  const heroImage = legacyAsset(condition.heroImageUrl);

  const pageUrl = absoluteUrl(`/conditions/${condition.slug}`);
  const webPageSchema = medicalWebPageSchema({
    name: condition.name,
    description: condition.metaDescription ?? condition.directAnswer,
    url: pageUrl,
    lastReviewed: condition.lastUpdatedAt,
    reviewedByName: condition.reviewedByDoctor?.name,
  });
  const faqSchema =
    condition.faqs.length > 0
      ? faqPageSchema(condition.faqs.map((f) => ({ question: f.question, answer: f.answer })))
      : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <JsonLd data={webPageSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/conditions" className="hover:text-forest-800">Conditions</Link>
        <ChevronRight className="size-3" />
        <span>{CATEGORY_LABELS[condition.category]}</span>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{condition.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div>
          <h1 className="text-balance font-heading text-4xl font-semibold text-forest-900">{condition.name}</h1>

          {heroImage && (
            <div className="relative mt-6 h-64 overflow-hidden rounded-2xl border border-border bg-forest-50 sm:h-80">
              <Image
                src={heroImage}
                alt={condition.name}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-contain p-6"
                priority
              />
            </div>
          )}

          {/* GEO direct-answer block */}
          <div className="mt-6 rounded-xl border border-terracotta-200 bg-terracotta-50 p-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-wide text-terracotta-700">
              Quick Answer
            </p>
            <p className="mt-1.5 text-terracotta-950">{condition.directAnswer}</p>
          </div>

          {condition.introText && (
            <p className="mt-6 text-muted-foreground">{condition.introText}</p>
          )}

          {condition.definitionHeading && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">{condition.definitionHeading}</h2>
              <p className="mt-3 text-muted-foreground">{condition.definitionText}</p>
            </Reveal>
          )}

          {condition.symptoms.length > 0 && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">
                Common Symptoms of {condition.name}
              </h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {condition.symptoms.map((symptom, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-terracotta-600" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {condition.causes && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">Causes &amp; Risk Factors</h2>
              <p className="mt-3 text-muted-foreground">{condition.causes}</p>
            </Reveal>
          )}

          {treatmentOptions.length > 0 && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">
                Types of {condition.name} Treatment We Offer
              </h2>
              <ol className="mt-4 flex flex-col gap-4">
                {treatmentOptions.map((option, i) => {
                  const procedure = condition.procedures.find(
                    (p) => p.name.toLowerCase().startsWith(option.title.toLowerCase())
                  );
                  return (
                    <li key={i} className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
                      <p className="font-heading font-semibold text-card-foreground">
                        {i + 1}. {option.title}
                      </p>
                      <p className="mt-1.5 text-sm text-muted-foreground">{option.description}</p>
                      {procedure && (
                        <Link
                          href={`/treatments/${procedure.slug}`}
                          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:underline"
                        >
                          Procedure details <ChevronRight className="size-3.5" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          )}

          {condition.whyChooseUsPoints.length > 0 && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">
                Why Choose Aaravya Hospital for {condition.name} Treatment?
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {condition.whyChooseUsPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-terracotta-600" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {condition.faqs.length > 0 && (
            <Reveal as="section" className="mt-10">
              <h2 className="font-heading text-2xl font-semibold text-forest-900">Frequently Asked Questions</h2>
              <div className="mt-4 flex flex-col gap-3">
                {condition.faqs.map((faq) => (
                  <div key={faq.id} className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
                    <p className="font-medium text-card-foreground">{faq.question}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {(condition.closingHeading || condition.closingText) && (
            <Reveal as="section" className="mt-10 rounded-xl bg-sage-100 p-6">
              {condition.closingHeading && (
                <h2 className="font-heading text-xl font-semibold text-sage-900">
                  {condition.closingHeading}
                </h2>
              )}
              {condition.closingText && (
                <p className="mt-2 text-sm text-sage-800/90">
                  {condition.closingText}
                </p>
              )}
            </Reveal>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              size="xl"
              render={<Link href={`/book?condition=${condition.slug}`} />}
              className="bg-brand text-brand-foreground hover:bg-terracotta-700"
            >
              Book a Consultation for {condition.name}
            </Button>
            <Button
              size="xl"
              variant="outline"
              render={<a href={contact.whatsappHref()} />}
              className="border-forest-300 text-forest-800 hover:bg-forest-50"
            >
              WhatsApp Us
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:h-fit">
          {condition.reviewedByDoctor && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
              <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                Reviewed By
              </p>
              <Link
                href={`/doctors/${condition.reviewedByDoctor.slug}`}
                className="mt-2 flex items-center gap-3"
              >
                {legacyAsset(condition.reviewedByDoctor.photoUrl) && (
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Image
                      src={legacyAsset(condition.reviewedByDoctor.photoUrl)!}
                      alt={condition.reviewedByDoctor.name}
                      fill
                      sizes="48px"
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {condition.reviewedByDoctor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{condition.reviewedByDoctor.qualifications}</p>
                </div>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Last updated {new Date(condition.lastUpdatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          )}

          {sameCategory && sameCategory.conditions.length > 1 && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
              <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                {sameCategory.label}
              </p>
              <ul className="mt-3 flex flex-col gap-1">
                {sameCategory.conditions
                  .filter((c) => c.slug !== condition.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/conditions/${c.slug}`}
                        className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-forest-50 hover:text-forest-800"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-brand p-5 text-brand-foreground shadow-soft-md">
            <p className="font-heading font-semibold">Have questions?</p>
            <p className="mt-1 text-sm text-brand-foreground/85">
              Call us directly for a same-day opinion.
            </p>
            <a href={contact.phoneHref} className="mt-3 block text-lg font-semibold">
              {contact.phone}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
