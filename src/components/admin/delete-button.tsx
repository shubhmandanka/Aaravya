"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import type { FormState } from "@/lib/admin/actions";

export function DeleteButton({ action, confirmText }: { action: () => Promise<FormState | void>; confirmText?: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      title="Delete"
      onClick={() => {
        if (!confirm(confirmText ?? "Delete this item? This cannot be undone.")) return;
        startTransition(async () => {
          const result = await action();
          if (result?.error) {
            alert(result.error);
            // A failed action doesn't revalidate, so re-fetch in case the list is stale.
            router.refresh();
          }
        });
      }}
      className="flex size-8 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
      aria-label="Delete"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </button>
  );
}
