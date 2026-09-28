"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useAdminFormStatus } from "@/components/admin/admin-form";

/**
 * Submit button for admin forms: disabled with a spinner while the save (and
 * any image upload) is in flight, to prevent double-submits. Reads pending
 * state from `AdminForm`, or from a plain `<form action>` via `useFormStatus`.
 */
export function AdminSubmitButton({
  children,
  pendingText = "Saving…",
  ...props
}: React.ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending: formPending } = useFormStatus();
  const status = useAdminFormStatus();
  const pending = status.pending || formPending;
  return (
    <Button type="submit" disabled={pending || !status.ready} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" /> {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
