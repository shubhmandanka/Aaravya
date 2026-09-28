import { notFound } from "next/navigation";
import { getAnonymousCategory } from "@/content/anonymous-categories";

/**
 * Existence check for /anonymous-consultation/[category]. It sits above this
 * segment's loading.tsx Suspense boundary (the listing page keeps its own
 * loading.tsx inside a route group), so an unknown category calls notFound()
 * before the response starts streaming and gets a real 404 status instead of
 * a 200 soft 404.
 */
export default async function AnonymousCategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!getAnonymousCategory(category)) notFound();
  return children;
}
