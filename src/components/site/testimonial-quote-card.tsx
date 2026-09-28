import Image from "next/image";
import Link from "next/link";
import { Quote, Star } from "lucide-react";
import { legacyAsset } from "@/lib/assets";
import type { getApprovedTestimonials } from "@/lib/queries";

type TestimonialEntry = Awaited<ReturnType<typeof getApprovedTestimonials>>[number];

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** The admin field is a bare YouTube ID; anything else is ignored rather than embedded. */
function youtubeId(value: string | null) {
  const v = value?.trim();
  return v && YOUTUBE_ID.test(v) ? v : null;
}

export function TestimonialQuoteCard({ testimonial }: { testimonial: TestimonialEntry }) {
  const photo = legacyAsset(testimonial.imageUrl);
  const videoId = youtubeId(testimonial.videoUrl);
  const name = testimonial.patientName ?? testimonial.initials ?? "Aaravya patient";
  const rating = testimonial.rating ? Math.min(Math.max(testimonial.rating, 1), 5) : null;

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft-sm">
      {videoId && (
        <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-muted">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Testimonial from ${name}`}
            className="size-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}

      {rating && (
        <div className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={i < rating ? "size-4 fill-terracotta-500 text-terracotta-500" : "size-4 text-border"}
            />
          ))}
        </div>
      )}

      {testimonial.quote && (
        <blockquote className="mt-3 flex-1 text-forest-900/85">
          <Quote className="mb-2 size-5 text-terracotta-400" aria-hidden="true" />
          <p>{testimonial.quote}</p>
        </blockquote>
      )}

      <figcaption className="mt-5 flex items-center gap-3">
        {photo ? (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image src={photo} alt={name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest-100 font-heading font-semibold text-forest-700">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-card-foreground">{name}</p>
          {testimonial.condition && (
            <Link
              href={`/conditions/${testimonial.condition.slug}`}
              className="text-xs text-muted-foreground hover:text-forest-800"
            >
              Treated for {testimonial.condition.name}
            </Link>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
