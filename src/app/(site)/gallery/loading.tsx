import { PageHeroSkeleton, GalleryGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div><PageHeroSkeleton /><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><GalleryGridSkeleton count={9} /></div></div>;
}
