import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import type { CostCategory } from "@/generated/prisma";

export function CostCategoryForm({
  action,
  category,
  conditions,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  category?: CostCategory;
  conditions: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <Field label="Category name" htmlFor="name" help="Step 1 of the public estimator, e.g. Piles / Hemorrhoids">
        <input id="name" name="name" required defaultValue={category?.name} className={ADMIN_INPUT_CLASS} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
        <Field label="Linked condition (optional)" htmlFor="conditionId" help="Pre-selected on the booking form when a patient books from this category">
          <select id="conditionId" name="conditionId" defaultValue={category?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sort order" htmlFor="sortOrder" help="Lower shows first">
          <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={category?.sortOrder ?? 0} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Category
      </AdminSubmitButton>
    </AdminForm>
  );
}
