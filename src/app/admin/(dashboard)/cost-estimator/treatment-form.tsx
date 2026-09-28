import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { COST_BANDS, bandOptionLabel } from "@/lib/cost-bands";
import type { CostBand, CostTreatment } from "@/generated/prisma";

const COST_LEVELS = ["₹", "₹₹", "₹₹₹"];

export function CostTreatmentForm({
  action,
  treatment,
  categories,
  defaultCategoryId,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  treatment?: CostTreatment;
  categories: { id: string; name: string }[];
  defaultCategoryId?: string;
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="categoryId">
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={treatment?.categoryId ?? defaultCategoryId ?? ""}
            className={ADMIN_INPUT_CLASS}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Estimated Treatment Cost" htmlFor="band" help="Standardized ₹5,000 bands only">
          <select id="band" name="band" required defaultValue={treatment?.band ?? "LOWER"} className={ADMIN_INPUT_CLASS}>
            {(Object.keys(COST_BANDS) as CostBand[]).map((b) => (
              <option key={b} value={b}>
                {bandOptionLabel(b)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Patient-friendly name" htmlFor="name" help="e.g. Laser Piles Surgery">
          <input id="name" name="name" required defaultValue={treatment?.name} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Medical name (optional)" htmlFor="medicalName" help="e.g. LHP">
          <input id="medicalName" name="medicalName" defaultValue={treatment?.medicalName ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Effectiveness" htmlFor="effectiveness">
          <input id="effectiveness" name="effectiveness" defaultValue={treatment?.effectiveness ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Cost level" htmlFor="costLevel">
          <select id="costLevel" name="costLevel" defaultValue={treatment?.costLevel ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">—</option>
            {COST_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Discomfort" htmlFor="discomfort">
          <input id="discomfort" name="discomfort" defaultValue={treatment?.discomfort ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Recovery" htmlFor="recovery">
          <input id="recovery" name="recovery" defaultValue={treatment?.recovery ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Sort order" htmlFor="sortOrder" help="Lower shows first within the category">
        <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={treatment?.sortOrder ?? 0} className={`${ADMIN_INPUT_CLASS} max-w-40`} />
      </Field>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Treatment
      </AdminSubmitButton>
    </AdminForm>
  );
}
