"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  AdminFormError,
  adminAction,
  requiredString,
  revalidatePublicSite,
  toIntOrNull,
  toStringOrNull,
  type FormState,
} from "@/lib/admin/actions";
import { FAQ_PAGE_CONTEXTS } from "./page-contexts";

function readFaqForm(formData: FormData) {
  const pageContext = String(formData.get("pageContext") ?? "");
  if (!FAQ_PAGE_CONTEXTS.some((c) => c.value === pageContext)) throw new AdminFormError("Choose where this FAQ appears.");
  return {
    question: requiredString(formData, "question", "Question"),
    answer: requiredString(formData, "answer", "Answer"),
    conditionId: toStringOrNull(formData.get("conditionId")),
    topic: toStringOrNull(formData.get("topic")),
    pageContext,
    sortOrder: toIntOrNull(formData.get("sortOrder")) ?? 0,
  };
}

export async function createFaq(_state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    await prisma.faq.create({ data: readFaqForm(formData) });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, _state: FormState, formData: FormData): Promise<FormState> {
  const result = await adminAction(async () => {
    await prisma.faq.update({ where: { id }, data: readFaqForm(formData) });
    revalidatePublicSite();
  });
  if (result) return result;
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string): Promise<FormState> {
  return adminAction(async () => {
    await prisma.faq.delete({ where: { id } });
    revalidatePublicSite();
  });
}
