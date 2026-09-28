"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shared public-site error boundary UI. Each route segment's `error.tsx`
 * renders this (Next.js requires the boundary itself to be a Client
 * Component, so the thin per-segment files just import and render it).
 */
export function RouteError({
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
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </div>
      <h2 className="font-heading text-xl font-semibold text-forest-900">{title}</h2>
      <p className="text-sm text-muted-foreground">
        This page couldn&rsquo;t load. Please try again, or head back to the homepage
        if the problem continues.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="bg-brand text-brand-foreground hover:bg-brand/90">
          <RotateCcw className="mr-1.5 size-4" /> Try again
        </Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
