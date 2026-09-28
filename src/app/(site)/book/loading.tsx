import { PageHeroSkeleton, FormCardSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-xl px-4 py-14 sm:px-6"><FormCardSkeleton fields={6} /></div></div>;
}
