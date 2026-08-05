"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PublicSiteSettings } from "@/lib/site-settings";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  settings,
}: {
  children: ReactNode;
  settings: PublicSiteSettings;
}) {
  const pathname = usePathname() ?? "/";

  const mobileMenuTrigger = (
    <Sheet>
      <SheetTrigger
        aria-label="Ouvrir la navigation"
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[82vw] max-w-xs border-r border-border bg-background p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation principale</SheetTitle>
          <SheetDescription>
            Accédez aux principales rubriques du site.
          </SheetDescription>
        </SheetHeader>
        <SiteSidebar
          pathname={pathname}
          siteConfig={settings.siteConfig}
          mobile
        />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen">
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader
          pathname={pathname}
          mobileMenuTrigger={mobileMenuTrigger}
          siteConfig={settings.siteConfig}
        />
        <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
        <SiteFooter settings={settings} />
      </div>
    </div>
  );
}
