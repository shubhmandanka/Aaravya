import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { RevealGroup, RevealItem } from "@/components/site/reveal";
import { legacyAsset } from "@/lib/assets";
import { getPublishedBlogPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Health Library",
  description: "Symptom guides, treatment explainers, and patient FAQs from Aaravya Hospital.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div>
      <PageHero
        eyebrow="Health Library"
        title="Health Library"
        description="Symptom guides, treatment explainers, and myth-busting articles — reviewed by our doctors."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {posts.length === 0 ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-forest-200 bg-forest-50/60 p-8 text-center">
            <p className="font-heading font-semibold text-forest-900">Articles launching soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our doctor-reviewed health library is in progress. In the meantime,
              each condition page already covers symptoms, causes, and
              treatment options in detail.
            </p>
          </div>
        ) : (
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = legacyAsset(post.heroImageUrl);
              return (
                <RevealItem key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm transition-all hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-soft-md"
                  >
                    <div className="relative aspect-[4/3] w-full bg-forest-50">
                      {image ? (
                        <Image
                          src={image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <BookOpen className="size-8 text-forest-300" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <time
                        dateTime={post.createdAt.toISOString()}
                        className="font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground"
                      >
                        {post.createdAt.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                      <h2 className="mt-2 text-balance font-heading text-lg font-semibold text-forest-900">
                        {post.title}
                      </h2>
                      {post.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>}
                      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-terracotta-700">
                        Read article <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </RevealItem>
              );
            })}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
