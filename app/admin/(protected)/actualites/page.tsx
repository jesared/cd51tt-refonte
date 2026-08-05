import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
import {
  deleteNewsArticle,
  getAdminNewsArticles,
  seedMockNewsArticles,
  toggleNewsArticlePublication,
} from "@/lib/admin-news";
import { createPageMetadata } from "@/lib/metadata";
import { formatFrenchDate } from "@/lib/news";

export const metadata = createPageMetadata({
  title: "Admin actualites",
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
  };
};

export default async function AdminActualitesPage({
  searchParams,
}: AdminActualitesPageProps) {
  const articles = await getAdminNewsArticles();
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
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Sparkles className="size-4" />
                Importer les mocks
              </button>
            </form>
          ) : null}

          <Link
            href="/admin/actualites/nouveau"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Nouvel article
          </Link>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.5rem] border border-border bg-background">
        <div className="border-b border-border px-6 py-4">
          <h3 className="font-medium">Liste des articles</h3>
        </div>

        {articles.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun article n&apos;est encore en base. Vous pouvez importer les
            mocks ou creer votre premier contenu manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {articles.map((article) => {
              const isPublished = article.status === "PUBLISHED";

              return (
              <article
                key={article.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_10rem_10rem_18rem]"
              >
                <div className="space-y-2">
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
                  <p className="text-sm leading-6 text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-muted-foreground">/{article.slug}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Statut</p>
                  <p className="mt-2">
                    {isPublished ? "Publiée" : "Dépubliée"}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Date</p>
                  <p className="mt-2">
                    {formatFrenchDate(article.publishedAt ?? article.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <form action={toggleNewsArticlePublication}>
                    <input type="hidden" name="id" value={article.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={isPublished ? "DRAFT" : "PUBLISHED"}
                    />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {isPublished ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                      {isPublished ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/actualites/${article.id}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <DeleteConfirmationForm
                    action={deleteNewsArticle}
                    message="Supprimer cette actualité ? Cette action est définitive."
                  >
                    <input type="hidden" name="id" value={article.id} />
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-destructive/20 px-3 text-sm text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                      Supprimer
                    </button>
                  </DeleteConfirmationForm>
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
