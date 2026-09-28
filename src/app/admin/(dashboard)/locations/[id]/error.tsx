"use client";

import { AdminRouteError } from "@/components/admin/route-error";

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminRouteError {...props} title="Couldn't load this location" />;
}
