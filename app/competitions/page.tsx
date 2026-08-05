import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Trophy } from "lucide-react";

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

      <section className="grid gap-4">
        {competitions.map((competition) => (
          <article
            key={competition.title}
            className="grid gap-5 rounded-lg border border-border bg-card p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    competition.status === "En cours" ? "default" : "secondary"
                  }
                >
                  {competition.status}
                </Badge>
                <Badge variant="outline">{competition.format}</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {competition.title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                {competition.summary}
              </p>
            </div>

            <div className="rounded-md border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="size-4 text-primary" />
                Période
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {competition.period}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Documents sportifs
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Retrouvez les règlements, convocations et supports utiles.
          </p>
        </div>
        <Link
          href="/documents"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Voir les documents
          <FileText className="size-4" />
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
