"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared admin error boundary UI — see `src/components/site/route-error.tsx`
 * for the public-site equivalent. Kept in the admin's own slate/blue tone. */
export function AdminRouteError({
  error,
  reset,
  title = "Something went wrong",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        This page couldn&rsquo;t load. Try again, or go back to the dashboard if it
        keeps happening.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <RotateCcw className="mr-1.5 size-4" /> Try again
        </Button>
        <Button variant="outline" render={<Link href="/admin" />}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
