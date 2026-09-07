import Link from "next/link";
import {
  CalendarDays,
  Eye,
  EyeOff,
  FileText,
  Plus,
  UserRound,
} from "lucide-react";
import { CompetitionResourceStatus } from "@prisma/client";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { Badge } from "@/components/ui/badge";
import {
  deleteCompetition,
  getAdminCompetitions,
  toggleCompetitionPublication,
} from "@/lib/admin-competitions";
import { getAdminCalendarEvents } from "@/lib/admin-calendar";
import { getAdminDocuments } from "@/lib/admin-documents";
import { getCompetitionNextDateLabel } from "@/lib/calendar";
import { createPageMetadata } from "@/lib/metadata";
import type { CompetitionTag } from "@/lib/mock-data";

export const metadata = createPageMetadata({
  title: "Admin compétitions",
  description: "Pilotage des compétitions sportives publiées sur le site.",
  path: "/admin/competitions",
});

export const dynamic = "force-dynamic";

type AdminCompetitionsPageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    published?: string;
    unpublished?: string;
    error?: string;
    q?: string;
    statut?: string;
    sport?: string;
    tag?: string;
    tri?: string;
  };
};

function getSportStatusTone(status: string) {
  if (status === "En cours") {
    return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
  }

  if (status === "À venir" || status === "Ouvert") {
    return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "border border-border text-muted-foreground";
}

function parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function AdminCompetitionsPage({
  searchParams,
}: AdminCompetitionsPageProps) {
  const [competitionEntries, calendarEvents, documents] = await Promise.all([
    getAdminCompetitions(),
    getAdminCalendarEvents(),
    getAdminDocuments(),
  ]);
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const publicationFilter = searchParams?.statut;
  const sportFilter = searchParams?.sport;
  const tagFilter = searchParams?.tag;
  const sortMode = searchParams?.tri ?? "order-asc";
  const publishedCount = competitionEntries.filter(
    (competition) => competition.status === CompetitionResourceStatus.PUBLISHED,
  ).length;
  const sportStatusOptions = Array.from(
    new Set(competitionEntries.map((competition) => competition.sportStatus)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const tagOptions = Array.from(
    new Set(
      competitionEntries.flatMap((competition) =>
        parseJsonArray<CompetitionTag>(competition.tags, []),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const filteredCompetitions = competitionEntries
    .filter((competition) => {
      const tags = parseJsonArray<CompetitionTag>(competition.tags, []);
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${competition.title} ${competition.summary} ${competition.manager} ${competition.location}`,
        ).includes(query);
      const matchesPublication =
        !publicationFilter ||
        (publicationFilter === "published" &&
          competition.status === CompetitionResourceStatus.PUBLISHED) ||
        (publicationFilter === "draft" &&
          competition.status === CompetitionResourceStatus.DRAFT);
      const matchesSport = !sportFilter || competition.sportStatus === sportFilter;
      const matchesTag = !tagFilter || tags.includes(tagFilter as CompetitionTag);

      return matchesSearch && matchesPublication && matchesSport && matchesTag;
    })
    .sort((first, second) => {
      if (sortMode === "title-asc") {
        return first.title.localeCompare(second.title, "fr");
      }

      if (sortMode === "title-desc") {
        return second.title.localeCompare(first.title, "fr");
      }

      if (sortMode === "updated-desc") {
        return second.updatedAt.getTime() - first.updatedAt.getTime();
      }

      return first.sortOrder - second.sortOrder;
    });
  const message =
    searchParams?.saved === "1"
      ? "La compétition a été enregistrée."
      : searchParams?.deleted === "1"
        ? "La compétition a été supprimée."
        : searchParams?.published === "1"
          ? "La compétition est publiée."
          : searchParams?.unpublished === "1"
            ? "La compétition est dépubliée."
            : searchParams?.error
              ? decodeURIComponent(searchParams.error)
              : null;
  const feedbackTone = searchParams?.error ? "error" : "default";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Sportif
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les compétitions
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Créez, modifiez, publiez ou dépubliez les épreuves visibles sur la
            page publique, avec leurs échéances, responsables, tags et liens
            utiles.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Base admin réelle</Badge>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <Link
            href="/admin/competitions/nouveau"
            className="admin-action admin-action-primary h-11 w-full"
          >
            <Plus className="size-4" />
            Nouvelle compétition
          </Link>
        </div>
      </section>

      {message ? (
        <div
          className={
            feedbackTone === "error"
              ? "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm"
              : "admin-feedback"
          }
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">Liste des compétitions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredCompetitions.length} sur {competitionEntries.length} compétition(s)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {competitionEntries.length} enregistrées
              </Badge>
              <Badge variant="secondary">{publishedCount} publiées</Badge>
            </div>
          </div>
          <AdminListControls
            searchPlaceholder="Titre, résumé, responsable ou lieu"
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
                name: "sport",
                label: "Statut sportif",
                defaultLabel: "Tous les statuts sportifs",
                options: sportStatusOptions.map((status) => ({
                  label: status,
                  value: status,
                })),
              },
              {
                name: "tag",
                label: "Tag",
                defaultLabel: "Tous les tags",
                options: tagOptions.map((tag) => ({
                  label: tag,
                  value: tag,
                })),
              },
            ]}
            sortOptions={[
              { label: "Ordre d'affichage", value: "order-asc" },
              { label: "Mise à jour récente", value: "updated-desc" },
              { label: "Titre A-Z", value: "title-asc" },
              { label: "Titre Z-A", value: "title-desc" },
            ]}
          />
        </div>

        {competitionEntries.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucune compétition n&apos;est encore en base. Créez la première
            compétition manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredCompetitions.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucune compétition ne correspond aux filtres.
              </div>
            ) : null}
            {filteredCompetitions.map((competition) => {
              const isPublished =
                competition.status === CompetitionResourceStatus.PUBLISHED;
              const tags = parseJsonArray<CompetitionTag>(competition.tags, []);
              const visibleTags = tags.slice(0, 2);
              const hiddenTagCount = tags.length - visibleTags.length;
              const documentCount = documents.filter(
                (document) => document.competitionId === competition.id,
              ).length;

              return (
                <article
                  key={competition.id}
                  className="admin-list-row grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)_auto] lg:items-center"
                >
                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-medium">
                        {competition.title}
                      </h4>
                      <span
                        className={
                          isPublished
                            ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                            : "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        {isPublished ? (
                          <Eye className="size-3.5" />
                        ) : (
                          <EyeOff className="size-3.5" />
                        )}
                        {isPublished ? "Publié" : "Brouillon"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${getSportStatusTone(
                          competition.sportStatus,
                        )}`}
                      >
                        {competition.sportStatus}
                      </span>
                    </div>

                    <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                      {competition.summary}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {visibleTags.map((tag) => (
                        <span
                          key={`${competition.id}-${tag}`}
                          className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {hiddenTagCount > 0 ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          +{hiddenTagCount}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3 lg:grid-cols-1">
                    <div className="flex min-w-0 items-start gap-2">
                      <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="min-w-0 text-foreground">
                        {getCompetitionNextDateLabel(
                          calendarEvents,
                          competition.id,
                        )}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-start gap-2">
                      <UserRound className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="min-w-0 text-foreground">
                        {competition.manager}
                      </span>
                    </div>
                    <Link
                      href={`/admin/documents?competition=${competition.id}`}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <FileText className="size-3.5" />
                      {documentCount} documents
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <form action={toggleCompetitionPublication}>
                      <input type="hidden" name="id" value={competition.id} />
                      <input
                        type="hidden"
                        name="published"
                        value={isPublished ? "" : "on"}
                      />
                      <button
                        type="submit"
                        className={
                          isPublished
                            ? "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            : "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                        }
                      >
                        {isPublished ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                        {isPublished ? "Dépublier" : "Publier"}
                      </button>
                    </form>
                    <AdminRowActionsMenu
                      editHref={`/admin/competitions/${competition.id}`}
                      deleteAction={deleteCompetition}
                      deleteId={competition.id}
                      deleteLabel={competition.title}
                      deleteMessage="Supprimer cette compétition ? Les documents et échéances liés garderont leur identifiant de compétition."
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
