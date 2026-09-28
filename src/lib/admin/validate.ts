import { AdminFormError } from "@/lib/admin/actions";

// Each validator takes an already-trimmed, non-empty value and returns it
// (possibly normalised) or throws an AdminFormError naming the field.

export function validPhone(value: string, label = "Phone") {
  if (!/^\+?[0-9][0-9 ()-]{6,19}$/.test(value)) {
    throw new AdminFormError(`${label} should look like +91 87338 89957 (digits, spaces, dashes).`);
  }
  return value;
}

/** wa.me links need the full international number as digits only. */
export function validWhatsapp(value: string, label = "WhatsApp number") {
  const digits = value.replace(/[\s()+-]/g, "");
  if (!/^[0-9]{10,15}$/.test(digits)) {
    throw new AdminFormError(`${label} must be the full number with country code, digits only — e.g. 918733889957.`);
  }
  return digits;
}

export function validEmail(value: string, label = "Email") {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) throw new AdminFormError(`${label} doesn't look like a valid email address.`);
  return value;
}

/** Only http(s) — these land in `href`/`src` attributes on the public site. */
export function validUrl(value: string, label: string, allowedHosts?: string[]) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new AdminFormError(`${label} must be a full link starting with https://`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new AdminFormError(`${label} must be a full link starting with https://`);
  }
  if (allowedHosts && !allowedHosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`))) {
    throw new AdminFormError(`${label} must be a link on ${allowedHosts.join(" or ")}.`);
  }
  return value;
}

/** Rendered as an <iframe src>, so it's restricted to Google Maps' embed endpoint. */
export function validMapEmbedUrl(value: string) {
  let url: URL | null = null;
  try {
    url = new URL(value);
  } catch {}
  const ok =
    url?.protocol === "https:" &&
    (url.hostname === "www.google.com" || url.hostname === "maps.google.com") &&
    url.pathname.startsWith("/maps/embed");
  if (!ok) {
    throw new AdminFormError(
      "Google Maps Embed URL must be the src from Google Maps → Share → Embed a map (starts with https://www.google.com/maps/embed)."
    );
  }
  return value;
}
