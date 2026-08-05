import Link from "next/link";
import { Download, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

import { DeleteConfirmationForm } from "@/components/admin/delete-confirmation-form";
import {
  deleteDocument,
  getAdminDocuments,
  seedMockDocuments,
} from "@/lib/admin-documents";
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
    error?: string;
  };
};

export default async function AdminDocumentsPage({
  searchParams,
}: AdminDocumentsPageProps) {
  const entries = await getAdminDocuments();
  const message =
    searchParams?.saved === "1"
      ? "Le document a été enregistré."
      : searchParams?.deleted === "1"
        ? "Le document a été supprimé."
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
            href="/admin/documents/nouveau"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Nouveau document
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
          <h3 className="font-medium">Liste des documents</h3>
        </div>

        {entries.length === 0 ? (
          <div className="px-6 py-8 text-sm leading-6 text-muted-foreground">
            Aucun document n&apos;est encore en base. Vous pouvez importer les
            mocks ou créer votre première ressource manuellement.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-4 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_10rem_10rem_12rem]"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-medium">{entry.title}</h4>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {entry.category}
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {entry.format}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {entry.description}
                  </p>
                  <a
                    href={entry.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="size-4" />
                    Ouvrir le document
                  </a>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Statut</p>
                  <p className="mt-2">
                    {entry.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Mise à jour</p>
                  <p className="mt-2">{formatFrenchMonthYear(entry.updatedAt)}</p>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/documents/${entry.id}`}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Link>
                  <DeleteConfirmationForm
                    action={deleteDocument}
                    message="Supprimer ce document ? Cette action est définitive."
                  >
                    <input type="hidden" name="id" value={entry.id} />
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
