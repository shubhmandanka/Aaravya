import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { prisma } from "@/lib/prisma";
import { getDoctorBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { physicianSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const doctors = await prisma.doctor.findMany({ select: { slug: true } });
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: `${doctor.name} — ${doctor.designation} at Aaravya Hospital, Chandkheda, Ahmedabad.`,
  };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const photo = legacyAsset(doctor.photoUrl);
  const schema = physicianSchema(doctor);
  // Degrade gracefully: this row only renders once at least one of these
  // credential fields is actually filled in for this doctor.
  const hasCredentials = Boolean(
    doctor.registrationNumber || doctor.yearsExperience || doctor.surgeriesCount
  );

  return (
    <div>
      <JsonLd data={schema} />

      {/* Header block */}
      <section className="border-b border-border bg-forest-50">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[220px_1fr] lg:items-center">
          {photo ? (
            <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl bg-muted shadow-soft-md ring-4 ring-white sm:w-48 lg:mx-0 lg:w-full">
              <Image src={photo} alt={doctor.name} fill sizes="220px" className="object-cover object-top" priority />
            </div>
          ) : (
            <div className="mx-auto flex aspect-square w-40 items-center justify-center rounded-2xl bg-forest-100 font-heading text-5xl font-semibold text-forest-700 ring-4 ring-white sm:w-48 lg:mx-0 lg:w-full">
              {doctor.name.charAt(0)}
            </div>
          )}
          <div className="text-center lg:text-left">
            <h1 className="text-balance font-heading text-3xl font-semibold text-forest-900 sm:text-4xl">
              {doctor.name}
            </h1>
            <p className="mt-1.5 font-medium text-terracotta-700">{doctor.qualifications}</p>
            <p className="mt-1 text-muted-foreground">{doctor.designation}</p>
            {doctor.specializations.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                {doctor.specializations.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-forest-800 shadow-soft-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: credentials + persistent booking CTA */}
        <aside className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
          {hasCredentials && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft-sm">
              <p className="font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Credentials
              </p>
              <div className="mt-3 flex flex-col gap-3 text-sm">
                {doctor.registrationNumber && (
                  <div className="flex items-center gap-2.5">
                    <Award className="size-4 shrink-0 text-terracotta-600" />
                    <span className="text-foreground/80">Reg. No: {doctor.registrationNumber}</span>
                  </div>
                )}
                {doctor.yearsExperience && (
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="size-4 shrink-0 text-terracotta-600" />
                    <span className="text-foreground/80">{doctor.yearsExperience}+ years experience</span>
                  </div>
                )}
                {doctor.surgeriesCount && (
                  <div className="flex items-center gap-2.5">
                    <Award className="size-4 shrink-0 text-terracotta-600" />
                    <span className="text-foreground/80">{doctor.surgeriesCount}+ successful surgeries</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-2.5">
            <Button
              size="lg"
              render={<Link href={`/book?doctor=${doctor.slug}`} />}
              className="w-full bg-brand text-brand-foreground hover:bg-terracotta-700"
            >
              Book an Appointment
            </Button>
            {doctor.phone && (
              <Button
                variant="outline"
                render={<a href={`tel:${doctor.phone}`} />}
                className="w-full border-forest-300 text-forest-800 hover:bg-forest-50"
              >
                <Phone className="mr-1.5" /> Call to Book
              </Button>
            )}
          </div>
        </aside>

        {/* Bio */}
        <div className="order-1 lg:order-2">
          <Reveal className="flex flex-col gap-4">
            {doctor.bioParagraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Reveal>

          {doctor.philosophy && (
            <Reveal>
              <blockquote className="mt-6 rounded-2xl border-l-4 border-terracotta-500 bg-terracotta-50 p-5 text-terracotta-900 italic">
                &ldquo;{doctor.philosophy}&rdquo;
              </blockquote>
            </Reveal>
          )}

          {doctor.reviewedConditions.length > 0 && (
            <Reveal className="mt-8">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Conditions Reviewed By {doctor.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.reviewedConditions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/conditions/${c.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-forest-400 hover:text-forest-800"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
