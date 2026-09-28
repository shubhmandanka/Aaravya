import { ContentSkeleton } from "@/components/site/skeletons";
import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="mt-4 h-4 w-40" />
      <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
      <ContentSkeleton lines={8} />
    </div>
  );
}
