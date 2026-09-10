import Link from "next/link";
import { Download, Eye, EyeOff, Plus } from "lucide-react";
import { AdminUserRole, DocumentResourceStatus } from "@prisma/client";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { PublicationConfirmationForm } from "@/components/admin/publication-confirmation-form";
import {
  deleteDocument,
  getAdminDocuments,
  toggleDocumentPublication,
} from "@/lib/admin-documents";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminCompetitions } from "@/lib/admin-competitions";
import { matchesRecentUpdateFilter } from "@/lib/admin-list-filters";
import { formatFrenchMonthYear } from "@/lib/documents";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin documents",
  description: "Administration de la base documentaire du comité.",
  path: "/admin/documents",
});

type AdminDocumentsPageProps = {
  searchParams?: {
    saved?: string;
    deleted?: string;
    seeded?: string;
    published?: string;
    unpublished?: string;
    error?: string;
    q?: string;
    statut?: string;
    categorie?: string;
    competition?: string;
    maj?: string;
    tri?: string;
  };
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function publishButtonClass(isPublished: boolean) {
  return isPublished
    ? "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    : "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90";
}

function isString(value: string | null): value is string {
  return Boolean(value);
}

function getDocumentIncompleteReasons(
  document: Awaited<ReturnType<typeof getAdminDocuments>>[number],
) {
  return [
    !document.title ? "Titre manquant" : null,
    !document.description ? "Description manquante" : null,
    !document.fileUrl ? "Fichier ou lien manquant" : null,
  ].filter((reason): reason is string => Boolean(reason));
}

export default async function AdminDocumentsPage({
  searchParams,
}: AdminDocumentsPageProps) {
  const [entries, competitions, session] = await Promise.all([
    getAdminDocuments(),
    getAdminCompetitions(),
    requireAdminSession(),
  ]);
  const canEditContent = session.role !== AdminUserRole.USER;
  const canManagePublication = canEditContent;
  const competitionTitleById = new Map(
    competitions.map((competition) => [competition.id, competition.title]),
  );
  const categories = Array.from(
    new Set(entries.map((entry) => entry.category)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const categoryFilter = searchParams?.categorie;
  const competitionFilter = searchParams?.competition;
  const updateFilter = searchParams?.maj;
  const sortMode = searchParams?.tri ?? "date-desc";
  const competitionOptions = Array.from(
    new Set(entries.map((entry) => entry.competitionId).filter(isString)),
  )
    .map((competitionId) => {
      return {
        label: competitionTitleById.get(competitionId) ?? competitionId,
        value: competitionId,
      };
    })
    .sort((first, second) => first.label.localeCompare(second.label, "fr"));
  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${entry.title} ${entry.description} ${entry.category} ${entry.format}`,
        ).includes(query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "published" &&
          entry.status === DocumentResourceStatus.PUBLISHED) ||
        (statusFilter === "draft" &&
          entry.status === DocumentResourceStatus.DRAFT) ||
        (statusFilter === "linked" && Boolean(entry.competitionId)) ||
        (statusFilter === "unlinked" && !entry.competitionId);
      const matchesCategory =
        !categoryFilter || entry.category === categoryFilter;
      const matchesCompetition =
        !competitionFilter || entry.competitionId === competitionFilter;
      const matchesUpdated = matchesRecentUpdateFilter(
        entry.updatedAt,
        updateFilter,
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesCompetition &&
        matchesUpdated
      );
    })
    .sort((first, second) => {
      if (sortMode === "title-asc") {
        return first.title.localeCompare(second.title, "fr");
      }

      if (sortMode === "title-desc") {
        return second.title.localeCompare(first.title, "fr");
      }

      return sortMode === "date-asc"
        ? first.updatedAt.getTime() - second.updatedAt.getTime()
        : second.updatedAt.getTime() - first.updatedAt.getTime();
    });
  const message =
    searchParams?.saved === "1"
      ? "Le document a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le document a été supprimé."
        : searchParams?.published === "1"
          ? "Le document est publié."
            : searchParams?.unpublished === "1"
              ? "Le document est dépublié."
              : searchParams?.seeded === "1"
                ? "Les documents existants ont été importés."
                : searchParams?.seeded === "0"
                  ? "Des documents existent déjà en base admin. Import ignoré."
                  : searchParams?.error
                    ? decodeURIComponent(searchParams.error)
                    : null;
  const feedbackTone = searchParams?.error
    ? "error"
    : searchParams?.seeded === "1"
      ? "success"
      : "default";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-between gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Documents
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer la base documentaire du comité
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Consultez les guides, règlements, formulaires et supports utiles.
            Les rôles ADMIN et EDITOR peuvent aussi les mettre à jour.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              Base admin réelle
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {canEditContent ? (
            <Link
              href="/admin/documents/nouveau"
              className="admin-action admin-action-primary h-11 w-full"
            >
              <Plus className="size-4" />
              Nouveau document
            </Link>
          ) : null}
        </div>
      </section>

      {message ? (
        <div
          className={
            feedbackTone === "error"
              ? "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm"
              : feedbackTone === "success"
                ? "rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm dark:text-emerald-200"
                : "admin-feedback"
          }
        >
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="font-medium">Liste des documents</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredEntries.length} sur {entries.length} document(s)
            </p>
          </div>
          <AdminListControls
            searchPlaceholder="Document, description, catégorie ou format"
            filters={[
              {
                name: "statut",
                label: "Statut",
                defaultLabel: "Tous les statuts",
                options: [
                  { label: "Publié", value: "published" },
                  { label: "Brouillon", value: "draft" },
                  { label: "Liés à une compétition", value: "linked" },
                  { label: "Sans compétition", value: "unlinked" },
                ],
              },
              {
                name: "categorie",
                label: "Catégorie",
                defaultLabel: "Toutes les catégories",
                options: categories.map((category) => ({
                  label: category,
                  value: category,
                })),
              },
              {
                name: "competition",
                label: "Compétition",
                defaultLabel: "Toutes les compétitions",
                options: competitionOptions,
              },
              {
                name: "maj",
                label: "Mise à jour",
                defaultLabel: "Toutes les dates",
                options: [
                  { label: "Mis à jour récemment", value: "recent" },
                  { label: "Plus ancien", value: "older" },
                ],
              },
            ]}
            sortOptions={[
              { label: "Date récente", value: "date-desc" },
              { label: "Date ancienne", value: "date-asc" },
              { label: "Titre A-Z", value: "title-asc" },
              { label: "Titre Z-A", value: "title-desc" },
            ]}
          />
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun document n&apos;est encore en base.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredEntries.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucun document ne correspond aux filtres.
              </div>
            ) : null}
            {filteredEntries.map((entry) => {
              const isPublished = entry.status === DocumentResourceStatus.PUBLISHED;

              return (
                <article
                  key={entry.id}
                  className="admin-list-row grid gap-3 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{entry.title}</h4>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {entry.category}
                      </span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {entry.format}
                      </span>
                      <span
                        className={
                          isPublished
                            ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300"
                            : "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        {isPublished ? "Publié" : "Brouillon"}
                      </span>
                      {entry.competitionId ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {competitionTitleById.get(entry.competitionId) ??
                            "Compétition liée"}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFrenchMonthYear(entry.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {canManagePublication ? (
                      <>
                        <PublicationConfirmationForm
                          action={toggleDocumentPublication}
                          itemName={entry.title}
                          isPublished={isPublished}
                          incompleteReasons={getDocumentIncompleteReasons(entry)}
                        >
                          <input type="hidden" name="id" value={entry.id} />
                          <input
                            type="hidden"
                            name="published"
                            value={isPublished ? "" : "on"}
                          />
                          <button
                            type="submit"
                            className={publishButtonClass(isPublished)}
                          >
                            {isPublished ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                            {isPublished ? "Dépublier" : "Publier"}
                          </button>
                        </PublicationConfirmationForm>
                        <AdminRowActionsMenu
                          editHref={`/admin/documents/${entry.id}`}
                          deleteAction={deleteDocument}
                          deleteId={entry.id}
                          deleteLabel={entry.title}
                          deleteMessage="Supprimer ce document ? Cette action est définitive."
                        >
                          <a
                            href={entry.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                          >
                            <Download className="size-4" />
                            Ouvrir
                          </a>
                        </AdminRowActionsMenu>
                      </>
                    ) : canEditContent ? (
                      <>
                        <a
                          href={entry.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Download className="size-4" />
                          Ouvrir
                        </a>
                        <Link
                          href={`/admin/documents/${entry.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          Modifier
                        </Link>
                      </>
                    ) : (
                      <a
                        href={entry.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Download className="size-4" />
                        Ouvrir
                      </a>
                    )}
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
