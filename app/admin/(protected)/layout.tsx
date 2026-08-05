import { AdminShell } from "@/components/admin/admin-shell";
import { logoutAdmin, requireAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return <AdminShell logoutAction={logoutAdmin}>{children}</AdminShell>;
}
