import { ContentSkeleton, FormCardSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12"><div className="grid gap-10 lg:grid-cols-[1fr_380px]"><ContentSkeleton lines={7} /><FormCardSkeleton fields={4} /></div></div>;
}
