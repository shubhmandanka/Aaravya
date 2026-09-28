import { PageHeroSkeleton, AvatarCardGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-5xl px-4 py-14 sm:px-6"><AvatarCardGridSkeleton count={2} /></div></div>;
}
