import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { ANONYMOUS_CATEGORIES, ANONYMOUS_WHATSAPP_MESSAGE, getAnonymousCategory } from "@/content/anonymous-categories";
import { getContactDetails } from "@/lib/queries";
import { ConfidentialityBadge } from "@/components/confidentiality-badge";
import { Reveal } from "@/components/site/reveal";
import { AnonymousRequestForm } from "./request-form";

export async function generateStaticParams() {
  return ANONYMOUS_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getAnonymousCategory(slug);
  if (!category) return {};
  return {
    title: `Anonymous Consultation — ${category.label}`,
    description: category.headline,
  };
}

export default async function AnonymousCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getAnonymousCategory(slug);
  if (!category) notFound();
  const contact = await getContactDetails();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/anonymous-consultation" className="hover:text-forest-800">
          Anonymous Consultation
        </Link>{" "}
        / <span className="text-foreground">{category.label}</span>
      </nav>

      <div className="mt-4">
        <ConfidentialityBadge />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta-700">
            {category.hook}
          </span>
          <h1 className="mt-2 text-balance font-heading text-3xl font-semibold text-forest-900 sm:text-4xl">
            {category.headline}
          </h1>
          <p className="mt-5 text-muted-foreground">{category.intro}</p>

          <Reveal as="section" className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-forest-900">Why this is common</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {category.whyCommon.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-terracotta-600" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="section" className="mt-8">
            <h2 className="font-heading text-xl font-semibold text-forest-900">What to expect</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {category.whatToExpect.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-terracotta-600" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-8 rounded-xl bg-forest-50 p-5 text-sm text-forest-900/80">
            <p className="font-medium text-forest-900">This still goes through the same doctors and the same care.</p>
            <p className="mt-1">
              Choosing this category just tailors the information on this page — your
              consultation, treatment, and records are handled exactly the same way as
              any other appointment.{" "}
              <Link href="/privacy" className="underline hover:text-forest-900">
                Read our privacy approach
              </Link>
              .
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:h-fit">
          <AnonymousRequestForm categorySlug={category.slug} offerFemaleDoctor={category.offerFemaleDoctor} />
          <a
            href={contact.whatsappHref(ANONYMOUS_WHATSAPP_MESSAGE)}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-soft-sm transition-colors hover:border-forest-300"
          >
            <MessageCircle className="size-4 text-terracotta-600" /> Prefer WhatsApp? Message us directly
          </a>
        </aside>
      </div>
    </div>
  );
}
