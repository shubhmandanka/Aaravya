"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { appointmentSchema, type AppointmentInput } from "@/lib/validations/appointment";
import { submitBooking } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fadeUp } from "@/lib/motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-forest-500 focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function BookingForm({
  conditions,
  doctors,
  defaultConditionId,
  defaultDoctorId,
  defaultNotes,
}: {
  conditions: { id: string; name: string }[];
  doctors: { id: string; name: string }[];
  defaultConditionId?: string;
  defaultDoctorId?: string;
  defaultNotes?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: "IN_CLINIC",
      conditionId: defaultConditionId ?? "",
      doctorId: defaultDoctorId ?? "",
      notes: defaultNotes ?? "",
    },
  });

  async function onSubmit(values: AppointmentInput) {
    setSubmitting(true);
    setResult(null);
    const res = await submitBooking(values);
    setSubmitting(false);
    setResult(res.ok ? { ok: true } : { ok: false, message: res.message });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-md sm:p-8">
      <AnimatePresence mode="wait">
        {result?.ok ? (
          <motion.div
            key="success"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="py-6 text-center"
          >
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-forest-100">
              <CheckCircle2 className="size-8 text-forest-700" />
            </div>
            <p className="mt-4 font-heading text-xl font-semibold text-forest-900">
              Request received
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Our coordinator will call you shortly to confirm your appointment.
              You&rsquo;ll also get an email confirmation if you provided one.
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
            <div>
              <Label>Visit Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="mt-2 grid grid-cols-2 gap-3"
                  >
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm transition-colors has-[[data-checked]]:border-forest-400 has-[[data-checked]]:bg-forest-50">
                      <RadioGroupItem value="IN_CLINIC" /> In-Clinic Visit
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm transition-colors has-[[data-checked]]:border-forest-400 has-[[data-checked]]:bg-forest-50">
                      <RadioGroupItem value="TELECONSULT" /> Teleconsultation
                    </label>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <input id="name" {...register("name")} className={inputClass} />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <input
                  id="phone"
                  {...register("phone")}
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <input id="email" {...register("email")} className={inputClass} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Condition (optional)</Label>
                <Controller
                  control={control}
                  name="conditionId"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="Select a condition">
                          {(value: string | null) =>
                            conditions.find((c) => c.id === value)?.name ?? "Select a condition"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label>Preferred Doctor (optional)</Label>
                <Controller
                  control={control}
                  name="doctorId"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="No preference">
                          {(value: string | null) =>
                            doctors.find((d) => d.id === value)?.name ?? "No preference"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="preferredDate">Preferred Date (optional)</Label>
                <input
                  id="preferredDate"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  // The server's "today" can differ from the browser's around midnight.
                  suppressHydrationWarning
                  {...register("preferredDate")}
                  className={inputClass}
                />
                {errors.preferredDate && <p className="mt-1 text-xs text-destructive">{errors.preferredDate.message}</p>}
              </div>
              <div>
                <Label>Preferred Time (optional)</Label>
                <Controller
                  control={control}
                  name="preferredTimeSlot"
                  render={({ field }) => (
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>

            {result && !result.ok && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{result.message}</p>
            )}

            <Button
              type="submit"
              size="xl"
              disabled={submitting}
              className="bg-brand text-brand-foreground hover:bg-terracotta-700 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Request Appointment"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
