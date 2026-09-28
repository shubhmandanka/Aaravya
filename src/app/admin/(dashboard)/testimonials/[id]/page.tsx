import { DOCTOR_ORDER } from "@/lib/queries";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { TestimonialForm } from "../testimonial-form";
import { updateTestimonial } from "../actions";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [testimonial, conditions, doctors] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);
  if (!testimonial) notFound();

  return (
    <AdminFormShell title="Edit Testimonial" backHref="/admin/testimonials">
      <TestimonialForm
        action={updateTestimonial.bind(null, testimonial.id)}
        testimonial={testimonial}
        conditions={conditions}
        doctors={doctors}
      />
    </AdminFormShell>
  );
}
