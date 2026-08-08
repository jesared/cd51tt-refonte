import Image from "next/image";
import Link from "next/link";

import type { PublicSiteSettings } from "@/lib/site-settings";

export function SiteFooter({ settings }: { settings: PublicSiteSettings }) {
  const { quickContactLinks, siteConfig } = settings;

  return (
    <footer className="border-t border-border bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative size-10 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border">
              <Image
                src="/branding/comite-logo.png"
                alt="Logo du Comite de la Marne de Tennis de Table"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-5">
                {siteConfig.shortName}
              </p>
              <p className="max-w-xl truncate text-sm text-muted-foreground">
                {siteConfig.name}
              </p>
              <p className="text-xs leading-4 text-muted-foreground">
                {siteConfig.season}
              </p>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-5 text-muted-foreground/90">
            Instance d&eacute;partementale au service des clubs, des
            comp&eacute;titions et du d&eacute;veloppement du tennis de table dans
            la Marne.
          </p>

          <div className="flex">
            {quickContactLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 {siteConfig.shortName}. Comit&eacute; D&eacute;partemental
            de Tennis de Table de la Marne.
          </p>
          <p>
            <a
              href="https://www.jesared.fr/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              Cr&eacute;&eacute; par J&eacute;r&ocirc;me
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
