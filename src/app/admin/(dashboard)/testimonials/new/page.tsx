import { DOCTOR_ORDER } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { AdminFormShell } from "@/components/admin/form";
import { TestimonialForm } from "../testimonial-form";
import { createTestimonial } from "../actions";

export default async function NewTestimonialPage() {
  const [conditions, doctors] = await Promise.all([
    prisma.condition.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.doctor.findMany({ select: { id: true, name: true }, orderBy: DOCTOR_ORDER }),
  ]);

  return (
    <AdminFormShell title="New Testimonial" backHref="/admin/testimonials">
      <TestimonialForm action={createTestimonial} conditions={conditions} doctors={doctors} />
    </AdminFormShell>
  );
}
