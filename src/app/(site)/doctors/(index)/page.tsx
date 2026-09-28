import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { getAllDoctors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Our Doctors",
  description: "Meet the doctors at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function DoctorsPage() {
  const doctors = await getAllDoctors();

  return (
    <div>
      <PageHero
        eyebrow="Our Team"
        title="Meet Your Doctors"
        description="Experienced specialists blending modern surgical technique with compassionate, patient-first care."
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {doctors.map((doctor) => {
            const photo = legacyAsset(doctor.photoUrl);
            return (
              <RevealItem key={doctor.slug}>
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="group flex h-full flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                >
                  {photo ? (
                    <div className="relative size-32 overflow-hidden rounded-full bg-muted ring-4 ring-forest-50">
                      <Image src={photo} alt={doctor.name} fill sizes="128px" className="object-cover object-top" />
                    </div>
                  ) : (
                    <div className="flex size-32 items-center justify-center rounded-full bg-forest-100 font-heading text-3xl font-semibold text-forest-700 ring-4 ring-forest-50">
                      {doctor.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-heading text-xl font-semibold">{doctor.name}</p>
                    <p className="mt-1 text-sm text-terracotta-700">{doctor.qualifications}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{doctor.designation}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-forest-700 opacity-0 transition-opacity group-hover:opacity-100">
                    View profile <ArrowRight className="size-3" />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </div>
  );
}
