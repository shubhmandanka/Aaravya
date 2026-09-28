import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma";
import { createClient } from "@/lib/supabase/server";
import { ImageValidationError } from "@/lib/storage";

/** What an admin form/delete action hands back to `AdminForm`/`DeleteButton`. */
export type FormState = { error?: string; success?: string } | undefined;

/** A user-correctable problem whose message is safe to show the admin. */
export class AdminFormError extends Error {}

/**
 * The proxy already gates /admin/*, but a server action is its own POST
 * endpoint, so each one re-verifies the session rather than relying on the
 * route it happens to be imported from.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");
}

function knownError(err: unknown): string | null {
  if (err instanceof AdminFormError || err instanceof ImageValidationError) return err.message;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") return "That slug is already used by another record — choose a different one.";
    if (err.code === "P2003") return "This item is still linked to other records, so it can't be removed yet.";
    if (err.code === "P2025") return "This item no longer exists — it may already have been deleted.";
  }
  return null;
}

/**
 * Runs an admin mutation after the auth check. Expected failures come back as
 * `{ error }` instead of throwing, because production builds replace thrown
 * server-action messages with a generic one. `redirect()` still propagates.
 */
export async function adminAction(run: () => Promise<FormState | void>): Promise<FormState> {
  await requireAdmin();
  try {
    return (await run()) ?? undefined;
  } catch (err) {
    const message = knownError(err);
    if (message) return { error: message };
    throw err;
  }
}

/**
 * Public pages are statically prerendered, and the site header/footer on every
 * page read conditions, doctors, the primary location and settings — so any
 * content change invalidates the whole public site (lazily, on next visit).
 */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
}

export function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

export function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : null;
}

export function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function requiredString(formData: FormData, key: string, label: string): string {
  const value = String(formData.get(key) ?? "").trim();
  if (!value) throw new AdminFormError(`${label} is required.`);
  return value;
}

/** Validates a submitted value against a Prisma enum object. */
export function enumValue<T extends Record<string, string>>(
  enumObj: T,
  value: FormDataEntryValue | null,
  label: string
): T[keyof T] {
  const v = String(value ?? "");
  if (!Object.values(enumObj).includes(v)) throw new AdminFormError(`Choose a valid ${label}.`);
  return v as T[keyof T];
}
