"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Stethoscope } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { logoutAction } from "./actions";

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:flex">
      <div className="flex items-center gap-2.5 border-b border-white/10 p-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
          <Stethoscope className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold">Aaravya Admin</p>
          <p className="truncate text-xs text-[var(--sidebar-foreground)]/60">{adminName}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                  : "text-[var(--sidebar-foreground)]/75 hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="border-t border-white/10 p-3">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--sidebar-foreground)]/75 transition-colors hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </form>
    </aside>
  );
}
