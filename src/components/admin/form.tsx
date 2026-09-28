import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";

export const ADMIN_INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40";

export function AdminFormShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" /> Back
      </Link>
      <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground">{title}</h1>

      <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {htmlFor ? <Label htmlFor={htmlFor}>{label}</Label> : <Label>{label}</Label>}
      {children}
      {help && <p className="mt-1.5 text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}
