"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Search,
  Stethoscope,
  CalendarPlus,
  Headset,
  X,
  ArrowLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { containsRedFlag } from "@/content/symptom-checker";
import { getChatFaqsAction } from "@/lib/actions/chat";

type Faq = { id: string; question: string; answer: string };
type View = "menu" | "ask" | "coordinator";

function scoreMatch(query: string, faq: Faq): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const haystack = (faq.question + " " + faq.answer).toLowerCase();
  return words.reduce((score, w) => (haystack.includes(w) ? score + 1 : score), 0);
}

export function ChatWidget({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [redFlag, setRedFlag] = useState(false);
  const [matches, setMatches] = useState<Faq[]>([]);

  // FAQs are only needed for the "ask a question" view, so they're fetched
  // on demand the first time that view opens rather than on every page load.
  const [faqs, setFaqs] = useState<Faq[] | null>(null);
  const [loadingFaqs, startLoadingFaqs] = useTransition();

  function openAsk() {
    setView("ask");
    if (faqs === null) {
      startLoadingFaqs(async () => {
        const data = await getChatFaqsAction();
        setFaqs(data);
      });
    }
  }

  function reset() {
    setView("menu");
    setQuery("");
    setSearched(false);
    setRedFlag(false);
    setMatches([]);
  }

  const faqsLoading = loadingFaqs || faqs === null;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || faqs === null) return;
    if (containsRedFlag(query)) {
      setRedFlag(true);
      setSearched(true);
      setMatches([]);
      return;
    }
    setRedFlag(false);
    const ranked = faqs
      .map((f) => ({ faq: f, score: scoreMatch(query, f) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.faq);
    setMatches(ranked);
    setSearched(true);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-brand-foreground">
            <p className="font-heading text-sm font-semibold">Aaravya Assistant</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </button>
          </div>

          <div className="border-b border-border bg-muted/40 px-4 py-2 text-[0.7rem] text-muted-foreground">
            This is not a diagnosis. For medical concerns, please consult a doctor.
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {view === "menu" && (
              <div className="flex flex-col gap-2">
                <Link
                  href="/symptom-checker"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:border-brand hover:bg-accent"
                >
                  <Stethoscope className="size-4 text-brand" /> Check my symptoms
                </Link>
                <button
                  onClick={openAsk}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:border-brand hover:bg-accent"
                >
                  <Search className="size-4 text-brand" /> Ask a question anonymously
                </button>
                <Link
                  href="/book"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:border-brand hover:bg-accent"
                >
                  <CalendarPlus className="size-4 text-brand" /> Book an appointment
                </Link>
                <button
                  onClick={() => setView("coordinator")}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 text-left text-sm hover:border-brand hover:bg-accent"
                >
                  <Headset className="size-4 text-brand" /> Talk to a coordinator
                </button>
              </div>
            )}

            {view === "ask" && (
              <div>
                <button onClick={reset} className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="size-3" /> Back
                </button>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. is piles surgery painful?"
                    disabled={faqsLoading}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={faqsLoading}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-brand px-3 py-2 text-brand-foreground disabled:opacity-60"
                    aria-label="Search"
                  >
                    {faqsLoading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                  </button>
                </form>
                <p className="mt-2 text-[0.68rem] text-muted-foreground">
                  {faqsLoading ? "Loading questions…" : "No name or email needed to ask."}
                </p>

                {searched && redFlag && (
                  <div className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    <div className="flex items-center gap-2 font-medium">
                      <AlertTriangle className="size-4" /> This sounds urgent
                    </div>
                    <p className="mt-1.5">
                      Please call us right now, or go to the nearest emergency room if you can&rsquo;t reach us.
                    </p>
                    <a href={`tel:${phone}`} className="mt-2 inline-block font-semibold underline">
                      {phone}
                    </a>
                  </div>
                )}

                {searched && !redFlag && matches.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2.5">
                    {matches.map((m) => (
                      <div key={m.id} className="rounded-xl border border-border p-3">
                        <p className="text-sm font-medium">{m.question}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{m.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {searched && !redFlag && matches.length === 0 && (
                  <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                    No exact match — want to{" "}
                    <button onClick={() => setView("coordinator")} className="font-medium text-brand underline">
                      talk to a coordinator
                    </button>{" "}
                    instead?
                  </div>
                )}
              </div>
            )}

            {view === "coordinator" && (
              <div>
                <button onClick={reset} className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="size-3" /> Back
                </button>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:border-brand hover:bg-accent"
                  >
                    <MessageCircle className="size-4 text-[#25D366]" /> WhatsApp us
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm hover:border-brand hover:bg-accent"
                  >
                    <Phone className="size-4 text-brand" /> Call {phone}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}
