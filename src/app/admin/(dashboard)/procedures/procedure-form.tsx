import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Procedure } from "@/generated/prisma";

export function ProcedureForm({
  action,
  procedure,
  conditions,
  doctors,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  procedure?: Procedure;
  conditions: { id: string; name: string }[];
  doctors: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" htmlFor="slug" help="Used in the URL: /treatments/[slug]">
          <input id="slug" name="slug" required defaultValue={procedure?.slug} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required defaultValue={procedure?.name} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Condition" htmlFor="conditionId">
          <select id="conditionId" name="conditionId" required defaultValue={procedure?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="" disabled>
              Select a condition
            </option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Doctor (optional)" htmlFor="doctorId">
          <select id="doctorId" name="doctorId" defaultValue={procedure?.doctorId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <Textarea id="description" name="description" rows={4} required defaultValue={procedure?.description} />
      </Field>

      <ImageUploadField name="imageUrl" label="Procedure Image" currentImageUrl={procedure?.imageUrl} />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Duration" htmlFor="duration" help="e.g. 30–45 minutes">
          <input id="duration" name="duration" defaultValue={procedure?.duration ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Anesthesia" htmlFor="anesthesiaType" help="e.g. Local / Spinal">
          <input id="anesthesiaType" name="anesthesiaType" defaultValue={procedure?.anesthesiaType ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Hospital Stay" htmlFor="hospitalStay" help="e.g. Day-care, 6–8 hrs">
          <input id="hospitalStay" name="hospitalStay" defaultValue={procedure?.hospitalStay ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Success Rate" htmlFor="successRate" help="Only enter if doctor-verified">
        <input id="successRate" name="successRate" defaultValue={procedure?.successRate ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cost Min (₹)" htmlFor="costMin" help="Usually leave empty: public prices come from the Cost Estimator">
          <input id="costMin" name="costMin" type="number" defaultValue={procedure?.costMin ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Cost Max (₹)" htmlFor="costMax">
          <input id="costMax" name="costMax" type="number" defaultValue={procedure?.costMax ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Downloadable PDF URL" htmlFor="downloadablePdfUrl">
        <input id="downloadablePdfUrl" name="downloadablePdfUrl" defaultValue={procedure?.downloadablePdfUrl ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Procedure
      </AdminSubmitButton>
    </AdminForm>
  );
}
