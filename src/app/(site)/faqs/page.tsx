import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { getFaqs } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { faqPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about piles, fissure, fistula, and other conditions treated at Aaravya Hospital.",
};

export default async function FaqsPage() {
  const faqs = await getFaqs("faqs-page");
  const schema = faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })));

  return (
    <div>
      <JsonLd data={schema} />
      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Straight answers to the questions patients ask us most."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <Accordion className="rounded-2xl border border-border bg-card px-5 shadow-soft-sm">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </div>
  );
}
