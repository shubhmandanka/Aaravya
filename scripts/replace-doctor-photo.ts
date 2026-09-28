/**
 * Replaces a doctor's photo through the same saveWithImage() path the admin
 * "Update Doctor" action uses (validation, resize/WebP, Storage upload, and
 * removal of the previous Storage file only after the DB write succeeds).
 *
 *   npx tsx scripts/replace-doctor-photo.ts <doctor-slug> <image-file>
 *
 * Note: this doesn't revalidate the deployed site's static pages; redeploy
 * (or save the doctor once in the admin) for the public site to pick it up.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { saveWithImage } from "@/lib/storage";

async function main() {
  const [slug, file] = process.argv.slice(2);
  if (!slug || !file) throw new Error("Usage: npx tsx scripts/replace-doctor-photo.ts <doctor-slug> <image-file>");

  const doctor = await prisma.doctor.findUniqueOrThrow({ where: { slug }, select: { id: true, photoUrl: true } });
  const bytes = await readFile(file);
  const ext = path.extname(file).toLowerCase();
  const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  const formData = new FormData();
  formData.set("photoUrl", new File([bytes], path.basename(file), { type }));

  await saveWithImage(formData, "photoUrl", "doctors", doctor.photoUrl, async (photoUrl) => {
    await prisma.doctor.update({ where: { id: doctor.id }, data: { photoUrl } });
  });

  const updated = await prisma.doctor.findUniqueOrThrow({ where: { id: doctor.id }, select: { photoUrl: true } });
  console.log(`previous: ${doctor.photoUrl}\nnow:      ${updated.photoUrl}`);
}

main().finally(() => prisma.$disconnect());
