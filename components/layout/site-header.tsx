import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { mainNavigation, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  pathname: string;
  mobileMenuTrigger: ReactNode;
};

export function SiteHeader({
  pathname,
  mobileMenuTrigger,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">{mobileMenuTrigger}</div>
          <Link href="/" className="flex min-w-0 items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border">
              <Image
                src="/branding/comite-logo.png"
                alt="Logo du Comite de la Marne de Tennis de Table"
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">
                Comit&eacute; Marne de tennis de table
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {siteConfig.season}
              </p>
            </div>
          </Link>
        </div>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNavigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
