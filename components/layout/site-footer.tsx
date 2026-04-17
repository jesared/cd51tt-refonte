import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-4">
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

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Instance départementale au service des clubs, des compétitions et
              du développement du tennis de table dans la Marne.
            </p>

            <div className="flex flex-wrap gap-2">
              {quickContactLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 text-sm text-muted-foreground">
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

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Clock3 className="size-4 text-primary" />
                Horaires du secrétariat
              </div>
              {officeHours.slice(0, 3).map((hour) => (
                <p key={hour}>{hour}</p>
              ))}
              <p>Jeudi et vendredi sur rendez-vous ou permanence selon saison.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 border-t border-border pt-6 md:grid-cols-3 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
            <div>
              <p className="text-sm font-semibold">Le comité</p>
              <div className="mt-3 space-y-2">
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
            </div>

            <div>
              <p className="text-sm font-semibold">Ressources</p>
              <div className="mt-3 space-y-2">
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
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold">Informations</p>
              <div className="mt-3 space-y-2">
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
              <div className="mt-3 space-y-2">
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

          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold">Affiliations</p>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                {affiliations.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold">Partenaires</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {partners.map((item) => (
                  <span key={item}>{item}</span>
                ))}
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
