import { cn } from "@/lib/utils";

/**
 * Consistent header band for standalone listing/content pages (Doctors,
 * Conditions, FAQs, Gallery, Testimonials, About, Contact, Cost, Privacy).
 * Kept free of scroll-triggered motion since it's always above the fold.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("border-b border-border bg-forest-50", className)}>
      <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 font-mono text-xs uppercase tracking-widest text-forest-700">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-balance font-heading text-4xl font-semibold text-forest-900">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </section>
  );
}
