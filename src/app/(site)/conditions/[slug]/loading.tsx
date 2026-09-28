import { DetailHeroSkeleton, CardGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><DetailHeroSkeleton /><div className="mt-10"><CardGridSkeleton count={3} columns={3} /></div></div>;
}
