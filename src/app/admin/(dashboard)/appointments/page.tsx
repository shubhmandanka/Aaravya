import Link from "next/link";
import { Video, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus, AppointmentType } from "@/generated/prisma";
import { AdminTable } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";
import { StatusSelect } from "./status-select";
import { deleteAppointment } from "./actions";

const STATUS_FILTERS: (AppointmentStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function oneOf<T extends string>(values: readonly T[], value: string | undefined): T | undefined {
  return values.includes(value as T) ? (value as T) : undefined;
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  // Unknown values from a hand-edited URL are ignored rather than crashing the query.
  const status = oneOf(Object.values(AppointmentStatus), params.status);
  const type = oneOf(Object.values(AppointmentType), params.type);

  const appointments = await prisma.appointment.findMany({
    where: { status, type },
    include: { condition: true, doctor: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Appointments</h1>
      <p className="mt-1 text-sm text-muted-foreground">Requests from the booking form and anonymous consultation funnel.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/appointments" : `/admin/appointments?status=${s}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              (status ?? "ALL") === s
                ? "border-primary bg-accent text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <AdminTable
        columns={["Patient", "Contact", "Type", "Condition / Doctor", "Requested", "Status", "Received", ""]}
        rows={appointments.map((a) => [
          <div key="name">
            <p className="font-medium text-foreground">{a.isAnonymous ? a.nickname ?? "Anonymous" : a.name ?? "—"}</p>
            {a.isAnonymous && (
              <span className="mt-0.5 inline-block rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground">
                Anonymous · {ANONYMOUS_CATEGORIES.find((c) => c.dbValue === a.anonymousCategory)?.label ?? "Other"}
              </span>
            )}
          </div>,
          <div key="contact" className="text-xs text-muted-foreground">
            <p>{a.phone}</p>
            {a.email && <p>{a.email}</p>}
          </div>,
          <span key="type" className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
            {a.type === "IN_CLINIC" ? (
              <Building2 className="size-3.5 text-muted-foreground" />
            ) : (
              <Video className="size-3.5 text-muted-foreground" />
            )}
            {a.type === "IN_CLINIC" ? "In-Clinic" : "Teleconsult"}
          </span>,
          <div key="rel" className="text-xs text-muted-foreground">
            {a.condition && <p>{a.condition.name}</p>}
            {a.doctor && <p>{a.doctor.name}</p>}
          </div>,
          <div key="requested" className="max-w-56 text-xs text-muted-foreground">
            {a.preferredDate || a.preferredTimeSlot ? (
              <p className="font-medium text-foreground">
                {a.preferredDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}
                {a.preferredDate && a.preferredTimeSlot ? " · " : ""}
                {a.preferredTimeSlot}
              </p>
            ) : (
              <p>Any time</p>
            )}
            {a.notes && (
              <p className="mt-0.5 line-clamp-2" title={a.notes}>
                {a.notes}
              </p>
            )}
          </div>,
          <StatusSelect key={`status-${a.status}`} id={a.id} status={a.status} />,
          <span key="date" className="text-xs text-muted-foreground">
            {a.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>,
          <div key="actions" className="flex justify-end">
            <DeleteButton action={deleteAppointment.bind(null, a.id)} confirmText="Delete this appointment record?" />
          </div>,
        ])}
      />
    </div>
  );
}
