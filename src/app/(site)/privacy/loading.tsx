import { PageHeroSkeleton, ContentSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><ContentSkeleton lines={8} /></div>;
}
