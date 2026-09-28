import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Testimonial } from "@/generated/prisma";

export function TestimonialForm({
  action,
  testimonial,
  conditions,
  doctors,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  testimonial?: Testimonial;
  conditions: { id: string; name: string }[];
  doctors: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Patient Name (optional)" htmlFor="patientName">
          <input id="patientName" name="patientName" defaultValue={testimonial?.patientName ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Initials (if anonymous)" htmlFor="initials">
          <input id="initials" name="initials" defaultValue={testimonial?.initials ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Quote" htmlFor="quote">
        <Textarea id="quote" name="quote" rows={3} defaultValue={testimonial?.quote ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Rating (1–5)" htmlFor="rating">
          <input id="rating" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Anonymous Category (optional)" htmlFor="anonymousCategory">
          <select id="anonymousCategory" name="anonymousCategory" defaultValue={testimonial?.anonymousCategory ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            <option value="STUDENT">Student</option>
            <option value="WOMAN">Woman</option>
            <option value="IT_PROFESSIONAL">IT Professional</option>
            <option value="POLICE_DEFENCE">Police & Defence</option>
            <option value="OTHER">Other</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ImageUploadField name="imageUrl" label="Photo" currentImageUrl={testimonial?.imageUrl} />
        <Field label="YouTube Video ID" htmlFor="videoUrl">
          <input id="videoUrl" name="videoUrl" defaultValue={testimonial?.videoUrl ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Related Condition (optional)" htmlFor="conditionId">
          <select id="conditionId" name="conditionId" defaultValue={testimonial?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Related Doctor (optional)" htmlFor="doctorId">
          <select id="doctorId" name="doctorId" defaultValue={testimonial?.doctorId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={testimonial?.isFeatured} className="size-4 rounded border-input" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isApproved" defaultChecked={testimonial?.isApproved ?? true} className="size-4 rounded border-input" />
          Approved (visible on site)
        </label>
      </div>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Testimonial
      </AdminSubmitButton>
    </AdminForm>
  );
}
