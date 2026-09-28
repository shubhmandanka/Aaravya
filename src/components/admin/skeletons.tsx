import { Skeleton } from "@/components/skeleton";

/** Mirrors `AdminListHeader` + `AdminTable`. */
export function AdminTableSkeleton({ columns = 4, rows = 6, showNewButton = true }: { columns?: number; rows?: number; showNewButton?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        {showNewButton && <Skeleton className="h-9 w-28 rounded-md" />}
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex gap-4 border-b border-border bg-muted/60 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 border-b border-border/70 px-4 py-3.5 last:border-0">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-4 w-20 first:w-32" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mirrors `AdminFormShell` + `Field` rows. */
export function AdminFormSkeleton({ fields = 5 }: { fields?: number }) {
  return (
    <div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="mt-2 h-8 w-56" />
      <div className="mt-6 flex max-w-2xl flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="mt-2 h-11 w-32 rounded-md" />
      </div>
    </div>
  );
}

/** Mirrors the dashboard home's stat-card grid. */
export function AdminDashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="mt-3 h-8 w-12" />
            <Skeleton className="mt-1 h-4 w-28" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-8 h-16 w-full rounded-xl" />
    </div>
  );
}

/** Mirrors the appointments inbox: status filter chips + table. */
export function AdminAppointmentsSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-44" />
      <Skeleton className="mt-1 h-4 w-72" />
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="mt-4">
        <AdminTableSkeleton columns={7} rows={8} showNewButton={false} />
      </div>
    </div>
  );
}

/** Mirrors the admin login card. */
export function AdminLoginSkeleton() {
  return (
    <div className="admin-scope flex min-h-screen items-center justify-center bg-[var(--sidebar)] px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-card p-8 shadow-xl">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="mt-1 h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
