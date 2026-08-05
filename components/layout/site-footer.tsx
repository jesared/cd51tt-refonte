import Image from "next/image";
import Link from "next/link";
import { Camera, ExternalLink, MapPin, MessageCircle, Phone } from "lucide-react";

import { footerNavigation } from "@/lib/site";
import type { PublicSiteSettings } from "@/lib/site-settings";

const socialIcons = {
  Facebook: MessageCircle,
  Instagram: Camera,
};

export function SiteFooter({ settings }: { settings: PublicSiteSettings }) {
  const {
    affiliations,
    partners,
    quickContactLinks,
    siteConfig,
    socialLinks,
  } = settings;

  return (
    <footer className="border-t border-border bg-card/80">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.45fr)] lg:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border">
                <Image
                  src="/branding/comite-logo.png"
                  alt="Logo du Comité de la Marne de Tennis de Table"
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
              Instance départementale au service des clubs, des compétitions et
              du développement du tennis de table dans la Marne.
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

          <div className="rounded-lg border border-border bg-background/60 p-4 text-sm text-muted-foreground lg:justify-self-end">
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <div>
                  <p>{siteConfig.addressLine1}</p>
                  <p>{siteConfig.addressLine2}</p>
                  <p>
                    {siteConfig.postalCode} {siteConfig.city}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <span>{siteConfig.phone}</span>
              </div>
              <p>{siteConfig.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-xs font-semibold uppercase text-foreground">
                Le comité
              </p>
              <div className="mt-3 space-y-1.5">
                {footerNavigation.comite.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-foreground">
                Ressources
              </p>
              <div className="mt-3 space-y-1.5">
                {footerNavigation.activites.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase text-foreground">
                Informations
              </p>
              <div className="mt-3 space-y-1.5">
                {footerNavigation.institutionnel.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-foreground">
                Suivre le comité
              </p>
              <div className="mt-3 space-y-1.5">
                {socialLinks.map((item) => {
                  const Icon =
                    socialIcons[item.label as keyof typeof socialIcons];

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-foreground">
              Affiliations
            </p>
            <div className="mt-3 space-y-1.5 text-sm leading-5 text-muted-foreground">
              {affiliations.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-foreground">
              Partenaires
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm leading-5 text-muted-foreground">
              {partners.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 {siteConfig.shortName}. Comité Départemental de Tennis
            de Table de la Marne.
          </p>
          <p>
            Informations institutionnelles et coordonnées à confirmer avant mise
            en ligne officielle.
          </p>
        </div>
      </div>
    </footer>
  );
}
