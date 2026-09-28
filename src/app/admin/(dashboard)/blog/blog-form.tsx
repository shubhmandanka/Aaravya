import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { BlogPost } from "@/generated/prisma";

export function BlogForm({
  action,
  post,
  doctors,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  post?: BlogPost;
  doctors: { id: string; name: string }[];
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Slug" htmlFor="slug" help="Used in the URL: /blog/[slug]">
          <input id="slug" name="slug" required defaultValue={post?.slug} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Title" htmlFor="title">
          <input id="title" name="title" required defaultValue={post?.title} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field label="Funnel Stage" htmlFor="funnelStage">
        <select id="funnelStage" name="funnelStage" defaultValue={post?.funnelStage ?? "AWARENESS"} className={ADMIN_INPUT_CLASS}>
          <option value="AWARENESS">Awareness</option>
          <option value="CONSIDERATION">Consideration</option>
          <option value="DECISION">Decision</option>
        </select>
      </Field>

      <Field label="Excerpt" htmlFor="excerpt">
        <input id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      {/* Plain text today (Tiptap is installed but not wired in anywhere in
          this codebase). If this field is ever upgraded to a Tiptap rich-text
          editor whose output gets rendered as HTML on the public site,
          sanitize it server-side (e.g. with a library like `isomorphic-dompurify`)
          before rendering — never trust editor-produced HTML directly. */}
      <Field label="Body" htmlFor="body">
        <Textarea id="body" name="body" rows={10} required defaultValue={post?.body} />
      </Field>

      <ImageUploadField name="heroImageUrl" label="Hero Image" currentImageUrl={post?.heroImageUrl} />

      <Field label="Tags" htmlFor="tags" help="One per line">
        <Textarea id="tags" name="tags" rows={2} defaultValue={post?.tags.join("\n") ?? ""} />
      </Field>

      <Field label="Reviewed By" htmlFor="reviewedByDoctorId">
        <select id="reviewedByDoctorId" name="reviewedByDoctorId" defaultValue={post?.reviewedByDoctorId ?? ""} className={ADMIN_INPUT_CLASS}>
          <option value="">— None —</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={post?.isPublished} className="size-4 rounded border-input" />
        Published (visible on site)
      </label>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Article
      </AdminSubmitButton>
    </AdminForm>
  );
}
