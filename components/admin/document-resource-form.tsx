import Link from "next/link";
import type { DocumentResource } from "@prisma/client";
import { ArrowLeft, Download, Eye, ExternalLink, Save } from "lucide-react";

import { saveDocument } from "@/lib/admin-documents";
import { SaveResultActions } from "@/components/admin/save-result-actions";
import { UnsavedChangesGuard } from "@/components/admin/unsaved-changes-guard";
import {
  DOCUMENT_CATEGORY_OPTIONS,
  normalizeDocumentCategory,
} from "@/lib/content-categories";
import { competitions } from "@/lib/mock-data";

type DocumentResourceFormProps = {
  mode: "create" | "edit";
  document?: DocumentResource;
  errorMessage?: string | null;
  saved?: boolean;
};

function toDateInputValue(date: Date | null | undefined) {
  if (!date) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(date).toISOString().slice(0, 10);
}

export function DocumentResourceForm({
  mode,
  document,
  errorMessage,
  saved = false,
}: DocumentResourceFormProps) {
  const isEdit = mode === "edit";
  const previewHref = document ? `/admin/documents/${document.id}/preview` : null;
  const publicHref = document?.status === "PUBLISHED" ? "/documents" : null;
  const selectedCategory = document?.category
    ? normalizeDocumentCategory(document.category)
    : null;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-background p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Documents
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {isEdit ? "Modifier le document" : "Ajouter un document"}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Centralisez les ressources utiles avec un titre, une catégorie,
              un format, une description, un lien ou fichier, et une date de
              mise à jour.
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
            {document?.fileUrl ? (
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <Download className="size-4" />
                Ouvrir le fichier
              </a>
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
              href="/admin/documents"
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
          message="Document enregistré."
          publicHref={publicHref ?? "/documents"}
          createHref="/admin/documents/nouveau"
          listHref="/admin/documents"
        />
      ) : null}

      {errorMessage ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <form
        action={saveDocument}
        encType="multipart/form-data"
        className="grid gap-6"
      >
        <UnsavedChangesGuard />
        {document ? <input type="hidden" name="id" value={document.id} /> : null}

        <section className="rounded-[1.5rem] border border-border bg-background p-6">
          <h3 className="text-lg font-semibold">Fiche du document</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={document?.title ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={selectedCategory ?? ""}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  <option value="" disabled>
                    Choisir une catégorie
                  </option>
                  {DOCUMENT_CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {document?.category && !selectedCategory ? (
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    Catégorie actuelle non harmonisée : {document.category}.
                    Choisissez une valeur de la liste avant d’enregistrer.
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label htmlFor="format" className="text-sm font-medium">
                  Format
                </label>
                <input
                  id="format"
                  name="format"
                  required
                  defaultValue={document?.format ?? "PDF"}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="updatedAt" className="text-sm font-medium">
                  Date de mise à jour
                </label>
                <input
                  id="updatedAt"
                  name="updatedAt"
                  type="date"
                  defaultValue={toDateInputValue(document?.updatedAt)}
                  className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="fileUrl" className="text-sm font-medium">
                Lien existant
              </label>
              <input
                id="fileUrl"
                name="fileUrl"
                defaultValue={document?.fileUrl ?? ""}
                placeholder="https://... ou /documents/fichier.pdf"
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="competitionId" className="text-sm font-medium">
                Compétition liée
              </label>
              <select
                id="competitionId"
                name="competitionId"
                defaultValue={document?.competitionId ?? ""}
                className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              >
                <option value="">Document global</option>
                {competitions.map((competition) => (
                  <option key={competition.id} value={competition.id}>
                    {competition.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Un document lié apparaît aussi dans les ressources de la
                compétition publique.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="fileUpload" className="text-sm font-medium">
                Fichier Cloudinary
              </label>
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                className="h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-sm file:text-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
              <p className="text-xs text-muted-foreground">
                Si vous ajoutez un fichier, il remplace le lien existant.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                defaultValue={document?.description ?? ""}
                className="rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border px-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="published"
                defaultChecked={document?.status === "PUBLISHED"}
                className="size-4 rounded border border-input"
              />
              Publier ce document sur le site
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Save className="size-4" />
            {isEdit ? "Enregistrer les modifications" : "Créer le document"}
          </button>
        </div>
      </form>
    </div>
  );
}
