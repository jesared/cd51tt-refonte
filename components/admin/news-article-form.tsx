import Link from "next/link";
import type { NewsArticle } from "@prisma/client";
import { ArrowLeft, Download, Eye, ExternalLink, Paperclip, Save } from "lucide-react";

import { saveNewsArticle } from "@/lib/admin-news";
import { ConfirmableAdminForm } from "@/components/admin/confirmable-admin-form";
import { SaveResultActions } from "@/components/admin/save-result-actions";
import { UnsavedChangesGuard } from "@/components/admin/unsaved-changes-guard";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { parseNewsArticleAttachments } from "@/lib/news";
import {
  NEWS_CATEGORY_DESTINATIONS,
  NEWS_CATEGORY_OPTIONS,
  normalizeNewsCategory,
} from "@/lib/content-categories";

type NewsArticleFormProps = {
  mode: "create" | "edit";
  article?: NewsArticle;
  errorMessage?: string | null;
  saved?: boolean;
  canPublish?: boolean;
  targetOptions?: Array<{ value: string; label: string }>;
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
  saved = false,
  canPublish = true,
  targetOptions = [],
}: NewsArticleFormProps) {
  const isEdit = mode === "edit";
  const previewHref = article ? `/admin/actualites/${article.id}/preview` : null;
  const publicHref =
    article?.status === "PUBLISHED" ? "/" : null;
  const selectedCategory = article?.category
    ? normalizeNewsCategory(article.category)
    : null;
  const pageOptions = [
    ...NEWS_CATEGORY_OPTIONS.map((category) => ({
      value: NEWS_CATEGORY_DESTINATIONS[category].href,
      label: `${category} → ${NEWS_CATEGORY_DESTINATIONS[category].label}`,
    })),
    ...targetOptions,
  ];
  const defaultTargetUrl =
    article?.targetUrl ??
    NEWS_CATEGORY_DESTINATIONS[selectedCategory ?? "Compétitions"].href;
  const attachments = parseNewsArticleAttachments(article?.attachments);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Fil info
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier une information" : "Ajouter une information"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Une information publiée apparaît sur l’accueil. La rubrique
              choisie détermine la page vers laquelle elle renvoie.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {previewHref ? (
              <Link
                href={previewHref}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/30 px-4 text-sm font-medium text-primary transition hover:bg-primary/10"
              >
                <Eye className="size-4" />
                Prévisualiser
              </Link>
            ) : null}
            {publicHref ? (
              <Link
                href={publicHref}
                target="_blank"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ExternalLink className="size-4" />
                Voir sur le site
              </Link>
            ) : null}
            <Link
              href="/admin/actualites"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Retour à la liste
            </Link>
          </div>
        </div>
      </section>

      {saved ? (
        <SaveResultActions
          message="Actualité enregistrée."
          publicHref={publicHref}
          createHref="/admin/actualites/nouveau"
          listHref="/admin/actualites"
        />
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <ConfirmableAdminForm
        action={saveNewsArticle}
        className="grid gap-6"
        contentLabel="cette actualité"
        contentType="news"
        currentHasImage={Boolean(article?.imageUrl)}
      >
        <UnsavedChangesGuard />
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
                Rubrique
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={selectedCategory ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="" disabled>
                  Choisir une rubrique
                </option>
                {NEWS_CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category} → {NEWS_CATEGORY_DESTINATIONS[category].label}
                  </option>
                ))}
              </select>
              {article?.category && !selectedCategory ? (
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Page actuelle non reconnue : {article.category}.
                  Choisissez une valeur de la liste avant d’enregistrer.
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label htmlFor="targetUrl" className="text-sm font-medium">
                Page de destination
              </label>
              <select
                id="targetUrl"
                name="targetUrl"
                required
                defaultValue={defaultTargetUrl}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                {pageOptions.map((option) => (
                  <option key={`${option.value}-${option.label}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-muted-foreground">
                Les fiches de compétition publiées apparaissent ici comme pages
                enfants.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Texte de l’information
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={4}
                defaultValue={article?.excerpt ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Illustration</h3>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">
            Facultative : ajoutez une image pour mettre en avant cette actualité.
          </p>
          <ImageUploadField initialImageUrl={article?.imageUrl} />
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <div className="flex items-center gap-2">
            <Paperclip className="size-5 text-primary" />
            <h3 className="text-lg font-semibold">Pièces jointes</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoutez des fichiers à télécharger depuis le fil info. 10 fichiers maximum, 15 Mo par fichier.
          </p>

          {attachments.length > 0 ? (
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {attachments.map((attachment) => (
                <li key={attachment.url} className="flex flex-wrap items-center justify-between gap-3 px-3 py-3">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="size-4 shrink-0" />
                    <span className="break-all">{attachment.name}</span>
                  </a>
                  <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" name="removeAttachmentUrl" value={attachment.url} className="size-4 rounded border border-input" />
                    Retirer
                  </label>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 grid gap-2">
            <label htmlFor="attachmentUploads" className="text-sm font-medium">
              Ajouter des fichiers
            </label>
            <input
              id="attachmentUploads"
              name="attachmentUploads"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.jpg,.jpeg,.png,.zip"
              className="block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              PDF, documents bureautiques, images ou ZIP. Les pièces jointes existantes restent conservées si vous n’en cochez aucune pour les retirer.
            </p>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">
            {canPublish ? "Publication" : "Mise en avant"}
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {canPublish ? (
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
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {canPublish ? (
              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={article?.status === "PUBLISHED"}
                  className="size-4 rounded border border-input"
                />
                Publier dans le fil info
              </label>
            ) : null}

          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer" : "Créer l’information"}
          </button>
        </div>
      </ConfirmableAdminForm>
    </div>
  );
}
