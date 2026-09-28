import Link from "next/link";
import { CalendarClock, CheckCircle2, Clock, UserX } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [pending, confirmed, todayCount, anonymousCount, conditionsCount, doctorsCount] =
    await Promise.all([
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.appointment.count({ where: { status: "CONFIRMED" } }),
      prisma.appointment.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.appointment.count({ where: { isAnonymous: true } }),
      prisma.condition.count(),
      prisma.doctor.count(),
    ]);

  const stats = [
    {
      label: "Pending Appointments",
      value: pending,
      href: "/admin/appointments?status=PENDING",
      icon: Clock,
      iconBg: "var(--status-warning-bg)",
      iconText: "var(--status-warning-text)",
    },
    {
      label: "Confirmed Appointments",
      value: confirmed,
      href: "/admin/appointments?status=CONFIRMED",
      icon: CheckCircle2,
      iconBg: "var(--status-success-bg)",
      iconText: "var(--status-success-text)",
    },
    {
      label: "New Today",
      value: todayCount,
      href: "/admin/appointments",
      icon: CalendarClock,
      iconBg: "var(--status-info-bg)",
      iconText: "var(--status-info-text)",
    },
    {
      label: "Anonymous Requests",
      value: anonymousCount,
      href: "/admin/appointments",
      icon: UserX,
      iconBg: "var(--secondary)",
      iconText: "var(--secondary-foreground)",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {conditionsCount} conditions · {doctorsCount} doctors published
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span
              className="flex size-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: s.iconBg, color: s.iconText }}
            >
              <s.icon className="size-[18px]" />
            </span>
            <p className="mt-3 font-heading text-3xl font-semibold text-foreground">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Use the menu to manage content — changes go live immediately on the public site.
      </div>
    </div>
  );
}
