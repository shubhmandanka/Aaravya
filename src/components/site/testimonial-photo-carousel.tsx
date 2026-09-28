"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Carousel, CarouselSlide } from "@/components/site/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { legacyAsset } from "@/lib/assets";
import type { getMediaByCategory } from "@/lib/queries";

export function TestimonialPhotoCarousel({
  items,
}: {
  items: Awaited<ReturnType<typeof getMediaByCategory>>;
}) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  function goTo(direction: 1 | -1) {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + items.length) % items.length;
    });
  }

  return (
    <>
      <Carousel ariaLabel="Patient photos" autoplayMs={4500}>
        {items.map((item, index) => {
          const src = legacyAsset(item.url);
          if (!src) return null;
          return (
            <CarouselSlide
              key={item.id}
              className="relative aspect-3/4 w-[45vw] sm:w-[30vw] lg:w-[19vw]"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative size-full overflow-hidden rounded-xl bg-muted shadow-soft-sm"
              >
                <Image
                  src={src}
                  alt="Patient testimonial"
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 19vw"
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-forest-950/0 opacity-0 transition-all group-hover:bg-forest-950/25 group-hover:opacity-100">
                  <ZoomIn className="size-6 text-white" />
                </span>
              </button>
            </CarouselSlide>
          );
        })}
      </Carousel>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-2rem)] bg-forest-950 p-2 sm:max-w-2xl"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(1);
            if (e.key === "ArrowLeft") goTo(-1);
          }}
        >
          <DialogTitle className="sr-only">Patient photo viewer</DialogTitle>
          {activeIndex !== null && (
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
              {legacyAsset(items[activeIndex]?.url) && (
                <Image
                  src={legacyAsset(items[activeIndex]!.url)!}
                  alt="Patient testimonial"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-contain"
                />
              )}
            </div>
          )}
          {items.length > 1 && (
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Previous photo"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="text-xs text-white/60">
                {activeIndex !== null ? activeIndex + 1 : 0} / {items.length}
              </span>
              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Next photo"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
