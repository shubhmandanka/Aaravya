"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

const MAX_BYTES = 8 * 1024 * 1024; // keep in sync with src/lib/storage.ts
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** A legacy `photoUrl`/image value may be a bare relative path left over from
 * the old static site (e.g. `assets/img/team/dr-deep.png`), while anything
 * uploaded through this component is stored as `/uploads/...`. Normalize
 * both to a root-relative `src` so the preview renders either way. */
function normalizeSrc(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:")) return url;
  return `/${url}`;
}

/**
 * Drop-in replacement for a plain image-path text input inside an existing
 * admin `<form action={serverAction}>`. It stays a normal, uncontrolled file
 * input under the hood — no new endpoint, no client-side upload call — so
 * the actual file rides along in the same FormData POST the form already
 * makes, and the corresponding server action resolves it via
 * `uploadImage()`/`deleteImage()` from `@/lib/storage`.
 *
 * Also renders a hidden `${name}__remove` field the server action checks:
 * set to "1" when the admin clicks "Remove image" without picking a new
 * file, so the action knows to clear (and clean up) the existing image
 * instead of leaving it untouched.
 */
export function ImageUploadField({
  name,
  label,
  currentImageUrl,
  help,
}: {
  name: string;
  label: string;
  currentImageUrl?: string | null;
  help?: string;
}) {
  const [preview, setPreview] = useState<string | null>(normalizeSrc(currentImageUrl));
  const [fileName, setFileName] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null) {
    setError(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large (max 8MB).");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setRemoved(false);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    setPreview(null);
    setFileName(null);
    setError(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="mt-1.5 flex items-start gap-4">
        <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-muted/40">
          {preview ? (
            // Preview source is either a data: URL (just-selected file) or an
            // existing /uploads path — next/image needs a fixed size or a
            // configured remote loader for the latter, so a plain <img> here
            // keeps this self-contained.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground/50" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            id={name}
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="block text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-foreground file:transition-colors hover:file:bg-secondary/80"
          />
          {fileName && <p className="text-xs text-muted-foreground">Selected: {fileName}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {(preview || currentImageUrl) && !error && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              <X className="size-3.5" /> Remove image
            </button>
          )}
          <p className="text-xs text-muted-foreground/70">{help ?? "JPEG, PNG, or WebP. Max 8MB."}</p>
        </div>
      </div>
      <input type="hidden" name={`${name}__remove`} value={removed ? "1" : ""} />
    </div>
  );
}
