import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Privacy Approach",
  description: "How Aaravya Hospital handles your information, especially for anonymous consultation requests.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Privacy"
        title="Our Privacy Approach"
        description="This page explains, in plain language, what actually happens to your information when you use this site — particularly for an anonymous consultation request. It is a description of our system's real behaviour, not a substitute for a full legal privacy policy, which will be published before public launch."
      />

      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
            <h2 className="font-heading text-lg font-semibold text-forest-900">What we ask for</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For an anonymous consultation request, we only ask for a nickname
              or initials and a phone number — enough to send you a video call
              link. A full legal name is never required for this flow. Email
              and any notes you add are optional.
            </p>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
            <h2 className="font-heading text-lg font-semibold text-forest-900">Who sees your request</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your request is visible to our booking coordinator (to schedule
              the call) and the treating doctor. It is not shared outside the
              clinic, and it is stored in the same system as every other
              appointment — anonymity here is a presentation choice for you,
              not a separate, less-secure system.
            </p>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
            <h2 className="font-heading text-lg font-semibold text-forest-900">Recording</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Video consultations are not recorded unless you explicitly
              consent to it during the call. Keeping your camera off is fine
              and does not affect the quality of care.
            </p>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
            <h2 className="font-heading text-lg font-semibold text-forest-900">Questions</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              If anything here is unclear, message us on WhatsApp before
              booking — you can ask questions without giving any identifying
              details first.
            </p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
