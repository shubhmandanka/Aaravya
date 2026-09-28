import { PageHeroSkeleton, CardGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><CardGridSkeleton count={9} columns={3} /></div></div>;
}
