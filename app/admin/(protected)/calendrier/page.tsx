import Link from "next/link";
import { CalendarDays, Eye, EyeOff, MapPin, Plus, Sparkles } from "lucide-react";

import { AdminListControls } from "@/components/admin/admin-list-controls";
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
    q?: string;
    statut?: string;
    type?: string;
    tri?: string;
  };
};

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
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
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const typeFilter = searchParams?.type;
  const sortMode = searchParams?.tri ?? "date-asc";
  const typeOptions = Array.from(
    new Map(
      calendarEvents.map((event) => [
        event.type,
        getCalendarEventTypeLabel(event.type),
      ]),
    ),
  ).sort(([, first], [, second]) => first.localeCompare(second, "fr"));
  const filteredEvents = calendarEvents
    .filter((event) => {
      const typeLabel = getCalendarEventTypeLabel(event.type);
      const competitionTitle = getCompetitionTitle(event.competitionId);
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${competitionTitle} ${event.title} ${typeLabel} ${event.location}`,
        ).includes(query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "published" && event.published) ||
        (statusFilter === "draft" && !event.published);
      const matchesType = !typeFilter || event.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((first, second) => {
      if (sortMode === "title-asc") {
        return first.title.localeCompare(second.title, "fr");
      }

      if (sortMode === "title-desc") {
        return second.title.localeCompare(first.title, "fr");
      }

      return sortMode === "date-desc"
        ? second.date.getTime() - first.date.getTime()
        : first.date.getTime() - second.date.getTime();
    });

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
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">Événements du calendrier</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredEvents.length} sur {calendarEvents.length} échéance(s)
              </p>
            </div>
            <Badge variant="outline">Prisma CalendarEvent</Badge>
          </div>
          <AdminListControls
            searchPlaceholder="Compétition, libellé, type ou lieu"
            filters={[
              {
                name: "statut",
                label: "Publication",
                defaultLabel: "Tous les statuts",
                options: [
                  { label: "Publiées", value: "published" },
                  { label: "Brouillons", value: "draft" },
                ],
              },
              {
                name: "type",
                label: "Type",
                defaultLabel: "Tous les types",
                options: typeOptions.map(([value, label]) => ({
                  label,
                  value,
                })),
              },
            ]}
            sortOptions={[
              { label: "Date proche", value: "date-asc" },
              { label: "Date lointaine", value: "date-desc" },
              { label: "Libellé A-Z", value: "title-asc" },
              { label: "Libellé Z-A", value: "title-desc" },
            ]}
          />
        </div>

        {calendarEvents.length === 0 ? (
          <div className="p-6 text-sm leading-6 text-muted-foreground">
            Aucune échéance n&apos;est enregistrée pour le moment.
          </div>
        ) : (
            <div className="divide-y divide-border">
              {filteredEvents.length === 0 ? (
                <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                  Aucune échéance ne correspond aux filtres.
                </div>
              ) : null}
              {filteredEvents.map((event) => {
                const typeLabel = getCalendarEventTypeLabel(event.type);
                const competitionTitle = getCompetitionTitle(event.competitionId);

                return (
                  <article
                    key={event.id}
                    className="admin-list-row grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                  >
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold">{event.title}</h4>
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {typeLabel}
                        </span>
                        <span
                          className={
                            event.published
                              ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                              : "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                          }
                        >
                          {event.published ? (
                            <Eye className="size-3.5" />
                          ) : (
                            <EyeOff className="size-3.5" />
                          )}
                          {event.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-muted-foreground">
                        {competitionTitle}
                      </p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="size-4 text-primary" />
                          {formatEventDate(event.date)}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="size-4 text-primary" />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <form action={toggleCalendarEventPublication}>
                        <input type="hidden" name="id" value={event.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={event.published ? "" : "on"}
                        />
                        <button
                          type="submit"
                          className={
                            event.published
                              ? "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              : "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                          }
                        >
                          {event.published ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                          {event.published ? "Dépublier" : "Publier"}
                        </button>
                      </form>
                      <AdminRowActionsMenu
                        editHref={`/admin/calendrier/${event.id}`}
                        deleteAction={deleteCalendarEvent}
                        deleteId={event.id}
                        deleteLabel={`${event.title} - ${competitionTitle}`}
                        deleteMessage="Supprimer cette échéance du calendrier ?"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
        )}
      </section>
    </div>
  );
}
