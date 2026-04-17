import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Camera,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  affiliations,
  footerNavigation,
  officeHours,
  partners,
  quickContactLinks,
  siteConfig,
  socialLinks,
} from "@/lib/site";

const socialIcons = {
  Facebook: MessageCircle,
  Instagram: Camera,
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="surface-panel rounded-[1.5rem] border border-border px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative size-14 overflow-hidden rounded-2xl border border-border bg-background">
                  <Image
                    src="/branding/comite-logo.png"
                    alt="Logo du Comité de la Marne de Tennis de Table"
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{siteConfig.shortName}</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.name}</p>
                  <p className="text-sm text-muted-foreground">{siteConfig.season}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickContactLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
              Instance départementale au service des clubs, des compétitions, du
              développement de la pratique et de l’accompagnement des acteurs du
              tennis de table dans la Marne.
            </p>
          </div>

          <div className="surface-panel rounded-[1.5rem] border border-border px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Phone className="size-4 text-primary" />
              Contact rapide
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </p>
                <p className="mt-2 text-sm font-medium">{siteConfig.email}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Standard
                </p>
                <p className="mt-2 text-sm font-medium">{siteConfig.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="size-4 text-primary" />
                Adresse postale
              </div>
              <div className="mt-4 space-y-1 text-sm leading-6 text-muted-foreground">
                <p>{siteConfig.addressLine1}</p>
                <p>{siteConfig.addressLine2}</p>
                <p>
                  {siteConfig.postalCode} {siteConfig.city}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Clock3 className="size-4 text-primary" />
                Horaires du secrétariat
              </div>
              <div className="mt-4 space-y-1 text-sm leading-6 text-muted-foreground">
                {officeHours.map((hour) => (
                  <p key={hour}>{hour}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">Le comité</p>
            <div className="mt-4 space-y-2">
              {footerNavigation.comite.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold">Ressources</p>
            <div className="mt-4 space-y-2">
              {footerNavigation.activites.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BadgeCheck className="size-4 text-primary" />
                Affiliations
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {affiliations.map((item) => (
                  <Badge key={item} variant="secondary" className="rounded-full px-3 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="size-4 text-primary" />
                Partenaires
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {partners.map((item) => (
                  <Badge key={item} variant="outline" className="rounded-full px-3 py-1">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold">Informations</p>
              <div className="mt-4 space-y-2">
                {footerNavigation.institutionnel.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Suivre le comité</p>
              <div className="mt-4 space-y-2">
                {socialLinks.map((item) => {
                  const Icon = socialIcons[item.label as keyof typeof socialIcons];

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteConfig.shortName}. Comité Départemental de Tennis de
            Table de la Marne.
          </p>
          <p>Informations institutionnelles et coordonnées à confirmer avant mise en ligne officielle.</p>
        </div>
      </div>
    </footer>
  );
}
