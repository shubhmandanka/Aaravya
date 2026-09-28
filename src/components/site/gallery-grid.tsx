"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { legacyAsset } from "@/lib/assets";
import type { getMediaByCategory } from "@/lib/queries";

const CATEGORY_ASPECT = {
  HAPPY_FACES: "aspect-3/4",
  INTERIOR: "aspect-4/3",
  SURGERY: "aspect-16/9",
  TESTIMONIAL: "aspect-3/4",
} as const;

/**
 * Same data and grouping as before, plus a lightbox: clicking a photo opens
 * it full-size with prev/next (buttons, arrow keys, and touch swipe via the
 * dialog's own pan) and a visible close control. Videos stay as inline
 * YouTube embeds (they already have their own fullscreen control).
 */
export function GalleryGrid({
  items,
  category,
}: {
  items: Awaited<ReturnType<typeof getMediaByCategory>>;
  category: keyof typeof CATEGORY_ASPECT;
}) {
  const images = items.filter((i) => i.type === "IMAGE");
  const videos = items.filter((i) => i.type === "VIDEO");
  const aspect = CATEGORY_ASPECT[category];
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  function goTo(direction: 1 | -1) {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + images.length) % images.length;
    });
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((item, index) => {
          const src = legacyAsset(item.url);
          if (!src) return null;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group relative ${aspect} overflow-hidden rounded-xl bg-muted shadow-soft-sm transition-transform hover:-translate-y-0.5 hover:shadow-soft-md`}
            >
              <Image
                src={src}
                alt={item.caption ?? "Aaravya Hospital"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-forest-950/0 opacity-0 transition-all group-hover:bg-forest-950/25 group-hover:opacity-100">
                <ZoomIn className="size-6 text-white" />
              </span>
            </button>
          );
        })}
        {videos.map((item) => (
          <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl bg-muted shadow-soft-sm sm:col-span-2">
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}`}
              title="Aaravya Hospital video"
              className="size-full"
              allowFullScreen
            />
          </div>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100%-2rem)] bg-forest-950 p-2 sm:max-w-3xl"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") goTo(1);
            if (e.key === "ArrowLeft") goTo(-1);
          }}
        >
          <DialogTitle className="sr-only">Photo viewer</DialogTitle>
          {activeIndex !== null && (
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg sm:aspect-video">
              {legacyAsset(images[activeIndex]?.url) && (
                <Image
                  src={legacyAsset(images[activeIndex]!.url)!}
                  alt={images[activeIndex]!.caption ?? "Aaravya Hospital"}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-contain"
                />
              )}
            </div>
          )}
          {images.length > 1 && (
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
                {activeIndex !== null ? activeIndex + 1 : 0} / {images.length}
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
