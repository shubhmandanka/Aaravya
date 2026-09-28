import { z } from "zod";

export const TIME_SLOTS = ["Morning", "Afternoon", "Evening"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

/** A real calendar date in YYYY-MM-DD form, no earlier than yesterday (UTC) so
 * "today" is accepted for patients in any timezone. */
const preferredDate = z
  .string()
  .trim()
  .refine((v) => {
    if (!v) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const t = Date.parse(`${v}T00:00:00Z`);
    return !Number.isNaN(t) && new Date(t).toISOString().startsWith(v) && t >= Date.now() - 2 * DAY_MS;
  }, "Choose a preferred date from today onwards");

export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  type: z.enum(["IN_CLINIC", "TELECONSULT"]),
  conditionId: z.string().max(64).optional(),
  doctorId: z.string().max(64).optional(),
  preferredDate: preferredDate.optional(),
  preferredTimeSlot: z.union([z.literal(""), z.enum(TIME_SLOTS)]).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
