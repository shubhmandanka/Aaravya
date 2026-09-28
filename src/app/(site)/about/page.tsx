import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { getAllDoctors, getPrimaryLocation } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Aaravya Hospital, Chandkheda, Ahmedabad — our facility, doctors, and approach to care.",
};

export default async function AboutPage() {
  const [doctors, location] = await Promise.all([getAllDoctors(), getPrimaryLocation()]);

  return (
    <div>
      <PageHero
        eyebrow="About Us"
        title="About Aaravya Hospital"
        description="A dedicated proctology and general-surgery centre in Chandkheda, Ahmedabad, offering modern laser and minimally-invasive treatment for anorectal conditions alongside general surgery, urology, and peripheral vascular care."
      >
        {location?.address && (
          <p className="mt-4 text-sm text-forest-700">{location.address}</p>
        )}
      </PageHero>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        <Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Day-care laser procedures with faster recovery than open surgery",
              "Doctor-reviewed care plans across proctology, general surgery, urology, and vascular conditions",
              "A female doctor available for patients who prefer one",
              "Transparent, doctor-reviewed treatment information on every condition page",
            ].map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-soft-sm"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-terracotta-600" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        {doctors.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-semibold text-forest-900">Our Doctors</h2>
            <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2">
              {doctors.map((doctor) => {
                const photo = legacyAsset(doctor.photoUrl);
                return (
                  <RevealItem key={doctor.slug}>
                    <Link
                      href={`/doctors/${doctor.slug}`}
                      className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                    >
                      {photo ? (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                          <Image src={photo} alt={doctor.name} fill sizes="64px" className="object-cover object-top" />
                        </div>
                      ) : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-forest-100 font-heading text-lg font-semibold text-forest-700">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-heading font-semibold">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">{doctor.designation}</p>
                      </div>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        )}

        <div className="mt-12 text-center sm:text-left">
          <Button size="xl" render={<Link href="/book" />} className="bg-brand text-brand-foreground hover:bg-terracotta-700">
            Book an Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
