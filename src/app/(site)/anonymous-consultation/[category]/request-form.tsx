"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import {
  anonymousRequestSchema,
  type AnonymousRequestInput,
} from "@/lib/validations/anonymous-request";
import { submitAnonymousRequest } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fadeUp } from "@/lib/motion";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-forest-500 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AnonymousRequestForm({
  categorySlug,
  offerFemaleDoctor,
}: {
  categorySlug: string;
  offerFemaleDoctor: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnonymousRequestInput>({
    resolver: zodResolver(anonymousRequestSchema),
  });

  async function onSubmit(values: AnonymousRequestInput) {
    setSubmitting(true);
    setResult(null);
    const res = await submitAnonymousRequest(categorySlug, values);
    setSubmitting(false);
    setResult(res.ok ? { ok: true } : { ok: false, message: res.message });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-md">
      <AnimatePresence mode="wait">
        {result?.ok ? (
          <motion.div key="success" initial="hidden" animate="visible" variants={fadeUp} className="py-4 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest-100">
              <CheckCircle2 className="size-8 text-forest-700" />
            </div>
            <p className="mt-4 font-heading text-xl font-semibold text-forest-900">Request received</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;ll message you a private video link at the number you gave us —
              no one else sees this request.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
            variants={fadeUp}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Lock className="size-4 text-terracotta-600" /> No full name required
            </div>

            <div>
              <Label htmlFor="nickname">Nickname or Initials</Label>
              <input id="nickname" {...register("nickname")} placeholder="e.g. R.K. or whatever you're comfortable with" className={inputClass} />
              {errors.nickname && <p className="mt-1 text-xs text-destructive">{errors.nickname.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <input id="phone" {...register("phone")} placeholder="To send your private video link" className={inputClass} />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <input id="email" {...register("email")} className={inputClass} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {offerFemaleDoctor && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("preferFemaleDoctor")} className="size-4 rounded border-input accent-forest-600" />
                I&rsquo;d prefer a female doctor (Dr. Dipti Prajapati)
              </label>
            )}

            <div>
              <Label htmlFor="notes">Anything you&rsquo;d like the doctor to know (optional)</Label>
              <Textarea id="notes" rows={3} {...register("notes")} placeholder="Symptoms, how long, whatever you're comfortable sharing" />
            </div>

            {result && !result.ok && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{result.message}</p>
            )}

            <Button type="submit" size="xl" disabled={submitting} className="bg-brand text-brand-foreground hover:bg-terracotta-700 disabled:opacity-70">
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Request a Private Video Consult"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
