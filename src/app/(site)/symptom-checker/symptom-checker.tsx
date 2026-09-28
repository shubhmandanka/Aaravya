"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Phone,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BLEEDING_OPTIONS,
  DURATION_OPTIONS,
  PAIN_OPTIONS,
  SYMPTOM_TYPE_OPTIONS,
  type SymptomAnswers,
  type UrgencyResult,
} from "@/content/symptom-checker";
import { logSymptomSession } from "./actions";
import { fadeUp } from "@/lib/motion";

type Step = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Symptoms", "Duration", "Bleeding", "Pain"];

export function SymptomChecker({ phone, phoneHref, whatsappHref }: { phone: string; phoneHref: string; whatsappHref: string }) {
  const [step, setStep] = useState<Step>(0);
  const [symptomTypes, setSymptomTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState<SymptomAnswers["duration"] | null>(null);
  const [bleeding, setBleeding] = useState<SymptomAnswers["bleeding"] | null>(null);
  const [pain, setPain] = useState<SymptomAnswers["pain"] | null>(null);
  const [result, setResult] = useState<UrgencyResult | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleSymptomType(value: string) {
    setSymptomTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function finish(finalPain: SymptomAnswers["pain"]) {
    setLoading(true);
    const answers: SymptomAnswers = {
      symptomTypes,
      duration: duration!,
      bleeding: bleeding!,
      pain: finalPain,
    };
    const res = await logSymptomSession(answers);
    setResult(res);
    setLoading(false);
    setStep(4);
  }

  function startOver() {
    setSymptomTypes([]);
    setDuration(null);
    setBleeding(null);
    setPain(null);
    setResult(null);
    setStep(0);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft-md sm:p-8">
      {step < 4 && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-forest-700"
              >
                <ChevronLeft className="size-4" /> Back
              </button>
            ) : (
              <span />
            )}
            <span className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of 4 · {STEP_LABELS[step]}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => (
              <div
                key={label}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-forest-600" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step-0" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeUp}>
            <h2 className="font-heading text-xl font-semibold text-forest-900">
              What are you experiencing?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Select all that apply.</p>
            <div className="mt-5 flex flex-col gap-2.5">
              {SYMPTOM_TYPE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3.5 text-sm transition-colors has-[:checked]:border-forest-500 has-[:checked]:bg-forest-50"
                >
                  <input
                    type="checkbox"
                    checked={symptomTypes.includes(opt.value)}
                    onChange={() => toggleSymptomType(opt.value)}
                    className="size-4 rounded border-input accent-forest-600"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <Button
              size="xl"
              className="mt-6 w-full bg-brand text-brand-foreground hover:bg-terracotta-700"
              disabled={symptomTypes.length === 0}
              onClick={() => setStep(1)}
            >
              Continue <ArrowRight className="ml-1" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step-1" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeUp}>
            <h2 className="font-heading text-xl font-semibold text-forest-900">
              How long has this been going on?
            </h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setDuration(opt.value);
                    setStep(2);
                  }}
                  className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm transition-colors hover:border-forest-400 hover:bg-forest-50/60"
                >
                  {opt.label}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step-2" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeUp}>
            <h2 className="font-heading text-xl font-semibold text-forest-900">Any bleeding?</h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {BLEEDING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setBleeding(opt.value);
                    setStep(3);
                  }}
                  className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm transition-colors hover:border-forest-400 hover:bg-forest-50/60"
                >
                  {opt.label}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step-3" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={fadeUp}>
            <h2 className="font-heading text-xl font-semibold text-forest-900">
              How much pain or discomfort?
            </h2>
            <div className="mt-5 flex flex-col gap-2.5">
              {PAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  disabled={loading}
                  onClick={() => {
                    setPain(opt.value);
                    finish(opt.value);
                  }}
                  className="flex items-center justify-between rounded-xl border border-border p-3.5 text-left text-sm transition-colors hover:border-forest-400 hover:bg-forest-50/60 disabled:opacity-50"
                >
                  {opt.label}
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              ))}
            </div>
            {loading && (
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-forest-600" /> Working out what fits best…
              </div>
            )}
          </motion.div>
        )}

        {step === 4 && result && (
          <motion.div key="step-4" initial="hidden" animate="visible" variants={fadeUp} className="text-center">
            <div
              className={`mx-auto flex size-14 items-center justify-center rounded-full ${
                result.level === "URGENT" ? "bg-destructive/10" : "bg-forest-100"
              }`}
            >
              {result.level === "URGENT" ? (
                <AlertTriangle className="size-8 text-destructive" />
              ) : (
                <CheckCircle2 className="size-8 text-forest-700" />
              )}
            </div>
            <p className="mt-4 font-heading text-xl font-semibold text-forest-900">{result.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {result.level === "URGENT" ? (
                <Button size="xl" render={<a href={phoneHref} />} className="bg-destructive text-white hover:bg-destructive/90">
                  <Phone className="mr-1.5" /> Call {phone} Now
                </Button>
              ) : (
                <Button size="xl" render={<Link href="/book" />} className="bg-brand text-brand-foreground hover:bg-terracotta-700">
                  Book a Consultation
                </Button>
              )}
              <Button size="xl" variant="outline" render={<a href={whatsappHref} />}>
                WhatsApp Us
              </Button>
            </div>

            <button
              type="button"
              onClick={startOver}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-forest-700"
            >
              <RotateCcw className="size-3.5" /> Retake the check
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
