"use server";

import { getFaqs } from "@/lib/queries";

/**
 * Called on-demand from the client chat widget the first time its "ask a
 * question" view is opened — not eagerly on every page load. Previously the
 * widget's FAQ list was fetched server-side in the root site layout on
 * every single navigation, whether or not a visitor ever opened the widget.
 */
export async function getChatFaqsAction() {
  const faqs = await getFaqs();
  return faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
}
