"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  CircleHelp,
  ExternalLink,
  FileText,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Newspaper,
  ScrollText,
  Settings2,
  Trophy,
  Users,
  UserRoundCheck,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AdminRole = "ADMIN" | "EDITOR" | "USER";

const adminNavigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    section: "Pilotage",
  },
  {
    href: "/admin/a-verifier",
    label: "À vérifier",
    icon: ListChecks,
    section: "Pilotage",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/aide",
    label: "Aide",
    icon: CircleHelp,
    section: "Pilotage",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/activite",
    label: "Activité",
    icon: ScrollText,
    section: "Pilotage",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/actualites",
    label: "Actualités",
    icon: Newspaper,
    section: "Contenu",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/documents",
    label: "Documents",
    icon: FileText,
    section: "Contenu",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/competitions",
    label: "Compétitions",
    icon: Trophy,
    section: "Sportif",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/calendrier",
    label: "Échéances",
    icon: CalendarDays,
    section: "Sportif",
    roles: ["ADMIN", "EDITOR"],
  },
  {
    href: "/admin/clubs",
    label: "Clubs",
    icon: Building2,
    section: "data",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/stats",
    label: "Stats",
    icon: BarChart3,
    section: "data",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/comite",
    label: "Comité",
    icon: Landmark,
    section: "data",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/cadres-techniques",
    label: "Cadres techniques",
    icon: UserRoundCheck,
    section: "data",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/utilisateurs",
    label: "Utilisateurs",
    icon: Users,
    section: "settings",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/site",
    label: "Paramètres",
    icon: Settings2,
    section: "settings",
    roles: ["ADMIN"],
  },
] satisfies Array<{
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
  roles?: AdminRole[];
}>;

const sections = [
  { id: "Pilotage", label: "Pilotage" },
  { id: "Contenu", label: "Contenu" },
  { id: "Sportif", label: "Sportif" },
  { id: "data", label: "Données" },
  { id: "settings", label: "Réglages" },
];

type AdminShellProps = {
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
  session: {
    email: string;
    name: string;
    role: AdminRole;
  };
};

export function AdminShell({ children, logoutAction, session }: AdminShellProps) {
  const pathname = usePathname() ?? "/admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleNavigation = adminNavigation.filter(
    (item) =>
      !item.roles || (item.roles as readonly AdminRole[]).includes(session.role),
  );
  const visibleSections = sections.filter((section) =>
    visibleNavigation.some((item) => item.section === section.id),
  );
  const roleLabel =
    session.role === "ADMIN"
      ? "Admin"
      : session.role === "EDITOR"
        ? "Éditeur"
        : "Utilisateur";

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
          {visibleSections.map((section) => (
            <div key={section.id} className="mb-5">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase text-muted-foreground">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {visibleNavigation
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
                          "group relative flex h-9 items-center gap-2 overflow-hidden rounded-md px-3 text-sm transition-[background-color,color,box-shadow,transform] duration-200 ease-out",
                          isActive
                            ? "bg-muted text-foreground shadow-sm ring-1 ring-border"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-200 ease-out",
                            isActive
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-60",
                          )}
                        />
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-[color,transform] duration-200 ease-out",
                            isActive
                              ? "text-primary"
                              : "group-hover:translate-x-0.5",
                          )}
                        />
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
            className="flex h-9 items-center rounded-md px-2 text-sm text-muted-foreground transition-[background-color,color,transform] duration-200 ease-out hover:bg-muted/70 hover:text-foreground"
          >
            Voir le site public
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-1 flex h-9 w-full items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-[background-color,color,transform] duration-200 ease-out hover:bg-muted/70 hover:text-foreground"
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
            <div className="flex w-full items-center justify-between gap-3 lg:hidden">
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
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  aria-label="Ouvrir le menu admin"
                  className="ml-auto inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[88vw] max-w-sm border-r border-border bg-background p-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu administration</SheetTitle>
                    <SheetDescription>
                      Accéder aux modules du tableau de bord.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex h-full flex-col">
                    <div className="border-b border-border px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded-lg border border-border bg-white">
                          <Image
                            src="/branding/comite-logo.png"
                            alt="Logo du Comité de la Marne de Tennis de Table"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            Dashboard CD51TT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Pilotage du site
                          </p>
                        </div>
                      </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-3 py-4">
                      {visibleSections.map((section) => (
                        <div key={section.id} className="mb-5">
                          <p className="mb-1 px-2 text-[11px] font-medium uppercase text-muted-foreground">
                            {section.label}
                          </p>
                          <div className="space-y-1">
                            {visibleNavigation
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
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                      "flex min-h-10 items-center gap-3 rounded-lg border px-3 text-sm transition-colors",
                                      isActive
                                        ? "border-border bg-muted text-foreground"
                                        : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                                    )}
                                  >
                                    <Icon
                                      className={cn(
                                        "size-4 shrink-0",
                                        isActive ? "text-primary" : null,
                                      )}
                                    />
                                    <span className="min-w-0 flex-1 truncate font-medium">
                                      {item.label}
                                    </span>
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
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex h-10 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                      >
                        Voir le site public
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="mt-1 flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                        >
                          <LogOut className="size-4" />
                          Se déconnecter
                        </button>
                      </form>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden lg:block">
              <p className="text-sm font-medium">Administration</p>
              <p className="text-xs text-muted-foreground">
                Gestion du contenu et des données du site.
              </p>
            </div>

            <div className="flex items-center overflow-hidden rounded-full border border-border bg-muted/40 p-1 shadow-sm">
              <span
                className="inline-flex h-8 max-w-[12rem] items-center gap-2 rounded-full bg-background px-3 text-xs font-medium text-foreground shadow-sm"
                title={`${session.name} - ${session.email}`}
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">{roleLabel}</span>
              </span>
              <div className="mx-1 h-5 w-px bg-border" />
              <ThemeToggle className="h-8 w-8 rounded-full border-0 bg-transparent shadow-none hover:bg-background hover:shadow-sm" />
              <div className="mx-1 h-5 w-px bg-border" />
              <Link
                href="/"
                className="inline-flex h-8 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-foreground transition-colors hover:bg-background hover:shadow-sm"
              >
                <ExternalLink className="size-3.5" />
                Site public
              </Link>
              <div className="mx-1 h-5 w-px bg-border" />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground hover:shadow-sm"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
          </div>

        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div key={pathname} className="admin-page-transition">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
