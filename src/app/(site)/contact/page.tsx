import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { getPrimaryLocation } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Aaravya Hospital, Chandkheda, Ahmedabad — phone, WhatsApp, email, and directions.",
};

export default async function ContactPage() {
  const location = await getPrimaryLocation();

  return (
    <div>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Call, WhatsApp, or visit us directly — we're happy to help."
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <RevealGroup className="flex flex-col gap-4">
            {location?.address && (
              <RevealItem>
                <div className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-soft-sm">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-terracotta-600" />
                  <div>
                    <p className="font-medium text-card-foreground">Address</p>
                    <p className="mt-1 text-sm text-muted-foreground">{location.address}</p>
                  </div>
                </div>
              </RevealItem>
            )}
            {location?.phone && (
              <RevealItem>
                <a
                  href={`tel:${location.phone}`}
                  className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                >
                  <Phone className="mt-0.5 size-5 shrink-0 text-terracotta-600" />
                  <div>
                    <p className="font-medium text-card-foreground">Phone</p>
                    <p className="mt-1 text-sm text-muted-foreground">{location.phone}</p>
                  </div>
                </a>
              </RevealItem>
            )}
            {location?.whatsapp && (
              <RevealItem>
                <a
                  href={`https://wa.me/${location.whatsapp}`}
                  className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                >
                  <MessageCircle className="mt-0.5 size-5 shrink-0 text-terracotta-600" />
                  <div>
                    <p className="font-medium text-card-foreground">WhatsApp</p>
                    <p className="mt-1 text-sm text-muted-foreground">Chat with our coordinator</p>
                  </div>
                </a>
              </RevealItem>
            )}
            {location?.email && (
              <RevealItem>
                <a
                  href={`mailto:${location.email}`}
                  className="flex gap-3 rounded-xl border border-border bg-card p-5 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                >
                  <Mail className="mt-0.5 size-5 shrink-0 text-terracotta-600" />
                  <div>
                    <p className="font-medium text-card-foreground">Email</p>
                    <p className="mt-1 text-sm text-muted-foreground">{location.email}</p>
                  </div>
                </a>
              </RevealItem>
            )}
          </RevealGroup>

          {location?.mapEmbedUrl && (
            <Reveal className="overflow-hidden rounded-xl border border-border shadow-soft-sm">
              <iframe
                src={location.mapEmbedUrl}
                title="Aaravya Hospital location"
                className="h-full min-h-80 w-full"
                loading="lazy"
              />
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
