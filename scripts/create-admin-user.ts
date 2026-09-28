/**
 * One-off script to provision the real admin credential in Supabase Auth.
 * This replaces the retired admin@aaravyahospital.com / ChangeMe123! seed
 * credential entirely — there is no fallback login left once this has run.
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts <email> <password>
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment (server-side only —
 * never expose this key to the browser, and never commit it to git).
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin-user.ts <email> <password>");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  console.log(`Admin user created: ${data.user.email} (id: ${data.user.id})`);
  console.log("They can now log in at /admin/login with this email and password.");
}

main();
