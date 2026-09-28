"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A lightweight, dependency-free carousel used for testimonials, doctor
 * highlights, gallery highlights, and "related content" rows.
 *
 * Mechanics: a native CSS scroll-snap track (so touch swipe "just works"
 * with no JS) plus Prev/Next buttons that page by one viewport width, and
 * an optional autoplay timer. Pauses on hover/focus/touch, and disables
 * autoplay entirely when the visitor prefers reduced motion.
 */
export function Carousel({
  children,
  ariaLabel,
  autoplayMs,
  className,
  slideCount,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  /** Autoplay interval in ms. Omit to disable autoplay. */
  autoplayMs?: number;
  className?: string;
  /** Number of slides, for optional dot indicators. Omit to hide dots. */
  slideCount?: number;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [paused, setPaused] = React.useState(false);
  const [activeDot, setActiveDot] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  const page = React.useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.92, behavior: "smooth" });
  }, []);

  const updateEdges = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < max - 8);
    if (slideCount) {
      const ratio = max > 0 ? track.scrollLeft / max : 0;
      setActiveDot(Math.round(ratio * (slideCount - 1)));
    }
  }, [slideCount]);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    return () => track.removeEventListener("scroll", updateEdges);
  }, [updateEdges]);

  React.useEffect(() => {
    if (!autoplayMs) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || paused) return;

    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 8) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        page(1);
      }
    }, autoplayMs);
    return () => window.clearInterval(id);
  }, [autoplayMs, paused, page]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn("group/carousel relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label={`${ariaLabel} - scrollable`}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 outline-none [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {canPrev && (
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label="Previous slide"
          className="absolute top-1/2 -left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft-md transition-opacity hover:bg-forest-50 sm:flex"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => page(1)}
          aria-label="Next slide"
          className="absolute top-1/2 -right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft-md transition-opacity hover:bg-forest-50 sm:flex"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {slideCount ? (
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: slideCount }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === activeDot ? "w-5 bg-terracotta-600" : "w-1.5 bg-forest-200"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CarouselSlide({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("shrink-0 snap-start", className)}>{children}</div>;
}
