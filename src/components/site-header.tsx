import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";
import { getAllDoctors, getConditionsGroupedByCategory, getContactDetails } from "@/lib/queries";

export async function SiteHeader() {
  const [conditionGroups, doctors, contact] = await Promise.all([
    getConditionsGroupedByCategory(),
    getAllDoctors(),
    getContactDetails(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/85">
      <div className="hidden items-center justify-end gap-5 border-b border-border/70 bg-forest-50 px-6 py-1.5 text-xs text-forest-800 lg:flex">
        <a
          href={contact.whatsappHref()}
          className="flex items-center gap-1.5 transition-colors hover:text-terracotta-700"
        >
          <MessageCircle className="size-3.5" /> WhatsApp Us
        </a>
        <span className="text-forest-300" aria-hidden>
          |
        </span>
        <a
          href={contact.phoneHref}
          className="flex items-center gap-1.5 transition-colors hover:text-terracotta-700"
        >
          <Phone className="size-3.5" /> {contact.phone}
        </a>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="shrink-0" aria-label="Aaravya Hospital home">
          <Wordmark />
        </Link>
        <SiteNav conditionGroups={conditionGroups} doctors={doctors} phone={contact.phone} />
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/book" />}
          className="hidden shrink-0 bg-brand text-brand-foreground shadow-soft-sm transition-colors hover:bg-terracotta-700 lg:inline-flex"
        >
          Book an Appointment
        </Button>
      </div>
    </header>
  );
}
