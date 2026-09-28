import type { Metadata } from "next";
import Link from "next/link";
import { Lock, MessageCircle, ShieldCheck, UserX } from "lucide-react";
import { ANONYMOUS_CATEGORIES, ANONYMOUS_WHATSAPP_MESSAGE } from "@/content/anonymous-categories";
import { getContactDetails } from "@/lib/queries";
import { ConfidentialityBadge } from "@/components/confidentiality-badge";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Anonymous Video Consultation",
  description:
    "A fully confidential video consultation at Aaravya Hospital — no full name required, camera optional, nickname welcome.",
};

const PROMISES = [
  { icon: UserX, text: "No full name required — a nickname or initials is enough" },
  { icon: Lock, text: "Camera can stay off for your first call" },
  { icon: ShieldCheck, text: "Nothing is recorded unless you consent, and only the treating doctor sees your request" },
];

export default async function AnonymousConsultationHub() {
  const contact = await getContactDetails();
  return (
    <div className="bg-sage-50/60">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="text-center">
          <div className="flex justify-center">
            <ConfidentialityBadge />
          </div>
          <h1 className="mt-5 text-balance font-heading text-4xl font-semibold text-forest-900">
            Find Care That Understands Your Lifestyle
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Piles, fissures, and fistula are common — the embarrassment around
            them shouldn&rsquo;t stop you from getting checked. Pick whichever
            fits, or skip straight to &ldquo;Others.&rdquo;
          </p>
        </div>

        <RevealGroup className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
          {PROMISES.map(({ icon: Icon, text }) => (
            <RevealItem key={text}>
              <div className="flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground shadow-soft-sm">
                <Icon className="size-5 text-terracotta-600" />
                {text}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ANONYMOUS_CATEGORIES.map((category) => (
            <RevealItem key={category.slug}>
              <Link
                href={`/anonymous-consultation/${category.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
              >
                <p className="font-heading text-lg font-semibold text-forest-900">{category.label}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{category.hook}</p>
                <span className="mt-3 inline-block text-sm font-medium text-terracotta-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Continue →
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-12 text-center">
          <a
            href={contact.whatsappHref(ANONYMOUS_WHATSAPP_MESSAGE)}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium shadow-soft-sm transition-colors hover:border-forest-300"
          >
            <MessageCircle className="size-4 text-terracotta-600" /> Don&rsquo;t want to pick a category? Message us on WhatsApp
          </a>
        </Reveal>
      </div>
    </div>
  );
}
