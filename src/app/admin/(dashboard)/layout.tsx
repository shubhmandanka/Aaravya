import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMobileNav } from "./admin-mobile-nav";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminName = user?.email ?? "Admin";

  return (
    <div className="admin-scope flex min-h-screen flex-col bg-background md:flex-row">
      <AdminMobileNav adminName={adminName} />
      <AdminSidebar adminName={adminName} />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
