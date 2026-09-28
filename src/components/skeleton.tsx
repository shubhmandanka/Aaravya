/**
 * Base skeleton primitive shared by every loading.tsx in the app (public and
 * admin). Uses `bg-muted`, which resolves to the sage-tinted muted tone on
 * the public site and the slate-tinted muted tone inside `.admin-scope` —
 * so this one component automatically looks right in both design systems.
 * `animate-pulse` is disabled globally under `prefers-reduced-motion` via
 * the `@media (prefers-reduced-motion: reduce)` block in globals.css.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}
