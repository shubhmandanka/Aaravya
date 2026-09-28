import { ContentSkeleton, CardGridSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div className="mx-auto max-w-3xl px-6 py-12"><ContentSkeleton lines={4} /><CardGridSkeleton count={4} columns={4} /></div>;
}
