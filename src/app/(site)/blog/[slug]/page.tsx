import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { legacyAsset } from "@/lib/assets";
import { getPublishedBlogPostBySlug, getPublishedBlogSlugs } from "@/lib/queries";
import { absoluteUrl, blogPostingSchema } from "@/lib/schema";

const DATE_FORMAT: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

function summary(post: { excerpt: string | null; body: string }) {
  return post.excerpt ?? post.body.slice(0, 155);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) return {};
  const image = legacyAsset(post.heroImageUrl);
  return {
    title: post.title,
    description: summary(post),
    openGraph: { type: "article", title: post.title, description: summary(post), ...(image ? { images: [image] } : {}) },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);
  if (!post) notFound();

  const heroImage = legacyAsset(post.heroImageUrl);
  const reviewer = post.reviewedByDoctor;
  const reviewerPhoto = legacyAsset(reviewer?.photoUrl);
  // Body is stored as plain text (see blog-form.tsx) — render paragraphs, never HTML.
  const paragraphs = post.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const schema = blogPostingSchema({
    title: post.title,
    description: summary(post),
    url: absoluteUrl(`/blog/${post.slug}`),
    image: heroImage,
    datePublished: post.createdAt,
    dateModified: post.lastUpdatedAt,
    reviewedByName: reviewer?.name,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/blog" className="hover:text-forest-800">
          Health Library
        </Link>
        <ChevronRight className="size-3" />
        <span className="line-clamp-1 text-foreground">{post.title}</span>
      </nav>

      <h1 className="mt-4 text-balance font-heading text-4xl font-semibold text-forest-900">{post.title}</h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
        <time dateTime={post.createdAt.toISOString()}>{post.createdAt.toLocaleDateString("en-IN", DATE_FORMAT)}</time>
        {post.lastUpdatedAt.getTime() - post.createdAt.getTime() > 60_000 && (
          <> · Updated <time dateTime={post.lastUpdatedAt.toISOString()}>{post.lastUpdatedAt.toLocaleDateString("en-IN", DATE_FORMAT)}</time></>
        )}
      </p>

      {heroImage && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-forest-50">
          <Image src={heroImage} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>
      )}

      {post.excerpt && <p className="mt-6 text-lg text-forest-900/80">{post.excerpt}</p>}

      <div className="mt-6 flex flex-col gap-4 text-muted-foreground">
        {paragraphs.map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>

      {post.tags.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-forest-50 px-3 py-1 text-xs text-forest-800">
              {tag}
            </li>
          ))}
        </ul>
      )}

      {reviewer && (
        <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-soft-sm">
          <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">Reviewed By</p>
          <Link href={`/doctors/${reviewer.slug}`} className="mt-2 flex items-center gap-3">
            {reviewerPhoto && (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image src={reviewerPhoto} alt={reviewer.name} fill sizes="48px" className="object-cover object-top" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-card-foreground">{reviewer.name}</p>
              <p className="text-xs text-muted-foreground">{reviewer.qualifications}</p>
            </div>
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button size="xl" render={<Link href="/book" />} className="bg-brand text-brand-foreground hover:bg-terracotta-700">
          Book an Appointment
        </Button>
        <Button
          size="xl"
          variant="outline"
          render={<Link href="/blog" />}
          className="border-forest-300 text-forest-800 hover:bg-forest-50"
        >
          Back to Health Library
        </Button>
      </div>
    </article>
  );
}
