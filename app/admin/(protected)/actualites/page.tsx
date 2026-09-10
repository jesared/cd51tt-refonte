import Link from "next/link";
import { Eye, EyeOff, Plus, Sparkles } from "lucide-react";
import { NewsArticleStatus } from "@prisma/client";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { PublicationConfirmationForm } from "@/components/admin/publication-confirmation-form";
import {
  deleteNewsArticle,
  getAdminNewsArticles,
  seedMockNewsArticles,
  toggleNewsArticlePublication,
} from "@/lib/admin-news";
import { requireEditorSession } from "@/lib/admin-auth";
import { matchesRecentUpdateFilter } from "@/lib/admin-list-filters";
import { createPageMetadata } from "@/lib/metadata";
import { formatFrenchDate } from "@/lib/news";

export const metadata = createPageMetadata({
  title: "Admin actualités",
  description:
    "Administration des articles, annonces et publications du comité.",
  path: "/admin/actualites",
});

type AdminActualitesPageProps = {
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
    image?: string;
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

function getArticleIncompleteReasons(
  article: Awaited<ReturnType<typeof getAdminNewsArticles>>[number],
) {
  return [
    !article.title ? "Titre manquant" : null,
    !article.excerpt ? "Extrait manquant" : null,
    !article.content ? "Contenu manquant" : null,
    !article.imageUrl ? "Image manquante" : null,
  ].filter((reason): reason is string => Boolean(reason));
}

export default async function AdminActualitesPage({
  searchParams,
}: AdminActualitesPageProps) {
  const [articles, session] = await Promise.all([
    getAdminNewsArticles(),
    requireEditorSession("/admin/actualites"),
  ]);
  const canManagePublication = session.role === "ADMIN";
  const categories = Array.from(
    new Set(articles.map((article) => article.category)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const categoryFilter = searchParams?.categorie;
  const imageFilter = searchParams?.image;
  const updateFilter = searchParams?.maj;
  const sortMode = searchParams?.tri ?? "date-desc";
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        !query ||
        normalizeSearchValue(
          `${article.title} ${article.excerpt} ${article.category}`,
        ).includes(query);
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "published" &&
          article.status === NewsArticleStatus.PUBLISHED) ||
        (statusFilter === "draft" &&
          article.status === NewsArticleStatus.DRAFT) ||
        (statusFilter === "featured" && article.featured);
      const matchesCategory =
        !categoryFilter || article.category === categoryFilter;
      const hasImage = Boolean(article.imageUrl);
      const matchesImage =
        !imageFilter ||
        (imageFilter === "with" && hasImage) ||
        (imageFilter === "without" && !hasImage);
      const matchesUpdated = matchesRecentUpdateFilter(
        article.updatedAt,
        updateFilter,
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesImage &&
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

      if (sortMode === "updated-desc") {
        return second.updatedAt.getTime() - first.updatedAt.getTime();
      }

      const firstDate = first.publishedAt ?? first.createdAt;
      const secondDate = second.publishedAt ?? second.createdAt;

      return sortMode === "date-asc"
        ? firstDate.getTime() - secondDate.getTime()
        : secondDate.getTime() - firstDate.getTime();
    });
  const message =
    searchParams?.saved === "1"
      ? "L'article a été enregistré."
      : searchParams?.deleted === "1"
        ? "L'article a été supprimé."
        : searchParams?.published === "1"
          ? "L'actualité est publiée."
            : searchParams?.unpublished === "1"
              ? "L'actualité est dépubliée."
              : searchParams?.seeded === "1"
              ? "Articles de démonstration importés depuis le mock local."
              : searchParams?.seeded === "0"
                ? "Des articles existent déjà en base admin. Import mock local ignoré."
                : searchParams?.error
                  ? decodeURIComponent(searchParams.error)
                  : null;
  const feedbackTone = searchParams?.error
    ? "error"
    : searchParams?.seeded === "1"
      ? "mock"
      : "default";

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-[1.5rem] border border-border bg-background p-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch">
        <div className="flex min-w-0 flex-col justify-between gap-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Actualités
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Gérer les actualités
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Créez, modifiez, publiez ou dépubliez les informations visibles sur
            le site public.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
              Base admin réelle
            </span>
            {articles.length === 0 ? (
              <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-800 dark:text-amber-200">
                Mock local disponible
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {articles.length === 0 && canManagePublication ? (
            <form action={seedMockNewsArticles} className="contents">
              <AdminSubmitButton
                icon={<Sparkles className="size-4" />}
                loadingLabel="Import en cours..."
                className="h-11 w-full px-4"
              >
                Importer mock local
              </AdminSubmitButton>
            </form>
          ) : null}

          <Link
            href="/admin/actualites/nouveau"
            className="admin-action admin-action-primary h-11 w-full"
          >
            <Plus className="size-4" />
            Nouvel article
          </Link>
        </div>
      </section>

      {message ? (
        <div
          className={
            feedbackTone === "error"
              ? "rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm"
              : feedbackTone === "mock"
                ? "rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-900 shadow-sm dark:text-amber-200"
                : "admin-feedback"
          }
        >
          {feedbackTone === "mock" ? (
            <span className="mr-2 rounded-full border border-current/20 px-2 py-0.5 text-xs">
              Mock local
            </span>
          ) : null}
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="space-y-4 border-b border-border px-6 py-4">
          <div>
            <h3 className="font-medium">Liste des articles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredArticles.length} sur {articles.length} article(s)
            </p>
          </div>
          <AdminListControls
            searchPlaceholder="Titre, extrait ou catégorie"
            filters={[
              {
                name: "statut",
                label: "Statut",
                defaultLabel: "Tous les statuts",
                options: [
                  { label: "Publié", value: "published" },
                  { label: "Brouillon", value: "draft" },
                  { label: "Mises en avant", value: "featured" },
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
                name: "image",
                label: "Image",
                defaultLabel: "Toutes les images",
                options: [
                  { label: "Avec image", value: "with" },
                  { label: "Sans image", value: "without" },
                ],
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
              { label: "Mise à jour récente", value: "updated-desc" },
              { label: "Date ancienne", value: "date-asc" },
              { label: "Titre A-Z", value: "title-asc" },
              { label: "Titre Z-A", value: "title-desc" },
            ]}
          />
        </div>

        {articles.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun article n&apos;est encore en base. Vous pouvez importer les
            mocks ou créer votre premier contenu manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredArticles.length === 0 ? (
              <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
                Aucun article ne correspond aux filtres.
              </div>
            ) : null}
            {filteredArticles.map((article) => {
              const isPublished = article.status === "PUBLISHED";

              return (
                <article
                  key={article.id}
                  className="admin-list-row grid gap-3 px-6 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium">{article.title}</h4>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {article.category}
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
                      {article.featured ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Mise en avant
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatFrenchDate(article.publishedAt ?? article.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {canManagePublication ? (
                      <>
                        <PublicationConfirmationForm
                          action={toggleNewsArticlePublication}
                          itemName={article.title}
                          isPublished={isPublished}
                          incompleteReasons={getArticleIncompleteReasons(article)}
                        >
                          <input type="hidden" name="id" value={article.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={isPublished ? "DRAFT" : "PUBLISHED"}
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
                        </PublicationConfirmationForm>
                        <AdminRowActionsMenu
                          editHref={`/admin/actualites/${article.id}`}
                          deleteAction={deleteNewsArticle}
                          deleteId={article.id}
                          deleteLabel={article.title}
                          deleteMessage="Supprimer cette actualité ? Cette action est définitive."
                        />
                      </>
                    ) : (
                      <Link
                        href={`/admin/actualites/${article.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        Modifier
                      </Link>
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
