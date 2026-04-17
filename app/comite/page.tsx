import { Handshake, Landmark } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { committeeMembers } from "@/lib/mock-data";
import { routeCopy } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Comité",
  description:
    "Présentation du comité, de sa gouvernance et des responsables engagés dans la vie sportive départementale.",
  path: "/comite",
});

export default function ComitePage() {
  const intro = routeCopy["/comite"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <SectionCard
          eyebrow="Organisation"
          title="Une gouvernance présentée avec clarté"
          description="La page met en avant les responsabilités, les interlocuteurs et les grandes missions portées par le comité."
          icon={Landmark}
        >
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Présidence, pôles opérationnels et référents présentés dans une
              grille simple.
            </p>
            <p>
              Les clubs identifient plus facilement leurs interlocuteurs selon
              les sujets abordés.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Missions"
          title="Accompagner, structurer et représenter le territoire"
          description="Le comité agit au service du développement de la pratique, de l'organisation sportive et de l'accompagnement des structures."
          icon={Handshake}
        >
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Direction</Badge>
            <Badge variant="secondary">Sportif</Badge>
            <Badge variant="secondary">Développement</Badge>
            <Badge variant="secondary">Jeunesse</Badge>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        eyebrow="Équipe"
        title="Bureau et référents"
        description="Les responsables du comité et leurs domaines d'intervention au service de la saison."
        icon={Landmark}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {committeeMembers.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-border bg-muted p-5"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border border-border">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{member.area}</Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {member.mission}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
