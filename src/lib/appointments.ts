import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { escapeHtml } from "@/lib/html";
import { getContactDetails } from "@/lib/queries";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";
import { AnonymousCategory, AppointmentType } from "@/generated/prisma";

export type CreateAppointmentInput = {
  name?: string;
  nickname?: string;
  phone: string;
  email?: string;
  type: AppointmentType;
  conditionId?: string;
  doctorId?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  notes?: string;
  isAnonymous?: boolean;
  anonymousCategory?: AnonymousCategory;
};

/** Drops a condition/doctor id that no longer exists (e.g. a stale ?condition=
 * link) instead of failing the whole booking on a foreign-key error. */
async function existingId(model: "condition" | "doctor", id?: string) {
  if (!id) return null;
  const row =
    model === "condition"
      ? await prisma.condition.findUnique({ where: { id }, select: { id: true } })
      : await prisma.doctor.findUnique({ where: { id }, select: { id: true } });
  return row?.id ?? null;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const [conditionId, doctorId, contact] = await Promise.all([
    existingId("condition", input.conditionId),
    existingId("doctor", input.doctorId),
    getContactDetails(),
  ]);

  const appointment = await prisma.appointment.create({
    data: {
      name: input.name || null,
      nickname: input.nickname || null,
      phone: input.phone,
      email: input.email || null,
      type: input.type,
      conditionId,
      doctorId,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      preferredTimeSlot: input.preferredTimeSlot || null,
      notes: input.notes || null,
      isAnonymous: input.isAnonymous ?? false,
      anonymousCategory: input.anonymousCategory ?? null,
    },
    include: { condition: true, doctor: true },
  });

  const displayName = appointment.isAnonymous
    ? appointment.nickname || "Anonymous patient"
    : appointment.name || "Patient";
  const visitType = appointment.type === "IN_CLINIC" ? "In-Clinic Visit" : "Teleconsultation";
  const categoryLabel = ANONYMOUS_CATEGORIES.find((c) => c.dbValue === appointment.anonymousCategory)?.label;

  const detailRows = [
    ["Type", visitType],
    ["Name / Nickname", displayName],
    ["Phone", appointment.phone],
    appointment.email ? ["Email", appointment.email] : null,
    appointment.condition ? ["Condition", appointment.condition.name] : null,
    appointment.doctor ? ["Preferred Doctor", appointment.doctor.name] : null,
    appointment.preferredDate
      ? ["Preferred Date", appointment.preferredDate.toLocaleDateString("en-IN", { timeZone: "UTC" })]
      : null,
    appointment.preferredTimeSlot ? ["Preferred Time", appointment.preferredTimeSlot] : null,
    appointment.isAnonymous ? ["Anonymous Category", categoryLabel ?? appointment.anonymousCategory] : null,
    appointment.notes ? ["Notes", appointment.notes] : null,
  ].filter((row): row is [string, string] => row !== null);

  // Every value below can come from the public form, so it's escaped before
  // going into HTML that the hospital's own mail server sends.
  const rowsHtml = detailRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${escapeHtml(label)}</td><td style="padding:4px 0;font-weight:600;white-space:pre-line;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
  const subjectName = displayName.replace(/[\r\n]+/g, " ").slice(0, 80);

  await sendMail({
    to: process.env.COORDINATOR_EMAIL || contact.email,
    subject: `New ${visitType} request — ${subjectName}`,
    html: `
      <h2 style="color:#3a653d;">New Appointment Request</h2>
      <table>${rowsHtml}</table>
      <p style="margin-top:16px;color:#6b7280;font-size:13px;">Submitted via the aaravyahospital.com booking form.</p>
    `,
  }).catch((err) => console.error("Failed to send coordinator notification email:", err));

  if (appointment.email) {
    await sendMail({
      to: appointment.email,
      subject: "We've received your appointment request — Aaravya Hospital",
      html: `
        <h2 style="color:#3a653d;">Thank you, ${escapeHtml(displayName)}</h2>
        <p>We've received your ${escapeHtml(visitType.toLowerCase())} request${
        appointment.condition ? ` for <strong>${escapeHtml(appointment.condition.name)}</strong>` : ""
      }. Our coordinator will call you at ${escapeHtml(appointment.phone)} shortly to confirm your slot.</p>
        <p style="color:#6b7280;font-size:13px;">If you need to reach us sooner, call ${escapeHtml(contact.phone)} or WhatsApp us anytime.</p>
      `,
    }).catch((err) => console.error("Failed to send patient confirmation email:", err));
  }

  return appointment;
}
