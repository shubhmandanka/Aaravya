"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Stethoscope } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "./nav-items";
import { logoutAction } from "./actions";

export function AdminMobileNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[var(--sidebar)] px-4 py-3 text-[var(--sidebar-foreground)] md:hidden">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
          <Stethoscope className="size-3.5" />
        </span>
        <p className="font-heading text-sm font-semibold">Aaravya Admin</p>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="flex size-9 items-center justify-center rounded-lg text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)]"
          aria-label="Open admin menu"
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-72 flex-col overflow-y-auto border-white/10 bg-[var(--sidebar)] p-0 text-[var(--sidebar-foreground)]"
        >
          <SheetHeader className="border-b border-white/10 text-left">
            <SheetTitle className="text-[var(--sidebar-foreground)]">Aaravya Admin</SheetTitle>
            <p className="truncate text-xs text-[var(--sidebar-foreground)]/60">{adminName}</p>
          </SheetHeader>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV_ITEMS.map((item) => {
              const active = "exact" in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
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
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-foreground)]/75 transition-colors hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            >
              <LogOut className="size-4" /> Sign Out
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
