import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import { AdminForm } from "@/components/admin/admin-form";
import type { FormState } from "@/lib/admin/actions";
import type { Doctor } from "@/generated/prisma";

export function DoctorForm({
  action,
  doctor,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  doctor?: Doctor;
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" htmlFor="slug" help="Used in the URL: /doctors/[slug]">
          <input id="slug" name="slug" required defaultValue={doctor?.slug} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Full Name" htmlFor="name">
          <input id="name" name="name" required defaultValue={doctor?.name} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Qualifications" htmlFor="qualifications" help="e.g. B.A.M.S., M.S">
          <input
            id="qualifications"
            name="qualifications"
            required
            defaultValue={doctor?.qualifications}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
        <Field label="Designation" htmlFor="designation" help="e.g. Consultant Proctologist & General Surgeon">
          <input
            id="designation"
            name="designation"
            required
            defaultValue={doctor?.designation}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
      </div>

      <ImageUploadField
        name="photoUrl"
        label="Doctor Photo"
        currentImageUrl={doctor?.photoUrl}
        help="JPEG, PNG, or WebP. Max 8MB — square images work best."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Registration No." htmlFor="registrationNumber">
          <input
            id="registrationNumber"
            name="registrationNumber"
            defaultValue={doctor?.registrationNumber ?? ""}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
        <Field label="Years Experience" htmlFor="yearsExperience">
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            defaultValue={doctor?.yearsExperience ?? ""}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
        <Field label="Surgeries Count" htmlFor="surgeriesCount">
          <input
            id="surgeriesCount"
            name="surgeriesCount"
            type="number"
            defaultValue={doctor?.surgeriesCount ?? ""}
            className={ADMIN_INPUT_CLASS}
          />
        </Field>
      </div>

      <Field label="Specializations" htmlFor="specializations" help="One per line">
        <Textarea
          id="specializations"
          name="specializations"
          rows={3}
          defaultValue={doctor?.specializations.join("\n") ?? ""}
        />
      </Field>

      <Field label="Bio Paragraphs" htmlFor="bioParagraphs" help="One paragraph per line">
        <Textarea
          id="bioParagraphs"
          name="bioParagraphs"
          rows={6}
          defaultValue={doctor?.bioParagraphs.join("\n") ?? ""}
        />
      </Field>

      <Field label="Philosophy / Personal Note" htmlFor="philosophy">
        <Textarea id="philosophy" name="philosophy" rows={2} defaultValue={doctor?.philosophy ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" defaultValue={doctor?.phone ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Facebook URL" htmlFor="facebookUrl">
          <input id="facebookUrl" name="facebookUrl" defaultValue={doctor?.facebookUrl ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Instagram URL" htmlFor="instagramUrl">
          <input id="instagramUrl" name="instagramUrl" defaultValue={doctor?.instagramUrl ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="LinkedIn URL" htmlFor="linkedinUrl">
          <input id="linkedinUrl" name="linkedinUrl" defaultValue={doctor?.linkedinUrl ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field
        label="Display order (optional)"
        htmlFor="sortOrder"
        help={doctor ? "Lower shows first. Leave as is to keep the current position." : "Lower shows first. Leave blank to add after the existing doctors."}
      >
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          step={1}
          defaultValue={doctor?.sortOrder ?? ""}
          className={`${ADMIN_INPUT_CLASS} max-w-40`}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeatured" defaultChecked={doctor?.isFeatured ?? true} className="size-4 rounded border-input" />
        Featured (shown on homepage)
      </label>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Doctor
      </AdminSubmitButton>
    </AdminForm>
  );
}
