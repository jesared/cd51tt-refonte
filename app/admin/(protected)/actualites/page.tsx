import Link from "next/link";
import { Eye, EyeOff, Plus, Sparkles } from "lucide-react";
import { NewsArticleStatus } from "@prisma/client";

import { AdminListControls } from "@/components/admin/admin-list-controls";
import { AdminRowActionsMenu } from "@/components/admin/admin-row-actions-menu";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import {
  deleteNewsArticle,
  getAdminNewsArticles,
  seedMockNewsArticles,
  toggleNewsArticlePublication,
} from "@/lib/admin-news";
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
    tri?: string;
  };
};

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function AdminActualitesPage({
  searchParams,
}: AdminActualitesPageProps) {
  const articles = await getAdminNewsArticles();
  const categories = Array.from(
    new Set(articles.map((article) => article.category)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const query = normalizeSearchValue(searchParams?.q ?? "");
  const statusFilter = searchParams?.statut;
  const categoryFilter = searchParams?.categorie;
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

      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((first, second) => {
      if (sortMode === "title-asc") {
        return first.title.localeCompare(second.title, "fr");
      }

      if (sortMode === "title-desc") {
        return second.title.localeCompare(first.title, "fr");
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
              ? "Les articles mockés ont été importés."
              : searchParams?.seeded === "0"
                ? "Des articles existent déjà. Import mock ignoré."
                : searchParams?.error
                  ? decodeURIComponent(searchParams.error)
                  : null;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border bg-background p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
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
        </div>

        <div className="flex flex-wrap gap-2">
          {articles.length === 0 ? (
            <form action={seedMockNewsArticles}>
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
            href="/admin/actualites/nouveau"
            className="admin-action admin-action-primary"
          >
            <Plus className="size-4" />
            Nouvel article
          </Link>
        </div>
      </section>

      {message ? <div className="admin-feedback">{message}</div> : null}

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
                  { label: "Publiées", value: "published" },
                  { label: "Brouillons", value: "draft" },
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
            ]}
            sortOptions={[
              { label: "Date récente", value: "date-desc" },
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
                        {isPublished ? "Publiée" : "Brouillon"}
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
                    <form action={toggleNewsArticlePublication}>
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
                    </form>
                    <AdminRowActionsMenu
                      editHref={`/admin/actualites/${article.id}`}
                      deleteAction={deleteNewsArticle}
                      deleteId={article.id}
                      deleteLabel={article.title}
                      deleteMessage="Supprimer cette actualité ? Cette action est définitive."
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
