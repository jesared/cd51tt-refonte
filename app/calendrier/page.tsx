import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Trophy } from "lucide-react";

import {
  SportsCalendar,
  type SportsCalendarEvent,
} from "@/components/calendar/sports-calendar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedCalendarEvents } from "@/lib/admin-calendar";
import { getCalendarEventTypeLabel, getCompetitionTitle } from "@/lib/calendar";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Calendrier",
  description:
    "Agenda sportif du Comité Marne de tennis de table : journées, tours, convocations, inscriptions et résultats.",
  path: "/calendrier",
});

export const dynamic = "force-dynamic";

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function CalendrierPage() {
  const publishedEvents = (await getPublishedCalendarEvents()) ?? [];
  const calendarItems: SportsCalendarEvent[] = publishedEvents.map((event) => ({
    id: event.id,
    competitionTitle: getCompetitionTitle(event.competitionId),
    date: event.date.toISOString().slice(0, 10),
    title: event.title,
    type: getCalendarEventTypeLabel(event.type),
    location: event.location,
    status: "published",
  }));
  const nextEvents = publishedEvents.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <CalendarDays className="size-4" />
            Agenda sportif
          </div>
          <div className="space-y-3">
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Calendrier
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Retrouvez les échéances publiées par le comité : journées,
              convocations, limites d&apos;inscription et résultats.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="secondary">{publishedEvents.length} échéances</Badge>
          <Badge variant="outline">Mois · Semaine · Liste</Badge>
        </div>
      </section>

      {publishedEvents.length === 0 ? (
        <section className="rounded-lg border border-border bg-card p-8 text-sm leading-6 text-muted-foreground">
          Aucun événement n&apos;est publié pour le moment.
        </section>
      ) : (
        <>
          <section className="rounded-lg border border-border bg-card p-3 sm:p-5">
            <SportsCalendar events={calendarItems} />
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">
                  Prochaines échéances
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  À retenir
                </h2>
              </div>
              <Link
                href="/competitions"
                className={buttonVariants({ variant: "outline" })}
              >
                Voir les compétitions
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {nextEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Badge variant="secondary">
                      {getCalendarEventTypeLabel(event.type)}
                    </Badge>
                    <Trophy className="size-4 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getCompetitionTitle(event.competitionId)}
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-foreground">
                      <CalendarDays className="size-4 text-primary" />
                      {formatEventDate(event.date)}
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      {event.location}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
