"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteShell } from "@/components/layout/site-shell";
import type { PublicSiteSettings } from "@/lib/site-settings";

export function AppFrame({
  children,
  settings,
}: {
  children: ReactNode;
  settings: PublicSiteSettings;
}) {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <SiteShell settings={settings}>{children}</SiteShell>;
}
