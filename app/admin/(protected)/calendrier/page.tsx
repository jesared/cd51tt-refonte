import Link from "next/link";
import { Eye, EyeOff, Plus, Sparkles } from "lucide-react";

import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSportsCalendar } from "@/components/admin/admin-sports-calendar";
import { Badge } from "@/components/ui/badge";
import {
  deleteCalendarEvent,
  getAdminCalendarEvents,
  seedMockCalendarEvents,
  toggleCalendarEventPublication,
} from "@/lib/admin-calendar";
import { getCalendarEventTypeLabel, getCompetitionTitle } from "@/lib/calendar";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin calendrier",
  description: "Pilotage des échéances sportives du comité.",
  path: "/admin/calendrier",
});

export const dynamic = "force-dynamic";

type AdminCalendrierPageProps = {
  searchParams?: {
    error?: string;
    saved?: string;
    deleted?: string;
    seeded?: string;
    published?: string;
  };
};

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function AdminCalendrierPage({
  searchParams,
}: AdminCalendrierPageProps) {
  const calendarEvents = await getAdminCalendarEvents();
  const publishedCount = calendarEvents.filter((event) => event.published).length;
  const calendarItems = calendarEvents.map((event) => ({
    id: event.id,
    competitionTitle: getCompetitionTitle(event.competitionId),
    date: event.date.toISOString().slice(0, 10),
    title: event.title,
    type: getCalendarEventTypeLabel(event.type),
    location: event.location,
    status: event.published ? ("published" as const) : ("draft" as const),
  }));

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer le calendrier
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Centralisez les journées, tours, finales, convocations, résultats et
            limites d&apos;inscription rattachés à une compétition.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {calendarEvents.length === 0 ? (
            <form action={seedMockCalendarEvents}>
              <button type="submit" className="admin-action">
                <Sparkles className="size-4" />
                Charger un exemple
              </button>
            </form>
          ) : null}
          <Link
            href="/admin/calendrier/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Nouvelle échéance
          </Link>
        </div>
      </section>

      {searchParams?.error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {decodeURIComponent(searchParams.error)}
        </div>
      ) : null}

      {searchParams?.saved ||
      searchParams?.deleted ||
      searchParams?.seeded ||
      searchParams?.published ? (
        <div className="admin-feedback">Calendrier mis à jour.</div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Vue agenda</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Mois, semaine ou liste selon le besoin de pilotage.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{calendarEvents.length} échéances</Badge>
            <Badge variant="secondary">{publishedCount} publiées</Badge>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <AdminSportsCalendar events={calendarItems} />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium">Événements du calendrier</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestion complète des échéances sportives.
            </p>
          </div>
          <Badge variant="outline">Prisma CalendarEvent</Badge>
        </div>

        {calendarEvents.length === 0 ? (
          <div className="p-6 text-sm leading-6 text-muted-foreground">
            Aucune échéance n&apos;est enregistrée pour le moment.
          </div>
        ) : (
          <>
            <div className="hidden border-b border-border px-6 py-3 text-xs font-medium uppercase text-muted-foreground xl:grid xl:grid-cols-[minmax(180px,1.2fr)_150px_160px_140px_minmax(180px,1fr)_120px_44px] xl:gap-4">
              <span>Compétition</span>
              <span>Date</span>
              <span>Libellé</span>
              <span>Type</span>
              <span>Lieu</span>
              <span>Publication</span>
              <span className="sr-only">Actions</span>
            </div>

            <div className="divide-y divide-border">
              {calendarEvents.map((event) => (
                <article
                  key={event.id}
                  className="admin-list-row grid gap-4 px-6 py-4 xl:grid-cols-[minmax(180px,1.2fr)_150px_160px_140px_minmax(180px,1fr)_120px_44px] xl:items-center"
                >
                  <div className="min-w-0">
                    <h4 className="font-medium">
                      {getCompetitionTitle(event.competitionId)}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground xl:hidden">
                      {formatEventDate(event.date)} · {event.title}
                    </p>
                  </div>

                  <p className="text-sm text-foreground">
                    {formatEventDate(event.date)}
                  </p>
                  <p className="text-sm text-foreground">{event.title}</p>
                  <span className="w-fit rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {getCalendarEventTypeLabel(event.type)}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {event.location}
                  </p>
                  <span
                    className={
                      event.published
                        ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                        : "inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {event.published ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                    {event.published ? "Publié" : "Brouillon"}
                  </span>

                  <div className="flex justify-start xl:justify-end">
                    <AdminRowActionsMenu
                      editHref={`/admin/calendrier/${event.id}`}
                      deleteAction={deleteCalendarEvent}
                      deleteId={event.id}
                      deleteMessage="Supprimer cette échéance du calendrier ?"
                    >
                      <form action={toggleCalendarEventPublication}>
                        <input type="hidden" name="id" value={event.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={event.published ? "" : "on"}
                        />
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted"
                        >
                          {event.published ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                          {event.published ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                    </AdminRowActionsMenu>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
