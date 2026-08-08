import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Trophy } from "lucide-react";

import { CompetitionsList } from "@/components/competitions/competitions-list";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedCalendarEvents } from "@/lib/admin-calendar";
import { getPublishedDocumentCards } from "@/lib/admin-documents";
import { getCalendarEventTypeLabel, getCompetitionTitle } from "@/lib/calendar";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Compétitions",
  description:
    "Calendrier, épreuves et informations sportives du Comité Marne de tennis de table.",
  path: "/competitions",
});

export const dynamic = "force-dynamic";

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function CompetitionsPage() {
  const [databaseDocuments, publishedEvents] = await Promise.all([
    getPublishedDocumentCards(),
    getPublishedCalendarEvents(),
  ]);
  const calendarEvents = publishedEvents ?? [];
  const competitionDocuments =
    databaseDocuments?.filter((document) => document.competitionId) ?? [];
  const displayCompetitions = competitions.map((competition) => {
    const linkedDocuments = competitionDocuments.filter(
      (document) => document.competitionId === competition.id,
    );

    return {
      ...competition,
      documents:
        linkedDocuments.length > 0
          ? linkedDocuments.map((document) => ({
              title: document.title,
              category: document.category,
              format: document.format,
              href: document.href,
              competitionId: document.competitionId ?? undefined,
            }))
          : competition.documents,
    };
  });
  const activeCompetitions = displayCompetitions.filter(
    (competition) => competition.status === "En cours",
  );
  const upcomingCompetitions = displayCompetitions.filter(
    (competition) => competition.status === "À venir",
  );
  const nextCompetition =
    activeCompetitions[0] ?? upcomingCompetitions[0] ?? displayCompetitions[0];
  const nextCompetitionPrimaryAction = nextCompetition?.actions.find(
    (action) => action.primary,
  );
  const nextCalendarEvent = calendarEvents[0];
  const nextCalendarCompetitionTitle = nextCalendarEvent
    ? getCompetitionTitle(nextCalendarEvent.competitionId)
    : null;

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
          <Badge variant="secondary">
            {displayCompetitions.length} épreuves
          </Badge>
          <Badge variant="outline">{activeCompetitions.length} en cours</Badge>
          <Badge variant="outline">{upcomingCompetitions.length} à venir</Badge>
        </div>
      </section>

      {nextCalendarEvent ? (
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
                {nextCalendarEvent.title} · {formatEventDate(nextCalendarEvent.date)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {nextCalendarCompetitionTitle} · {nextCalendarEvent.location}
              </p>
            </div>
          </div>

          <Link
            href="/calendrier"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Voir le calendrier
            <ArrowRight className="size-4" />
          </Link>
        </section>
      ) : nextCompetition ? (
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

      {calendarEvents.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Calendrier sportif
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Prochaines dates publiées
              </h2>
            </div>
            <Link
              href="/calendrier"
              className={buttonVariants({ variant: "outline" })}
            >
              Ouvrir l&apos;agenda
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {calendarEvents.slice(0, 3).map((event) => (
              <article
                key={event.id}
                className="rounded-lg border border-border bg-card p-5"
              >
                <Badge variant="secondary">
                  {getCalendarEventTypeLabel(event.type)}
                </Badge>
                <h3 className="mt-4 font-semibold tracking-tight">
                  {event.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {getCompetitionTitle(event.competitionId)}
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-foreground">
                  <CalendarDays className="size-4 text-primary" />
                  {formatEventDate(event.date)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <CompetitionsList competitions={displayCompetitions} />

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
          {displayCompetitions.map((competition) => (
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
