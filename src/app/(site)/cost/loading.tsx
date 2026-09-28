import { PageHeroSkeleton, ContentSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><ContentSkeleton lines={4} /></div>;
}
