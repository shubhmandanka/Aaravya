"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/generated/prisma";
import { AdminFormError, adminAction, type FormState } from "@/lib/admin/actions";

function revalidateInbox() {
  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

export async function updateAppointmentStatus(id: string, status: string): Promise<FormState> {
  return adminAction(async () => {
    if (!Object.values(AppointmentStatus).includes(status as AppointmentStatus)) {
      throw new AdminFormError("That isn't a valid appointment status.");
    }
    await prisma.appointment.update({ where: { id }, data: { status: status as AppointmentStatus } });
    revalidateInbox();
  });
}

export async function deleteAppointment(id: string): Promise<FormState> {
  return adminAction(async () => {
    await prisma.appointment.delete({ where: { id } });
    revalidateInbox();
  });
}
