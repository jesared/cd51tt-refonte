import { Clock3, Mail, Phone } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPageMetadata } from "@/lib/metadata";
import { contactChannels } from "@/lib/mock-data";
import { routeCopy, siteConfig } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Coordonnées, canaux de contact et formulaire pour joindre rapidement le comité.",
  path: "/contact",
});

export default function ContactPage() {
  const intro = routeCopy["/contact"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SectionCard
          eyebrow="Coordonnées"
          title="Nous joindre"
          description="Retrouvez les bons canaux pour joindre le comité selon votre besoin."
          icon={Mail}
        >
          <div className="space-y-4">
            {contactChannels.map((channel) => (
              <div
                key={channel.title}
                className="rounded-3xl border border-border bg-muted p-5"
              >
                <p className="text-sm font-medium text-foreground">
                  {channel.title}
                </p>
                <p className="mt-2 text-base font-semibold">{channel.value}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {channel.description}
                </p>
              </div>
            ))}

            <div className="grid gap-3 rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                Standard comité
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary" />
                {siteConfig.location}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Formulaire"
          title="Envoyer une demande"
          description="Utilisez ce formulaire pour transmettre une question, une demande d'information ou un besoin d'accompagnement."
          icon={Mail}
        >
          <form className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Nom du club ou nom complet" />
              <Input type="email" placeholder="Adresse email" />
            </div>
            <Input placeholder="Objet de la demande" />
            <Textarea
              placeholder="Décrivez votre besoin : compétition, documents, accompagnement club, gouvernance..."
              className="min-h-40"
            />
            <div className="flex justify-end">
              <Button type="button">Envoyer une demande</Button>
            </div>
          </form>
        </SectionCard>
      </section>
    </div>
  );
}
