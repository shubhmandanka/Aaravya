import { Skeleton } from "@/components/skeleton";

/** Mirrors `PageHero`: forest-tinted band, centered eyebrow/title/description bars. */
export function PageHeroSkeleton() {
  return (
    <section className="border-b border-border bg-forest-50">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-14 sm:px-6 sm:py-16">
        <Skeleton className="h-5 w-28 rounded-full bg-forest-100" />
        <Skeleton className="mt-4 h-9 w-72 max-w-full" />
        <Skeleton className="mt-4 h-4 w-96 max-w-full" />
      </div>
    </section>
  );
}

/** Mirrors the round-avatar-card pattern used on the doctors listing page. */
export function AvatarCardGridSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8">
          <Skeleton className="size-32 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Mirrors condition/procedure/blog-style cards: image block + two text lines. */
export function CardGridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: 2 | 3 | 4 }) {
  const colClass = columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-6 ${colClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="flex flex-col gap-2 p-5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Square tiles for the gallery grid. */
export function GalleryGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  );
}

/** Accordion-row bars for the FAQ page. */
export function FaqListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card px-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-5">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="size-4 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Sidebar photo + content column, for doctor/condition/procedure detail pages. */
export function DetailHeroSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/** Testimonial-carousel-style row of photo-and-quote cards. */
export function TestimonialGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

/** Matches the `rounded-2xl border bg-card shadow-soft-md` form-card wrapper
 * used by the booking form and anonymous-consultation request form. */
export function FormCardSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft-md sm:p-8">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="mt-2 h-12 w-full rounded-full" />
    </div>
  );
}

/** Composite skeleton for the homepage's above-the-fold + first sections. */
export function HomeSkeleton() {
  return (
    <div>
      <div className="bg-[linear-gradient(135deg,var(--brand-forest-900),var(--brand-forest-700))] px-4 py-20 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Skeleton className="h-5 w-40 bg-white/10" />
          <Skeleton className="h-10 w-full max-w-xl bg-white/10" />
          <Skeleton className="h-4 w-full max-w-lg bg-white/10" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-12 w-44 rounded-full bg-white/10" />
            <Skeleton className="h-12 w-44 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <Skeleton className="mx-auto h-4 w-40" />
          <Skeleton className="mx-auto mt-3 h-8 w-72" />
        </div>
        <div className="mt-10">
          <CardGridSkeleton count={6} columns={3} />
        </div>
        <div className="mt-14">
          <AvatarCardGridSkeleton count={2} />
        </div>
      </div>
    </div>
  );
}

/** Generic stacked paragraph-line placeholder for text-heavy static pages
 * (About, Contact, Cost, Privacy). */
export function ContentSkeleton({ lines = 6 }: { lines?: number }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-14 sm:px-6 sm:py-16">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
