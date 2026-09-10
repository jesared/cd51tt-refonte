import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { logoutAdmin, requireAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  if (session.mustChangePassword) {
    redirect("/admin/mot-de-passe");
  }

  return (
    <AdminShell logoutAction={logoutAdmin} session={session}>
      {children}
    </AdminShell>
  );
}
