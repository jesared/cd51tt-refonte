"use client";

import {
  MapPin,
  Monitor,
  MoonStar,
  MoreHorizontal,
  ShieldCheck,
  SunMedium,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainNavigation, siteConfig } from "@/lib/site";
import type { PublicSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  pathname: string;
  mobileMenuTrigger: ReactNode;
  siteConfig: typeof siteConfig;
  socialLinks: PublicSiteSettings["socialLinks"];
};

const primaryHeaderHrefs = [
  "/competitions",
  "/clubs",
  "/documents",
];
const moreHeaderHrefs = [
  "/calendrier",
  "/cadres-techniques",
  "/comite",
  "/contact",
];

const primaryHeaderNavigation = mainNavigation.filter((item) =>
  primaryHeaderHrefs.includes(item.href),
);
const moreHeaderNavigation = mainNavigation.filter((item) =>
  moreHeaderHrefs.includes(item.href),
);

const themeOptions = [
  { value: "light", label: "Clair", icon: SunMedium },
  { value: "dark", label: "Sombre", icon: MoonStar },
  { value: "system", label: "Système", icon: Monitor },
] as const;

export function SiteHeader({
  pathname,
  mobileMenuTrigger,
  siteConfig,
  socialLinks,
}: SiteHeaderProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isActivePath = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const hasActiveMoreItem = moreHeaderNavigation.some((item) =>
    isActivePath(item.href),
  );
  const activeTheme = mounted ? (theme ?? "system") : "system";
  const facebookLink = socialLinks.find((link) => link.label === "Facebook");
  const instagramLink = socialLinks.find((link) => link.label === "Instagram");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="site-header-floating sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-16 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-border lg:size-11">
              {/* Logo thème clair */}
              <Image
                src="/branding/comite-logo.png"
                alt="Logo du Comité de la Marne de Tennis de Table"
                fill
                priority
                sizes="(min-width: 1024px) 2.75rem, 2.5rem"
                className="object-contain p-0.5 dark:hidden"
              />

              {/* Logo thème sombre */}
              <Image
                src="/branding/comite-logo-dark.png"
                alt="Logo du Comité de la Marne de Tennis de Table"
                fill
                priority
                sizes="(min-width: 1024px) 2.75rem, 2.5rem"
                className="hidden object-contain p-0.5 dark:block"
              />
            </div>

            <p className="truncate text-sm font-semibold leading-none sm:text-base">
              {siteConfig.shortName}
            </p>
          </Link>
        </div>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryHeaderNavigation.map((item) => {
              const isActive = isActivePath(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform",
                      isActive
                        ? "text-primary after:scale-x-100"
                        : "text-muted-foreground hover:bg-muted/45 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Autres rubriques"
                  title="Autres rubriques"
                  className={cn(
                    "flex size-10 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hasActiveMoreItem
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/45 hover:text-foreground",
                  )}
                >
                  <MoreHorizontal className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    {moreHeaderNavigation.map((item) => {
                      const isActive = isActivePath(item.href);

                      return (
                        <DropdownMenuItem key={item.href} className="p-0">
                          <Link
                            href={item.href}
                            className={cn(
                              "flex w-full items-center rounded-md px-2 py-1.5",
                              isActive && "bg-primary/10 text-primary",
                            )}
                          >
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Apparence</DropdownMenuLabel>
                    {themeOptions.map((option) => {
                      const Icon = option.icon;

                      return (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className="justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <Icon className="size-4" />
                            {option.label}
                          </span>
                          {activeTheme === option.value ? (
                            <span className="text-xs text-muted-foreground">
                              Actif
                            </span>
                          ) : null}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-0">
                    <Link
                      href="/admin"
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ShieldCheck className="size-4" />
                      Administration
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {facebookLink ? (
            <a
              href={facebookLink.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Suivre le CD51TT sur Facebook"
              title="Suivre le CD51TT sur Facebook"
              className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[#1877f2] transition-colors hover:border-[#1877f2]/40 hover:bg-[#1877f2]/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#1877f2]/25 sm:inline-flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 fill-current"
              >
                <path d="M13.5 21v-8h2.75l.41-3H13.5V8.08c0-.87.24-1.46 1.58-1.46h1.69V3.94a22.7 22.7 0 0 0-2.46-.13c-2.43 0-4.1 1.49-4.1 4.22V10H7.45v3h2.76v8h3.29Z" />
              </svg>
            </a>
          ) : null}
          {instagramLink ? (
            <a
              href={instagramLink.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Suivre le CD51TT sur Instagram"
              title="Suivre le CD51TT sur Instagram"
              className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[#e1306c] transition-colors hover:border-[#e1306c]/40 hover:bg-[#e1306c]/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#e1306c]/25 sm:inline-flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-4 fill-none stroke-current"
                strokeWidth="2"
              >
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.8" r="1" className="fill-current stroke-none" />
              </svg>
            </a>
          ) : null}
          <div className="lg:hidden">{mobileMenuTrigger}</div>
          <Link
            href="/clubs"
            aria-label="Trouver un club"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-10",
            )}
          >
            <MapPin className="size-4" />
            <span className="hidden sm:inline">Trouver un club</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
