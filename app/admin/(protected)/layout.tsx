import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";

import { logoutAdmin, requireAdminSession } from "@/lib/admin-auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card">
          <header className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-medium text-primary">
                Administration
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">
                Back-office du comité
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                Voir le site
              </Link>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogOut className="size-4" />
                  Se déconnecter
                </button>
              </form>
            </div>
          </header>

          <div className="grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="border-b border-border px-5 py-5 lg:border-b-0 lg:border-r lg:px-6">
              <nav>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
                >
                  <LayoutDashboard className="size-4" />
                  Tableau de bord
                </Link>
              </nav>
            </aside>

            <main className="px-5 py-5 sm:px-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
