import type { MediaCategory } from "@/generated/prisma";

export const MEDIA_CATEGORY_LABELS: Record<MediaCategory, string> = {
  HAPPY_FACES: "Happy Faces",
  INTERIOR: "Interior",
  SURGERY: "Surgery",
  TESTIMONIAL: "Patient Testimonials",
};

export const MEDIA_CATEGORY_HELP: Record<MediaCategory, string> = {
  HAPPY_FACES: "Shown in the Gallery page's Happy Faces tab",
  INTERIOR: "Shown in the Gallery page's Interior tab",
  SURGERY: "Shown in the Gallery page's Surgery tab",
  TESTIMONIAL: "Shown on /testimonials and in the homepage Patient Stories carousel",
};
