import Link from "next/link";
import { Download, Eye, EyeOff, Plus, Sparkles } from "lucide-react";
import { DocumentResourceStatus } from "@prisma/client";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import {
  deleteDocument,
  getAdminDocuments,
  seedMockDocuments,
  toggleDocumentPublication,
} from "@/lib/admin-documents";
import { formatFrenchMonthYear } from "@/lib/documents";
import { createPageMetadata } from "@/lib/metadata";
import { competitions } from "@/lib/mock-data";

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

export default async function AdminDocumentsPage({
  searchParams,
}: AdminDocumentsPageProps) {
  const entries = await getAdminDocuments();
  const categories = Array.from(
    new Set(entries.map((entry) => entry.category)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const categoryFilter = searchParams?.categorie;
  const sortMode = searchParams?.tri ?? "date-desc";
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
        (statusFilter === "linked" && Boolean(entry.competitionId));
      const matchesCategory =
        !categoryFilter || entry.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
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
              ? "Les documents mockés ont été importés."
              : searchParams?.seeded === "0"
                ? "Des documents existent déjà. Import mock ignoré."
                : searchParams?.error
                  ? decodeURIComponent(searchParams.error)
                  : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Documents
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer la base documentaire du comité
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Regroupez les guides, règlements, formulaires et supports utiles au
            même endroit, puis choisissez ce qui doit apparaître sur le site.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {entries.length === 0 ? (
            <form action={seedMockDocuments}>
              <AdminSubmitButton
                icon={<Sparkles className="size-4" />}
                loadingLabel="Import en cours..."
                className="h-10 px-4"
              >
                Importer les mocks
              </AdminSubmitButton>
            </form>
          ) : null}

          <Link
            href="/admin/documents/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Nouveau document
          </Link>
        </div>
      </section>

      {message ? <div className="admin-feedback">{message}</div> : null}

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
                  { label: "Publiés", value: "published" },
                  { label: "Brouillons", value: "draft" },
                  { label: "Liés à une compétition", value: "linked" },
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
            Aucun document n&apos;est encore en base. Vous pouvez importer les
            mocks ou créer votre première ressource manuellement.
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
                          {competitions.find(
                            (competition) =>
                              competition.id === entry.competitionId,
                          )?.title ?? "Compétition liée"}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFrenchMonthYear(entry.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <form action={toggleDocumentPublication}>
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
                    </form>
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
