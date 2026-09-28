import Link from "next/link";
import { Field, ADMIN_INPUT_CLASS } from "@/components/admin/form";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminSubmitButton } from "@/components/admin/submit-button";
import { getSiteSettings } from "@/lib/queries";
import { SETTINGS_KEYS } from "./config";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Site Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Social links and analytics IDs used across the whole site. Leave a field blank to remove it.{" "}
        Phone, WhatsApp and email are edited on the{" "}
        <Link href="/admin/locations" className="font-medium text-primary hover:underline">
          primary location
        </Link>
        .
      </p>

      <AdminForm
        action={updateSettings}
        className="mt-6 flex max-w-lg flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      >
        {SETTINGS_KEYS.map(({ key, label, help, placeholder }) => (
          <Field key={key} label={label} htmlFor={key} help={help}>
            <input id={key} name={key} defaultValue={settings[key] ?? ""} placeholder={placeholder} className={ADMIN_INPUT_CLASS} />
          </Field>
        ))}

        <AdminSubmitButton size="xl" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Save Settings
        </AdminSubmitButton>
      </AdminForm>
    </div>
  );
}
