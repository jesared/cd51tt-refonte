import { Mail, MapPin, Phone, Send } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Coordonnées et formulaire pour contacter le Comité Marne de tennis de table.",
  path: "/contact",
});

type SiteConfig = Awaited<
  ReturnType<typeof getPublicSiteSettings>
>["siteConfig"];

function formatAddress(siteConfig: SiteConfig) {
  const cityLine = [siteConfig.postalCode, siteConfig.city]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return [siteConfig.addressLine1, siteConfig.addressLine2, cityLine]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(", ");
}

export default async function ContactPage() {
  const { siteConfig } = await getPublicSiteSettings();
  const email = siteConfig.email.trim();
  const phone = siteConfig.phone.trim();
  const address = formatAddress(siteConfig);
  const contactItems = [
    email
      ? {
          label: "Email",
          value: email,
          href: `mailto:${email}`,
          icon: Mail,
        }
      : null,
    phone
      ? {
          label: "Téléphone",
          value: phone,
          href: `tel:${phone.replaceAll(" ", "")}`,
          icon: Phone,
        }
      : null,
    address
      ? {
          label: "Adresse",
          value: address,
          href: null,
          icon: MapPin,
        }
      : null,
  ].filter((item) => item !== null);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Mail className="size-4" />
            Nous joindre
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Contact
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Une question, une demande ou une information à transmettre au
              comité.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="rounded-md border border-border bg-background p-2 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-semibold">{item.value}</p>
              </div>
            </>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              className="flex min-h-28 items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/45 hover:bg-accent"
            >
              {content}
            </a>
          ) : (
            <div
              key={item.label}
              className="flex min-h-28 items-center gap-4 rounded-lg border border-border bg-card p-5"
            >
              {content}
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 rounded-lg border border-border bg-card p-5 sm:p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Envoyer un message
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Le formulaire en ligne n&apos;est pas encore activé. Pour envoyer
            une demande au comité, utilisez l&apos;adresse email officielle.
          </p>
        </div>

        <div className="grid gap-4 rounded-md border border-border bg-background p-4">
          {email ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">{email}</p>
              <a
                href={`mailto:${email}?subject=Demande%20depuis%20le%20site%20CD51TT`}
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                Écrire au comité
                <Send className="size-4" />
              </a>
            </div>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              Aucune adresse email n&apos;est configurée pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
