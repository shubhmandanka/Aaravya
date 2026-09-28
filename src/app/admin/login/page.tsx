"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="admin-scope flex min-h-screen items-center justify-center bg-[var(--sidebar)] px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-card p-8 shadow-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Stethoscope className="size-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">Aaravya Admin</p>
            <p className="text-xs text-muted-foreground">Staff sign-in</p>
          </div>
        </div>

        <form action={formAction} className="mt-6 flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="mt-1.5 w-full rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-input bg-white px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg bg-destructive/10 p-2.5 text-sm text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {pending ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0" />
          For hospital staff only. Contact the front desk if you&rsquo;ve lost access.
        </div>
      </div>
    </div>
  );
}
