import { PageHeroSkeleton, FaqListSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><FaqListSkeleton count={6} /></div></div>;
}
