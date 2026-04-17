import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ChevronRight,
  FileText,
  Home,
  Mail,
  Newspaper,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { mainNavigation, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type SiteSidebarProps = {
  pathname: string;
  mobile?: boolean;
};

const navigationIcons: Record<string, LucideIcon> = {
  "/": Home,
  "/actualites": Newspaper,
  "/competitions": Trophy,
  "/clubs": Building2,
  "/documents": FileText,
  "/comite": Users,
  "/contact": Mail,
};

export function SiteSidebar({ pathname, mobile = false }: SiteSidebarProps) {
  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative size-12 overflow-hidden rounded-xl border border-sidebar-border bg-card">
            <Image
              src="/branding/comite-logo.png"
              alt="Logo du Comité de la Marne de Tennis de Table"
              fill
              priority
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.08em]">
              {siteConfig.shortName}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              {siteConfig.season}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sidebar-foreground/45">
          Navigation
        </div>
        <div className="space-y-1">
          {mainNavigation.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = navigationIcons[item.href] ?? FileText;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground"
                    : "border-transparent text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {item.label}
                </span>
                {item.badge ? (
                  <Badge className="h-5 rounded-full bg-sidebar-primary px-1.5 text-[10px] text-sidebar-primary-foreground hover:bg-sidebar-primary">
                    {item.badge}
                  </Badge>
                ) : isActive ? (
                  <ChevronRight className="size-4 shrink-0" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-start gap-2 text-xs leading-5 text-sidebar-foreground/62">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-sidebar-primary" />
          <p>
            Structure FFTT prête.
            {mobile ? " Menu compact optimisé pour mobile." : " Base sobre et évolutive."}
          </p>
        </div>
      </div>
    </aside>
  );
}
