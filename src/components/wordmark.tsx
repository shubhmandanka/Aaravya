import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Real logo asset (public/brand/logo.png + logo-white.png), extracted at
 * exact size from the brand file the client supplied. Intrinsic
 * width/height below match the source aspect ratio (~3.3:1) so the browser
 * can compute the right box before the image loads and CSS can resize it
 * with just a height utility (width follows automatically).
 */
export function Wordmark({
  variant = "default",
  className,
}: {
  variant?: "default" | "inverted";
  className?: string;
}) {
  const inverted = variant === "inverted";
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={inverted ? "/brand/logo-white.png" : "/brand/logo.png"}
        alt="Aaravya Hospital"
        width={188}
        height={57}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </span>
  );
}
