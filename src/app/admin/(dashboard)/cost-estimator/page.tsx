import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminListHeader } from "@/components/admin/admin-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatBand } from "@/lib/cost-bands";
import { prisma } from "@/lib/prisma";
import { deleteCostCategory, deleteCostTreatment } from "./actions";

export default async function AdminCostEstimatorPage() {
  const categories = await prisma.costCategory.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      condition: { select: { name: true } },
      treatments: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] },
    },
  });

  return (
    <div>
      <AdminListHeader title="Cost Estimator" newHref="/admin/cost-estimator/categories/new" newLabel="New Category" />
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Step 1 categories and their Step 2 treatments, as shown on{" "}
        <Link href="/cost" target="_blank" className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
          /cost <ExternalLink className="size-3" />
        </Link>{" "}
        and in the downloadable price list PDF. Estimates use the standardized ₹5,000 bands.
      </p>

      {categories.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No categories yet — add one to start the estimator.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {categories.map((c) => (
            <section key={c.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-3">
                <div>
                  <h2 className="font-heading font-semibold text-foreground">{c.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {c.condition ? `Books as: ${c.condition.name}` : "No linked condition"} · Order {c.sortOrder}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" render={<Link href={`/admin/cost-estimator/treatments/new?category=${c.id}`} />}>
                    <Plus className="mr-1 size-3.5" /> Add treatment
                  </Button>
                  <Link
                    href={`/admin/cost-estimator/categories/${c.id}`}
                    aria-label={`Edit ${c.name}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteButton action={deleteCostCategory.bind(null, c.id)} confirmText={`Delete the ${c.name} category?`} />
                </div>
              </header>
              {c.treatments.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">No treatments in this category yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2">Treatment</th>
                      <th className="px-4 py-2">Medical name</th>
                      <th className="px-4 py-2">Estimated Treatment Cost</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {c.treatments.map((t) => (
                      <tr key={t.id} className="border-t border-border/70">
                        <td className="px-4 py-2.5">
                          <Link href={`/admin/cost-estimator/treatments/${t.id}`} className="font-medium hover:text-primary">
                            {t.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{t.medicalName ?? "—"}</td>
                        <td className="whitespace-nowrap px-4 py-2.5">{formatBand(t.band)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex justify-end gap-1">
                            <Link
                              href={`/admin/cost-estimator/treatments/${t.id}`}
                              aria-label={`Edit ${t.name}`}
                              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                            >
                              <Pencil className="size-4" />
                            </Link>
                            <DeleteButton action={deleteCostTreatment.bind(null, t.id)} confirmText={`Delete ${t.name}?`} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
