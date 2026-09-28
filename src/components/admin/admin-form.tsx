"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { FormState } from "@/lib/admin/actions";

// Outside an AdminForm (a plain `<form action>`) there's nothing to wait for.
const StatusContext = createContext({ pending: false, ready: true });

export function useAdminFormStatus() {
  return useContext(StatusContext);
}

const noopSubscribe = () => () => {};

/** false during SSR and hydration, true once the client has taken over. */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * Admin `<form>` wrapper for actions that return `FormState`. Submits through
 * `onSubmit` rather than the `action` prop on purpose: React resets
 * uncontrolled fields after a form action completes, which would wipe
 * everything the admin typed whenever the server reports a validation error.
 * The trade-off is that nothing works before hydration, so the submit button
 * stays disabled until then and `method="post"` keeps a stray native submit
 * from putting field values in the URL.
 */
export function AdminForm({
  action,
  className,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, dispatch, pending] = useActionState(action, undefined);
  const ready = useHydrated();
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state) bannerRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [state]);

  return (
    <form
      method="post"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => dispatch(formData));
      }}
    >
      <StatusContext value={{ pending, ready }}>
        {state?.error && (
          <div
            ref={bannerRef}
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.error}
          </div>
        )}
        {state?.success && !state.error && (
          <div
            ref={bannerRef}
            role="status"
            className="flex items-start gap-2 rounded-lg border border-[var(--status-success-text)]/20 bg-[var(--status-success-bg)] px-4 py-3 text-sm text-[var(--status-success-text)]"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {state.success}
          </div>
        )}
        {children}
      </StatusContext>
    </form>
  );
}
