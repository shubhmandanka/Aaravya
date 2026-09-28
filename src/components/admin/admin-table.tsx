import Link from "next/link";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminListHeader({ title, newHref, newLabel }: { title: string; newHref?: string; newLabel?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-heading text-2xl font-semibold text-foreground">{title}</h1>
      {newHref && (
        <Button size="sm" render={<Link href={newHref} />} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-1 size-4" /> {newLabel ?? "New"}
        </Button>
      )}
    </div>
  );
}

export function BooleanBadge({
  value,
  trueLabel = "Yes",
  falseLabel = "No",
}: {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        value
          ? "bg-[var(--status-success-bg)] text-[var(--status-success-text)]"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {value ? trueLabel : falseLabel}
    </span>
  );
}

export function AdminTable({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/60 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-14 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Inbox className="size-6 text-muted-foreground/60" />
                  <span>Nothing here yet.</span>
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3.5 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
