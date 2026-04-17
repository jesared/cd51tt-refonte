import { CalendarClock, Flag, Trophy } from "lucide-react";

import { PageIntro } from "@/components/shared/page-intro";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";
import { routeCopy } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Compétitions",
  description:
    "Calendrier, épreuves et organisation sportive du comité pour suivre la saison départementale.",
  path: "/competitions",
});

const workflow = [
  "Consulter le calendrier des épreuves et les dates importantes",
  "Retrouver les règlements, convocations et documents utiles",
  "Suivre ensuite les résultats et classements diffusés par le comité",
];

export default function CompetitionsPage() {
  const intro = routeCopy["/competitions"];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow={intro.eyebrow}
        title={intro.title}
        description={intro.description}
      />
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <SectionCard
          eyebrow="Calendrier"
          title="Épreuves et rendez-vous sportifs"
          description="Les compétitions départementales sont regroupées ici pour permettre une consultation rapide par les clubs et les joueurs."
          icon={Trophy}
        >
          <div className="space-y-4">
            {competitions.map((competition) => (
              <div
                key={competition.title}
                className="rounded-3xl border border-border bg-muted p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-medium">{competition.title}</h3>
                  <Badge variant="secondary">{competition.status}</Badge>
                  <Badge variant="outline">{competition.format}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {competition.summary}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                  <CalendarClock className="size-4 text-primary" />
                  {competition.period}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Informations pratiques"
          title="Les bons repères avant chaque échéance"
          description="La page a vocation à centraliser les informations utiles avant, pendant et après chaque compétition."
          icon={Flag}
        >
          <div className="space-y-3">
            {workflow.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
