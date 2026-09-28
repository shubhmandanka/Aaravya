import { PageHeroSkeleton, CardGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-5xl px-4 py-14 sm:px-6"><CardGridSkeleton count={6} columns={3} /></div></div>;
}
