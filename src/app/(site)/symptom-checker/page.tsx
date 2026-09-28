import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { SymptomChecker } from "./symptom-checker";
import { Reveal } from "@/components/site/reveal";
import { getContactDetails } from "@/lib/queries";

export const metadata: Metadata = {
  title: "AI Symptom Checker",
  description: "A private, guided symptom check for anorectal symptoms — not a diagnosis.",
};

export default async function SymptomCheckerPage() {
  const contact = await getContactDetails();
  return (
    <div className="bg-sage-50/40">
      <div className="mx-auto max-w-xl px-6 py-14 sm:py-16">
        <Reveal className="text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-terracotta-700">
            2-Minute Check
          </span>
          <h1 className="mt-2 text-balance font-heading text-4xl font-semibold text-forest-900">
            Symptom Checker
          </h1>
          <p className="mt-3 text-muted-foreground">
            Four quick questions to help you decide what to do next.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground shadow-soft-sm">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-forest-600" />
          <p>
            <strong className="text-foreground">This is not a diagnosis.</strong> It only
            suggests whether self-care, a routine consult, or urgent care fits what
            you&apos;ve described. For any medical concern, please consult a doctor. Your
            answers are logged anonymously to improve this tool — no name is collected here.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <SymptomChecker phone={contact.phone} phoneHref={contact.phoneHref} whatsappHref={contact.whatsappHref()} />
        </Reveal>
      </div>
    </div>
  );
}
