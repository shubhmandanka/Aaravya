import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CostDisclaimer } from "@/components/site/cost-disclaimer";
import { prisma } from "@/lib/prisma";
import { formatBand, isPricedBand } from "@/lib/cost-bands";
import { DOCTOR_ORDER } from "@/lib/queries";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book an in-clinic visit or teleconsultation at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ condition?: string; doctor?: string; treatment?: string }>;
}) {
  const { condition: conditionSlug, doctor: doctorSlug, treatment: treatmentId } = await searchParams;

  const [conditions, doctors, defaultCondition, defaultDoctor, treatment] = await Promise.all([
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
    conditionSlug
      ? prisma.condition.findUnique({ where: { slug: conditionSlug }, select: { id: true } })
      : null,
    doctorSlug
      ? prisma.doctor.findUnique({ where: { slug: doctorSlug }, select: { id: true } })
      : null,
    // Looked up by id rather than trusting text from the URL.
    treatmentId
      ? prisma.costTreatment.findUnique({
          where: { id: treatmentId },
          select: { name: true, band: true, category: { select: { conditionId: true } } },
        })
      : null,
  ]);

  const estimate = treatment && isPricedBand(treatment.band) ? formatBand(treatment.band) : null;
  const defaultNotes = treatment
    ? `Interested in: ${treatment.name}${estimate ? ` (Estimated Treatment Cost ${estimate})` : ""}`
    : undefined;

  return (
    <div>
      <PageHero
        eyebrow="Appointments"
        title="Book an Appointment"
        description="Tell us a little about what you need — our coordinator will call to confirm your slot."
      />
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-16">
        {treatment && (
          <div className="mb-6 rounded-xl border border-terracotta-200 bg-terracotta-50 p-4">
            <p className="text-sm text-terracotta-950">
              Selected treatment: <strong>{treatment.name}</strong>
              {estimate && (
                <>
                  {" "}· Estimated Treatment Cost <strong>{estimate}*</strong>
                </>
              )}
            </p>
            {estimate && <CostDisclaimer className="mt-2" />}
          </div>
        )}
        <BookingForm
          conditions={conditions}
          doctors={doctors}
          defaultConditionId={defaultCondition?.id ?? treatment?.category.conditionId ?? undefined}
          defaultDoctorId={defaultDoctor?.id}
          defaultNotes={defaultNotes}
        />
      </div>
    </div>
  );
}
