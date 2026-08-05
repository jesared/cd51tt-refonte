import Link from "next/link";
import type { NewsArticle } from "@prisma/client";
import { ArrowLeft, Save } from "lucide-react";

import { saveNewsArticle } from "@/lib/admin-news";

type NewsArticleFormProps = {
  mode: "create" | "edit";
  article?: NewsArticle;
  errorMessage?: string | null;
};

function toDatetimeLocalValue(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);
  const offset = parsedDate.getTimezoneOffset();
  const localDate = new Date(parsedDate.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function NewsArticleForm({
  mode,
  article,
  errorMessage,
}: NewsArticleFormProps) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Actualités
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier l'article" : "Créer un nouvel article"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Renseignez les champs utiles pour le site public. Le slug et le
              temps de lecture sont générés automatiquement.
            </p>
          </div>

          <Link
            href="/admin/actualites"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form action={saveNewsArticle} className="grid gap-6">
        {article ? <input type="hidden" name="id" value={article.id} /> : null}

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Contenu</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={article?.title ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Catégorie
              </label>
              <input
                id="category"
                name="category"
                required
                defaultValue={article?.category ?? ""}
                placeholder="Competition, club, formation..."
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Résumé
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={4}
                required
                defaultValue={article?.excerpt ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                defaultValue={article?.content ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Publication</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="publishedAt" className="text-sm font-medium">
                Date
              </label>
              <input
                id="publishedAt"
                name="publishedAt"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(article?.publishedAt)}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="published"
                defaultChecked={article?.status === "PUBLISHED"}
                className="size-4 rounded border border-input"
              />
              Publier cette actualité
            </label>

            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={article?.featured ?? false}
                className="size-4 rounded border border-input"
              />
              Mettre en avant
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer les modifications" : "Créer l'article"}
          </button>
        </div>
      </form>
    </div>
  );
}
