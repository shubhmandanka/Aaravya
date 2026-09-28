import { cn } from "@/lib/utils";
import { COST_DISCLAIMER } from "@/content/cost-estimator";

/** Required next to every displayed estimate. */
export function CostDisclaimer({ className }: { className?: string }) {
  return <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>*{COST_DISCLAIMER}</p>;
}
