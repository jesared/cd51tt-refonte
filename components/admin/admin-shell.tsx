"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Landmark,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings2,
  UserRoundCheck,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const adminNavigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    section: "Pilotage",
  },
  {
    href: "/admin/actualites",
    label: "Actualités",
    icon: Newspaper,
    section: "Contenu",
  },
  {
    href: "/admin/documents",
    label: "Documents",
    icon: FileText,
    section: "Contenu",
  },
  {
    href: "/admin/clubs",
    label: "Clubs",
    icon: Building2,
    section: "data",
  },
  {
    href: "/admin/comite",
    label: "Comité",
    icon: Landmark,
    section: "data",
  },
  {
    href: "/admin/cadres-techniques",
    label: "Cadres techniques",
    icon: UserRoundCheck,
    section: "data",
  },
  {
    href: "/admin/site",
    label: "Paramètres",
    icon: Settings2,
    section: "settings",
  },
];

const sections = [
  { id: "Pilotage", label: "Pilotage" },
  { id: "Contenu", label: "Contenu" },
  { id: "data", label: "Données" },
  { id: "settings", label: "Réglages" },
];

type AdminShellProps = {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
};

export function AdminShell({ children, logoutAction }: AdminShellProps) {
  const pathname = usePathname() ?? "/admin";

  return (
    <div className="min-h-screen bg-muted/35 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="relative size-8 overflow-hidden rounded-md border border-border bg-white">
            <Image
              src="/branding/comite-logo.png"
              alt="Logo du Comité de la Marne de Tennis de Table"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5">
              Comité Marne TT
            </p>
            <p className="text-xs text-muted-foreground">Back-office</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {sections.map((section) => (
            <div key={section.id} className="mb-5">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {adminNavigation
                  .filter((item) => item.section === section.id)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex h-9 items-center gap-2 rounded-md px-2 text-sm transition-colors",
                          isActive
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex h-9 items-center rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Voir le site public
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-1 flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="size-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
          <div className="flex min-h-16 flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="relative size-8 overflow-hidden rounded-md border border-border bg-white">
                <Image
                  src="/branding/comite-logo.png"
                  alt="Logo du Comité de la Marne de Tennis de Table"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Comité Marne TT</p>
                <p className="text-xs text-muted-foreground">Back-office</p>
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-medium">Administration</p>
              <p className="text-xs text-muted-foreground">
                Gestion du contenu et des données du site.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-md bg-background text-foreground"
              >
                Local
              </Badge>
              <ThemeToggle />
              <Link
                href="/"
                className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Site public
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-background px-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-3 lg:hidden">
            {adminNavigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 rounded-md px-3 py-1.5 text-sm",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
