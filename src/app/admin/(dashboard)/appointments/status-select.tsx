"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AppointmentStatus } from "@/generated/prisma";
import { updateAppointmentStatus } from "./actions";

const STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "border-amber-200 bg-[var(--status-warning-bg)] text-[var(--status-warning-text)]",
  CONFIRMED: "border-blue-200 bg-[var(--status-info-bg)] text-[var(--status-info-text)]",
  COMPLETED: "border-green-200 bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
  CANCELLED: "border-red-200 bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
};

export function StatusSelect({ id, status }: { id: string; status: AppointmentStatus }) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState(status);
  const router = useRouter();

  return (
    <select
      value={value}
      disabled={pending}
      aria-label="Appointment status"
      onChange={(e) => {
        const next = e.target.value as AppointmentStatus;
        setValue(next);
        startTransition(async () => {
          const result = await updateAppointmentStatus(id, next);
          if (result?.error) {
            // Don't leave the dropdown showing a status that wasn't saved.
            setValue(status);
            alert(result.error);
            router.refresh();
          }
        });
      }}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize outline-none transition-opacity disabled:opacity-50 ${STATUS_STYLES[value]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
