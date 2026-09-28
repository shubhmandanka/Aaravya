import { AdminFormError } from "@/lib/admin/actions";
import { validUrl } from "@/lib/admin/validate";

type SettingDef = {
  key: string;
  label: string;
  help: string;
  placeholder?: string;
  validate: (value: string) => string;
};

/**
 * Site-wide settings only. Phone, WhatsApp and email are location-specific and
 * live on the primary Location (see getContactDetails) — the old `phone`,
 * `whatsapp` and `email` SiteSetting rows are no longer read.
 */
export const SETTINGS_KEYS: readonly SettingDef[] = [
  {
    key: "instagram_url",
    label: "Instagram URL",
    help: "Footer social link",
    validate: (v) => validUrl(v, "Instagram URL", ["instagram.com"]),
  },
  {
    key: "facebook_url",
    label: "Facebook URL",
    help: "Footer social link",
    validate: (v) => validUrl(v, "Facebook URL", ["facebook.com"]),
  },
  {
    key: "ga4_id",
    label: "Google Analytics (GA4) ID",
    help: "Format G-XXXXXXXXXX",
    placeholder: "G-XXXXXXXXXX",
    validate: (v) => {
      if (!/^G-[A-Z0-9]{4,20}$/.test(v)) throw new AdminFormError("GA4 ID must look like G-XXXXXXXXXX.");
      return v;
    },
  },
  {
    key: "gtm_id",
    label: "Google Tag Manager ID",
    help: "Format GTM-XXXXXXX",
    placeholder: "GTM-XXXXXXX",
    validate: (v) => {
      if (!/^GTM-[A-Z0-9]{4,12}$/.test(v)) throw new AdminFormError("Tag Manager ID must look like GTM-XXXXXXX.");
      return v;
    },
  },
];
