import { Textarea } from "@/components/ui/textarea";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import type { FormState } from "@/lib/admin/actions";
import type { Location } from "@/generated/prisma";

export function LocationForm({
  action,
  location,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  location?: Location;
}) {
  return (
    <AdminForm action={action} className="flex flex-col gap-5">
      <p className="rounded-lg bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
        The primary location is the single source for the hospital&rsquo;s contact details: its phone,
        WhatsApp and email appear in the header, footer, every call/WhatsApp button, the Contact page
        and booking emails, and its address in the footer, About and Contact pages. Leaving WhatsApp or
        email blank falls back to the hospital&rsquo;s original number/address.
      </p>

      <Field label="Name" htmlFor="name">
        <input id="name" name="name" required defaultValue={location?.name ?? "Aaravya Hospital"} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Address" htmlFor="address">
        <Textarea id="address" name="address" rows={2} required defaultValue={location?.address} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone">
          <input id="phone" name="phone" required defaultValue={location?.phone} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="WhatsApp Number" htmlFor="whatsapp" help="Country code + number, digits only, e.g. 918733889957">
          <input id="whatsapp" name="whatsapp" inputMode="numeric" defaultValue={location?.whatsapp ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email">
          <input id="email" name="email" type="email" defaultValue={location?.email ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
        <Field label="Hours" htmlFor="hours" help="Not shown on the public site yet">
          <input id="hours" name="hours" defaultValue={location?.hours ?? ""} className={ADMIN_INPUT_CLASS} />
        </Field>
      </div>

      <Field
        label="Google Maps Embed URL"
        htmlFor="mapEmbedUrl"
        help="Google Maps → Share → Embed a map → copy the src link (starts with https://www.google.com/maps/embed)"
      >
        <input id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={location?.mapEmbedUrl ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <Field label="Google Business Profile URL" htmlFor="googleBusinessUrl" help="Not shown on the public site yet">
        <input id="googleBusinessUrl" name="googleBusinessUrl" defaultValue={location?.googleBusinessUrl ?? ""} className={ADMIN_INPUT_CLASS} />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPrimary" defaultChecked={location?.isPrimary ?? true} className="size-4 rounded border-input" />
        Primary location (replaces the current primary)
      </label>

      <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
        Save Location
      </AdminSubmitButton>
    </AdminForm>
  );
}
