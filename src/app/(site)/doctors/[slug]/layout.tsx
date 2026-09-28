import { notFound } from "next/navigation";
import { getDoctorBySlug } from "@/lib/queries";

/**
 * Existence check for /doctors/[slug]. It sits above this segment's loading.tsx
 * Suspense boundary (listing pages keep their own loading.tsx inside a route
 * group), so a missing slug calls notFound() before the response starts
 * streaming and gets a real 404 status instead of a 200 soft 404.
 * getDoctorBySlug is cache()'d, so the page reuses this lookup.
 */
export default async function DoctorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await getDoctorBySlug(slug))) notFound();
  return children;
}
