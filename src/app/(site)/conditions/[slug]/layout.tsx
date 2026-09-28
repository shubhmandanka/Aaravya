import { notFound } from "next/navigation";
import { getConditionBySlug } from "@/lib/queries";

/**
 * Existence check for /conditions/[slug]. It sits above this segment's loading.tsx
 * Suspense boundary (listing pages keep their own loading.tsx inside a route
 * group), so a missing slug calls notFound() before the response starts
 * streaming and gets a real 404 status instead of a 200 soft 404.
 * getConditionBySlug is cache()'d, so the page reuses this lookup.
 */
export default async function ConditionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await getConditionBySlug(slug))) notFound();
  return children;
}
