import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import type { Faq } from "@/generated/prisma";
import { FAQ_PAGE_CONTEXTS } from "./page-contexts";

export function FaqForm({
  action,
  faq,
  conditions,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  faq?: Faq;
  conditions: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <Field label="Question" htmlFor="question">
        <input id="question" name="question" required defaultValue={faq?.question} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Answer" htmlFor="answer">
        <Textarea id="answer" name="answer" rows={4} required defaultValue={faq?.answer} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Related Condition (optional)" htmlFor="conditionId" help="Also shown in that condition page's FAQ section">
          <select id="conditionId" name="conditionId" defaultValue={faq?.conditionId ?? ""} className={ADMIN_INPUT_CLASS}>
            <option value="">— None —</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Page" htmlFor="pageContext">
          <select id="pageContext" name="pageContext" defaultValue={faq?.pageContext ?? "faqs-page"} className={ADMIN_INPUT_CLASS}>
            {FAQ_PAGE_CONTEXTS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Topic Tag" htmlFor="topic">
          <input id="topic" name="topic" defaultValue={faq?.topic ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Sort Order" htmlFor="sortOrder" help="Lower shows first">
          <input id="sortOrder" name="sortOrder" type="number" step={1} defaultValue={faq?.sortOrder ?? 0} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save FAQ
      </AdminSubmitButton>
    </AdminForm>
  );
}
