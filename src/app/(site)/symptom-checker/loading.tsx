import { FormCardSkeleton } from "@/components/site/skeletons";

export default function Loading() {
  return <div className="mx-auto max-w-xl px-6 py-14 sm:py-16"><FormCardSkeleton fields={4} /></div>;
}
