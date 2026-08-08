import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Trophy } from "lucide-react";

import { CompetitionsList } from "@/components/competitions/competitions-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Compétitions",
  description:
    "Calendrier, épreuves et informations sportives du Comité Marne de tennis de table.",
  path: "/competitions",
});

export default function CompetitionsPage() {
  const activeCompetitions = competitions.filter(
    (competition) => competition.status === "En cours",
  );
  const upcomingCompetitions = competitions.filter(
    (competition) => competition.status === "À venir",
  );
  const nextCompetition =
    activeCompetitions[0] ?? upcomingCompetitions[0] ?? competitions[0];
  const nextCompetitionPrimaryAction = nextCompetition?.actions.find(
    (action) => action.primary,
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Trophy className="size-4" />
            Saison sportive
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Compétitions
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Les épreuves départementales, leurs périodes et les informations
              à retenir.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">{competitions.length} épreuves</Badge>
          <Badge variant="outline">{activeCompetitions.length} en cours</Badge>
          <Badge variant="outline">{upcomingCompetitions.length} à venir</Badge>
        </div>
      </section>

      {nextCompetition ? (
        <section className="grid gap-4 rounded-lg border border-primary/20 bg-accent p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 gap-4">
            <div className="hidden rounded-md border border-primary/20 bg-background p-3 text-primary sm:block">
              <CalendarDays className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary">
                Prochaine échéance
              </p>
              <h2 className="mt-1 text-balance text-2xl font-semibold tracking-tight">
                {nextCompetition.nextDate}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {nextCompetition.title} · {nextCompetition.location}
              </p>
            </div>
          </div>

          {nextCompetitionPrimaryAction ? (
            <Link
              href={nextCompetitionPrimaryAction.href}
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              {nextCompetitionPrimaryAction.label}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </section>
      ) : null}

      <CompetitionsList competitions={competitions} />

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Documents</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Ressources par compétition
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Accédez directement aux calendriers, convocations et règlements liés
            à chaque épreuve.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {competitions.map((competition) => (
            <article
              key={`${competition.title}-documents`}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {competition.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {competition.documents.length} documents utiles
                  </p>
                </div>
                <div className="rounded-md border border-border bg-background p-2 text-primary">
                  <FileText className="size-4" />
                </div>
              </div>

              <div className="mt-5 divide-y divide-border">
                {competition.documents.map((document) => (
                  <Link
                    key={`${competition.title}-${document.title}`}
                    href={document.href}
                    className="group flex items-center justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium group-hover:text-primary">
                        {document.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {document.category} · {document.format}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
