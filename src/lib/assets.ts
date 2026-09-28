/** Maps a legacy static-site path (e.g. "/assets/img/team/dr-deep.png" or
 * "assets/img/team/dr-deep.png" — the seed data has both forms, with and
 * without a leading slash) to its copied location under public/legacy-assets/.
 * A real, directly-servable path — an absolute URL (a Supabase Storage public
 * URL) or a local `/uploads/...` path from before the Supabase migration — is
 * passed through unchanged rather than mangled under `/legacy-assets/`. */
export function legacyAsset(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path) || path.startsWith("/uploads/") || path.startsWith("/legacy-assets/")) {
    return path;
  }
  return `/legacy-assets/${path.replace(/^\/?assets\//, "")}`;
}
