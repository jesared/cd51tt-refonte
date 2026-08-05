import { Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Coordonnées et formulaire pour contacter le Comité Marne de tennis de table.",
  path: "/contact",
});

const contactItems = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    icon: Mail,
  },
  {
    label: "Téléphone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replaceAll(" ", "")}`,
    icon: Phone,
  },
  {
    label: "Adresse",
    value: `${siteConfig.addressLine1}, ${siteConfig.city}`,
    href: null,
    icon: MapPin,
  },
];

export default function ContactPage() {
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
            Indiquez votre sujet et vos coordonnées. Le formulaire est prêt pour
            être relié à l’envoi réel.
          </p>
        </div>

        <form className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Nom complet" />
            <Input type="email" placeholder="Adresse email" />
          </div>
          <Input placeholder="Objet" />
          <Textarea
            placeholder="Votre message"
            className="min-h-36"
          />
          <div className="flex justify-end">
            <Button type="button">
              Envoyer
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
