import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { CATEGORY_LABELS } from "@/lib/queries";
import { treatmentOptionsToText } from "./format";
import type { Condition } from "@/generated/prisma";

export function ConditionForm({
  action,
  condition,
  doctors,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  condition?: Condition;
  doctors: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" htmlFor="slug" help="Used in the URL: /conditions/[slug]">
          <input id="slug" name="slug" required defaultValue={condition?.slug} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Name" htmlFor="name">
          <input id="name" name="name" required defaultValue={condition?.name} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Category" htmlFor="category">
        <select
          id="category"
          name="category"
          required
          defaultValue={condition?.category ?? "PROCTOLOGY"}
          className={ADMIN_INPUT_CLASS}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <ImageUploadField name="heroImageUrl" label="Hero Image" currentImageUrl={condition?.heroImageUrl} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="SEO Title" htmlFor="seoTitle">
          <input id="seoTitle" name="seoTitle" defaultValue={condition?.seoTitle ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Meta Description" htmlFor="metaDescription">
          <input id="metaDescription" name="metaDescription" defaultValue={condition?.metaDescription ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Direct Answer (40–60 words)" htmlFor="directAnswer" help="Shown as the 'Quick Answer' GEO block at the top of the page">
        <Textarea id="directAnswer" name="directAnswer" rows={3} required defaultValue={condition?.directAnswer} />
      </Field>

      <Field label="Intro Text" htmlFor="introText">
        <Textarea id="introText" name="introText" rows={3} defaultValue={condition?.introText ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Definition Heading" htmlFor="definitionHeading">
          <input id="definitionHeading" name="definitionHeading" defaultValue={condition?.definitionHeading ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Definition Text" htmlFor="definitionText">
          <input id="definitionText" name="definitionText" defaultValue={condition?.definitionText ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Symptoms" htmlFor="symptoms" help="One per line">
        <Textarea id="symptoms" name="symptoms" rows={4} defaultValue={condition?.symptoms.join("\n") ?? ""} />
      </Field>

      <Field label="Causes / Risk Factors" htmlFor="causes">
        <Textarea id="causes" name="causes" rows={2} defaultValue={condition?.causes ?? ""} />
      </Field>

      <Field
        label="Treatment Options"
        htmlFor="treatmentOptions"
        help='One per line, formatted as "Title | Description"'
      >
        <Textarea
          id="treatmentOptions"
          name="treatmentOptions"
          rows={5}
          defaultValue={treatmentOptionsToText(condition?.treatmentOptions)}
        />
      </Field>

      <Field label="Why Choose Us Points" htmlFor="whyChooseUsPoints" help="One per line">
        <Textarea id="whyChooseUsPoints" name="whyChooseUsPoints" rows={4} defaultValue={condition?.whyChooseUsPoints.join("\n") ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Closing Heading" htmlFor="closingHeading">
          <input id="closingHeading" name="closingHeading" defaultValue={condition?.closingHeading ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Closing Text" htmlFor="closingText">
          <input id="closingText" name="closingText" defaultValue={condition?.closingText ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Reviewed By" htmlFor="reviewedByDoctorId">
        <select
          id="reviewedByDoctorId"
          name="reviewedByDoctorId"
          defaultValue={condition?.reviewedByDoctorId ?? ""}
          className={ADMIN_INPUT_CLASS}
        >
          <option value="">— None —</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Condition
      </AdminSubmitButton>
    </AdminForm>
  );
}
